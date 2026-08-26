"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Loader2, FolderOpen, Globe, MapPin } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import type { Project } from "@/types/database"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    const { data } = await supabase
      .from("projects")
      .select("*, project_images:image(*)")
      .order("created_at", { ascending: false })
    if (data) setProjects(data)
    setLoading(false)
  }

  async function togglePublished(id: string, current: boolean) {
    setTogglingId(id)
    const { error } = await supabase.from("projects").update({ is_published: !current, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) {
      toast.error("Failed to update status")
    } else {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, is_published: !current } : p)))
      toast.success("Status updated")
    }
    setTogglingId(null)
  }

  async function deleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return
    setDeletingId(id)
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete project")
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast.success("Project deleted")
    }
    setDeletingId(null)
  }

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.service_type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Projects</h1>
          <p className="text-sm text-muted mt-1">Manage your project portfolio</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Projects</p>
            <p className="text-2xl font-bold text-secondary">{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Published</p>
            <p className="text-2xl font-bold text-success">{projects.filter((p) => p.is_published).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Featured</p>
            <p className="text-2xl font-bold text-primary">{projects.filter((p) => p.is_featured).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              All Projects
            </CardTitle>
            <div className="relative sm:ml-auto w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search projects..."
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
              <FolderOpen className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-muted font-medium">No projects found</p>
              <p className="text-sm text-muted/70 mt-1">
                {search ? "Try a different search term" : "Add your first project to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((project) => (
                <div
                  key={project.id}
                  className="group rounded-xl border border-border overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative h-48 bg-surface-dim">
                    {project.project_images && project.project_images.length > 0 ? (
                      <img
                        src={(project.project_images as unknown as { image_url: string }[])[0].image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FolderOpen className="h-10 w-10 text-muted/20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button
                        onClick={() => togglePublished(project.id, project.is_published)}
                        disabled={togglingId === project.id}
                        className="cursor-pointer"
                      >
                        {togglingId === project.id ? (
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                        ) : project.is_published ? (
                          <Badge variant="success">Published</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-white/90">Draft</Badge>
                        )}
                      </button>
                    </div>
                    {project.is_featured && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="warning">Featured</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-secondary text-sm">{project.title}</h3>
                    {project.location && (
                      <p className="text-xs text-muted mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {project.location}
                      </p>
                    )}
                    {project.service_type && (
                      <p className="text-xs text-muted mt-1 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {project.service_type}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-border">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                        disabled={deletingId === project.id}
                        className="text-danger hover:text-danger hover:bg-danger/10"
                      >
                        {deletingId === project.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
