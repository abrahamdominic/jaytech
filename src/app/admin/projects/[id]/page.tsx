"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical, Star } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import type { Project, ProjectImage } from "@/types/database"

interface ImageItem extends ProjectImage {
  tempId: string
}

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const isNew = id === "new"

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [serviceName, setServiceName] = useState("")
  const [clientId, setClientId] = useState("")
  const [clientName, setClientName] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [images, setImages] = useState<ImageItem[]>([])

  const supabase = createClient()

  const serviceTypes = [
    "Solar Installation",
    "Starlink Setup",
    "Electrical Wiring",
    "Inverter Installation",
    "Smart Home",
    "Maintenance",
    "Consultation",
    "Other",
  ]

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("projects").select("*, project_images(*)").eq("id", id).single()
      if (error || !data) {
        toast.error("Project not found")
        router.push("/admin/projects")
        return
      }
      setTitle(data.title)
      setSlug(data.slug)
      setDescription(data.description)
      setLocation(data.location || "")
      setServiceType(data.service_type || "")
      setClientName(data.client_name || "")
      setClientId(data.customer_id || "")
      setIsPublished(data.is_published)
      setIsFeatured(data.is_featured)
      setMetaTitle(data.meta_title || "")
      setMetaDescription(data.meta_description || "")
      setImages(
        (data.project_images || []).map((img: ProjectImage) => ({
          ...img,
          tempId: img.id,
        }))
      )
      setLoading(false)
    }
    if (!isNew) void load()
  }, [id])

  function handleTitleChange(value: string) {
    setTitle(value)
    if (isNew || slug === slugify(title)) {
      setSlug(slugify(value))
    }
  }

  function addImage() {
    setImages([
      ...images,
      {
        tempId: crypto.randomUUID(),
        id: "",
        project_id: id === "new" ? "" : id,
        image_url: "",
        caption: "",
        image_type: "standard",
        display_order: images.length,
      },
    ])
  }

  function updateImage(tempId: string, field: keyof ProjectImage, value: string | number) {
    setImages(images.map((img) => (img.tempId === tempId ? { ...img, [field]: value } : img)))
  }

  function removeImage(tempId: string) {
    setImages(images.filter((img) => img.tempId !== tempId))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }
    setSaving(true)

    const payload = {
      title: title.trim(),
      slug: slug || slugify(title),
      description: description.trim(),
      location: location.trim(),
      service_type: serviceType,
      service_name: serviceName.trim(),
      client_name: clientName.trim(),
      customer_id: clientId || null,
      is_published: isPublished,
      is_featured: isFeatured,
      meta_title: metaTitle.trim(),
      meta_description: metaDescription.trim(),
      updated_at: new Date().toISOString(),
    }

    let result
    if (isNew) {
      result = await supabase.from("projects").insert({ ...payload, created_at: new Date().toISOString() }).select().single()
    } else {
      result = await supabase.from("projects").update(payload).eq("id", id).select().single()
    }

    if (result.error) {
      toast.error("Failed to save project")
      setSaving(false)
      return
    }

    const projectId = result.data.id

    // Handle images: delete removed ones, update/add new ones
    for (const img of images) {
      if (img.image_url.trim()) {
        if (img.id) {
          await supabase.from("project_images").update({
            image_url: img.image_url,
            caption: img.caption,
            image_type: img.image_type,
            display_order: img.display_order,
          }).eq("id", img.id)
        } else {
          await supabase.from("project_images").insert({
            project_id: projectId,
            image_url: img.image_url,
            caption: img.caption,
            image_type: img.image_type,
            display_order: img.display_order,
          })
        }
      }
    }

    toast.success(isNew ? "Project created" : "Project saved")
    if (isNew) router.push(`/admin/projects/${projectId}`)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm" type="button">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary">
            {isNew ? "Add New Project" : "Edit Project"}
          </h1>
          <p className="text-sm text-muted mt-1">Fill in the project details below</p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Project"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Residential Solar Installation"
                required
              />
              <Input
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="residential-solar-installation"
              />
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lekki, Lagos"
                />
                <Input
                  label="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client or company name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Images
                <Button type="button" variant="ghost" size="sm" onClick={addImage}>
                  <Plus className="h-4 w-4" /> Add Image
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.length === 0 && <p className="text-sm text-muted">No images added yet</p>}
              {images.map((img, index) => (
                <div key={img.tempId} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-secondary">Image {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={img.image_type}
                        onChange={(e) => updateImage(img.tempId, "image_type", e.target.value)}
                        className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-secondary"
                      >
                        <option value="standard">Standard</option>
                        <option value="before">Before</option>
                        <option value="after">After</option>
                      </select>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeImage(img.tempId)} className="text-danger">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Input
                    value={img.image_url}
                    onChange={(e) => updateImage(img.tempId, "image_url", e.target.value)}
                    placeholder="Image URL"
                  />
                  {img.image_url && (
                    <img src={img.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  )}
                  <Input
                    value={img.caption}
                    onChange={(e) => updateImage(img.tempId, "caption", e.target.value)}
                    placeholder="Caption (optional)"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-secondary">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-secondary">Featured</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Meta Title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO title"
              />
              <Textarea
                label="Meta Description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="SEO description"
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
