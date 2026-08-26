"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  CalendarCheck,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  User,
  CreditCard,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import type { Booking } from "@/types/database";

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  pending: "warning",
  confirmed: "info",
  assigned: "info",
  in_progress: "default",
  completed: "success",
  cancelled: "danger",
  rescheduled: "warning",
};

const timelineSteps = [
  "pending",
  "confirmed",
  "assigned",
  "in_progress",
  "completed",
];

const paymentVariant: Record<string, "default" | "success" | "warning" | "danger"> = {
  unpaid: "danger",
  partial: "warning",
  paid: "success",
  refunded: "danger",
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", id)
          .single();
        setBooking(data);
      } catch {
        toast.error("Booking not found");
        router.push("/dashboard/bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, router]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) {
      toast.error("Failed to cancel booking");
      return;
    }
    setBooking((prev) => (prev ? { ...prev, status: "cancelled" } : null));
    toast.success("Booking cancelled");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) return null;

  const canCancel = ["pending", "confirmed"].includes(booking.status);
  const currentStepIndex = timelineSteps.indexOf(booking.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-dim text-secondary transition-colors hover:bg-secondary hover:text-white cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-secondary">
            {booking.service_name}
          </h1>
          <p className="text-sm text-muted">{booking.booking_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarCheck className="h-4 w-4 text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Service Date</p>
                    <p className="text-sm font-medium text-secondary">
                      {booking.appointment_date
                        ? formatDate(booking.appointment_date)
                        : booking.preferred_date
                          ? `Preferred: ${formatDate(booking.preferred_date)}`
                          : "Not scheduled"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Preferred Time</p>
                    <p className="text-sm font-medium text-secondary">
                      {booking.preferred_time || "Flexible"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Location</p>
                    <p className="text-sm font-medium text-secondary">
                      {booking.address || "—"}
                    </p>
                    <p className="text-xs text-muted">
                      {booking.city && booking.state
                        ? `${booking.city}, ${booking.state}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Service Type</p>
                    <p className="text-sm font-medium text-secondary capitalize">
                      {booking.service_type}
                    </p>
                  </div>
                </div>
              </div>

              {booking.description && (
                <div className="mt-4 rounded-xl bg-surface-dim p-4">
                  <p className="text-xs font-semibold text-muted mb-1">
                    Description
                  </p>
                  <p className="text-sm text-secondary leading-relaxed">
                    {booking.description}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <p className="text-xs font-semibold text-muted mb-3">
                  Status Timeline
                </p>
                <div className="flex items-center gap-0 overflow-x-auto">
                  {timelineSteps.map((step, i) => {
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent = step === booking.status;
                    return (
                      <div key={step} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                              isCompleted
                                ? "bg-primary text-secondary"
                                : "bg-surface-dim text-muted border border-border"
                            } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}
                          >
                            {i + 1}
                          </div>
                          <p className="mt-1.5 text-[10px] font-medium text-muted whitespace-nowrap capitalize">
                            {step.replace("_", " ")}
                          </p>
                        </div>
                        {i < timelineSteps.length - 1 && (
                          <div
                            className={`h-0.5 w-8 sm:w-12 mx-1 ${
                              i < currentStepIndex ? "bg-primary" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {booking.admin_notes && (
                <div className="mt-4 rounded-xl bg-info/5 border border-info/20 p-4">
                  <p className="text-xs font-semibold text-info mb-1">
                    Admin Notes
                  </p>
                  <p className="text-sm text-secondary leading-relaxed">
                    {booking.admin_notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {booking.booking_uploads &&
            booking.booking_uploads.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {booking.booking_uploads.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-xl bg-surface-dim px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-secondary truncate">
                            {file.file_name}
                          </p>
                          <p className="text-xs text-muted">{file.file_type}</p>
                        </div>
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-primary-dark hover:text-primary shrink-0"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Status</span>
                <Badge variant={paymentVariant[booking.payment_status]}>
                  {booking.payment_status}
                </Badge>
              </div>
              {booking.estimated_cost > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Estimated Cost</span>
                  <span className="text-sm font-semibold text-secondary">
                    {formatCurrency(booking.estimated_cost)}
                  </span>
                </div>
              )}
              {booking.final_cost > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Final Cost</span>
                  <span className="text-sm font-bold text-secondary">
                    {formatCurrency(booking.final_cost)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted shrink-0" />
                <span className="text-sm text-secondary">
                  {booking.full_name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted shrink-0" />
                <span className="text-sm text-secondary">{booking.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted shrink-0" />
                <span className="text-sm text-secondary">{booking.phone}</span>
              </div>
              {booking.whatsapp && (
                <a
                  href={`https://wa.me/${booking.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-success/10 px-4 py-2.5 text-sm font-medium text-success hover:bg-success/20 transition-colors mt-2 w-full justify-center"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            {canCancel && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleCancel}
              >
                <XCircle className="h-4 w-4" />
                Cancel Booking
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/contact")}
            >
              <RotateCcw className="h-4 w-4" />
              Request Reschedule
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/bookings">
                <ArrowLeft className="h-4 w-4" />
                Back to Bookings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
