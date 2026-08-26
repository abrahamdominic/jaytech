"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  ClipboardList,
  Users,
  UserCog,
  Settings,
  FolderOpen,
  Star,
  FileText,
  FileSpreadsheet,
  CreditCard,
  Receipt,
  Mail,
  HelpCircle,
  Cog,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { Profile, Notification } from "@/types/database"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Technicians", href: "/admin/technicians", icon: UserCog },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Services", href: "/admin/services", icon: Settings },
      { label: "Projects", href: "/admin/projects", icon: FolderOpen },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Blog", href: "/admin/blog", icon: FileText },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Quotes", href: "/admin/quotes", icon: FileSpreadsheet },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Invoices", href: "/admin/invoices", icon: Receipt },
      { label: "Messages", href: "/admin/contact-messages", icon: Mail },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: Cog },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      setSidebarOpen(false)
    }
  }, [pathname])

  const [configError, setConfigError] = useState(false)

  const checkAuth = useCallback(async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
        setConfigError(true)
        setLoading(false)
        return
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!data || (data.role !== "admin" && data.role !== "super_admin")) {
        router.push("/dashboard")
        return
      }

      setProfile(data)

      const { data: notifs } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(10)

      setNotifications(notifs || [])
    } catch {
      setConfigError(true)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void (async () => {
      await checkAuth()
    })()
  }, [checkAuth])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const unreadCount = notifications.length

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (configError) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim px-4">
        <div className="max-w-md w-full rounded-2xl border border-danger/30 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle className="h-8 w-8 text-danger" />
          </div>
          <h1 className="text-xl font-bold text-secondary mb-2">
            Supabase Not Configured
          </h1>
          <p className="text-sm text-muted leading-relaxed mb-6">
            The admin dashboard requires Supabase for authentication. Please
            set up the following environment variables and restart the
            application:
          </p>
          <div className="rounded-xl bg-surface-dim p-4 text-left text-xs font-mono text-secondary/80 space-y-1">
            <p>NEXT_PUBLIC_SUPABASE_URL</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-secondary hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-dim">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-secondary text-white transition-all duration-300 lg:static lg:z-auto",
          collapsed ? "w-[72px]" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-secondary font-black text-sm shadow-lg shadow-primary/30">
                J
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-primary">Jay</span>Tech
              </span>
              <span className="ml-1 rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                Admin
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-secondary font-black text-sm shadow-lg shadow-primary/30">
                J
              </div>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-white/30">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-primary/10 text-primary border-l-[3px] border-primary -ml-[3px] pl-[19px]"
                          : "text-white/50 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent -ml-[3px] pl-[19px]",
                        collapsed && "justify-center px-0 pl-0 border-l-0 -ml-0"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/40 transition-all hover:text-white hover:bg-white/5 cursor-pointer mb-1"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/40 transition-all hover:text-white hover:bg-white/5 cursor-pointer",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-white px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-dim text-secondary transition-colors hover:bg-secondary hover:text-white cursor-pointer lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search bookings, customers, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-surface-dim pl-10 pr-4 py-2 text-sm text-secondary placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-dim hover:text-secondary cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-semibold text-secondary leading-tight">
                  {profile?.full_name || "Admin"}
                </p>
                <p className="text-[11px] text-muted capitalize">
                  {profile?.role?.replace("_", " ") || "Admin"}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary font-bold text-sm shadow-md">
                {profile ? getInitials(profile.full_name) : "A"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
