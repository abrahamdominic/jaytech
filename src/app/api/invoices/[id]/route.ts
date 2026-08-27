import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

const COMPANY_INFO = {
  name: "J Tech Solar, Starlink & CCTV Hub",
  address: "Lagos, Nigeria",
  phone: "+234 704 354 1420",
  email: "info@J Tech Solar, Starlink & CCTV Hub.ng",
  website: "https://J Tech Solar, Starlink & CCTV Hub.ng",
}

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { id } = await params

    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from("invoices")
      .select(
        `
        *,
        customer:profiles(full_name, email, phone, address, state, city),
        booking:bookings(booking_number, service_name, description, full_name, email, phone, address, state, city)
      `
      )
      .eq("id", id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      )
    }

    const customer = invoice.customer as {
      full_name: string
      email: string
      phone: string
      address: string
      state: string
      city: string
    } | null

    const booking = invoice.booking as {
      booking_number: string
      service_name: string
      description: string
      full_name: string
      email: string
      phone: string
      address: string
      state: string
      city: string
    } | null

    const customerName = customer?.full_name || booking?.full_name || "N/A"
    const customerEmail = customer?.email || booking?.email || "N/A"
    const customerPhone = customer?.phone || booking?.phone || "N/A"
    const customerAddress = [
      booking?.address,
      booking?.city,
      booking?.state,
    ]
      .filter(Boolean)
      .join(", ") || customer?.address || "N/A"

    const invoiceData = {
      invoice_number: invoice.invoice_number,
      status: invoice.status,
      due_date: invoice.due_date,
      created_at: invoice.created_at,
      notes: invoice.notes,
      items: invoice.items,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      company: COMPANY_INFO,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
      },
      booking: booking
        ? {
            booking_number: booking.booking_number,
            service_name: booking.service_name,
          }
        : null,
      payment_status: invoice.status === "paid" ? "paid" : "unpaid",
    }

    return NextResponse.json({ invoice: invoiceData })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Invoice API error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
