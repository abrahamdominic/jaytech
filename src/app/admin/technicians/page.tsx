"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  Users,
  X,
  Phone,
  Mail,
} from "lucide-react"
import toast from "react-hot-toast"
import type { Technician } from "@/types/database"

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTech, setEditingTech] = useState<Technician | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const [formName, setFormName] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formSpecialization, setFormSpecialization] = useState("")
  const [formBio, setFormBio] = useState("")

  const supabase = createClient()

  useEffect(() => {
    fetchTechnicians()
  }, [])

  async function fetchTechnicians() {
    setLoading(true)
    const { data } = await supabase.from("technicians").select("*").order("created_at", { ascending: false })
    if (data) setTechnicians(data)
    setLoading(false)
  }

  function openForm(tech?: Technician) {
    if (tech) {
      setEditingTech(tech)
      setFormName(tech.name)
      setFormPhone(tech.phone)
      setFormEmail(tech.email)
      setFormSpecialization(tech.specialization)
      setFormBio(tech.bio)
    } else {
      setEditingTech(null)
      setFormName("")
      setFormPhone("")
      setFormEmail("")
      setFormSpecialization("")
      setFormBio("")
    }
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingTech(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) {
      toast.error("Name is required")
      return
    }
    setSaving(true)

    const payload = {
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim(),
      specialization: formSpecialization.trim(),
      bio: formBio.trim(),
      updated_at: new Date().toISOString(),
    }

    let result
    if (editingTech) {
      result = await supabase.from("technicians").update(payload).eq("id", editingTech.id)
    } else {
      result = await supabase.from("technicians").insert({
        ...payload,
        availability: "available",
        status: "active",
        created_at: new Date().toISOString(),
      })
    }

    if (result.error) {
      toast.error("Failed to save technician")
    } else {
      toast.success(editingTech ? "Technician updated" : "Technician added")
      closeForm()
      fetchTechnicians()
    }
    setSaving(false)
  }

  async function toggleAvailability(id: string, current: string) {
    const cycle: Record<string, string> = { available: "busy", busy: "unavailable", unavailable: "available" }
    const next = cycle[current] || "available"
    setTogglingId(id)
    const { error } = await supabase.from("technicians").update({ availability: next, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) {
      toast.error("Failed to update availability")
    } else {
      setTechnicians((prev) => prev.map((t) => (t.id === id ? { ...t, availability: next as Technician["availability"] } : t)))
      toast.success(`Set to ${next}`)
    }
    setTogglingId(null)
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === "active" ? "inactive" : "active"
    setTogglingId(id)
    const { error } = await supabase.from("technicians").update({ status: next, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) {
      toast.error("Failed to update status")
    } else {
      setTechnicians((prev) => prev.map((t) => (t.id === id ? { ...t, status: next as Technician["status"] } : t)))
      toast.success(`Technician ${next}`)
    }
    setTogglingId(null)
  }

  async function deleteTechnician(id: string) {
    if (!confirm("Are you sure you want to delete this technician?")) return
    setDeletingId(id)
    const { error } = await supabase.from("technicians").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete technician")
    } else {
      setTechnicians((prev) => prev.filter((t) => t.id !== id))
      toast.success("Technician deleted")
    }
    setDeletingId(null)
  }

  function availabilityColor(a: string) {
    if (a === "available") return "success"
    if (a === "busy") return "warning"
    return "danger"
  }

  const filtered = technicians.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Technicians</h1>
          <p className="text-sm text-muted mt-1">Manage your technician team</p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus className="h-4 w-4" />
          Add Technician
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingTech ? "Edit Technician" : "Add Technician"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={closeForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Full name"
                  required
                />
                <Input
                  label="Phone"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="08012345678"
                />
                <Input
                  label="Email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="email@example.com"
                />
                <Input
                  label="Specialization"
                  value={formSpecialization}
                  onChange={(e) => setFormSpecialization(e.target.value)}
                  placeholder="e.g. Solar Installation"
                />
              </div>
              <Textarea
                label="Bio"
                value={formBio}
                onChange={(e) => setFormBio(e.target.value)}
                placeholder="Brief bio about the technician"
                className="min-h-[80px]"
              />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {saving ? "Saving..." : "Save Technician"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Technicians</p>
            <p className="text-2xl font-bold text-secondary">{technicians.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Available</p>
            <p className="text-2xl font-bold text-success">{technicians.filter((t) => t.availability === "available").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Active</p>
            <p className="text-2xl font-bold text-accent">{technicians.filter((t) => t.status === "active").length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              All Technicians
            </CardTitle>
            <div className="relative sm:ml-auto w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search technicians..."
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
              <Users className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-muted font-medium">No technicians found</p>
              <p className="text-sm text-muted/70 mt-1">
                {search ? "Try a different search term" : "Add your first technician to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Name</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Contact</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Specialization</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Availability</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((tech) => (
                    <tr key={tech.id} className="hover:bg-surface-dim/50 transition-colors">
                      <td className="py-4">
                        <p className="font-medium text-secondary text-sm">{tech.name}</p>
                      </td>
                      <td className="py-4">
                        <div className="space-y-1">
                          {tech.phone && (
                            <p className="text-xs text-muted flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {tech.phone}
                            </p>
                          )}
                          {tech.email && (
                            <p className="text-xs text-muted flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {tech.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{tech.specialization || "-"}</Badge>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleAvailability(tech.id, tech.availability)}
                          disabled={togglingId === tech.id}
                          className="cursor-pointer"
                        >
                          <Badge variant={availabilityColor(tech.availability) as "success" | "warning" | "danger"}>
                            {tech.availability}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleStatus(tech.id, tech.status)}
                          disabled={togglingId === tech.id}
                          className="cursor-pointer"
                        >
                          <Badge variant={tech.status === "active" ? "success" : "outline"}>
                            {tech.status}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openForm(tech)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTechnician(tech.id)}
                            disabled={deletingId === tech.id}
                            className="text-danger hover:text-danger hover:bg-danger/10"
                          >
                            {deletingId === tech.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
