"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search as SearchIcon, ArrowRight, Loader2, FileText, FolderOpen, Briefcase, HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Container from "@/components/ui/Container"
import { truncate } from "@/lib/utils"

interface SearchResult {
  services: { id: string; title: string; slug: string; description: string }[]
  projects: { id: string; title: string; slug: string; description: string }[]
  blog_posts: { id: string; title: string; slug: string; excerpt: string }[]
  faqs: { id: string; question: string; answer: string }[]
}

const groupConfig = [
  {
    key: "services" as const,
    label: "Services",
    icon: Briefcase,
    linkPrefix: "/services",
    getHref: (item: { slug: string }) => `/services/${item.slug}`,
    getDescription: (item: Record<string, unknown>) => (item.description as string) || "",
  },
  {
    key: "projects" as const,
    label: "Projects",
    icon: FolderOpen,
    linkPrefix: "/projects",
    getHref: () => `/projects`,
    getDescription: (item: Record<string, unknown>) => (item.description as string) || "",
  },
  {
    key: "blog_posts" as const,
    label: "Blog Posts",
    icon: FileText,
    linkPrefix: "/blog",
    getHref: (item: { slug: string }) => `/blog/${item.slug}`,
    getDescription: (item: Record<string, unknown>) => (item.excerpt as string) || "",
  },
  {
    key: "faqs" as const,
    label: "FAQs",
    icon: HelpCircle,
    linkPrefix: "",
    getHref: () => "/#faq",
    getDescription: (item: Record<string, unknown>) => (item.answer as string) || "",
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(!!initialQuery)
  const [hasSearched, setHasSearched] = useState(!!initialQuery)

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery.trim())}`
      )
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      setResults(data.results)
    } catch {
      setResults({ services: [], projects: [], blog_posts: [], faqs: [] })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!initialQuery) return
    const run = async () => {
      if (!initialQuery.trim()) return
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(initialQuery.trim())}`
        )
        if (!response.ok) throw new Error("Search failed")
        const data = await response.json()
        setResults(data.results)
      } catch {
        setResults({ services: [], projects: [], blog_posts: [], faqs: [] })
      } finally {
        setIsLoading(false)
      }
    }
    void run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    setIsLoading(true)
    setHasSearched(true)
    performSearch(query)
  }

  const totalResults = results
    ? results.services.length +
      results.projects.length +
      results.blog_posts.length +
      results.faqs.length
    : 0

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Search Header */}
        <section className="bg-gradient-to-br from-secondary via-secondary-light to-secondary py-16 md:py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Search
              </h1>
              <p className="mt-3 text-slate-300">
                Find services, projects, articles, and more
              </p>
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for solar, starlink, electrical..."
                    className="flex h-14 w-full rounded-2xl border-0 bg-white pl-12 pr-4 text-base text-secondary shadow-xl shadow-black/10 placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </form>
            </div>
          </Container>
        </section>

        {/* Results */}
        <section className="bg-surface-dim py-12 md:py-16">
          <Container>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted">Searching...</p>
              </div>
            ) : !hasSearched ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <SearchIcon className="h-12 w-12 text-muted/30" />
                <p className="mt-4 text-lg font-semibold text-secondary">
                  Enter a search term
                </p>
                <p className="mt-1 text-sm text-muted">
                  Search across our services, projects, blog posts, and FAQs
                </p>
              </div>
            ) : totalResults === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <SearchIcon className="h-12 w-12 text-muted/30" />
                <p className="mt-4 text-lg font-semibold text-secondary">
                  No results found
                </p>
                <p className="mt-1 text-sm text-muted">
                  Try searching with different keywords or browse our{" "}
                  <Link href="/services" className="text-primary hover:text-primary-dark">
                    services
                  </Link>
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                <p className="text-sm text-muted">
                  Found {totalResults} result{totalResults !== 1 ? "s" : ""} for
                  &ldquo;{initialQuery}&rdquo;
                </p>

                {groupConfig.map(({ key, label, icon: Icon, getHref, getDescription }) => {
                  const items = results?.[key]
                  if (!items || items.length === 0) return null

                  return (
                    <div key={key}>
                      <div className="mb-4 flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold text-secondary">
                          {label}
                        </h2>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {items.length}
                        </span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {items.map((item) => {
                          const itemTitle = "title" in item ? item.title : "question" in item ? item.question : ""
                          const itemSlug = "slug" in item ? item.slug : ""
                          const itemDesc = getDescription(item as Record<string, unknown>)
                          return (
                            <Link
                              key={item.id}
                              href={getHref({ slug: itemSlug } as { slug: string })}
                            >
                              <Card className="group h-full transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
                                <CardContent className="p-5">
                                  <h3 className="font-bold text-secondary group-hover:text-primary-dark transition-colors">
                                    {itemTitle}
                                  </h3>
                                  <p className="mt-2 text-sm text-muted line-clamp-2">
                                    {truncate(itemDesc, 150)}
                                  </p>
                                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                    View Details
                                    <ArrowRight className="h-3 w-3" />
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  )
}
