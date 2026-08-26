"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency, formatDate, generateInvoiceNumber } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Search, Loader2, Trash2, Eye, Receipt, X, Plus, Printer, Download } from "lucide-react"
import toast from "react-hot-toast"
import type { Invoice } from "@/types/database"

interface InvoiceItem {
  description: string
  amount: number
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [editItems, setEditItems] = useState<InvoiceItem[]>([])
  const [editStatus, setEditStatus] = useState<string>("unpaid")
  const [editNotes, setEditNotes] = useState("")
  const [editDueDate, setEditDueDate] = useState("")

  const supabase = createClient()

  useEffect(() => {
    fetchInvoices()
  }, [])

  async function fetchInvoices() {
    setLoading(true)
    const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false })
    if (data) setInvoices(data)
    setLoading(false)
  }

  function openEdit(invoice: Invoice) {
    setEditingInvoice(invoice)
    setEditItems(invoice.items || [])
    setEditStatus(invoice.status)
    setEditNotes(invoice.notes || "")
    setEditDueDate(invoice.due_date ? invoice.due_date.split("T")[0] : "")
  }

  function closeEdit() {
    setEditingInvoice(null)
  }

  function addItem() {
    setEditItems([...editItems, { description: "", amount: 0 }])
  }

  function updateItem(index: number, field: keyof InvoiceItem, value: string | number) {
    setEditItems(editItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  function removeItem(index: number) {
    setEditItems(editItems.filter((_, i) => i !== index))
  }

  function calcTotals(items: InvoiceItem[]) {
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0)
    const tax = Math.round(subtotal * 0.075) // 7.5% VAT
    return { subtotal, tax, total: subtotal + tax }
  }

  async function handleSave() {
    if (!editingInvoice) return
    setSaving(true)
    const { subtotal, tax, total } = calcTotals(editItems)

    const { error } = await supabase.from("invoices").update({
      items: editItems,
      subtotal,
      tax,
      total,
      status: editStatus as Invoice["status"],
      notes: editNotes.trim(),
      due_date: editDueDate || null,
      updated_at: new Date().toISOString(),
    }).eq("id", editingInvoice.id)

    if (error) {
      toast.error("Failed to save invoice")
    } else {
      toast.success("Invoice updated")
      closeEdit()
      fetchInvoices()
    }
    setSaving(false)
  }

  async function deleteInvoice(id: string) {
    if (!confirm("Are you sure?")) return
    setDeletingId(id)
    const { error } = await supabase.from("invoices").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete invoice")
    } else {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id))
      if (selectedInvoice?.id === id) setSelectedInvoice(null)
      toast.success("Invoice deleted")
    }
    setDeletingId(null)
  }

  function statusVariant(s: string) {
    if (s === "paid") return "success"
    if (s === "overdue") return "danger"
    if (s === "cancelled") return "outline"
    return "warning"
  }

  function printInvoice() {
    window.print()
  }

  const filtered = invoices.filter((inv) => {
    const matchStatus = statusFilter === "all" || inv.status === statusFilter
    const matchSearch =
      inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer_id?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totals = editingInvoice ? calcTotals(editItems) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Invoices</h1>
        <p className="text-sm text-muted mt-1">Manage invoices and billing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Invoices</p>
            <p className="text-2xl font-bold text-secondary">{invoices.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Paid</p>
            <p className="text-2xl font-bold text-success">{invoices.filter((i) => i.status === "paid").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Unpaid</p>
            <p className="text-2xl font-bold text-warning">{invoices.filter((i) => i.status === "unpaid").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Value</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(invoices.reduce((sum, i) => sum + (i.total || 0), 0))}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              All Invoices
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto w-full sm:w-auto">
              <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1">
                {["all", "unpaid", "paid", "overdue", "cancelled"].map((s) => (
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
              <Receipt className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-muted font-medium">No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Invoice #</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Amount</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                    <th className="pb-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-dim/50 transition-colors">
                      <td className="py-4">
                        <span className="text-sm font-mono font-medium text-secondary">{inv.invoice_number}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-secondary">{inv.customer_id?.slice(0, 8) || "-"}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-secondary">{formatCurrency(inv.total)}</span>
                      </td>
                      <td className="py-4">
                        <Badge variant={statusVariant(inv.status) as "success" | "warning" | "danger" | "outline"}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-xs text-muted">{formatDate(inv.created_at)}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(inv)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(inv)}>
                            <Receipt className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteInvoice(inv.id)}
                            disabled={deletingId === inv.id}
                            className="text-danger hover:text-danger hover:bg-danger/10"
                          >
                            {deletingId === inv.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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

      {(selectedInvoice || editingInvoice) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-secondary">
                {editingInvoice ? `Edit Invoice ${editingInvoice.invoice_number}` : `Invoice ${(selectedInvoice as Invoice).invoice_number}`}
              </h2>
              <div className="flex items-center gap-2">
                {selectedInvoice && !editingInvoice && (
                  <>
                    <Button variant="ghost" size="sm" onClick={printInvoice}>
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedInvoice(null); openEdit(selectedInvoice) }}>
                      Edit
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => { setSelectedInvoice(null); closeEdit() }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              {editingInvoice ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-secondary">Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {["unpaid", "paid", "overdue", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Due Date"
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-secondary">Items</label>
                      <Button type="button" variant="ghost" size="sm" onClick={addItem}>
                        <Plus className="h-4 w-4" /> Add Item
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(i, "description", e.target.value)}
                            placeholder="Description"
                          />
                          <Input
                            type="number"
                            value={item.amount || ""}
                            onChange={(e) => updateItem(i, "amount", Number(e.target.value))}
                            placeholder="Amount"
                            className="w-32"
                          />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)} className="text-danger shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {totals && (
                      <div className="mt-4 rounded-xl bg-surface-dim p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Subtotal</span>
                          <span className="text-secondary">{formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">VAT (7.5%)</span>
                          <span className="text-secondary">{formatCurrency(totals.tax)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                          <span className="text-secondary">Total</span>
                          <span className="text-secondary">{formatCurrency(totals.total)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <Textarea
                    label="Notes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Additional notes"
                    className="min-h-[60px]"
                  />
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={closeEdit}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {saving ? "Saving..." : "Save Invoice"}
                    </Button>
                  </div>
                </div>
              ) : selectedInvoice && (
                <div className="space-y-4" id="invoice-preview">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-secondary">JayTech</h3>
                    <p className="text-sm text-muted">Solar, Starlink & Electrical Services</p>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted">Invoice To</p>
                      <p className="text-sm font-medium text-secondary">{selectedInvoice.customer_id?.slice(0, 8) || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">Invoice #</p>
                      <p className="text-sm font-mono font-medium text-secondary">{selectedInvoice.invoice_number}</p>
                      <p className="text-xs text-muted mt-1">Date: {formatDate(selectedInvoice.created_at)}</p>
                      {selectedInvoice.due_date && (
                        <p className="text-xs text-muted">Due: {formatDate(selectedInvoice.due_date)}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={statusVariant(selectedInvoice.status) as "success" | "warning" | "danger" | "outline"}>
                    {selectedInvoice.status}
                  </Badge>
                  <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-surface-dim border-b border-border">
                          <th className="text-left px-4 py-2 text-xs font-semibold text-muted">Description</th>
                          <th className="text-right px-4 py-2 text-xs font-semibold text-muted">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedInvoice.items || []).map((item, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="px-4 py-2 text-sm text-secondary">{item.description}</td>
                            <td className="px-4 py-2 text-sm text-secondary text-right">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-muted">Subtotal: <span className="text-secondary">{formatCurrency(selectedInvoice.subtotal)}</span></p>
                    <p className="text-sm text-muted">VAT (7.5%): <span className="text-secondary">{formatCurrency(selectedInvoice.tax)}</span></p>
                    <p className="text-lg font-bold text-secondary">Total: {formatCurrency(selectedInvoice.total)}</p>
                  </div>
                  {selectedInvoice.notes && (
                    <div>
                      <p className="text-xs text-muted">Notes</p>
                      <p className="text-sm text-secondary whitespace-pre-wrap">{selectedInvoice.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
