import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { z } from "zod"

const reviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  review: z.string().min(10, "Review must be at least 10 characters"),
  service_used: z.string().min(1, "Please specify the service used"),
  booking_id: z.string().uuid().optional(),
  service_id: z.string().uuid().optional(),
  image_url: z.string().url().optional().default(""),
})

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const parsed = reviewSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const data = parsed.data

    const { error } = await supabaseAdmin.from("reviews").insert({
      name: data.name,
      rating: data.rating,
      review: data.review,
      service_used: data.service_used,
      booking_id: data.booking_id || null,
      service_id: data.service_id || null,
      image_url: data.image_url,
      is_approved: false,
      is_featured: false,
    })

    if (error) {
      console.error("Review insert error:", error)
      return NextResponse.json(
        { error: "Failed to submit review. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Review submitted! It will appear after approval." },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Review POST error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const all = searchParams.get("all") === "true"
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from("reviews")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    if (!all) {
      query = query.eq("is_approved", true)
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Review list error:", error)
      return NextResponse.json(
        { error: "Failed to fetch reviews." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reviews: data,
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
    console.error("Review GET error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
