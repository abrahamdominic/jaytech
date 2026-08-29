import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { requireAuth } from "@/lib/auth"
import { initializePayment, generatePaymentReference } from "@/lib/paystack"

interface InitRequestBody {
  booking_id?: string
  quote_id?: string
  invoice_id?: string
  amount?: number
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error

    const body = (await request.json()) as InitRequestBody
    const { booking_id, quote_id, invoice_id, amount } = body

    if (amount && amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      )
    }

    if (!booking_id && !quote_id && !invoice_id) {
      return NextResponse.json(
        { error: "Either booking_id, quote_id or invoice_id is required" },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    let customer_id: string | null = null
    let email = auth.user.email ?? ""

    // Derive authoritative amount and ownership server-side. Never trust a
    // client-supplied amount or email for the actual charge.
    if (booking_id) {
      const { data: booking } = await supabaseAdmin
        .from("bookings")
        .select("id, customer_id, email, final_cost, estimated_cost")
        .eq("id", booking_id)
        .single()

      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        )
      }

      if (
        booking.customer_id &&
        booking.customer_id !== auth.user.id &&
        auth.profile.role !== "admin" &&
        auth.profile.role !== "super_admin"
      ) {
        return NextResponse.json(
          { error: "You do not have access to this booking" },
          { status: 403 }
        )
      }

      customer_id = booking.customer_id || auth.user.id
      email = email || booking.email || ""

      const dueAmount = booking.final_cost || booking.estimated_cost || 0
      if (amount !== undefined && amount !== dueAmount) {
        return NextResponse.json(
          { error: "Payment amount does not match the booking amount" },
          { status: 400 }
        )
      }
      return createPayment(supabaseAdmin, {
        booking_id,
        quote_id: null,
        invoice_id: null,
        customer_id,
        amount: dueAmount,
        email,
      })
    }

    if (quote_id) {
      const { data: quote } = await supabaseAdmin
        .from("quotes")
        .select("id, customer_id, email, quote_amount")
        .eq("id", quote_id)
        .single()

      if (!quote) {
        return NextResponse.json(
          { error: "Quote not found" },
          { status: 404 }
        )
      }

      if (
        quote.customer_id &&
        quote.customer_id !== auth.user.id &&
        auth.profile.role !== "admin" &&
        auth.profile.role !== "super_admin"
      ) {
        return NextResponse.json(
          { error: "You do not have access to this quote" },
          { status: 403 }
        )
      }

      customer_id = quote.customer_id || auth.user.id
      email = email || quote.email || ""

      const dueAmount = quote.quote_amount || 0
      if (amount !== undefined && amount !== dueAmount) {
        return NextResponse.json(
          { error: "Payment amount does not match the quote amount" },
          { status: 400 }
        )
      }
      return createPayment(supabaseAdmin, {
        booking_id: null,
        quote_id,
        invoice_id: null,
        customer_id,
        amount: dueAmount,
        email,
      })
    }

    // invoice_id path
    const { data: invoice } = await supabaseAdmin
      .from("invoices")
      .select("id, customer_id, total")
      .eq("id", invoice_id)
      .single()

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      )
    }

    if (
      invoice.customer_id &&
      invoice.customer_id !== auth.user.id &&
      auth.profile.role !== "admin" &&
      auth.profile.role !== "super_admin"
    ) {
      return NextResponse.json(
        { error: "You do not have access to this invoice" },
        { status: 403 }
      )
    }

    customer_id = invoice.customer_id || auth.user.id

    if (amount !== undefined && amount !== invoice.total) {
      return NextResponse.json(
        { error: "Payment amount does not match the invoice amount" },
        { status: 400 }
      )
    }
    return createPayment(supabaseAdmin, {
      booking_id: null,
      quote_id: null,
      invoice_id: invoice_id as string,
      customer_id,
      amount: invoice.total,
      email,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Payment init error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}

async function createPayment(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  {
    booking_id,
    quote_id,
    invoice_id,
    customer_id,
    amount,
    email,
  }: {
    booking_id: string | null
    quote_id: string | null
    invoice_id: string | null
    customer_id: string | null
    amount: number
    email: string
  }
) {
  if (!amount || amount <= 0 || !email) {
    return NextResponse.json(
      { error: "Payment cannot be initialized: missing amount or email" },
      { status: 400 }
    )
  }

  const reference = generatePaymentReference()

  const { data: payment, error: paymentError } = await supabaseAdmin
    .from("payments")
    .insert({
      booking_id,
      quote_id,
      invoice_id,
      customer_id,
      amount,
      currency: "NGN",
      status: "pending",
      payment_method: "paystack",
      transaction_reference: reference,
      paystack_reference: reference,
      metadata: { email },
    })
    .select()
    .single()

  if (paymentError) {
    console.error("Payment insert error:", paymentError)
    return NextResponse.json(
      { error: "Failed to create payment record" },
      { status: 500 }
    )
  }

  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`

  const paystackResponse = await initializePayment({
    email,
    amount,
    reference,
    callback_url: callbackUrl,
    metadata: {
      payment_id: payment.id,
      booking_id: booking_id || null,
      quote_id: quote_id || null,
      invoice_id: invoice_id || null,
    },
  })

  await supabaseAdmin
    .from("payments")
    .update({
      paystack_reference: paystackResponse.data.reference,
      transaction_reference: paystackResponse.data.reference,
    })
    .eq("id", payment.id)

  return NextResponse.json({
    authorization_url: paystackResponse.data.authorization_url,
    reference: paystackResponse.data.reference,
    payment_id: payment.id,
  })
}
