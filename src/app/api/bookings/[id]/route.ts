import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { id } = await params

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .select(
        `
        *,
        service:services(id, title, slug, image_url, short_description),
        technician:technicians(id, name, phone, email, profile_photo, specialization),
        customer:profiles(id, full_name, email, phone, whatsapp, address, state, city),
        booking_uploads(*)
      `
      )
      .eq("id", id)
      .single()

    if (error || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Booking GET error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { id } = await params
    const body = await request.json()

    const allowedFields = [
      "status",
      "admin_notes",
      "internal_notes",
      "assigned_technician_id",
      "estimated_cost",
      "final_cost",
      "payment_status",
      "appointment_date",
      "appointment_time",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        service:services(id, title, slug),
        technician:technicians(id, name, phone, email),
        customer:profiles(id, full_name, email, phone)
      `
      )
      .single()

    if (error) {
      console.error("Booking update error:", error)
      return NextResponse.json(
        { error: "Failed to update booking" },
        { status: 500 }
      )
    }

    if (updateData.status && booking.customer_id) {
      const statusMessages: Record<string, { title: string; message: string; type: string }> = {
        confirmed: {
          title: "Booking Confirmed",
          message: `Your booking ${booking.booking_number} has been confirmed.`,
          type: "success",
        },
        assigned: {
          title: "Technician Assigned",
          message: `A technician has been assigned to your booking ${booking.booking_number}.`,
          type: "info",
        },
        in_progress: {
          title: "Service In Progress",
          message: `Work has begun on your booking ${booking.booking_number}.`,
          type: "info",
        },
        completed: {
          title: "Service Completed",
          message: `Your booking ${booking.booking_number} has been completed. Thank you!`,
          type: "success",
        },
        cancelled: {
          title: "Booking Cancelled",
          message: `Your booking ${booking.booking_number} has been cancelled.`,
          type: "warning",
        },
        rescheduled: {
          title: "Booking Rescheduled",
          message: `Your booking ${booking.booking_number} has been rescheduled.`,
          type: "warning",
        },
      }

      const notification = statusMessages[updateData.status as string]
      if (notification) {
        await supabaseAdmin.from("notifications").insert({
          user_id: booking.customer_id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          link: `/dashboard/bookings/${booking.id}`,
          is_read: false,
        })
      }
    }

    return NextResponse.json({ booking })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Booking PATCH error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
