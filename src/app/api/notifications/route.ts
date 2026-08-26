import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAuthenticatedUser(): Promise<{ id: string } | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: { user } } = await (supabase as any).auth.getUser()

  return user ?? null
}

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const unread_only = searchParams.get("unread_only") === "true"

    let query = supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (unread_only) {
      query = query.eq("is_read", false)
    }

    const { data: notifications, error: notifError } = await query

    if (notifError) {
      console.error("Notifications fetch error:", notifError)
      return NextResponse.json(
        { error: "Failed to fetch notifications" },
        { status: 500 }
      )
    }

    const { count: unreadCount } = await supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    return NextResponse.json({
      notifications: notifications || [],
      unread_count: unreadCount || 0,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Notifications API error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { notification_id, mark_all } = body

    if (mark_all) {
      const { error } = await supabaseAdmin
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) {
        console.error("Mark all read error:", error)
        return NextResponse.json(
          { error: "Failed to mark notifications as read" },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    if (notification_id) {
      const { error } = await supabaseAdmin
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notification_id)
        .eq("user_id", user.id)

      if (error) {
        console.error("Mark read error:", error)
        return NextResponse.json(
          { error: "Failed to mark notification as read" },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: "notification_id or mark_all is required" },
      { status: 400 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Notifications POST error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
