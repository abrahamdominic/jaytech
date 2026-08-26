"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Search, Loader2, Trash2, Eye, FileText, X, Plus, Clock } from "lucide-react"
import toast from "react-hot-toast"
import type { Quote } from "@/types/database"

interface QuoteItem {
  description: string
  amount: number
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [quoteAmount, setQuoteAmount] = useState("")
  const [quoteDescription, setQuoteDescription] = useState("")
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [quoteStatus, setQuoteStatus] = useState<string>("reviewing")

  const supabase = createClient()

  useEffect(() => {
    fetchQuotes()
  }, [])

  async function fetchQuotes() {
    setLoading(true)
    const { data } = await supabase.from("quotes").select("*").order("created_at", { ascending: false })
    if (data) setQuotes(data)
    setLoading(false)
  }

  function openEdit(quote: Quote) {
    setEditingQuote(quote)
    setQuoteAmount(quote.quote_amount?.toString() || "")
    setQuoteDescription(quote.quote_description || "")
    setQuoteItems(quote.quote_items || [])
    setEstimatedDuration(quote.estimated_duration || "")
    setExpiresAt(quote.expires_at ? quote.expires_at.split("T")[0] : "")
    setQuoteStatus(quote.status)
  }

  function closeEdit() {
    setEditingQuote(null)
  }

  function addQuoteItem() {
    setQuoteItems([...quoteItems, { description: "", amount: 0 }])
  }

