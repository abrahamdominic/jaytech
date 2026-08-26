"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  CheckCircle2,
  UserPlus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  ClipboardList,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import type { Booking, Technician } from "@/types/database"

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

const STATUS_COLORS: Record<string, "warning" | "info" | "secondary" | "default" | "success" | "danger"> = {
  pending: "warning",
  confirmed: "info",
  assigned: "secondary",
  in_progress: "default",
  completed: "success",
  cancelled: "danger",
}

const ITEMS_PER_PAGE = 10

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [assigningTech, setAssigningTech] = useState<string | null>(null)
  const [selectedTech, setSelectedTech] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const [bookingsRes, techsRes] = await Promise.all([
          supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("technicians")
            .select("*")
            .eq("status", "active")
            .order("name"),
        ])
        setBookings(bookingsRes.data || [])
        setTechnicians(techsRes.data || [])
      } catch {
        console.error("Failed to fetch bookings")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const serviceNames = useMemo(() => {
    const names = new Set(bookings.map((b) => b.service_name).filter(Boolean))
    return Array.from(names).sort()
  }, [bookings])

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (search) {
        const q = search.toLowerCase()
        const match =
          b.booking_number?.toLowerCase().includes(q) ||
          b.full_name?.toLowerCase().includes(q) ||
          b.email?.toLowerCase().includes(q) ||
          b.phone?.includes(q) ||
          b.service_name?.toLowerCase().includes(q)
        if (!match) return false
      }
      if (statusFilter !== "all" && b.status !== statusFilter) return false
      if (serviceFilter !== "all" && b.service_name !== serviceFilter) return false
      if (dateFrom && new Date(b.created_at) < new Date(dateFrom)) return false
      if (dateTo && new Date(b.created_at) > new Date(dateTo + "T23:59:59")) return false
      return true
    })
  }, [bookings, search, statusFilter, serviceFilter, dateFrom, dateTo])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const effectivePage = Math.min(currentPage, Math.max(1, totalPages))
  const paginated = filtered.slice(
    (effectivePage - 1) * ITEMS_PER_PAGE,
    effectivePage * ITEMS_PER_PAGE
  )

  const handleAssignTech = async (bookingId: string) => {
    if (!selectedTech) return
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("bookings")
        .update({
          assigned_technician_id: selectedTech,
          status: "assigned",
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)

      if (error) throw error

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, assigned_technician_id: selectedTech, status: "assigned" as const }
            : b
        )
      )
      setAssigningTech(null)
      setSelectedTech("")
    } catch {
      console.error("Failed to assign technician")
    }
  }

  const handleQuickConfirm = async (bookingId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)

      if (error) throw error

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "confirmed" as const } : b
        )
      )
    } catch {
      console.error("Failed to confirm booking")
    }
  }

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setServiceFilter("all")
    setDateFrom("")
    setDateTo("")
    setCurrentPage(1)
  }

  const hasFilters = search || statusFilter !== "all" || serviceFilter !== "all" || dateFrom || dateTo

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Bookings</h1>
        <p className="text-sm text-muted">
          Manage all customer bookings and assignments.
        </p>
      </div>

      <Card>
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search by booking #, name, email, phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="flex h-10 w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2 text-sm text-secondary placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
                className="h-10 rounded-xl border border-border bg-white px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={serviceFilter}
                onChange={(e) => { setServiceFilter(e.target.value); setCurrentPage(1) }}
                className="h-10 rounded-xl border border-border bg-white px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="all">All Services</option>
                {serviceNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Dates</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </Button>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 text-danger">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted" />
                <span className="text-xs text-muted whitespace-nowrap">From:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1) }}
                  className="h-9 rounded-lg border border-border bg-white px-3 py-1 text-sm text-secondary focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted whitespace-nowrap">To:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1) }}
                  className="h-9 rounded-lg border border-border bg-white px-3 py-1 text-sm text-secondary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
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
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <ClipboardList className="mx-auto mb-3 h-10 w-10 text-muted/30" />
                    <p className="text-sm text-muted">No bookings match your filters</p>
                  </td>
                </tr>
              ) : (
                paginated.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-surface-dim"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-sm font-semibold text-primary-dark hover:text-primary"
                      >
                        {booking.booking_number}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-secondary">
                          {booking.full_name}
                        </p>
                        <p className="text-xs text-muted">{booking.email}</p>
                      </div>
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
                      <Badge variant={STATUS_COLORS[booking.status]}>
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
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-dim hover:text-secondary"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {booking.status === "pending" && (
                          <button
                            onClick={() => handleQuickConfirm(booking.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-success/10 hover:text-success cursor-pointer"
                            title="Confirm"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        {["pending", "confirmed"].includes(booking.status) && (
                          <div className="relative">
                            <button
                              onClick={() =>
                                setAssigningTech(
                                  assigningTech === booking.id ? null : booking.id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-info/10 hover:text-info cursor-pointer"
                              title="Assign Technician"
                            >
                              <UserPlus className="h-4 w-4" />
                            </button>
                            {assigningTech === booking.id && (
                              <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-xl border border-border bg-white p-3 shadow-lg">
                                <p className="text-xs font-semibold text-secondary mb-2">
                                  Select Technician
                                </p>
                                <select
                                  value={selectedTech}
                                  onChange={(e) => setSelectedTech(e.target.value)}
                                  className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-sm text-secondary focus:border-primary focus:outline-none mb-2"
                                >
                                  <option value="">Choose...</option>
                                  {technicians.map((t) => (
                                    <option key={t.id} value={t.id}>
                                      {t.name} — {t.specialization}
                                    </option>
                                  ))}
                                </select>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAssignTech(booking.id)}
                                    disabled={!selectedTech}
                                    className="flex-1 h-8 text-xs"
                                  >
                                    Assign
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setAssigningTech(null)
                                      setSelectedTech("")
                                    }}
                                    className="h-8 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {paginated.length === 0 ? (
            <div className="p-8 text-center">
              <ClipboardList className="mx-auto mb-3 h-10 w-10 text-muted/30" />
              <p className="text-sm text-muted">No bookings match your filters</p>
            </div>
          ) : (
            paginated.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="block p-4 transition-colors hover:bg-surface-dim"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-secondary">
                      {booking.booking_number}
                    </p>
                    <p className="text-xs text-muted">{booking.full_name}</p>
                  </div>
                  <Badge variant={STATUS_COLORS[booking.status]}>
                    {booking.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{booking.service_name}</span>
                  <span>
                    {booking.final_cost
                      ? formatCurrency(booking.final_cost)
                      : booking.estimated_cost
                        ? formatCurrency(booking.estimated_cost)
                        : "—"}
                  </span>
                </div>
                {booking.appointment_date && (
                  <p className="mt-1 text-xs text-muted">
                    {formatDate(booking.appointment_date)}
                  </p>
                )}
              </Link>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-sm text-muted">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} bookings
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-primary text-secondary"
                        : "text-muted hover:bg-surface-dim"
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
