import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { z } from "zod"
import { requireRole, requireAuth, ADMIN_ROLES } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"

function generateQuoteNumber(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, "0")
  const random = (
    crypto.getRandomValues(new Uint32Array(1))[0] % 1000000
  )
    .toString()
    .padStart(6, "0")
  return `QT-${year}${month}-${random}`
}

const quoteSchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string().min(10, "Please describe your requirements"),
  budget: z.string().optional().default(""),
  preferred_date: z.string().optional(),
  service_id: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const limited = await rateLimit({ max: 10, windowMs: 60_000, key: "quote" })
    if (limited) return limited

    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const parsed = quoteSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const data = parsed.data
    const quote_number = generateQuoteNumber()

    // Link the quote to the authenticated user when present so customers can
    // later view/quote/pay for it. Public (guest) submissions remain allowed.
    const auth = await requireAuth()
    const customer_id = auth.error ? null : auth.user.id

    const { error } = await supabaseAdmin.from("quotes").insert({
      quote_number,
      customer_id,
      service_name: data.service_name,
      service_id: data.service_id || null,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      state: data.state,
      city: data.city,
      address: data.address,
      description: data.description,
      budget: data.budget,
      preferred_date: data.preferred_date || null,
      status: "pending",
      quote_amount: 0,
      quote_description: "",
      quote_items: [],
      estimated_duration: "",
      expires_at: null,
    })

    if (error) {
      console.error("Quote insert error:", error)
      return NextResponse.json(
        { error: "Failed to submit quote request. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Quote request submitted!",
        quote_number,
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Quote POST error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(ADMIN_ROLES)
    if (auth.error) return auth.error

    const supabaseAdmin = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from("quotes")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Quote list error:", error)
      return NextResponse.json(
        { error: "Failed to fetch quotes." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      quotes: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Quote GET error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
