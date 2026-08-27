"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Save, Loader2, Plus, Trash2, Settings as SettingsIcon } from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "general", label: "General" },
  { id: "contact", label: "Contact" },
  { id: "social", label: "Social" },
  { id: "hero", label: "Hero" },
  { id: "footer", label: "Footer" },
  { id: "seo", label: "SEO" },
  { id: "payment", label: "Payment" },
  { id: "notifications", label: "Notifications" },
]

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [settingsId, setSettingsId] = useState<string | null>(null)

  const [businessName, setBusinessName] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [state, setState] = useState("")
  const [city, setCity] = useState("")
  const [workingHours, setWorkingHours] = useState("")
  const [facebook, setFacebook] = useState("")
  const [twitter, setTwitter] = useState("")
  const [instagram, setInstagram] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [youtube, setYoutube] = useState("")
  const [heroHeadline, setHeroHeadline] = useState("")
  const [heroSubheadline, setHeroSubheadline] = useState("")
  const [heroCtaText, setHeroCtaText] = useState("")
  const [heroCtaSecondary, setHeroCtaSecondary] = useState("")
  const [footerDescription, setFooterDescription] = useState("")
  const [serviceAreas, setServiceAreas] = useState<string[]>([])
  const [newServiceArea, setNewServiceArea] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [ogImage, setOgImage] = useState("")
  const [paystackKey, setPaystackKey] = useState("")
  const [currency, setCurrency] = useState("NGN")

  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("settings").select("*").eq("key", "site_settings").single()
      if (data && data.value) {
        setSettingsId(data.id)
        const v = data.value as Record<string, unknown>
        setBusinessName((v.business_name as string) || "")
        setBusinessDescription((v.business_description as string) || "")
        setLogoUrl((v.logo_url as string) || "")
        setFaviconUrl((v.favicon_url as string) || "")
        setPhone((v.phone as string) || "")
        setWhatsapp((v.whatsapp as string) || "")
        setEmail((v.email as string) || "")
        setAddress((v.address as string) || "")
        setState((v.state as string) || "")
        setCity((v.city as string) || "")
        setWorkingHours((v.working_hours as string) || "")
        const sl = v.social_links as Record<string, string> | undefined
        if (sl) {
          setFacebook(sl.facebook || "")
          setTwitter(sl.twitter || "")
          setInstagram(sl.instagram || "")
          setLinkedin(sl.linkedin || "")
          setYoutube(sl.youtube || "")
        }
        setHeroHeadline((v.hero_headline as string) || "")
        setHeroSubheadline((v.hero_subheadline as string) || "")
        setHeroCtaText((v.hero_cta_text as string) || "")
        setHeroCtaSecondary((v.hero_cta_secondary as string) || "")
        setFooterDescription((v.footer_description as string) || "")
        setServiceAreas((v.service_areas as string[]) || [])
        setMetaTitle((v.meta_title as string) || "")
        setMetaDescription((v.meta_description as string) || "")
        setOgImage((v.og_image as string) || "")
        setPaystackKey((v.paystack_key as string) || "")
        setCurrency((v.currency as string) || "NGN")
      }
      setLoading(false)
    }
    void load()
  }, [])

  function addServiceArea() {
    if (newServiceArea.trim()) {
      setServiceAreas([...serviceAreas, newServiceArea.trim()])
      setNewServiceArea("")
    }
  }

  function removeServiceArea(index: number) {
    setServiceAreas(serviceAreas.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setSaving(true)

    const value = {
      business_name: businessName,
      business_description: businessDescription,
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      phone,
      whatsapp,
      email,
      address,
      state,
      city,
      working_hours: workingHours,
      service_areas: serviceAreas,
      social_links: { facebook, twitter, instagram, linkedin, youtube },
      hero_headline: heroHeadline,
      hero_subheadline: heroSubheadline,
      hero_cta_text: heroCtaText,
      hero_cta_secondary: heroCtaSecondary,
      meta_title: metaTitle,
      meta_description: metaDescription,
      og_image: ogImage,
      paystack_key: paystackKey,
      currency,
      updated_at: new Date().toISOString(),
    }

    let result
    if (settingsId) {
      result = await supabase.from("settings").update({ value, updated_at: new Date().toISOString() }).eq("id", settingsId)
    } else {
      result = await supabase.from("settings").insert({
        key: "site_settings",
        category: "general",
        value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    if (result.error) {
      toast.error("Failed to save settings")
    } else {
      toast.success("Settings saved successfully")
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Site Settings</h1>
          <p className="text-sm text-muted mt-1">Configure your site settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
              activeTab === tab.id
                ? "bg-primary text-secondary shadow-sm"
                : "text-muted hover:bg-surface-dim"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <Card>
          <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="JayTech" />
            <Textarea label="Business Description" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} placeholder="Your business description" className="min-h-[80px]" />
            <Input label="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
            {logoUrl && <img src={logoUrl} alt="Logo" className="h-16 object-contain" />}
            <Input label="Favicon URL" value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)} placeholder="https://..." />
          </CardContent>
        </Card>
      )}

      {activeTab === "contact" && (
        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" />
              <Input label="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="08012345678" />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@jaytech.ng" />
              <Input label="Working Hours" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} placeholder="Mon - Sat: 8AM - 6PM" />
            </div>
            <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="State" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Lagos" />
              <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Lekki" />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "social" && (
        <Card>
          <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
            <Input label="Twitter / X" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
            <Input label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
            <Input label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/..." />
            <Input label="YouTube" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/..." />
          </CardContent>
        </Card>
      )}

      {activeTab === "hero" && (
        <Card>
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Headline" value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} placeholder="Your main headline" />
            <Input label="Subheadline" value={heroSubheadline} onChange={(e) => setHeroSubheadline(e.target.value)} placeholder="Supporting text" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="CTA Primary Text" value={heroCtaText} onChange={(e) => setHeroCtaText(e.target.value)} placeholder="Get a Quote" />
              <Input label="CTA Secondary Text" value={heroCtaSecondary} onChange={(e) => setHeroCtaSecondary(e.target.value)} placeholder="View Services" />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "footer" && (
        <Card>
          <CardHeader><CardTitle>Footer Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea label="Footer Description" value={footerDescription} onChange={(e) => setFooterDescription(e.target.value)} placeholder="Short description for footer" className="min-h-[80px]" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary">Service Areas</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newServiceArea}
                  onChange={(e) => setNewServiceArea(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addServiceArea() } }}
                  placeholder="Add area and press Enter"
                  className="flex h-11 flex-1 rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button type="button" variant="outline" onClick={addServiceArea}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {serviceAreas.map((area, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary-dark">
                    {area}
                    <button onClick={() => removeServiceArea(i)} className="cursor-pointer hover:text-danger">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "seo" && (
        <Card>
          <CardHeader><CardTitle>SEO Defaults</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Default Meta Title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="JayTech - Solar & Electrical Services" />
            <Textarea label="Default Meta Description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Default SEO description" className="min-h-[80px]" />
            <Input label="OG Image URL" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://..." />
            {ogImage && <img src={ogImage} alt="OG Preview" className="w-full max-w-md rounded-xl border border-border" />}
          </CardContent>
        </Card>
      )}

      {activeTab === "payment" && (
        <Card>
          <CardHeader><CardTitle>Payment Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Paystack Public Key" value={paystackKey} onChange={(e) => setPaystackKey(e.target.value)} placeholder="pk_live_..." type="password" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted">
              Email and SMS notification settings will be available in a future update.
            </p>
            <div className="space-y-3">
              {["New booking received", "Payment received", "New review", "New contact message"].map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20" />
                  <span className="text-sm font-medium text-secondary">{item}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
