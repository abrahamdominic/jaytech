"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ClipboardList,
  FileSpreadsheet,
  CreditCard,
  Edit2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import toast from "react-hot-toast"
import type { Profile, Booking, Quote, Payment } from "@/types/database"

const STATUS_COLORS: Record<string, "warning" | "info" | "secondary" | "default" | "success" | "danger"> = {
  pending: "warning",
  confirmed: "info",
  assigned: "secondary",
  in_progress: "default",
  completed: "success",
  cancelled: "danger",
  rescheduled: "warning",
}

export default function AdminCustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient()

      const [customerRes, bookingsRes, quotesRes, paymentsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", customerId)
          .single(),
        supabase
          .from("bookings")
          .select("*")
          .eq("customer_id", customerId)
          .order("created_at", { ascending: false }),
        supabase
          .from("quotes")
          .select("*")
          .eq("customer_id", customerId)
          .order("created_at", { ascending: false }),
        supabase
          .from("payments")
          .select("*")
          .eq("customer_id", customerId)
          .order("created_at", { ascending: false }),
      ])

      if (customerRes.error || !customerRes.data) {
        toast.error("Customer not found")
        router.push("/admin/customers")
        return
      }

      setCustomer(customerRes.data)
      setBookings(bookingsRes.data || [])
      setQuotes(quotesRes.data || [])
      setPayments(paymentsRes.data || [])
    } catch {
      toast.error("Failed to load customer details")
      router.push("/admin/customers")
    } finally {
      setLoading(false)
    }
  }, [customerId, router])

  useEffect(() => {
    void (async () => {
      await fetchData()
    })()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!customer) return null

  const totalSpent = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const totalBookingsValue = bookings.reduce(
    (sum, b) => sum + (b.final_cost || b.estimated_cost || 0),
    0
  )

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-border text-secondary transition-colors hover:bg-surface-dim cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary">{customer.full_name}</h1>
          <p className="text-sm text-muted">Customer since {formatDate(customer.created_at)}</p>
        </div>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl mb-3">
                  {getInitials(customer.full_name)}
                </div>
                <h2 className="text-lg font-bold text-secondary">{customer.full_name}</h2>
                <Badge
                  variant={
                    customer.role === "super_admin"
                      ? "danger"
                      : customer.role === "admin"
                        ? "info"
                        : "default"
                  }
                  className="mt-1"
                >
                  {customer.role?.replace("_", " ")}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted shrink-0" />
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-secondary hover:text-primary truncate"
                  >
                    {customer.email}
                  </a>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted shrink-0" />
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-secondary hover:text-primary"
                    >
                      {customer.phone}
                    </a>
                  </div>
                )}
                {customer.whatsapp && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted shrink-0" />
                    <a
                      href={`https://wa.me/${customer.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary"
                    >
                      WhatsApp: {customer.whatsapp}
                    </a>
                  </div>
                )}
                {(customer.address || customer.city || customer.state) && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted shrink-0 mt-0.5" />
                    <span className="text-secondary">
                      {customer.address}
                      {customer.city && `, ${customer.city}`}
                      {customer.state && `, ${customer.state}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted shrink-0" />
                  <span className="text-secondary">
                    Joined {formatDate(customer.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Total Bookings</span>
                <span className="font-semibold text-secondary">{bookings.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Total Quotes</span>
                <span className="font-semibold text-secondary">{quotes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Total Payments</span>
                <span className="font-semibold text-secondary">{payments.length}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-sm">
                <span className="text-muted">Total Spent</span>
                <span className="font-bold text-secondary">
                  {totalSpent > 0 ? formatCurrency(totalSpent) : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Booking Value</span>
                <span className="font-semibold text-secondary">
                  {totalBookingsValue > 0 ? formatCurrency(totalBookingsValue) : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-4 w-4 text-primary" />
                Bookings ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {bookings.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <ClipboardList className="mx-auto mb-3 h-10 w-10 text-muted/30" />
                  <p className="text-sm text-muted">No bookings yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {bookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/admin/bookings/${booking.id}`}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-surface-dim"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-primary-dark">
                            {booking.booking_number}
                          </p>
                          <Badge variant={STATUS_COLORS[booking.status]}>
                            {booking.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-secondary mt-0.5">{booking.service_name}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {booking.appointment_date
                            ? formatDate(booking.appointment_date)
                            : formatDate(booking.created_at)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-secondary">
                          {booking.final_cost
                            ? formatCurrency(booking.final_cost)
                            : booking.estimated_cost
                              ? formatCurrency(booking.estimated_cost)
                              : "—"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                Quotes ({quotes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {quotes.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <FileSpreadsheet className="mx-auto mb-3 h-10 w-10 text-muted/30" />
                  <p className="text-sm text-muted">No quotes yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-secondary">
                          {quote.quote_number}
                        </p>
                        <p className="text-sm text-muted mt-0.5">{quote.service_name}</p>
                        <p className="text-xs text-muted">{formatDate(quote.created_at)}</p>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <Badge
                          variant={
                            quote.status === "accepted"
                              ? "success"
                              : quote.status === "rejected"
                                ? "danger"
                                : quote.status === "quoted"
                                  ? "info"
                                  : "warning"
                          }
                        >
                          {quote.status}
                        </Badge>
                        {quote.quote_amount > 0 && (
                          <p className="text-sm font-medium text-secondary">
                            {formatCurrency(quote.quote_amount)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment History ({payments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {payments.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <CreditCard className="mx-auto mb-3 h-10 w-10 text-muted/30" />
                  <p className="text-sm text-muted">No payments recorded</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-secondary">
                          {payment.payment_method || "Payment"}
                        </p>
                        <p className="text-xs text-muted">
                          {payment.transaction_reference || "No reference"}
                        </p>
                        <p className="text-xs text-muted">
                          {payment.paid_at
                            ? formatDate(payment.paid_at)
                            : formatDate(payment.created_at)}
                        </p>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <Badge
                          variant={
                            payment.status === "success"
                              ? "success"
                              : payment.status === "failed"
                                ? "danger"
                                : payment.status === "refunded"
                                  ? "warning"
                                  : "default"
                          }
                        >
                          {payment.status}
                        </Badge>
                        <p className="text-sm font-semibold text-secondary">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
