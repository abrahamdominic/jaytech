"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Loader2, TrendingUp, TrendingDown, Users, Calendar, DollarSign, Target } from "lucide-react"
import type { Payment, Booking, Service } from "@/types/database"

const DATE_RANGES = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
]

const PIE_COLORS = ["#f59e0b", "#0ea5e9", "#22c55e", "#ef4444", "#8b5cf6", "#ec4899"]

export default function AnalyticsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [paymentsRes, bookingsRes, servicesRes] = await Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("services").select("*"),
    ])
    if (paymentsRes.data) setPayments(paymentsRes.data)
    if (bookingsRes.data) setBookings(bookingsRes.data)
    if (servicesRes.data) setServices(servicesRes.data)
    setLoading(false)
  }

  function getDateCutoff(): Date {
    const now = new Date()
    switch (dateRange) {
      case "today": return new Date(now.getFullYear(), now.getMonth(), now.getDate())
      case "7d": now.setDate(now.getDate() - 7); return now
      case "30d": now.setDate(now.getDate() - 30); return now
      case "6m": now.setMonth(now.getMonth() - 6); return now
      case "1y": now.setFullYear(now.getFullYear() - 1); return now
      default: return new Date(0)
    }
  }

  const cutoff = getDateCutoff()
  const filteredPayments = payments.filter((p) => new Date(p.created_at) >= cutoff)
  const filteredBookings = bookings.filter((b) => new Date(b.created_at) >= cutoff)

  const totalRevenue = filteredPayments.filter((p) => p.status === "success").reduce((s, p) => s + (p.amount || 0), 0)
  const completedBookings = filteredBookings.filter((b) => b.status === "completed").length
  const totalBookings = filteredBookings.length
  const conversionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0
  const avgBookingValue = completedBookings > 0 ? Math.round(totalRevenue / completedBookings) : 0
  const cancelledBookings = filteredBookings.filter((b) => b.status === "cancelled").length

  // Revenue over time
  const revenueData = (() => {
    const months = dateRange === "today" || dateRange === "7d" ? 7 : dateRange === "30d" ? 12 : dateRange === "6m" ? 6 : 12
    return Array.from({ length: months }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (months - 1 - i))
      const month = date.toLocaleString("default", { month: "short" })
      const year = date.getFullYear()
      const monthPayments = filteredPayments.filter((p) => {
        const d = new Date(p.created_at)
        return d.getMonth() === date.getMonth() && d.getFullYear() === year && p.status === "success"
      })
      return { month, revenue: monthPayments.reduce((s, p) => s + (p.amount || 0), 0) }
    })
  })()

  // Bookings over time
  const bookingsData = (() => {
    const months = dateRange === "today" || dateRange === "7d" ? 7 : dateRange === "30d" ? 12 : dateRange === "6m" ? 6 : 12
    return Array.from({ length: months }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (months - 1 - i))
      const month = date.toLocaleString("default", { month: "short" })
      const year = date.getFullYear()
      const monthBookings = filteredBookings.filter((b) => {
        const d = new Date(b.created_at)
        return d.getMonth() === date.getMonth() && d.getFullYear() === year
      })
      return {
        month,
        completed: monthBookings.filter((b) => b.status === "completed").length,
        cancelled: monthBookings.filter((b) => b.status === "cancelled").length,
        total: monthBookings.length,
      }
    })
  })()

  // Customer growth (unique by month)
  const customerGrowth = (() => {
    const months = 12
    const seenEmails = new Set<string>()
    return Array.from({ length: months }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (months - 1 - i))
      const month = date.toLocaleString("default", { month: "short" })
      const year = date.getFullYear()
      const monthBookings = filteredBookings.filter((b) => {
        const d = new Date(b.created_at)
        return d.getMonth() === date.getMonth() && d.getFullYear() === year
      })
      monthBookings.forEach((b) => seenEmails.add(b.email))
      return { month, customers: seenEmails.size }
    })
  })()

  // Service popularity
  const servicePopularity = (() => {
    const map: Record<string, number> = {}
    filteredBookings.forEach((b) => {
      const name = b.service_name || "Other"
      map[name] = (map[name] || 0) + 1
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  })()

  // Revenue by service
  const revenueByService = (() => {
    const map: Record<string, number> = {}
    filteredPayments
      .filter((p) => p.status === "success")
      .forEach((p) => {
        const name = "Service"
        map[name] = (map[name] || 0) + (p.amount || 0)
      })
    // Try to group by booking service
    filteredPayments
      .filter((p) => p.status === "success" && p.booking_id)
      .forEach((p) => {
        const booking = bookings.find((b) => b.id === p.booking_id)
        if (booking?.service_name) {
          const name = booking.service_name
          map[name] = (map[name] || 0) + (p.amount || 0)
        }
      })
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
  })()

  // Recent transactions
  const recentPayments = filteredPayments.slice(0, 10)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Analytics</h1>
          <p className="text-sm text-muted mt-1">Track your business performance</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1">
          {DATE_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setDateRange(r.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                dateRange === r.value ? "bg-primary text-secondary" : "text-muted hover:bg-surface-dim"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted">Revenue</p>
                <p className="text-xl font-bold text-secondary">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted">Bookings</p>
                <p className="text-xl font-bold text-secondary">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted">Conversion</p>
                <p className="text-xl font-bold text-secondary">{conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted">Avg Booking</p>
                <p className="text-xl font-bold text-secondary">{formatCurrency(avgBookingValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} formatter={(value) => [formatCurrency(Number(value)), "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                  <Legend />
                  <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                  <Line type="monotone" dataKey="customers" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: "#0ea5e9", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {servicePopularity.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={servicePopularity}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {servicePopularity.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByService.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">No revenue data available</p>
            ) : (
              <div className="space-y-3">
                {revenueByService.map((item, i) => {
                  const maxAmount = Math.max(...revenueByService.map((r) => r.amount))
                  const pct = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary font-medium">{item.name}</span>
                        <span className="text-muted">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="h-2 bg-surface-dim rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-secondary">{p.transaction_reference || p.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted">{formatDate(p.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-secondary">{formatCurrency(p.amount)}</p>
                      <Badge variant={p.status === "success" ? "success" : p.status === "pending" ? "warning" : "danger"}>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
