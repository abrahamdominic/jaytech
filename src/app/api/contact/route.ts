import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  service_type: z.string().optional().default("general"),
})

export async function POST(request: NextRequest) {
  try {
    const limited = await rateLimit({ max: 5, windowMs: 60_000, key: "contact" })
    if (limited) return limited

    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const data = parsed.data

    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      service_type: data.service_type,
      status: "unread",
      admin_notes: "",
    })

    if (error) {
      console.error("Contact insert error:", error)
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Contact API error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
