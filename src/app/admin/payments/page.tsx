"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Search, Loader2, CreditCard, TrendingUp, Clock, XCircle, ArrowUpRight } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import toast from "react-hot-toast"
import type { Payment } from "@/types/database"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  const supabase = createClient()

  useEffect(() => {
    fetchPayments()
  }, [])

  async function fetchPayments() {
    setLoading(true)
    const { data } = await supabase.from("payments").select("*").order("created_at", { ascending: false })
    if (data) setPayments(data)
    setLoading(false)
  }

  function statusVariant(s: string) {
    if (s === "success") return "success"
    if (s === "pending") return "warning"
    if (s === "failed") return "danger"
    if (s === "refunded") return "info"
    return "outline"
  }

  const totalRevenue = payments.filter((p) => p.status === "success").reduce((sum, p) => sum + (p.amount || 0), 0)
  const thisMonth = payments.filter((p) => {
    const d = new Date(p.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && p.status === "success"
  }).reduce((sum, p) => sum + (p.amount || 0), 0)
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0)
  const refundedAmount = payments.filter((p) => p.status === "refunded").reduce((sum, p) => sum + (p.amount || 0), 0)

  // Chart data - last 12 months
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    const month = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()
    const monthPayments = payments.filter((p) => {
      const d = new Date(p.created_at)
      return d.getMonth() === date.getMonth() && d.getFullYear() === year && p.status === "success"
    })
    const total = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    return { month, total }
  })

  const filtered = payments.filter((p) => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    const matchSearch =
      p.transaction_reference?.toLowerCase().includes(search.toLowerCase()) ||
      p.customer_id?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Payments</h1>
        <p className="text-sm text-muted mt-1">Track transactions and revenue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted">Total Revenue</p>
                <p className="text-xl font-bold text-secondary">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted">This Month</p>
                <p className="text-xl font-bold text-secondary">{formatCurrency(thisMonth)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted">Pending</p>
                <p className="text-xl font-bold text-secondary">{formatCurrency(pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
                <XCircle className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted">Refunded</p>
                <p className="text-xl font-bold text-secondary">{formatCurrency(refundedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                />
                <Area type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Transactions
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto w-full sm:w-auto">
              <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1">
                {["all", "success", "pending", "failed", "refunded"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      statusFilter === s ? "bg-primary text-secondary" : "text-muted hover:bg-surface-dim"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-muted font-medium">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Transaction ID</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Amount</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Method</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((payment) => (
                    <tr key={payment.id} className="hover:bg-surface-dim/50 transition-colors">
                      <td className="py-4">
                        <span className="text-xs font-mono text-secondary">{payment.transaction_reference || payment.id.slice(0, 8)}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-secondary">{payment.customer_id?.slice(0, 8) || "-"}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-secondary">{formatCurrency(payment.amount)}</span>
                      </td>
                      <td className="py-4">
                        <Badge variant={statusVariant(payment.status) as "success" | "warning" | "danger" | "info" | "outline"}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-secondary capitalize">{payment.payment_method || "-"}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-xs text-muted">{formatDate(payment.created_at)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
