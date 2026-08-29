# Security Audit Report — J Tech Solar, Starlink & CCTV Hub

**Date:** 29 August 2026
**Scope:** Next.js 16 (App Router) + Supabase (PostgreSQL RLS) + Paystack + Resend application
**Method:** Combination of (1) attacker/penetration-tester perspective and (2) OWASP Top 10 / OWASP API Security Top 10 / STRIDE mapping, with sources cited for every claim.

> **Frameworks used:**
> - OWASP Top 10:2025 — A01 Broken Access Control (https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/index.html)
> - OWASP API Security Top 10:2023/2025 — API1 BOLA (https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
> - STRIDE (threat modelling), OWASP IDOR reference, PSQL Row Security documentation, Supabase RLS documentation.

---

## Executive Summary

The application has a **sound design intent** (RLS enabled on all tables, service-role used server-side, webhook signature verification, patched dependency versions), but the **security boundary is not correctly enforced**. There are **2 critical**, **3 high**, **3 medium** and **2 low** findings. The most severe are:

1. **Privilege escalation to `super_admin` via permissive RLS write policies** (any authenticated user can flip their own `role`).
2. **Unauthenticated API endpoints using the service-role key (bypasses all RLS)** that expose / mutate all bookings, quotes and invoices.

These two issues mean a single low-privilege attacker can gain full administrator access and read the entire customer database.

---

## Remediation Status (29 Aug 2026)

All findings have been remediated. Summary of the applied fixes (see per-finding details below):

| ID | Severity | Status | Key changes |
|---|---|---|---|
| C1 | Critical | **Fixed** | Tightened `profiles` RLS: own-row select, admin-only all-row select, insert restricted to `role='customer'`, update restricted to non-privileged fields; tightened `bookings`/`quotes` write policies |
| C2 | Critical | **Fixed** | Every service-role API route now performs server-side auth/role checks via shared `src/lib/auth.ts` |
| H1 | High | **Fixed** | `redirect` validated to path-only (single `/`, not `//`) in `LoginClient.tsx` |
| H2 | High | **Fixed** | Payment amount/ownership computed server-side; auth required; client `amount`/`email` no longer trusted |
| H3 | High | **Fixed** | Upload requires auth + magic-byte (file-signature) validation |
| M1 | Medium | **Fixed** | `/api/reviews` `?all=true` and admin GETs now gated to `admin`/`super_admin` |
| M2 | Medium | **Fixed** | Profile visibility restricted (own-row only; admin all-rows) |
| M3 | Medium | **Fixed** | Booking/quote/invoice number entropy raised to 6 digits via `crypto.getRandomValues` + updated DB triggers |
| L1 | Low | **Fixed** | Per-IP rate limiting on `/api/contact`, `/api/bookings`, `/api/quotes`, `/api/reviews` |
| L2 | Low | **Fixed** | Admin data access re-verified server-side in every service-role route |

**Build/lint:** `npx tsc --noEmit`, `npm run build`, and `npm run lint` all pass (0 errors; lint warnings are pre-existing and unrelated to these changes).

> **Note (product decision):** To close C2 securely, `POST /api/bookings` now requires authentication and links a booking to the logged-in customer (`customer_id`). Guest (anonymous) booking requests are no longer accepted — visitors must register/login first. The public "request a booking" form redirects unauthenticated users to `/auth/login?redirect=/booking`. This was a deliberate choice to avoid collecting customer PII (name/address/phone) from anonymous callers.

---

## Findings

### CRITICAL

#### C1. Privilege escalation to `super_admin` via permissive RL write policies (RLS)

**Location:** `supabase/schema.sql` lines 25–34 (profiles policies).

```sql
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
```

**Why it is exploitable:**
- The `UPDATE` policy has **no `WITH CHECK` clause**. PostgreSQL falls back to using `USING` for `WITH CHECK`. `USING (auth.uid() = id)` constrains *which existing row* can be targeted, but the attacker keeps their own `id`, so the row still passes. **Nothing constrains the `role` column**, so an attacker can set `role = 'super_admin'`.
- The `INSERT`/`UPSERT` policy `with check (auth.uid() = id)` likewise only pins `id`, not `role`. The client-side registration code itself upserts `role: "customer"` (`src/app/auth/register/RegisterClient.tsx:75`), but an attacker can post `role: "super_admin"` directly through the Supabase client.
- Once the attacker's own `profiles.role` is `super_admin`, the app's role checks (`src/middleware.ts:54-66`, `src/app/admin/layout.tsx:139`, and every `role in ('admin','super_admin')` RLS policy) all pass → **full admin access**.

**Sources (RLS `WITH CHECK` default / escalation):**
- PostgreSQL 17 CREATE POLICY: "For policies that can have both `USING` and `WITH CHECK` expressions (ALL and UPDATE), if no WITH CHECK expression is defined, then the USING expression will be used both to determine which rows are visible ... and which new rows will be allowed to be added." (https://www.postgresql.org/docs/17/sql-createpolicy.html)
- PostgreSQL 18 Row Security: "The policy above implicitly provides a WITH CHECK clause identical to its USING clause ..." (https://www.postgresql.org/docs/18/ddl-rowsecurity.html)
- Supabase RLS docs: "If no `with check` expression is defined, the `using` expression decides both which rows are visible and which new rows are allowed." (https://supabase.com/docs/guides/database/postgres/row-level-security)
- RLS write-bypass/privilege-escalation write-ups confirm "columns USING does not pin (role/tenant_id) can be escalated": (https://tomodahinata.com/en/blog/supabase-rls-with-check-using-write-bypass-guide), (https://toolchew.com/en/deepdive-supabase-rls-pitfalls/)

**Remediation:** Add explicit `WITH CHECK` restricting `role` on both INSERT and UPDATE (e.g. only allow inserting/updating non-privileged fields), plus deny-by-default using the `authenticated` role, and consider a trigger or column `REVOKE` to make `role` immutable from the client. The role should be a server-controlled value (e.g. an `admin` flag in `auth.users.app_metadata`), not client-writable.

---

#### C2. Unauthenticated `/api/*` endpoints use the service-role key, which bypasses all RLS

**Location:** all files under `src/app/api/...` that call `getSupabaseAdmin()`, combined with **no authentication/authorization check**:
- `src/app/api/bookings/route.ts` (GET list + POST create via service role)
- `src/app/api/bookings/[id]/route.ts` (GET + PATCH)
- `src/app/api/quotes/route.ts` (GET list)
- `src/app/api/invoices/[id]/route.ts` (GET)
- `src/app/api/payments/initialize/route.ts` (POST)
- `src/app/api/upload/route.ts` (POST)
- `src/app/api/webhook/paystack/route.ts` (POST — this one *does* verify the Paystack HMAC, see C3/C4 positives)

**Why it is critical:** `getSupabaseAdmin()` (`src/lib/supabase/admin.ts:3-13`) uses `SUPABASE_SERVICE_ROLE_KEY`, which **bypasses every RLS policy**. Because the route handlers never verify the caller's identity or role, the RLS layer provides **zero protection** for these endpoints. The app relies on RLS + client-side role checks for the admin UI, but these API routes are a completely separate, unprotected path that reaches all data directly.

Concrete impact:
- `GET /api/bookings` returns **every booking including `internal_notes`, `admin_notes`, `final_cost`, customer email/phone/address** — full customer PII dump (OWASP A01 / excessive data exposure).
- `GET /api/quotes` returns all quotes and customer PII.
- `GET /api/invoices/[id]` returns any invoice + customer PII by guessing a UUID (IDOR/BOLA).
- `PATCH /api/bookings/[id]` lets anyone change any booking's `status`, `final_cost`, `payment_status`, `assigned_technician_id`, etc. (unauthorized data modification).
- `POST /api/upload` lets anyone upload files to the Supabase storage bucket with no auth.

**Sources:**
- OWASP Top 10:2025 A01 Broken Access Control — "An accessible API with missing access controls for POST, PUT, DELETE"; "Permitting viewing or editing someone else's account by providing its unique identifier (insecure direct object references)". (https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/index.html)
- OWASP API Security Top 10 API1:2023 Broken Object Level Authorization. (https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
- Service-role bypassing RLS is documented Supabase behavior: server-side role keys bypass Row Level Security. (https://supabase.com/docs/guides/database/postgres/row-level-security)

**Remediation:** Never use the service role on publicly accessible routes. Either (a) enforce authentication + role checks in each route before using the service role, or (b) better, use the user-scoped `createClient()` (anon key + user JWT) so RLS actually governs the query. The `GET/PATCH bookings`, `GET quotes`, `GET invoices` and `PATCH bookings` routes should be admin-only and verify the caller's `profiles.role` server-side.

---

### HIGH

#### H1. Open redirect after login via the unvalidated `redirect` parameter

**Location:** `src/app/auth/login/LoginClient.tsx:28` (`const redirect = searchParams.get("redirect") || "/dashboard"`) and used at line 64 `router.push(redirect)`; the middleware also passes arbitrary pathname as redirect (`src/middleware.ts:50-51`).

**Why it is a vulnerability:** The `redirect` value is taken verbatim from the URL and pushed client-side with no allow-list or scheme/authority validation. An attacker crafts `/auth/login?redirect=https://evil.example` (or `//evil.example`); after the victim logs in they are redirected to the attacker's site → classic **open redirect** used for phishing/credential-harvesting.

**Sources:**
- OWASP Top 10:2025 A01 lists "Bypassing access control checks by modifying the URL (parameter tampering or force browsing)". (https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/index.html)
- Next.js SSRF/Open Redirect advisory (CVE-2026-64645) demonstrates the same class of issue with attacker-controlled redirect destinations. (https://osv.dev/vulnerability/CVE-2026-64645)

**Remediation:** Only ever redirect to a path that starts with a single `/` and is not `//` or `http(s)://`. E.g. `if (redirect.startsWith("/") && !redirect.startsWith("//"))`.

---

#### H2. Payment initialization trusts client-supplied `amount` and `email`, with no ownership/amount validation (IDOR + amount tampering)

**Location:** `src/app/api/payments/initialize/route.ts:5-126`.

The client supplies `booking_id`, `quote_id`, `amount`, and `email`. The route looks up the booking/quote by id but **does not**:
- verify the requesting user owns the booking/quote, or
- validate that the `amount` equals the booking's `final_cost`/`estimated_cost` (or quote amount).

An attacker can therefore initiate a Paystack charge for **any amount** (e.g. ₦1) against anyone else's booking, and attach any email. There is also **no authentication** on this endpoint (ties into C2). Even though the webhook correctly verifies the Paystack signature (positive — see below), the recorded payment amount is attacker-controlled.

**Sources:** OWASP API Security Top 10 API1:2023 BOLA — "Attackers can exploit API endpoints that are vulnerable to broken object-level authorization by manipulating the ID of an object." "Implement object-level authorization checks ... in every function that uses an input from the client." (https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)

**Remediation:** Compute the amount server-side from the booking/quote's authoritative cost once the user is authenticated and proven to be the owner (or the request is made by an authenticated admin).

---

#### H3. Upload endpoint trusts client-declared MIME type; no content/magic-byte validation; no auth

**Location:** `src/app/api/upload/route.ts:27-92`.

The only type check is `ALLOWED_TYPES.includes(file.type)` (line 47), where `file.type` is the **client-declared MIME type**, which is trivially spoofable. The server never inspects magic bytes (file signatures) or re-encodes images. Given the bucket is public (`getPublicUrl`), an attacker could upload arbitrary content (e.g. an HTML/script disguised as `image/png`, or a malicious file) that is served back. There is also **no authentication** on this endpoint (ties into C2), and it runs with the service role.

**Sources:** OWASP Top 10 API Security — Broken Object Property Level Authorization / mass assignment and uploading unsafe content; the Next.js AVIF RCE advisory (GHSA-2xp9-vwfh-vxw4) is an example of image-pipeline risk (relevant because `sharp` is used). (https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4)

**Remediation:** Authenticate the uploader; validate against actual file signatures (magic bytes) via `file-type`, re-encode images server-side, refuse SVG/HTML, serve the bucket with restrictive Content-Type / `Content-Disposition` and non-public download policies where appropriate.

---

### MEDIUM

#### M1. Unauthorized access to unapproved/private data through the API bypasses visibility policies

**Location:** `src/app/api/reviews/route.ts:84-99` (`GET ?all=true` returns unapproved reviews); `src/app/api/bookings/[id]/route.ts` GET returns `internal_notes`/`admin_notes`/costs; `src/app/api/quotes/route.ts` GET returns all rows.

These are service-role queries (bypass RLS) with no auth, so `?all=true` exposes unapproved reviews, and the booking/quote GETs expose internal data and PII. Classified under C2 as the root cause; listed separately for visibility.

**Sources:** OWASP Top 10:2025 A01 (exposure of sensitive information — CWE-200/CWE-201). (https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/index.html)

---

#### M2. `profiles` are fully public to any authenticated user (and guest via `#` — see L1)

**Location:** `supabase/schema.sql:27-28`.

`"Public profiles are viewable by everyone" ... using (true)` exposes every user's `email`, `phone`, `address`, `state`, `city`, and `role` to any authenticated Supabase user, and (absent `to authenticated`) to anonymous requests. Combined with C1 this is an additional PII disclosure path. Rows should expose only what the public site needs (e.g. name/photo), with confidential fields protected.

**Sources:** OWASP Top 10:2025 A01 / CWE-200 Exposure of Sensitive Information. (https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/index.html)

---

#### M3. Booking-number generator has a small entropy space (predictable/replayable)

**Location:** `src/app/api/bookings/route.ts:6-14`, plus the DB trigger `generate_booking_number()` (`supabase/schema.sql:797-806`) which uses `floor(random() * 10000)`.

Booking/quote/invoice numbers are `PREFIX-YYMM-XXXX` with only 4 digits of randomness (10,000 values) per month. They are used as customer-facing "tracking" identifiers (the booking success screen points users to a tracking page by `booking_number`). Enumeration of active booking numbers in a month is feasible (~10k), enabling an attacker to guess valid booking numbers. This is lower impact because invoices/bookings are also UUID-addressed internally, but the number space is weak as a security token.

**Sources:** OWASP Authn / IDOR guidance on predictable identifiers; the booking page exposes `/bookings/{booking_number}` tracking. (https://owasp.org/www-community/attacks/insecure_direct_object_reference)

---

### LOW

#### L1. Publicly writable tables create unauthenticated write surface (spam/abuse)

`bookings`, `quotes`, `reviews`, `contact_messages`, `notifications` all have `for insert with check (true)` policies (`supabase/schema.sql:263-264, 399, 445, 664-665, 698`). These are intentional (guest bookings/contact/reviews) but there is **no rate limiting, CAPTCHA, or spam protection** on the public forms (`/api/contact`, `/api/bookings`, `/api/reviews`). An attacker can flood the admin inbox / database (denial-of-service via storage, spam). Recommend rate limiting and honeypot/CAPTCHA.

**Sources:** OWASP Top 10:2025 A01 — "Access control is only effective when implemented in trusted server-side code"; rate limiting guidance: "Implement rate limits on API and controller access." (https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/index.html)

---

#### L2. Admin authorization is enforced client-side only for the dashboard page data

The admin pages (e.g. `src/app/admin/page.tsx`, `src/app/admin/bookings/page.tsx`) fetch data with the **browser** client and rely on RLS + the middleware/layout role check. This is acceptable *if* RLS is fixed (C1) but today a user who escalates (C1) or directly queries the browser client (`supabase.from("bookings").select("*")`) already bypasses application-level roles because RLS policies for admin use `using (true)`-style visibility only where the caller's `role` is in `('admin','super_admin')` — which becomes moot once role is self-writable. Fixing C1 resolves this, but data-fetching authorization should ideally be re-verified server-side.

---

### Verified POSITIVES (things done right)

- **Paystack webhook signature verification is correct.** `src/lib/paystack.ts:132-142` computes `HMAC-SHA512` of the raw body and compares to the `x-paystack-signature` header with a constant-time-ish compare. This is the documented Paystack method. (https://paystack.com/docs/payments/webhooks)
- **`auth.getUser()` is used** in `src/app/api/notifications/route.ts:8-30` (server-side token introspection) rather than trusting client claims — correct approach.
- **Dependencies are current and patched.** `next` 16.3.3 is the August 2026 security release that fixes:
  - AVIF Image Optimization unauth RCE (GHSA-2xp9-vwfh-vxw4 / GHSA-g89c-p67h-r497) — patched 16.3.3
  - Windows-hosted RCE (CVE-2026-75604 / GHSA-p293-qw3h-jr36) — patched 16.3.3
  - Middleware auth bypass (CVE-2026-64642), SSRF/open redirect via rewrites (CVE-2026-64645), Server Action DoS (CVE-2026-64641/64646), body buffering DoS (CVE-2026-27979, CVE-2026-44579) — all fixed by 16.2.11+.
  - `npm audit --omit=dev` reports **0 vulnerabilities**.
- **Secrets hygiene:** `.env*` are gitignored (`src/.gitignore`/`.gitignore` lines 33-34); no `.env`, service-role key, Paystack secret, or Resend key is committed; no `sk_`/`pk_live`/private keys found in tracked source.
- **RLS is enabled** on every public table (good starting point).

---

## STRIDE Quick Map

| Threat | Relevant findings |
|---|---|
| Spoofing (identity) | C1 (role escalation), L2 |
| Tampering | C2 (PATCH bookings), H2 (amount) |
| Repudiation | — (no audit logging observed) |
| Information disclosure | C2 (bookings/quotes/invoices PII), M2 (profiles), M1 |
| Denial of service | L1 (spam/flood), CVE-2026-44579 fixed |
| Elevation of privilege | C1 (→ super_admin), L2 |

---

## Recommended Priority Order

1. **C1** — Lock down `profiles` write policies (add `WITH CHECK` restricting `role`), make `role` server-controlled/immutable.
2. **C2** — Remove service-role from public routes; add server-side auth + role checks; use user-scoped clients so RLS applies.
3. **H1** — Validate the `redirect` parameter (path-only allow-list).
4. **H2** — Compute payment amount server-side; verify ownership.
5. **H3** — Add auth + magic-byte validation to upload; restrict bucket serving.
6. **M1–M3, L1–L2** — Restrict profile visibility, increase booking-number entropy, add rate limiting/CAPTCHA, and mirror role enforcement server-side.

---

## Sources
- OWASP Top 10:2025 — https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/index.html
- OWASP API Security Top 10 API1:2023 BOLA — https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/
- OWASP IDOR — https://owasp.org/www-community/attacks/insecure_direct_object_reference
- PostgreSQL 17 CREATE POLICY — https://www.postgresql.org/docs/17/sql-createpolicy.html
- PostgreSQL 18 Row Security — https://www.postgresql.org/docs/18/ddl-rowsecurity.html
- Supabase RLS docs — https://supabase.com/docs/guides/database/postgres/row-level-security
- RLS WITH CHECK write-bypass/escalation — https://tomodahinata.com/en/blog/supabase-rls-with-check-using-write-bypass-guide ; https://toolchew.com/en/deepdive-supabase-rls-pitfalls/
- Next.js August 2026 Security Release — https://nextjs.org/blog/august-2026-security-release
- Next.js CVEs — https://osv.dev/vulnerability/CVE-2026-64641 ; CVE-2026-64642 ; CVE-2026-64645 ; CVE-2026-64646 ; CVE-2026-27979 ; CVE-2026-44579
- Next.js AVIF RCE advisory — https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4
- Paystack webhook docs — https://paystack.com/docs/payments/webhooks
