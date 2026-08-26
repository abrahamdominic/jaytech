"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import {
  Users,
  ClipboardList,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Loader2,
  DollarSign,
  CalendarDays,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import type { Booking } from "@/types/database"

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "info" | "secondary"> = {
  pending: "warning",
  confirmed: "info",
  assigned: "secondary",
  in_progress: "default",
  completed: "success",
  cancelled: "danger",
  rescheduled: "warning",
}

const CHART_COLORS = ["#f59e0b", "#0ea5e9", "#22c55e", "#ef4444", "#8b5cf6", "#ec4899"]

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [customerCount, setCustomerCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        const [bookingsResult, customersResult] = await Promise.all([
          supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("role", "customer"),
        ])

        setBookings(bookingsResult.data || [])
        setCustomerCount(customersResult.count || 0)
      } catch {
        console.error("Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const thisMonthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    const thisMonthBookings = bookings.filter((b) =>
      isWithinInterval(new Date(b.created_at), { start: thisMonthStart, end: thisMonthEnd })
    )
    const lastMonthBookings = bookings.filter((b) =>
      isWithinInterval(new Date(b.created_at), { start: lastMonthStart, end: lastMonthEnd })
    )

    const totalRevenue = bookings
      .filter((b) => b.payment_status === "paid")
      .reduce((sum, b) => sum + (b.final_cost || b.estimated_cost || 0), 0)

    const thisMonthRevenue = thisMonthBookings
      .filter((b) => b.payment_status === "paid")
      .reduce((sum, b) => sum + (b.final_cost || b.estimated_cost || 0), 0)

    const lastMonthRevenue = lastMonthBookings
      .filter((b) => b.payment_status === "paid")
      .reduce((sum, b) => sum + (b.final_cost || b.estimated_cost || 0), 0)

    const revenueChange =
      lastMonthRevenue > 0
        ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : thisMonthRevenue > 0
          ? 100
          : 0

    const bookingChange =
      lastMonthBookings.length > 0
        ? Math.round(
            ((thisMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100
          )
        : thisMonthBookings.length > 0
          ? 100
          : 0

    const pendingCount = bookings.filter((b) =>
      ["pending", "confirmed"].includes(b.status)
    ).length

    const completedCount = bookings.filter((b) => b.status === "completed").length

    return {
      totalCustomers: customerCount,
      totalBookings: bookings.length,
      pendingBookings: pendingCount,
      completedJobs: completedCount,
      totalRevenue,
      monthlyRevenue: thisMonthRevenue,
      revenueChange,
      bookingChange,
    }
  }, [bookings, customerCount])

  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i)
      return {
        month: format(date, "MMM"),
        fullMonth: format(date, "yyyy-MM"),
      }
    })

    const revenueData = months.map(({ month, fullMonth }) => {
      const monthBookings = bookings.filter((b) => {
        const created = format(new Date(b.created_at), "yyyy-MM")
        return created === fullMonth && b.payment_status === "paid"
      })
      const revenue = monthBookings.reduce(
        (sum, b) => sum + (b.final_cost || b.estimated_cost || 0),
        0
      )
      return { name: month, revenue }
    })

    const bookingsData = months.map(({ month, fullMonth }) => {
      const count = bookings.filter((b) => {
        const created = format(new Date(b.created_at), "yyyy-MM")
        return created === fullMonth
      }).length
      return { name: month, bookings: count }
    })

    const serviceCounts: Record<string, number> = {}
    bookings.forEach((b) => {
      const name = b.service_name || "Other"
      serviceCounts[name] = (serviceCounts[name] || 0) + 1
    })
    const serviceData = Object.entries(serviceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    const customerGrowthData = months.map(({ month, fullMonth }) => {
      const count = bookings.filter((b) => {
        const created = format(new Date(b.created_at), "yyyy-MM")
        return created === fullMonth
      }).reduce((sum, b) => sum + (b.customer_id ? 1 : 0), 0)
      return { name: month, customers: count }
    })

    return { revenueData, bookingsData, serviceData, customerGrowthData }
  }, [bookings])

  const recentBookings = bookings.slice(0, 10)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-info/10 text-info",
      change: null,
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: ClipboardList,
      color: "bg-primary/10 text-primary-dark",
      change: stats.bookingChange,
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-warning/10 text-warning",
      change: null,
    },
    {
      label: "Completed Jobs",
      value: stats.completedJobs,
      icon: CheckCircle2,
      color: "bg-success/10 text-success",
      change: null,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-success/10 text-success",
      change: null,
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      icon: CalendarDays,
      color: "bg-primary/10 text-primary-dark",
      change: stats.revenueChange,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
        <p className="text-sm text-muted">
          Overview of your business performance and recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-secondary truncate">
                  {stat.value}
                </p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
              {stat.change !== null && (
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    stat.change >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {stat.change >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-lg font-semibold text-secondary">Revenue Overview</h2>
            <span className="text-xs text-muted">Last 6 months</span>
          </div>
          <CardContent className="p-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-lg font-semibold text-secondary">Bookings Overview</h2>
            <span className="text-xs text-muted">Last 6 months</span>
          </div>
          <CardContent className="p-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="bookings" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-lg font-semibold text-secondary">Service Popularity</h2>
          </div>
          <CardContent className="p-6">
            <div className="h-72">
              {chartData.serviceData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  No service data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.serviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.serviceData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) =>
                        value.length > 20 ? value.slice(0, 20) + "..." : value
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-lg font-semibold text-secondary">Customer Growth</h2>
            <span className="text-xs text-muted">Last 6 months</span>
          </div>
          <CardContent className="p-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.customerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#22c55e" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-lg font-semibold text-secondary">Recent Bookings</h2>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-dim">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Booking #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted">
                    No bookings found
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-surface-dim cursor-pointer"
                    onClick={() => {}}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-secondary">
                      {booking.booking_number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary">
                      {booking.full_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {booking.service_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {booking.appointment_date
                        ? formatDate(booking.appointment_date)
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant={statusVariant[booking.status]}>
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-secondary">
                      {booking.final_cost
                        ? formatCurrency(booking.final_cost)
                        : booking.estimated_cost
                          ? formatCurrency(booking.estimated_cost)
                          : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
