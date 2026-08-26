import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const MAX_PER_CATEGORY = 5

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes("placeholder")) {
    return NextResponse.json(
      { error: "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file with your actual Supabase project credentials." },
      { status: 503 }
    )
  }

  const supabase = createClient(url, key)
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")

    if (!q || q.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      )
    }

    const searchTerm = q.trim()

    const [servicesResult, projectsResult, blogResult, faqResult] =
      await Promise.all([
        supabase
          .from("services")
          .select("id, title, slug, description")
          .eq("is_active", true)
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%`)
          .limit(MAX_PER_CATEGORY),

        supabase
          .from("projects")
          .select("id, title, slug, description")
          .eq("is_published", true)
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(MAX_PER_CATEGORY),

        supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt")
          .eq("status", "published")
          .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
          .limit(MAX_PER_CATEGORY),

        supabase
          .from("faqs")
          .select("id, question, answer")
          .eq("is_active", true)
          .or(`question.ilike.%${searchTerm}%,answer.ilike.%${searchTerm}%`)
          .limit(MAX_PER_CATEGORY),
      ])

    return NextResponse.json({
      results: {
        services: servicesResult.data || [],
        projects: projectsResult.data || [],
        blog_posts: blogResult.data || [],
        faqs: faqResult.data || [],
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Search API error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}
