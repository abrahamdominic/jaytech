"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Users,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatDate, formatCurrency, getInitials } from "@/lib/utils"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import type { Profile } from "@/types/database"

interface CustomerWithStats extends Profile {
  booking_count: number
  total_spent: number
}

const ITEMS_PER_PAGE = 10

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "customer")
          .order("created_at", { ascending: false })

        if (error) throw error

        const customersWithStats: CustomerWithStats[] = await Promise.all(
          (profiles || []).map(async (profile: Profile) => {
            const [bookingsRes, paymentsRes] = await Promise.all([
              supabase
                .from("bookings")
                .select("id, final_cost, estimated_cost, payment_status", { count: "exact" })
                .eq("customer_id", profile.id),
              supabase
                .from("payments")
                .select("amount")
                .eq("customer_id", profile.id)
                .eq("status", "success"),
            ])

            const totalSpent =
              paymentsRes.data?.reduce((sum: number, p: { amount?: number }) => sum + (p.amount || 0), 0) ||
              bookingsRes.data
                ?.filter((b: { payment_status?: string }) => b.payment_status === "paid")
                .reduce(
                  (sum: number, b: { final_cost?: number; estimated_cost?: number }) =>
                    sum + (b.final_cost || b.estimated_cost || 0),
                  0
                ) ||
              0

            return {
              ...profile,
              booking_count: bookingsRes.count || 0,
              total_spent: totalSpent,
            }
          })
        )

        setCustomers(customersWithStats)
      } catch {
        console.error("Failed to fetch customers")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    if (!search) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        c.state?.toLowerCase().includes(q)
    )
  }, [customers, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const effectivePage = Math.min(currentPage, Math.max(1, totalPages))
  const paginated = filtered.slice(
    (effectivePage - 1) * ITEMS_PER_PAGE,
    effectivePage * ITEMS_PER_PAGE
  )

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
        <h1 className="text-2xl font-bold text-secondary">Customers</h1>
        <p className="text-sm text-muted">
          Manage your customer base and view customer details.
        </p>
      </div>

      <Card>
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by name, email, phone, city..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="flex h-10 w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2 text-sm text-secondary placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-dim">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="mx-auto mb-3 h-10 w-10 text-muted/30" />
                    <p className="text-sm text-muted">
                      {search ? "No customers match your search" : "No customers yet"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition-colors hover:bg-surface-dim"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                          {getInitials(customer.full_name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">
                            {customer.full_name}
                          </p>
                          <p className="text-xs text-muted">
                            {customer.city && customer.state
                              ? `${customer.city}, ${customer.state}`
                              : customer.state || customer.city || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <Mail className="h-3 w-3" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted">
                            <Phone className="h-3 w-3" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary font-medium">
                      {customer.booking_count}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-secondary">
                      {customer.total_spent > 0
                        ? formatCurrency(customer.total_spent)
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-dim hover:text-secondary"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
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
              <Users className="mx-auto mb-3 h-10 w-10 text-muted/30" />
              <p className="text-sm text-muted">
                {search ? "No customers match your search" : "No customers yet"}
              </p>
            </div>
          ) : (
            paginated.map((customer) => (
              <Link
                key={customer.id}
                href={`/admin/customers/${customer.id}`}
                className="block p-4 transition-colors hover:bg-surface-dim"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {getInitials(customer.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-secondary truncate">
                      {customer.full_name}
                    </p>
                    <p className="text-xs text-muted truncate">{customer.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-secondary">
                      {customer.booking_count} bookings
                    </p>
                    <p className="text-xs text-muted">
                      {customer.total_spent > 0
                        ? formatCurrency(customer.total_spent)
                        : "No spending"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-sm text-muted">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} customers
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