  function updateQuoteItem(index: number, field: keyof QuoteItem, value: string | number) {
    setQuoteItems(quoteItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  function removeQuoteItem(index: number) {
    setQuoteItems(quoteItems.filter((_, i) => i !== index))
  }

  async function handleSaveQuote() {
    if (!editingQuote) return
    setSaving(true)

    const { error } = await supabase.from("quotes").update({
      quote_amount: Number(quoteAmount) || 0,
      quote_description: quoteDescription.trim(),
      quote_items: quoteItems,
      estimated_duration: estimatedDuration.trim(),
      expires_at: expiresAt || null,
      status: quoteStatus as Quote["status"],
      updated_at: new Date().toISOString(),
    }).eq("id", editingQuote.id)

    if (error) {
      toast.error("Failed to save quote")
    } else {
      toast.success("Quote updated")
      closeEdit()
      fetchQuotes()
    }
    setSaving(false)
  }

  async function deleteQuote(id: string) {
    if (!confirm("Are you sure?")) return
    setDeletingId(id)
    const { error } = await supabase.from("quotes").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete quote")
    } else {
      setQuotes((prev) => prev.filter((q) => q.id !== id))
      if (selectedQuote?.id === id) setSelectedQuote(null)
      if (editingQuote?.id === id) closeEdit()
      toast.success("Quote deleted")
    }
    setDeletingId(null)
  }

  function statusVariant(s: string) {
    if (s === "accepted") return "success"
    if (s === "rejected" || s === "expired") return "danger"
    if (s === "quoted") return "info"
    if (s === "reviewing") return "warning"
    return "outline"
  }

  const filtered = quotes.filter((q) => {
    const matchStatus = statusFilter === "all" || q.status === statusFilter
    const matchSearch =
      q.full_name.toLowerCase().includes(search.toLowerCase()) ||
      q.quote_number?.toLowerCase().includes(search.toLowerCase()) ||
      q.service_name?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Quotes</h1>
        <p className="text-sm text-muted mt-1">Manage customer quote requests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Quotes</p>
            <p className="text-2xl font-bold text-secondary">{quotes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Pending</p>
            <p className="text-2xl font-bold text-warning">{quotes.filter((q) => q.status === "pending" || q.status === "reviewing").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Accepted</p>
            <p className="text-2xl font-bold text-success">{quotes.filter((q) => q.status === "accepted").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Value</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(quotes.reduce((sum, q) => sum + (q.quote_amount || 0), 0))}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              All Quotes
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto w-full sm:w-auto">
              <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto">
                {["all", "pending", "reviewing", "quoted", "accepted", "rejected"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
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
                  placeholder="Search..."
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
              <p className="text-muted font-medium">No quotes found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Quote #</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Service</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Amount</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                    <th className="pb-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((quote) => (
                    <tr key={quote.id} className="hover:bg-surface-dim/50 transition-colors">
                      <td className="py-4">
                        <span className="text-sm font-mono font-medium text-secondary">{quote.quote_number}</span>
                      </td>
                      <td className="py-4">
                        <p className="text-sm font-medium text-secondary">{quote.full_name}</p>
                        <p className="text-xs text-muted">{quote.email}</p>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-secondary">{quote.service_name || "-"}</span>
                      </td>
                      <td className="py-4">
                        <Badge variant={statusVariant(quote.status) as "success" | "warning" | "info" | "danger" | "outline"}>
                          {quote.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-secondary">
                          {quote.quote_amount ? formatCurrency(quote.quote_amount) : "-"}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-xs text-muted">{formatDate(quote.created_at)}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedQuote(quote)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(quote)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteQuote(quote.id)}
                            disabled={deletingId === quote.id}
                            className="text-danger hover:text-danger hover:bg-danger/10"
                          >
                            {deletingId === quote.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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

      {/* Detail/Edit Modal */}
      {(selectedQuote || editingQuote) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-secondary">
                {editingQuote ? `Edit Quote ${editingQuote.quote_number}` : `Quote ${(selectedQuote as Quote).quote_number}`}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => { setSelectedQuote(null); closeEdit() }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              {editingQuote ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary">Status</label>
                    <select
                      value={quoteStatus}
                      onChange={(e) => setQuoteStatus(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {["pending", "reviewing", "quoted", "accepted", "rejected", "expired"].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Quote Amount (₦)"
                    type="number"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                  />
                  <Textarea
                    label="Description"
                    value={quoteDescription}
                    onChange={(e) => setQuoteDescription(e.target.value)}
                    placeholder="Quote description for the customer"
                    className="min-h-[80px]"
                  />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-secondary">Line Items</label>
                      <Button type="button" variant="ghost" size="sm" onClick={addQuoteItem}>
                        <Plus className="h-4 w-4" /> Add Item
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {quoteItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            value={item.description}
                            onChange={(e) => updateQuoteItem(i, "description", e.target.value)}
                            placeholder="Description"
                          />
                          <Input
                            type="number"
                            value={item.amount || ""}
                            onChange={(e) => updateQuoteItem(i, "amount", Number(e.target.value))}
                            placeholder="Amount"
                            className="w-32"
                          />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeQuoteItem(i)} className="text-danger shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Estimated Duration"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      placeholder="e.g. 3-5 days"
                    />
                    <Input
                      label="Expiry Date"
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={closeEdit}>Cancel</Button>
                    <Button onClick={handleSaveQuote} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {saving ? "Saving..." : "Save Quote"}
                    </Button>
                  </div>
                </div>
              ) : selectedQuote && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted">Customer</p>
                      <p className="text-sm font-medium text-secondary">{selectedQuote.full_name}</p>
                      <p className="text-xs text-muted">{selectedQuote.email}</p>
                      <p className="text-xs text-muted">{selectedQuote.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Location</p>
                      <p className="text-sm text-secondary">{selectedQuote.city}, {selectedQuote.state}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Service</p>
                    <p className="text-sm text-secondary">{selectedQuote.service_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Description</p>
                    <p className="text-sm text-secondary whitespace-pre-wrap">{selectedQuote.description}</p>
                  </div>
                  {selectedQuote.budget && (
                    <div>
                      <p className="text-xs text-muted">Budget</p>
                      <p className="text-sm text-secondary">{selectedQuote.budget}</p>
                    </div>
                  )}
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Status</span>
                      <Badge variant={statusVariant(selectedQuote.status) as "success" | "warning" | "info" | "danger" | "outline"}>
                        {selectedQuote.status}
                      </Badge>
                    </div>
                    {selectedQuote.quote_amount > 0 && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted">Amount</span>
                        <span className="text-lg font-bold text-secondary">{formatCurrency(selectedQuote.quote_amount)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => { setSelectedQuote(null); openEdit(selectedQuote) }}>
                      Edit Quote
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
