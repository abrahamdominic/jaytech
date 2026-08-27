"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Wrench,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import type { Service, ServiceCategory } from "@/types/database"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const [servicesRes, categoriesRes] = await Promise.all([
        supabase.from("services").select("*, category:service_categories(*)").order("created_at", { ascending: false }),
        supabase.from("service_categories").select("*").order("display_order"),
      ])
      if (servicesRes.data) setServices(servicesRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    }
    void load()
  }, [])

  async function toggleActive(id: string, current: boolean) {
    setTogglingId(id)
    const { error } = await supabase.from("services").update({ is_active: !current, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) {
      toast.error("Failed to update status")
    } else {
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s)))
      toast.success("Status updated")
    }
    setTogglingId(null)
  }

  async function deleteService(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return
    setDeletingId(id)
    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete service")
    } else {
      setServices((prev) => prev.filter((s) => s.id !== id))
      toast.success("Service deleted")
    }
    setDeletingId(null)
  }

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Services</h1>
          <p className="text-sm text-muted mt-1">Manage your service offerings</p>
        </div>
        <Link href="/admin/services/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Services</p>
            <p className="text-2xl font-bold text-secondary">{services.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Active</p>
            <p className="text-2xl font-bold text-success">{services.filter((s) => s.is_active).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Categories</p>
            <p className="text-2xl font-bold text-accent">{categories.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              All Services
            </CardTitle>
            <div className="relative sm:ml-auto w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
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
              <Wrench className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-muted font-medium">No services found</p>
              <p className="text-sm text-muted/70 mt-1">
                {search ? "Try a different search term" : "Add your first service to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Service</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Price</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((service) => (
                    <tr key={service.id} className="hover:bg-surface-dim/50 transition-colors">
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-secondary text-sm">{service.title}</p>
                          <p className="text-xs text-muted mt-0.5 truncate max-w-[300px]">{service.short_description}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{service.category?.name || "Uncategorized"}</Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-secondary">
                          {service.pricing_type === "request_quote"
                            ? "Quote"
                            : service.pricing_type === "fixed"
                              ? formatCurrency(service.starting_price)
                              : service.pricing_type === "starting"
                                ? `From ${formatCurrency(service.starting_price)}`
                                : service.pricing_type === "range"
                                  ? `${formatCurrency(service.price_range_min)} - ${formatCurrency(service.price_range_max)}`
                                  : formatCurrency(service.starting_price)}
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleActive(service.id, service.is_active)}
                          disabled={togglingId === service.id}
                          className="cursor-pointer"
                        >
                          {togglingId === service.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted" />
                          ) : service.is_active ? (
                            <Badge variant="success">
                              <Eye className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/services/${service.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteService(service.id)}
                            disabled={deletingId === service.id}
                            className="text-danger hover:text-danger hover:bg-danger/10"
                          >
                            {deletingId === service.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
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
