"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import {
  Bell,
  BellOff,
  CheckCheck,
  Loader2,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import toast from "react-hot-toast"
import type { Notification } from "@/types/database"
import { cn } from "@/lib/utils"

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

const typeBadgeVariant = {
  info: "secondary" as const,
  success: "success" as const,
  warning: "warning" as const,
  error: "danger" as const,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingRead, setMarkingRead] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (data) setNotifications(data)
      setLoading(false)
    }
    void load()
    const interval = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [])

  async function markAsRead(id: string) {
    setMarkingRead(id)
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)

    if (error) {
      toast.error("Failed to mark as read")
    } else {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
    }
    setMarkingRead(null)
  }

  async function markAllAsRead() {
    setMarkingAll(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMarkingAll(false)
      return
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (error) {
      toast.error("Failed to mark all as read")
    } else {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      toast.success("All notifications marked as read")
    }
    setMarkingAll(false)
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  function timeAgo(dateStr: string) {
    const diff = now - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Notifications</h1>
          <p className="text-sm text-muted mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} disabled={markingAll}>
            {markingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total</p>
            <p className="text-2xl font-bold text-secondary">{notifications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Unread</p>
            <p className="text-2xl font-bold text-primary">{unreadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Read</p>
            <p className="text-2xl font-bold text-success">{notifications.length - unreadCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <BellOff className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-muted font-medium">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => {
                const Icon = typeIcons[notif.type] || Info
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex items-start gap-4 py-4 transition-colors",
                      !notif.is_read && "bg-primary/5 -mx-6 px-6"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        notif.type === "info" && "bg-blue-100 text-blue-600",
                        notif.type === "success" && "bg-green-100 text-green-600",
                        notif.type === "warning" && "bg-yellow-100 text-yellow-600",
                        notif.type === "error" && "bg-red-100 text-red-600"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-secondary">
                            {notif.title}
                          </p>
                          <p className="text-sm text-muted mt-0.5">{notif.message}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={typeBadgeVariant[notif.type]}>
                            {notif.type}
                          </Badge>
                          {!notif.is_read && (
                            <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-muted">
                          {timeAgo(notif.created_at)}
                        </span>
                        {notif.link && (
                          <a
                            href={notif.link}
                            className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                          >
                            View details
                          </a>
                        )}
                        {!notif.is_read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            disabled={markingRead === notif.id}
                            className="text-xs font-medium text-muted hover:text-secondary transition-colors cursor-pointer"
                          >
                            {markingRead === notif.id ? (
                              <Loader2 className="h-3 w-3 animate-spin inline" />
                            ) : (
                              "Mark read"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
