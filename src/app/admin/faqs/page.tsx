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
  HelpCircle,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import toast from "react-hot-toast"
import type { FAQ } from "@/types/database"

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [formQuestion, setFormQuestion] = useState("")
  const [formAnswer, setFormAnswer] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formOrder, setFormOrder] = useState("0")
  const [formActive, setFormActive] = useState(true)

  const supabase = createClient()

  async function fetchFAQs() {
    const { data } = await supabase.from("faqs").select("*").order("display_order")
    if (data) setFaqs(data)
    setLoading(false)
  }

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("faqs").select("*").order("display_order")
      if (data) setFaqs(data)
      setLoading(false)
    }
    void load()
  }, [])

  function openForm(faq?: FAQ) {
    if (faq) {
      setEditingFaq(faq)
      setFormQuestion(faq.question)
      setFormAnswer(faq.answer)
      setFormCategory(faq.category || "")
      setFormOrder(faq.display_order?.toString() || "0")
      setFormActive(faq.is_active)
    } else {
      setEditingFaq(null)
      setFormQuestion("")
      setFormAnswer("")
      setFormCategory("")
      setFormOrder((faqs.length).toString())
      setFormActive(true)
    }
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingFaq(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!formQuestion.trim() || !formAnswer.trim()) {
      toast.error("Question and answer are required")
      return
    }
    setSaving(true)

    const payload = {
      question: formQuestion.trim(),
      answer: formAnswer.trim(),
      category: formCategory.trim(),
      display_order: Number(formOrder) || 0,
      is_active: formActive,
      updated_at: new Date().toISOString(),
    }

    let result
    if (editingFaq) {
      result = await supabase.from("faqs").update(payload).eq("id", editingFaq.id)
    } else {
      result = await supabase.from("faqs").insert({
        ...payload,
        created_at: new Date().toISOString(),
      })
    }

    if (result.error) {
      toast.error("Failed to save FAQ")
    } else {
      toast.success(editingFaq ? "FAQ updated" : "FAQ created")
      closeForm()
      fetchFAQs()
    }
    setSaving(false)
  }

  async function moveOrder(id: string, currentOrder: number, direction: "up" | "down") {
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1
    if (newOrder < 0) return

    const swapFaq = faqs.find((f) => f.display_order === newOrder)
    if (swapFaq) {
      await supabase.from("faqs").update({ display_order: currentOrder, updated_at: new Date().toISOString() }).eq("id", swapFaq.id)
    }
    await supabase.from("faqs").update({ display_order: newOrder, updated_at: new Date().toISOString() }).eq("id", id)
    fetchFAQs()
  }

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase.from("faqs").update({ is_active: !current, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) {
      toast.error("Failed to update")
    } else {
      setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, is_active: !current } : f)))
      toast.success("Status updated")
    }
  }

  async function deleteFaq(id: string) {
    if (!confirm("Are you sure you want to delete this FAQ?")) return
    setDeletingId(id)
    const { error } = await supabase.from("faqs").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete FAQ")
    } else {
      setFaqs((prev) => prev.filter((f) => f.id !== id))
      toast.success("FAQ deleted")
    }
    setDeletingId(null)
  }

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.category?.toLowerCase().includes(search.toLowerCase())
  )

  const categories = [...new Set(faqs.map((f) => f.category).filter(Boolean))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">FAQs</h1>
          <p className="text-sm text-muted mt-1">Manage frequently asked questions</p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total FAQs</p>
            <p className="text-2xl font-bold text-secondary">{faqs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Active</p>
            <p className="text-2xl font-bold text-success">{faqs.filter((f) => f.is_active).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Categories</p>
            <p className="text-2xl font-bold text-accent">{categories.length}</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={closeForm}>Cancel</Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <Textarea
                label="Question"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                placeholder="Your question here"
                className="min-h-[60px]"
                required
              />
              <Textarea
                label="Answer"
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
                placeholder="Detailed answer"
                className="min-h-[120px]"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. General"
                />
                <Input
                  label="Display Order"
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(e.target.value)}
                />
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm font-medium text-secondary">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {saving ? "Saving..." : "Save FAQ"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              All FAQs
            </CardTitle>
            <div className="relative sm:ml-auto w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search FAQs..."
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
              <HelpCircle className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-muted font-medium">No FAQs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Order</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Question</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Active</th>
                    <th className="pb-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((faq) => (
                    <tr key={faq.id} className="hover:bg-surface-dim/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-secondary w-6 text-center">{faq.display_order}</span>
                          <div className="flex flex-col">
                            <button onClick={() => moveOrder(faq.id, faq.display_order, "up")} className="cursor-pointer text-muted hover:text-secondary">
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button onClick={() => moveOrder(faq.id, faq.display_order, "down")} className="cursor-pointer text-muted hover:text-secondary">
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="font-medium text-secondary text-sm max-w-[400px] truncate">{faq.question}</p>
                        <p className="text-xs text-muted mt-0.5 max-w-[400px] truncate">{faq.answer}</p>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{faq.category || "General"}</Badge>
                      </td>
                      <td className="py-4">
                        <button onClick={() => toggleActive(faq.id, faq.is_active)} className="cursor-pointer">
                          <Badge variant={faq.is_active ? "success" : "outline"}>
                            {faq.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openForm(faq)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFaq(faq.id)}
                            disabled={deletingId === faq.id}
                            className="text-danger hover:text-danger hover:bg-danger/10"
                          >
                            {deletingId === faq.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
