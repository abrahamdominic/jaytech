"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Search, Loader2, Trash2, Eye, Mail, X, MessageSquare } from "lucide-react"
import toast from "react-hot-toast"
import type { ContactMessage } from "@/types/database"

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })
    if (data) setMessages(data)
    setLoading(false)
  }

  async function markAs(id: string, status: ContactMessage["status"]) {
    setUpdatingId(id)
    const { error } = await supabase.from("contact_messages").update({ status, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) {
      toast.error("Failed to update message")
    } else {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
      toast.success(`Message marked as ${status}`)
      if (selectedMessage?.id === id) setSelectedMessage((prev) => prev ? { ...prev, status } : null)
    }
    setUpdatingId(null)
  }

  async function deleteMessage(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return
    setDeletingId(id)
    const { error } = await supabase.from("contact_messages").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete message")
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedMessage?.id === id) setSelectedMessage(null)
      toast.success("Message deleted")
    }
    setDeletingId(null)
  }

  function statusVariant(s: string) {
    if (s === "unread") return "warning"
    if (s === "replied") return "success"
    if (s === "archived") return "outline"
    return "info"
  }

  const filtered = messages.filter((m) => {
    const matchStatus = statusFilter === "all" || m.status === statusFilter
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const unreadCount = messages.filter((m) => m.status === "unread").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Contact Messages</h1>
        <p className="text-sm text-muted mt-1">Manage customer inquiries and messages</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Total Messages</p>
            <p className="text-2xl font-bold text-secondary">{messages.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Unread</p>
            <p className="text-2xl font-bold text-warning">{unreadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Replied</p>
            <p className="text-2xl font-bold text-success">{messages.filter((m) => m.status === "replied").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted">Archived</p>
            <p className="text-2xl font-bold text-muted">{messages.filter((m) => m.status === "archived").length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Messages
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto w-full sm:w-auto">
                  <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1">
                    {["all", "unread", "read", "replied", "archived"].map((s) => (
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
                  <Mail className="h-12 w-12 text-muted/30 mx-auto mb-4" />
                  <p className="text-muted font-medium">No messages found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg)
                        if (msg.status === "unread") markAs(msg.id, "read")
                      }}
                      className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
                        selectedMessage?.id === msg.id
                          ? "border-primary/40 bg-primary/5"
                          : msg.status === "unread"
                            ? "border-primary/20 bg-surface-dim"
                            : "border-border hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {msg.status === "unread" && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                            <p className={`text-sm ${msg.status === "unread" ? "font-bold" : "font-medium"} text-secondary`}>
                              {msg.name}
                            </p>
                            <Badge variant={statusVariant(msg.status) as "warning" | "info" | "success" | "outline"}>
                              {msg.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted mt-0.5">{msg.email}</p>
                          {msg.subject && <p className="text-sm font-medium text-secondary mt-1 truncate">{msg.subject}</p>}
                          <p className="text-xs text-muted mt-1 truncate">{msg.message}</p>
                        </div>
                        <span className="text-xs text-muted whitespace-nowrap">{formatDate(msg.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedMessage ? (
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Message Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted">From</p>
                  <p className="text-sm font-medium text-secondary">{selectedMessage.name}</p>
                  <p className="text-xs text-muted">{selectedMessage.email}</p>
                  {selectedMessage.phone && <p className="text-xs text-muted">{selectedMessage.phone}</p>}
                </div>
                {selectedMessage.subject && (
                  <div>
                    <p className="text-xs text-muted">Subject</p>
                    <p className="text-sm font-medium text-secondary">{selectedMessage.subject}</p>
                  </div>
                )}
                {selectedMessage.service_type && (
                  <div>
                    <p className="text-xs text-muted">Service Type</p>
                    <Badge variant="secondary">{selectedMessage.service_type}</Badge>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted">Message</p>
                  <p className="text-sm text-secondary whitespace-pre-wrap mt-1">{selectedMessage.message}</p>
                </div>
                <div className="text-xs text-muted">
                  Received: {formatDate(selectedMessage.created_at)}
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {selectedMessage.status !== "read" && (
                    <Button variant="outline" size="sm" onClick={() => markAs(selectedMessage.id, "read")}>
                      Mark Read
                    </Button>
                  )}
                  {selectedMessage.status !== "replied" && (
                    <Button variant="outline" size="sm" onClick={() => markAs(selectedMessage.id, "replied")}>
                      Mark Replied
                    </Button>
                  )}
                  {selectedMessage.status !== "archived" && (
                    <Button variant="outline" size="sm" onClick={() => markAs(selectedMessage.id, "archived")}>
                      Archive
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMessage(selectedMessage.id)}
                    disabled={deletingId === selectedMessage.id}
                    className="text-danger hover:text-danger ml-auto"
                  >
                    {deletingId === selectedMessage.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Mail className="h-10 w-10 text-muted/30 mx-auto mb-3" />
                  <p className="text-sm text-muted">Select a message to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
