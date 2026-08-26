"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Eye, Loader2, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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

const STATUS_FILTERS = [
  "all",
  "pending",
  "confirmed",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("bookings")
          .select("*")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

        setBookings(data || []);
      } catch {
        console.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">My Bookings</h1>
        <p className="text-sm text-muted">
          View and manage all your service bookings.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted shrink-0" />
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === s
                ? "bg-secondary text-white"
                : "bg-surface-dim text-muted hover:text-secondary"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarCheck className="mb-3 h-12 w-12 text-muted/30" />
            <p className="text-sm font-medium text-secondary mb-1">
              No bookings found
            </p>
            <p className="text-xs text-muted mb-4">
              {statusFilter === "all"
                ? "You haven't made any bookings yet."
                : `No bookings with status "${statusFilter.replace("_", " ")}".`}
            </p>
            {statusFilter === "all" && (
              <Button size="sm" asChild>
                <Link href="/services">Book a Service</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden lg:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((booking) => (
                      <tr
                        key={booking.id}
                        className="transition-colors hover:bg-surface-dim"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-secondary">
                            {booking.service_name}
                          </p>
                          <p className="text-xs text-muted">
                            {booking.booking_number}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted">
                          {booking.appointment_date
                            ? formatDate(booking.appointment_date)
                            : booking.preferred_date
                              ? formatDate(booking.preferred_date)
                              : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusVariant[booking.status]}>
                            {booking.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-secondary">
                          {booking.final_cost > 0
                            ? formatCurrency(booking.final_cost)
                            : booking.estimated_cost > 0
                              ? `~${formatCurrency(booking.estimated_cost)}`
                              : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/dashboard/bookings/${booking.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="space-y-3 lg:hidden">
            {filtered.map((booking) => (
              <Link
                key={booking.id}
                href={`/dashboard/bookings/${booking.id}`}
                className="block"
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-secondary">
                          {booking.service_name}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {booking.booking_number}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          {booking.appointment_date
                            ? formatDate(booking.appointment_date)
                            : booking.preferred_date
                              ? `Preferred: ${formatDate(booking.preferred_date)}`
                              : "No date set"}
                        </p>
                      </div>
                      <Badge variant={statusVariant[booking.status]}>
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {booking.estimated_cost > 0 && (
                      <p className="mt-2 text-sm font-medium text-secondary">
                        {booking.final_cost > 0
                          ? formatCurrency(booking.final_cost)
                          : `Est. ${formatCurrency(booking.estimated_cost)}`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
