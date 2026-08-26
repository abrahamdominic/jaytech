"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Star, Loader2, Trash2, Check, X, Eye, Search, Filter } from "lucide-react"
import toast from "react-hot-toast"
import type { Review } from "@/types/database"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all")
  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    setLoading(true)
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false })
    if (data) setReviews(data)
    setLoading(false)
  }

  async function toggleApproved(id: string, current: boolean) {
    setUpdatingId(id)
    const { error } = await supabase.from("reviews").update({ is_approved: !current, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) {
      toast.error("Failed to update review")
    } else {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_approved: !current } : r)))
      toast.success(current ? "Review rejected" : "Review approved")
    }
    setUpdatingId(null)
  }

  async function toggleFeatured(id: string, current: boolean) {
    setUpdatingId(id)
    const { error } = await supabase.from("reviews").update({ is_featured: !current, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) {
      toast.error("Failed to update review")
    } else {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_featured: !current } : r)))
      toast.success(current ? "Removed from featured" : "Marked as featured")
    }
    setUpdatingId(null)
  }

  async function deleteReview(id: string) {
    if (!confirm("Are you sure you want to delete this review?")) return
    setDeletingId(id)
    const { error } = await supabase.from("reviews").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete review")
    } else {
      setReviews((prev) => prev.filter((r) => r.id !== id))
      toast.success("Review deleted")
    }
    setDeletingId(null)
  }

  const filtered = reviews.filter((r) => {
    const matchesFilter = filter === "all" || (filter === "approved" && r.is_approved) || (filter === "pending" && !r.is_approved)
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.review.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "fill-none text-muted/30"}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Reviews</h1>
        <p className="text-sm text-muted mt-1">Manage customer reviews and testimonials</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Reviews</p>
            <p className="text-2xl font-bold text-secondary">{reviews.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Approved</p>
            <p className="text-2xl font-bold text-success">{reviews.filter((r) => r.is_approved).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Pending</p>
            <p className="text-2xl font-bold text-warning">{reviews.filter((r) => !r.is_approved).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              All Reviews
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto w-full sm:w-auto">
              <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1">
                {(["all", "approved", "pending"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      filter === f ? "bg-primary text-secondary" : "text-muted hover:bg-surface-dim"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search reviews..."
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
              <Star className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-muted font-medium">No reviews found</p>
              <p className="text-sm text-muted/70 mt-1">
                {filter !== "all" ? "No reviews match this filter" : "No reviews yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Rating</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Service</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                    <th className="pb-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((review) => (
                    <tr key={review.id} className="hover:bg-surface-dim/50 transition-colors">
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-secondary text-sm">{review.name}</p>
                          <p className="text-xs text-muted mt-0.5 truncate max-w-[250px]">{review.review}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-secondary">{review.service_used || "-"}</span>
                      </td>
                      <td className="py-4">
                        <Badge variant={review.is_approved ? "success" : "warning"}>
                          {review.is_approved ? "Approved" : "Pending"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-xs text-muted">{formatDate(review.created_at)}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleApproved(review.id, review.is_approved)}
                            disabled={updatingId === review.id}
                            className="cursor-pointer"
                            title={review.is_approved ? "Reject" : "Approve"}
                          >
                            {updatingId === review.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted" />
                            ) : review.is_approved ? (
                              <X className="h-4 w-4 text-danger hover:text-danger" />
                            ) : (
                              <Check className="h-4 w-4 text-success hover:text-success" />
                            )}
                          </button>
                          <button
                            onClick={() => toggleFeatured(review.id, review.is_featured)}
                            disabled={updatingId === review.id}
                            className="cursor-pointer"
                            title={review.is_featured ? "Unfeature" : "Feature"}
                          >
                            <Star className={`h-4 w-4 ${review.is_featured ? "fill-primary text-primary" : "text-muted hover:text-primary"}`} />
                          </button>
                          <button
                            onClick={() => deleteReview(review.id)}
                            disabled={deletingId === review.id}
                            className="cursor-pointer"
                            title="Delete"
                          >
                            {deletingId === review.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-danger hover:text-danger" />
                            )}
                          </button>
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
