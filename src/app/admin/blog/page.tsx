"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Plus, Search, Edit2, Trash2, Loader2, FileText, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import type { BlogPost, BlogCategory } from "@/types/database"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [postsRes, catsRes] = await Promise.all([
      supabase.from("blog_posts").select("*, category:blog_categories(*)").order("created_at", { ascending: false }),
      supabase.from("blog_categories").select("*").order("name"),
    ])
    if (postsRes.data) setPosts(postsRes.data)
    if (catsRes.data) setCategories(catsRes.data)
    setLoading(false)
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === "published" ? "draft" : "published"
    setTogglingId(id)
    const { error } = await supabase.from("blog_posts").update({
      status: next,
      published_at: next === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq("id", id)
    if (error) {
      toast.error("Failed to update status")
    } else {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: next as BlogPost["status"] } : p)))
      toast.success(`Post ${next === "published" ? "published" : "unpublished"}`)
    }
    setTogglingId(null)
  }

  async function archivePost(id: string) {
    setTogglingId(id)
    const { error } = await supabase.from("blog_posts").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", id)
    if (error) {
      toast.error("Failed to archive post")
    } else {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "archived" } : p)))
      toast.success("Post archived")
    }
    setTogglingId(null)
  }

  async function deletePost(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return
    setDeletingId(id)
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete post")
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success("Post deleted")
    }
    setDeletingId(null)
  }

  function statusVariant(s: string) {
    if (s === "published") return "success"
    if (s === "archived") return "outline"
    return "warning"
  }

  const filtered = posts.filter((p) => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category?.name?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Blog</h1>
          <p className="text-sm text-muted mt-1">Manage your blog posts and articles</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Posts</p>
            <p className="text-2xl font-bold text-secondary">{posts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Published</p>
            <p className="text-2xl font-bold text-success">{posts.filter((p) => p.status === "published").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Drafts</p>
            <p className="text-2xl font-bold text-warning">{posts.filter((p) => p.status === "draft").length}</p>
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
              <FileText className="h-5 w-5 text-primary" />
              All Posts
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto w-full sm:w-auto">
              <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1">
                {["all", "published", "draft", "archived"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
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
                  placeholder="Search posts..."
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
              <FileText className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-muted font-medium">No posts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Title</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                    <th className="pb-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((post) => (
                    <tr key={post.id} className="hover:bg-surface-dim/50 transition-colors">
                      <td className="py-4">
                        <p className="font-medium text-secondary text-sm">{post.title}</p>
                        {post.excerpt && <p className="text-xs text-muted mt-0.5 truncate max-w-[300px]">{post.excerpt}</p>}
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{post.category?.name || "Uncategorized"}</Badge>
                      </td>
                      <td className="py-4">
                        <Badge variant={statusVariant(post.status) as "success" | "warning" | "outline"}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-xs text-muted">{formatDate(post.created_at)}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-1">
                          {post.status !== "published" && (
                            <button
                              onClick={() => toggleStatus(post.id, post.status)}
                              disabled={togglingId === post.id}
                              className="cursor-pointer"
                              title="Publish"
                            >
                              {togglingId === post.id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted" />
                              ) : (
                                <Eye className="h-4 w-4 text-success" />
                              )}
                            </button>
                          )}
                          {post.status === "published" && (
                            <button
                              onClick={() => toggleStatus(post.id, post.status)}
                              disabled={togglingId === post.id}
                              className="cursor-pointer"
                              title="Unpublish"
                            >
                              {togglingId === post.id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-warning" />
                              )}
                            </button>
                          )}
                          <Link href={`/admin/blog/${post.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePost(post.id)}
                            disabled={deletingId === post.id}
                            className="text-danger hover:text-danger hover:bg-danger/10"
                          >
                            {deletingId === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
