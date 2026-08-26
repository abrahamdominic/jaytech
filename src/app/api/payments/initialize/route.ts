import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { initializePayment, generatePaymentReference } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const { booking_id, quote_id, amount, email } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    if (!booking_id && !quote_id) {
      return NextResponse.json(
        { error: "Either booking_id or quote_id is required" },
        { status: 400 }
      )
    }

    let customer_id: string | null = null

    if (booking_id) {
      const { data: booking } = await supabaseAdmin
        .from("bookings")
        .select("id, customer_id")
        .eq("id", booking_id)
        .single()

      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        )
      }
      customer_id = booking.customer_id
    }

    if (quote_id) {
      const { data: quote } = await supabaseAdmin
        .from("quotes")
        .select("id, customer_id")
        .eq("id", quote_id)
        .single()

      if (!quote) {
        return NextResponse.json(
          { error: "Quote not found" },
          { status: 404 }
        )
      }
      customer_id = quote.customer_id
    }

    const reference = generatePaymentReference()

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        booking_id: booking_id || null,
        quote_id: quote_id || null,
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Payment init error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
