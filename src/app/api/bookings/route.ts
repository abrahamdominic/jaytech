import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { z } from "zod"
import type { Booking, BookingUpload } from "@/types/database"

function generateBookingNumber(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `JT-${year}${month}-${random}`
}

const bookingSchema = z.object({
  service_type: z.enum(["solar", "starlink", "electrical", "other"]),
  description: z.string().min(10),
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  whatsapp: z.string().optional().default(""),
  state: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(5),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional().default(""),
  project_details: z.record(z.unknown()).optional().default({}),
  uploads: z
    .array(
      z.object({
        file_url: z.string(),
        file_name: z.string(),
        file_type: z.string(),
        file_size: z.number(),
      })
    )
    .optional()
    .default([]),
})

const SERVICE_NAMES: Record<string, string> = {
  solar: "Solar Energy Installation",
  starlink: "Starlink Internet Setup",
  electrical: "Electrical Services",
  other: "Other Services",
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const data = parsed.data
    const booking_number = generateBookingNumber()

    const projectDetails: Record<string, unknown> = {
      ...data.project_details,
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        booking_number,
        service_name: SERVICE_NAMES[data.service_type],
        service_type: data.service_type,
        description: data.description,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        state: data.state,
        city: data.city,
        address: data.address,
        preferred_date: data.preferred_date || null,
        preferred_time: data.preferred_time,
        project_details: projectDetails,
        status: "pending",
        payment_status: "unpaid",
        admin_notes: "",
        internal_notes: "",
        estimated_cost: 0,
        final_cost: 0,
        appointment_date: null,
        appointment_time: "",
        assigned_technician_id: null,
      })
      .select()
      .single()

    if (bookingError) {
      console.error("Booking insert error:", bookingError)
      return NextResponse.json(
        { error: "Failed to create booking. Please try again." },
        { status: 500 }
      )
    }

    if (data.uploads && data.uploads.length > 0) {
      const uploadRecords = data.uploads.map((u) => ({
        booking_id: booking.id,
        file_url: u.file_url,
        file_name: u.file_name,
        file_type: u.file_type,
        file_size: u.file_size,
      }))

      const { error: uploadError } = await supabaseAdmin
        .from("booking_uploads")
        .insert(uploadRecords)

      if (uploadError) {
        console.error("Upload insert error:", uploadError)
      }
    }

    return NextResponse.json(
      { booking: { id: booking.id, booking_number: booking.booking_number } },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Booking API error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const service_type = searchParams.get("service_type")
    const date_from = searchParams.get("date_from")
    const date_to = searchParams.get("date_to")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }
    if (service_type) {
      query = query.eq("service_type", service_type)
    }
    if (date_from) {
      query = query.gte("created_at", date_from)
    }
    if (date_to) {
      query = query.lte("created_at", date_to + "T23:59:59")
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Booking list error:", error)
      return NextResponse.json(
        { error: "Failed to fetch bookings." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      bookings: data,
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
    console.error("Booking GET error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
