import { headers } from "next/headers"
import { NextResponse } from "next/server"

interface Bucket {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

async function getClientIp(): Promise<string> {
  const h = await headers()
  const fwd = h.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return h.get("x-real-ip") ?? "unknown"
}

/**
 * Minimal in-memory fixed-window rate limiter. Suitable for moderate traffic
 * and for protecting public write endpoints (contact/booking/quote/review)
 * from spam and simple flood attacks. For very high-scale deployments,
 * replace with a distributed store (e.g. a Supabase table or Redis).
 *
 * Returns an error response when the limit is exceeded, otherwise null.
 */
export async function rateLimit(options?: {
  max?: number
  windowMs?: number
  key?: string
}): Promise<NextResponse | null> {
  const max = options?.max ?? 10
  const windowMs = options?.windowMs ?? 60_000
  const ip = await getClientIp()
  const key = options?.key ? `${ip}:${options.key}` : ip

  const now = Date.now()
  const bucket = store.get(key)

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  if (bucket.count >= max) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  bucket.count += 1
  return null
}
