import { createClient } from "@supabase/supabase-js"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import type { SiteSettings, Setting } from "@/types/database"

const CACHE_TTL = 5 * 60 * 1000

interface CacheEntry {
  value: SiteSettings
  timestamp: number
}

let settingsCache: CacheEntry | null = null

function isCacheValid(entry: CacheEntry | null): boolean {
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_TTL
}

function invalidateCache() {
  settingsCache = null
}

const DEFAULT_SETTINGS: SiteSettings = {
  business_name: "JayTech",
  business_description:
    "Nigeria's trusted partner for solar energy installations, Starlink internet setup, electrical repairs, and smart home solutions.",
  logo_url: "",
  favicon_url: "",
  phone: "+2347043541420",
  whatsapp: "2347043541420",
  email: "info@jaytech.ng",
  address: "Lagos, Nigeria",
  working_hours: "Mon - Sat: 8am - 6pm",
  state: "Lagos",
  city: "Lagos",
  service_areas: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"],
  social_links: {
    facebook: "https://facebook.com/jaytechng",
    twitter: "https://twitter.com/jaytechng",
    instagram: "https://instagram.com/jaytechng",
    linkedin: "https://linkedin.com/company/jaytechng",
    youtube: "https://youtube.com/@jaytechng",
  },
  hero_headline: "Powering Nigeria with Solar, Starlink & Smart Solutions",
  hero_subheadline:
    "Professional solar installations, satellite internet setup, and electrical services across all 36 states.",
  hero_cta_text: "Book a Service",
  hero_cta_secondary: "Get a Free Quote",
  about_text:
    "JayTech is a leading solar and tech company in Nigeria, providing professional energy solutions and smart home services.",
  meta_title:
    "JayTech - Solar, Starlink & Electrical Services in Nigeria",
  meta_description:
    "Nigeria's trusted partner for solar energy installations, Starlink internet setup, electrical repairs, and smart home solutions. Professional. Reliable. Affordable.",
  og_image: "/og-image.png",
  stats: {
    customers_served: 500,
    projects_completed: 300,
    states_covered: 36,
    years_experience: 5,
    satisfaction_rate: 98,
  },
}

export async function getSettings(): Promise<SiteSettings> {
  if (isCacheValid(settingsCache)) {
    return settingsCache!.value
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    const { data: settings, error } = await supabase
      .from("settings")
      .select("*")

    if (error || !settings || settings.length === 0) {
      return DEFAULT_SETTINGS
    }

  const settingsMap: Record<string, unknown> = {}
  for (const setting of settings as Setting[]) {
    settingsMap[setting.key] = setting.value
  }

  const merged: SiteSettings = {
    ...DEFAULT_SETTINGS,
    ...(settingsMap as unknown as Partial<SiteSettings>),
    social_links: {
      ...DEFAULT_SETTINGS.social_links,
      ...((settingsMap.social_links as Record<string, string>) || {}),
    },
    stats: {
      ...DEFAULT_SETTINGS.stats,
      ...((settingsMap.stats as Record<string, number>) || {}),
    },
  }

    settingsCache = {
      value: merged,
      timestamp: Date.now(),
    }

    return merged
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function getSetting(key: string): Promise<unknown | null> {
  const settings = await getSettings()
  return (settings as unknown as Record<string, unknown>)[key] ?? null
}

export async function updateSetting(
  key: string,
  value: unknown
): Promise<boolean> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.from("settings").upsert(
      {
        key,
        value,
        category: "general",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )

    if (error) {
      console.error("Setting update error:", error)
      return false
    }

    invalidateCache()
    return true
  } catch {
    return false
  }
}
