import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://jaytech.ng"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/booking`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    const { data: services } = await supabase
      .from("services")
      .select("slug, updated_at")
      .eq("is_active", true)

    if (services) {
      for (const service of services) {
        staticPages.push({
          url: `${BASE_URL}/services/${service.slug}`,
          lastModified: new Date(service.updated_at),
          changeFrequency: "weekly",
          priority: 0.8,
        })
      }
    }
  } catch {
    // Use empty fallback - only static pages
  }

  try {
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published")

    if (posts) {
      for (const post of posts) {
        staticPages.push({
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at),
          changeFrequency: "weekly",
          priority: 0.7,
        })
      }
    }
  } catch {
    // Use empty fallback - only static pages
  }

  return staticPages
}
