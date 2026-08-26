import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { verifyWebhookSignature } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    const eventType = event.event

    if (eventType === "charge.success") {
      const { data } = event
      const reference = data.reference

      const { data: payment, error: paymentError } = await supabaseAdmin
        .from("payments")
        .select("*, booking:bookings(id, customer_id)")
        .eq("paystack_reference", reference)
        .single()

      if (paymentError || !payment) {
        console.error("Payment record not found for reference:", reference)
        return NextResponse.json({ received: true })
      }

      if (payment.status === "success") {
        return NextResponse.json({ received: true })
      }

      const { error: updateError } = await supabaseAdmin
        .from("payments")
        .update({
          status: "success",
          paid_at: data.paid_at || new Date().toISOString(),
          metadata: {
            ...payment.metadata,
            paystack_response: data,
          },
        })
        .eq("id", payment.id)

      if (updateError) {
        console.error("Failed to update payment:", updateError)
      }

      if (payment.booking_id) {
        const { error: bookingUpdateError } = await supabaseAdmin
          .from("bookings")
          .update({ payment_status: "paid" })
          .eq("id", payment.booking_id)

        if (bookingUpdateError) {
          console.error("Failed to update booking payment status:", bookingUpdateError)
        }

        const booking = payment.booking as { id: string; customer_id: string | null } | null
        if (booking?.customer_id) {
          await supabaseAdmin.from("notifications").insert({
            user_id: booking.customer_id,
            title: "Payment Confirmed",
            message: `Your payment of ₦${(payment.amount / 100).toLocaleString()} has been confirmed successfully.`,
            type: "success",
            link: `/dashboard/bookings/${booking.id}`,
            is_read: false,
          })
        }
      }
    }

    if (eventType === "invoice.payment") {
      const { data } = event
      const reference = data.reference

      const { data: payment } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("paystack_reference", reference)
        .single()

      if (payment && payment.status !== "success") {
        await supabaseAdmin
          .from("payments")
          .update({
            status: "success",
            paid_at: data.paid_at || new Date().toISOString(),
          })
          .eq("id", payment.id)

        if (payment.invoice_id) {
          await supabaseAdmin
            .from("invoices")
            .update({ status: "paid" })
            .eq("id", payment.invoice_id)
        }

        if (payment.booking_id) {
          await supabaseAdmin
            .from("bookings")
            .update({ payment_status: "paid" })
            .eq("id", payment.booking_id)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Webhook error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
