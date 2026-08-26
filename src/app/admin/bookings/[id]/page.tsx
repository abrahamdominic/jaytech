"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  Receipt,
  StickyNote,
  UserCog,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Image as ImageIcon,
  ExternalLink,
  Save,
  AlertCircle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import { Textarea } from "@/components/ui/Textarea"
import toast from "react-hot-toast"
import type { Booking, Technician } from "@/types/database"

const STATUS_COLORS: Record<string, "warning" | "info" | "secondary" | "default" | "success" | "danger"> = {
  pending: "warning",
  confirmed: "info",
  assigned: "secondary",
  in_progress: "default",
  completed: "success",
  cancelled: "danger",
  rescheduled: "warning",
}

const TIMELINE_STEPS = ["pending", "confirmed", "assigned", "in_progress", "completed"]

export default function AdminBookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<Booking | null>(null)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState("")
  const [showTechSelector, setShowTechSelector] = useState(false)
  const [selectedTech, setSelectedTech] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const fetchBooking = useCallback(async () => {
    try {
      const supabase = createClient()
      const [bookingRes, techsRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .eq("id", bookingId)
          .single(),
        supabase
          .from("technicians")
          .select("*")
          .eq("status", "active")
          .order("name"),
      ])

      if (bookingRes.error || !bookingRes.data) {
        toast.error("Booking not found")
        router.push("/admin/bookings")
        return
      }

      setBooking(bookingRes.data)
      setNotes(bookingRes.data.internal_notes || "")
      setTechnicians(techsRes.data || [])
    } catch {
      toast.error("Failed to load booking")
      router.push("/admin/bookings")
    } finally {
      setLoading(false)
    }
  }, [bookingId, router])

  useEffect(() => {
    void (async () => {
      await fetchBooking()
    })()
  }, [fetchBooking])

  const updateBooking = async (updates: Partial<Booking>) => {
    setUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("bookings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", bookingId)

      if (error) throw error

      setBooking((prev) => (prev ? { ...prev, ...updates } : prev))
      toast.success("Booking updated successfully")
    } catch {
      toast.error("Failed to update booking")
    } finally {
      setUpdating(false)
    }
  }

  const handleStatusUpdate = (status: Booking["status"]) => {
    updateBooking({ status })
  }

  const handleAssignTech = () => {
    if (!selectedTech) return
    updateBooking({
      assigned_technician_id: selectedTech,
      status: "assigned",
    })
    setShowTechSelector(false)
    setSelectedTech("")
  }

  const handleSaveNotes = () => {
    updateBooking({ internal_notes: notes })
  }

  const handleMarkPayment = () => {
    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount")
      return
    }
    updateBooking({
      final_cost: amount,
      payment_status: "paid",
    })
    setShowPaymentForm(false)
    setPaymentAmount("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!booking) return null

  const currentStepIndex = TIMELINE_STEPS.indexOf(booking.status)
  const assignedTech = technicians.find((t) => t.id === booking.assigned_technician_id)

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
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-secondary">
              {booking.booking_number}
            </h1>
            <Badge variant={STATUS_COLORS[booking.status]}>
              {booking.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted mt-0.5">
            Created {formatDate(booking.created_at)}
          </p>
        </div>
        <div className="flex gap-2">
          {booking.status === "pending" && (
            <Button onClick={() => handleStatusUpdate("confirmed")} disabled={updating}>
              <CheckCircle2 className="h-4 w-4" />
              Confirm
            </Button>
          )}
          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <Button
              variant="destructive"
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={updating}
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}
          {booking.status === "in_progress" && (
            <Button
              onClick={() => handleStatusUpdate("completed")}
              disabled={updating}
              className="bg-success hover:bg-success/90"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {getInitials(booking.full_name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary">{booking.full_name}</p>
                    <p className="text-xs text-muted">Customer</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>{booking.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{booking.phone}</span>
                  </div>
                  {booking.whatsapp && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>WhatsApp: {booking.whatsapp}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm text-muted sm:col-span-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>
                    {booking.address}
                    {booking.city && `, ${booking.city}`}
                    {booking.state && `, ${booking.state}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Service</p>
                  <p className="text-sm font-medium text-secondary">{booking.service_name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Type</p>
                  <p className="text-sm font-medium text-secondary capitalize">{booking.service_type}</p>
                </div>
              </div>
              {booking.description && (
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-secondary whitespace-pre-wrap">{booking.description}</p>
                </div>
              )}
              {booking.project_details && Object.keys(booking.project_details).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Project Details</p>
                  <div className="rounded-xl border border-border bg-surface-dim p-4 space-y-2">
                    {Object.entries(booking.project_details).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2">
                        <span className="text-xs font-medium text-muted capitalize min-w-[120px]">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="text-sm text-secondary">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {booking.booking_uploads && booking.booking_uploads.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Uploaded Files ({booking.booking_uploads.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {booking.booking_uploads.map((file) => (
                    <a
                      key={file.id}
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-xl border border-border bg-surface-dim aspect-square flex items-center justify-center transition-all hover:shadow-md"
                    >
                      {file.file_type.startsWith("image/") ? (
                        <img
                          src={file.file_url}
                          alt={file.file_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-muted">
                          <FileText className="h-8 w-8" />
                          <span className="text-[10px] text-center px-1 truncate max-w-full">
                            {file.file_name}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ExternalLink className="h-5 w-5 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <StickyNote className="h-4 w-4 text-primary" />
                Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes about this booking..."
                className="mb-3"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveNotes}
                disabled={updating || notes === (booking.internal_notes || "")}
              >
                <Save className="h-4 w-4" />
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const isCompleted = i <= currentStepIndex
                  const isCurrent = step === booking.status
                  return (
                    <div key={step} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                            isCompleted
                              ? "border-success bg-success text-white"
                              : "border-border bg-white text-muted"
                          } ${isCurrent ? "ring-2 ring-primary/30" : ""}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-bold">{i + 1}</span>
                          )}
                        </div>
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div
                            className={`w-0.5 h-6 ${
                              i < currentStepIndex ? "bg-success" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-6 pt-1">
                        <p
                          className={`text-sm font-medium capitalize ${
                            isCurrent
                              ? "text-primary-dark"
                              : isCompleted
                                ? "text-secondary"
                                : "text-muted"
                          }`}
                        >
                          {step.replace("_", " ")}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-muted mt-0.5">Current status</p>
                        )}
                      </div>
                    </div>
                  )
                })}
                {booking.status === "cancelled" && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-danger bg-danger text-white">
                        <XCircle className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-medium text-danger">Cancelled</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted" />
                <span className="text-muted">Date:</span>
                <span className="font-medium text-secondary">
                  {booking.appointment_date
                    ? formatDate(booking.appointment_date)
                    : booking.preferred_date
                      ? formatDate(booking.preferred_date) + " (preferred)"
                      : "Not set"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted" />
                <span className="text-muted">Time:</span>
                <span className="font-medium text-secondary">
                  {booking.appointment_time || booking.preferred_time || "Not set"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Assigned Technician</span>
                <button
                  onClick={() => setShowTechSelector(!showTechSelector)}
                  className="text-xs font-medium text-primary-dark hover:text-primary cursor-pointer"
                >
                  {assignedTech ? "Change" : "Assign"}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedTech ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {getInitials(assignedTech.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary">{assignedTech.name}</p>
                    <p className="text-xs text-muted">{assignedTech.specialization}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">No technician assigned</p>
              )}

              {showTechSelector && (
                <div className="mt-4 space-y-3 p-3 rounded-xl border border-border bg-surface-dim">
                  <select
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select technician...</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.specialization}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAssignTech}
                      disabled={!selectedTech || updating}
                      className="flex-1"
                    >
                      <UserCog className="h-4 w-4" />
                      Assign
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowTechSelector(false)
                        setSelectedTech("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Payment</span>
                <button
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="text-xs font-medium text-primary-dark hover:text-primary cursor-pointer"
                >
                  Record Payment
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Estimated Cost</span>
                  <span className="font-medium text-secondary">
                    {booking.estimated_cost ? formatCurrency(booking.estimated_cost) : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Final Cost</span>
                  <span className="font-medium text-secondary">
                    {booking.final_cost ? formatCurrency(booking.final_cost) : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Payment Status</span>
                  <Badge
                    variant={
                      booking.payment_status === "paid"
                        ? "success"
                        : booking.payment_status === "partial"
                          ? "warning"
                          : booking.payment_status === "refunded"
                            ? "danger"
                            : "danger"
                    }
                  >
                    {booking.payment_status}
                  </Badge>
                </div>
              </div>

              {showPaymentForm && (
                <div className="p-3 rounded-xl border border-border bg-surface-dim space-y-3">
                  <div className="flex items-center gap-2 text-xs text-warning">
                    <AlertCircle className="h-3.5 w-3.5" />
                    This will update the booking cost and mark as paid.
                  </div>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Amount (₦)"
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleMarkPayment}
                      disabled={updating || !paymentAmount}
                      className="flex-1"
                    >
                      <CreditCard className="h-4 w-4" />
                      Record Payment
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowPaymentForm(false)
                        setPaymentAmount("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                <Link href={`/admin/bookings/${booking.id}`}>
                  <Receipt className="h-4 w-4" />
                  Generate Invoice
                </Link>
              </Button>
              {booking.status !== "cancelled" && booking.status !== "completed" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => handleStatusUpdate("rescheduled")}
                  disabled={updating}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reschedule
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
