"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { Bell, Check, CheckCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { Notification } from "@/types/database"

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications?limit=10")
      if (!response.ok) return
      const data = await response.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread_count || 0)
    } catch {
      // Silently fail
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any
    supabaseAny.auth.getUser().then(({ data: { user } }: { data: { user: { id: string } | null } }) => {
      if (user?.id) {
        setUserId(user.id)
        fetchNotifications()
      }
    })
  }, [fetchNotifications])

  useEffect(() => {
    if (!userId) return
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [userId, fetchNotifications])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_id: notificationId }),
      })
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // Silently fail
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mark_all: true }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch {
      // Silently fail
    }
  }

  if (!userId) return null

  const typeColors: Record<string, string> = {
    info: "bg-info/10 text-info",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-danger/10 text-danger",
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-surface-dim text-secondary transition-colors hover:bg-secondary/10 cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-border bg-white shadow-2xl shadow-black/10">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-bold text-secondary">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-primary hover:text-primary-dark cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-muted hover:bg-surface-dim cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted/40" />
                <p className="mt-2 text-sm text-muted">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-surface",
                    !notification.is_read && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      typeColors[notification.type] || typeColors.info
                    )}
                  >
                    {notification.type === "success" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium text-secondary",
                          !notification.is_read && "font-bold"
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="shrink-0 rounded p-0.5 text-muted hover:text-primary cursor-pointer"
                          title="Mark as read"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        onClick={() => {
                          markAsRead(notification.id)
                          setIsOpen(false)
                        }}
                        className="mt-1 inline-block text-xs font-medium text-primary hover:text-primary-dark"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-2.5">
              <Link
                href="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-xs font-semibold text-primary hover:text-primary-dark"
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
