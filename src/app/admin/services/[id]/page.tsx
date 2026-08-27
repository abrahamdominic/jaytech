"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import type { Service, ServiceCategory } from "@/types/database"

interface BenefitItem { id: string; value: string }
interface ProcessStep { id: string; step: string; description: string }

export default function EditServicePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const isNew = id === "new"

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<ServiceCategory[]>([])

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [description, setDescription] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [heroImageUrl, setHeroImageUrl] = useState("")
  const [pricingType, setPricingType] = useState<string>("fixed")
  const [startingPrice, setStartingPrice] = useState("")
  const [priceRangeMin, setPriceRangeMin] = useState("")
  const [priceRangeMax, setPriceRangeMax] = useState("")
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const [benefits, setBenefits] = useState<BenefitItem[]>([])
  const [includes, setIncludes] = useState<BenefitItem[]>([])
  const [equipment, setEquipment] = useState<BenefitItem[]>([])
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([])
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [displayOrder, setDisplayOrder] = useState("0")

  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: cats } = await supabase.from("service_categories").select("*").order("display_order")
      if (cats) setCategories(cats)

      if (isNew) return

      const { data, error } = await supabase.from("services").select("*").eq("id", id).single()
      if (error || !data) {
        toast.error("Service not found")
        router.push("/admin/services")
        return
      }
      setTitle(data.title)
      setSlug(data.slug)
      setCategoryId(data.category_id || "")
      setDescription(data.description)
      setShortDescription(data.short_description)
      setImageUrl(data.image_url)
      setHeroImageUrl(data.hero_image_url || "")
      setPricingType(data.pricing_type)
      setStartingPrice(data.starting_price?.toString() || "")
      setPriceRangeMin(data.price_range_min?.toString() || "")
      setPriceRangeMax(data.price_range_max?.toString() || "")
      setEstimatedDuration(data.estimated_duration || "")
      setBenefits((data.benefits || []).map((b: string) => ({ id: crypto.randomUUID(), value: b })))
      setIncludes((data.includes || []).map((i: string) => ({ id: crypto.randomUUID(), value: i })))
      setEquipment((data.equipment || []).map((e: string) => ({ id: crypto.randomUUID(), value: e })))
      setProcessSteps((data.process_steps || []).map((p: { step: string; description: string }) => ({ ...p, id: crypto.randomUUID() })))
      setMetaTitle(data.meta_title || "")
      setMetaDescription(data.meta_description || "")
      setIsActive(data.is_active)
      setDisplayOrder(data.display_order?.toString() || "0")
      setLoading(false)
    }
    void load()
  }, [id])

  function handleTitleChange(value: string) {
    setTitle(value)
    if (isNew || slug === slugify(title)) {
      setSlug(slugify(value))
    }
  }

  function addListItem(type: "benefits" | "includes" | "equipment") {
    const newItem = { id: crypto.randomUUID(), value: "" }
    if (type === "benefits") setBenefits([...benefits, newItem])
    else if (type === "includes") setIncludes([...includes, newItem])
    else setEquipment([...equipment, newItem])
  }

  function updateListItem(type: "benefits" | "includes" | "equipment", id: string, value: string) {
    const setter = type === "benefits" ? setBenefits : type === "includes" ? setIncludes : setEquipment
    const list = type === "benefits" ? benefits : type === "includes" ? includes : equipment
    setter(list.map((item) => (item.id === id ? { ...item, value } : item)))
  }

  function removeListItem(type: "benefits" | "includes" | "equipment", id: string) {
    const setter = type === "benefits" ? setBenefits : type === "includes" ? setIncludes : setEquipment
    const list = type === "benefits" ? benefits : type === "includes" ? includes : equipment
    setter(list.filter((item) => item.id !== id))
  }

  function addProcessStep() {
    setProcessSteps([...processSteps, { id: crypto.randomUUID(), step: "", description: "" }])
  }

  function updateProcessStep(id: string, field: "step" | "description", value: string) {
    setProcessSteps(processSteps.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  function removeProcessStep(id: string) {
    setProcessSteps(processSteps.filter((s) => s.id !== id))
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
      category_id: categoryId || null,
      description: description.trim(),
      short_description: shortDescription.trim(),
      image_url: imageUrl.trim(),
      hero_image_url: heroImageUrl.trim(),
      pricing_type: pricingType,
      starting_price: Number(startingPrice) || 0,
      price_range_min: Number(priceRangeMin) || 0,
      price_range_max: Number(priceRangeMax) || 0,
      estimated_duration: estimatedDuration.trim(),
      benefits: benefits.map((b) => b.value).filter(Boolean),
      includes: includes.map((i) => i.value).filter(Boolean),
      equipment: equipment.map((e) => e.value).filter(Boolean),
      process_steps: processSteps.map(({ id: _id, ...rest }) => rest).filter((s) => s.step),
      meta_title: metaTitle.trim(),
      meta_description: metaDescription.trim(),
      is_active: isActive,
      display_order: Number(displayOrder) || 0,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isNew) {
      result = await supabase.from("services").insert({ ...payload, created_at: new Date().toISOString() }).select().single()
    } else {
      result = await supabase.from("services").update(payload).eq("id", id).select().single()
    }

    if (result.error) {
      toast.error("Failed to save service")
      setSaving(false)
      return
    }

    toast.success(isNew ? "Service created" : "Service saved")
    if (isNew && result.data) {
      router.push(`/admin/services/${result.data.id}`)
    }
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
        <Link href="/admin/services">
          <Button variant="ghost" size="sm" type="button">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary">
            {isNew ? "Add New Service" : "Edit Service"}
          </h1>
          <p className="text-sm text-muted mt-1">Fill in the service details below</p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Service"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Solar Panel Installation"
                required
              />
              <Input
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="solar-panel-installation"
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <Textarea
                label="Short Description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief description for listings"
                className="min-h-[80px]"
              />
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full service description (HTML allowed)"
              />
              <Input
                label="Estimated Duration"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g. 2-3 days"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary">Pricing Type</label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="starting">Starting From</option>
                  <option value="range">Price Range</option>
                  <option value="request_quote">Request Quote</option>
                </select>
              </div>
              {pricingType !== "request_quote" && (
                <Input
                  label="Starting Price (₦)"
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  placeholder="0"
                />
              )}
              {pricingType === "range" && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min Price (₦)"
                    type="number"
                    value={priceRangeMin}
                    onChange={(e) => setPriceRangeMin(e.target.value)}
                    placeholder="0"
                  />
                  <Input
                    label="Max Price (₦)"
                    type="number"
                    value={priceRangeMax}
                    onChange={(e) => setPriceRangeMax(e.target.value)}
                    placeholder="0"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Benefits
                <Button type="button" variant="ghost" size="sm" onClick={() => addListItem("benefits")}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {benefits.length === 0 && <p className="text-sm text-muted">No benefits added yet</p>}
              {benefits.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    value={item.value}
                    onChange={(e) => updateListItem("benefits", item.id, e.target.value)}
                    placeholder="Benefit description"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeListItem("benefits", item.id)} className="text-danger shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                What&apos;s Included
                <Button type="button" variant="ghost" size="sm" onClick={() => addListItem("includes")}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {includes.length === 0 && <p className="text-sm text-muted">No items added yet</p>}
              {includes.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    value={item.value}
                    onChange={(e) => updateListItem("includes", item.id, e.target.value)}
                    placeholder="Included item"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeListItem("includes", item.id)} className="text-danger shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Equipment
                <Button type="button" variant="ghost" size="sm" onClick={() => addListItem("equipment")}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {equipment.length === 0 && <p className="text-sm text-muted">No equipment added yet</p>}
              {equipment.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    value={item.value}
                    onChange={(e) => updateListItem("equipment", item.id, e.target.value)}
                    placeholder="Equipment name"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeListItem("equipment", item.id)} className="text-danger shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Process Steps
                <Button type="button" variant="ghost" size="sm" onClick={addProcessStep}>
                  <Plus className="h-4 w-4" /> Add Step
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {processSteps.length === 0 && <p className="text-sm text-muted">No process steps added yet</p>}
              {processSteps.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-secondary">Step {index + 1}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeProcessStep(item.id)} className="text-danger">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={item.step}
                    onChange={(e) => updateProcessStep(item.id, "step", e.target.value)}
                    placeholder="Step title"
                  />
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateProcessStep(item.id, "description", e.target.value)}
                    placeholder="Step description"
                    className="min-h-[60px]"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-secondary">Active</span>
              </label>
              <Input
                label="Display Order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="0"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
              {imageUrl && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" />
                </div>
              )}
              <Input
                label="Hero Image URL"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://..."
              />
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
