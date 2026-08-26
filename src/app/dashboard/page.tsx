"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Phone,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Booking } from "@/types/database";

const statsConfig = [
  {
    label: "Total Bookings",
    key: "total",
    icon: CalendarCheck,
    color: "bg-primary/10 text-primary-dark",
  },
  {
    label: "Pending",
    key: "pending",
    icon: Clock,
    color: "bg-warning/10 text-warning",
  },
  {
    label: "Completed",
    key: "completed",
    icon: CheckCircle2,
    color: "bg-success/10 text-success",
  },
  {
    label: "Upcoming",
    key: "upcoming",
    icon: CalendarCheck,
    color: "bg-info/10 text-info",
  },
];

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  pending: "warning",
  confirmed: "info",
  assigned: "info",
  in_progress: "default",
  completed: "success",
  cancelled: "danger",
  rescheduled: "warning",
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
          .order("created_at", { ascending: false })
          .limit(5);

        setBookings(data || []);
      } catch {
        console.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) =>
      ["pending", "confirmed", "assigned"].includes(b.status)
    ).length,
    completed: bookings.filter((b) => b.status === "completed").length,
    upcoming: bookings.filter(
      (b) =>
        b.appointment_date &&
        new Date(b.appointment_date) >= new Date() &&
        b.status !== "cancelled"
    ).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
        <p className="text-sm text-muted">
          Welcome back! Here&apos;s an overview of your bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">
                  {stats[stat.key as keyof typeof stats]}
                </p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-lg font-semibold text-secondary">
                Recent Bookings
              </h2>
              <Link
                href="/dashboard/bookings"
                className="text-sm font-medium text-primary-dark hover:text-primary transition-colors"
              >
                View all
              </Link>
            </div>
            <CardContent className="p-0">
              {bookings.length === 0 ? (
                <div className="p-8 text-center">
                  <CalendarCheck className="mx-auto mb-3 h-10 w-10 text-muted/40" />
                  <p className="text-sm text-muted mb-1">No bookings yet</p>
                  <p className="text-xs text-muted">
                    Book your first service to get started.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {bookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/dashboard/bookings/${booking.id}`}
                      className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-surface-dim"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-secondary truncate">
                          {booking.service_name}
                        </p>
                        <p className="text-xs text-muted">
                          {booking.booking_number}
                          {booking.appointment_date &&
                            ` • ${formatDate(booking.appointment_date)}`}
                        </p>
                      </div>
                      <Badge variant={statusVariant[booking.status]}>
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-secondary mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/services">
                    Book a Service
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">
                    <Phone className="h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-secondary mb-2">
                Need Help?
              </h3>
              <p className="text-xs text-muted leading-relaxed mb-4">
                Our team is available Mon–Sat, 8am–6pm. Reach out via WhatsApp
                for quick support.
              </p>
              <a
                href="https://wa.me/2347043541420"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-success/90"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
