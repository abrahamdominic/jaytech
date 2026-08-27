import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate, normalizeImageUrl } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BLOG_FALLBACK = [
  {
    id: "1",
    title: "How to Choose the Right Solar System for Your Home",
    slug: "choosing-right-solar-system",
    excerpt:
      "Discover the key factors to consider when selecting a solar energy system for your Nigerian home.",
    meta_title: "How to Choose the Right Solar System for Your Home",
    meta_description:
      "Discover the key factors to consider when selecting a solar energy system for your Nigerian home.",
    content: `<p>Choosing the right solar system for your home in Nigeria can feel overwhelming with so many options available. Here's a comprehensive guide to help you make the right decision.</p>
<h2>1. Assess Your Energy Needs</h2>
<p>Start by calculating your average daily electricity consumption. Look at your recent electricity bills and note how many kilowatt-hours (kWh) you use per day. This will determine the size of the solar system you need.</p>
<h2>2. Consider Your Location</h2>
<p>Nigeria receives abundant sunlight year-round, but the amount varies by region. Northern states tend to get more sunlight hours than southern states, which may affect the number of panels needed.</p>
<h2>3. Budget and Financing</h2>
<p>Solar systems are an investment. While the upfront cost may seem high, the long-term savings on electricity bills make it worthwhile. At J Tech Solar, Starlink & CCTV Hub, we offer flexible payment plans to make solar accessible.</p>
<h2>4. Quality of Components</h2>
<p>Always choose high-quality solar panels, inverters, and batteries. Cheaper alternatives may save money initially but often fail within a few years. We recommend Tier-1 solar panels and reputable inverter brands.</p>
<h2>5. Professional Installation</h2>
<p>Proper installation is crucial for system performance and safety. Always work with certified solar installers like J Tech Solar, Starlink & CCTV Hub who can provide warranty support.</p>`,
    featured_image: "/images/jay20.jpeg",
    tags: ["solar", "guide", "home"],
    published_at: "2025-06-15T10:00:00Z",
    created_at: "2025-06-15T10:00:00Z",
    category: { id: "1", name: "Solar Energy", slug: "solar-energy" },
    author: { full_name: "J Tech Solar, Starlink & CCTV Hub Team", email: "info@J Tech Solar, Starlink & CCTV Hub.ng" },
  },
  {
    id: "2",
    title: "Starlink in Nigeria: Everything You Need to Know",
    slug: "starlink-nigeria-2025",
    excerpt:
      "A complete guide to Starlink satellite internet in Nigeria including pricing, installation, and what to expect.",
    meta_title: "Starlink in Nigeria: Everything You Need to Know",
    meta_description:
      "A complete guide to Starlink satellite internet in Nigeria including pricing, installation, and what to expect.",
    content: `<p>Starlink has been a game-changer for internet connectivity in Nigeria, especially in areas where traditional ISPs struggle to reach.</p>
<h2>What is Starlink?</h2>
<p>Starlink is a satellite internet constellation developed by SpaceX. It provides high speed, low latency broadband internet across the globe, including Nigeria.</p>
<h2>Pricing in Nigeria</h2>
<p>The Starlink kit costs around ₦350,000 for the hardware, with a monthly subscription of approximately ₦38,000. Prices may vary based on exchange rates.</p>
<h2>Installation</h2>
<p>Professional installation is recommended for optimal performance. J Tech Solar, Starlink & CCTV Hub provides expert Starlink installation services across Nigeria.</p>`,
    featured_image: "/images/jay18.jpeg",
    tags: ["starlink", "internet", "guide"],
    published_at: "2025-05-20T10:00:00Z",
    created_at: "2025-05-20T10:00:00Z",
    category: { id: "2", name: "Starlink", slug: "starlink" },
    author: { full_name: "J Tech Solar, Starlink & CCTV Hub Team", email: "info@J Tech Solar, Starlink & CCTV Hub.ng" },
  },
  {
    id: "3",
    title: "Common Electrical Problems in Nigerian Homes",
    slug: "common-electrical-problems",
    excerpt:
      "Learn about the most frequent electrical issues in Nigerian homes and how to prevent them.",
    meta_title: "Common Electrical Problems in Nigerian Homes",
    meta_description:
      "Learn about the most frequent electrical issues in Nigerian homes and how to prevent them.",
    content: `<p>Electrical issues are common in Nigerian homes. Understanding these problems can help you prevent dangerous situations.</p>
<h2>Frequent Power Surges</h2>
<p>Nigeria's unstable power grid means frequent surges when power returns. Installing surge protectors and voltage stabilizers is essential.</p>
<h2>Overloaded Circuits</h2>
<p>Many homes have circuits that weren't designed for modern electrical loads. Adding too many appliances to a single circuit can cause overheating and fire hazards.</p>`,
    featured_image: "/images/jay19.jpeg",
    tags: ["electrical", "maintenance", "safety"],
    published_at: "2025-04-10T10:00:00Z",
    created_at: "2025-04-10T10:00:00Z",
    category: { id: "3", name: "Electrical", slug: "electrical" },
    author: { full_name: "J Tech Solar, Starlink & CCTV Hub Team", email: "info@J Tech Solar, Starlink & CCTV Hub.ng" },
  },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let post = BLOG_FALLBACK.find((p) => p.slug === slug);

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("title, meta_title, meta_description, excerpt")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (data) post = { ...post!, ...data };
  } catch {
    // use fallback
  }

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let post = BLOG_FALLBACK.find((p) => p.slug === slug);
  let allPosts = BLOG_FALLBACK;

  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("blog_posts")
      .select("*, category:blog_categories(*), author:profiles(full_name, email)")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (data) post = data;

    const { data: allData } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, meta_title, meta_description, content, featured_image, tags, published_at, created_at, category:blog_categories(id, name, slug), author:profiles(full_name, email)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(10);

    if (allData && allData.length > 0) allPosts = allData as unknown as typeof allPosts;
  } catch {
    // use fallback
  }

  if (!post) notFound();

  const relatedPosts = allPosts
    .filter((p) => p.id !== post!.id)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <article>
          <div className="bg-secondary py-16">
            <Container>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Blog
              </Link>
              <div className="max-w-3xl">
                {post.category && (
                  <Badge className="mb-4">{post.category.name}</Badge>
                )}
                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight">
                  {post.title}
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {post.author?.full_name || "J Tech Solar, Starlink & CCTV Hub Team"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>
              </div>
            </Container>
          </div>

          <Container>
            <div className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-4">
              <div className="lg:col-span-3">
                {post.featured_image && (
                  <div className="mb-8 overflow-hidden rounded-2xl">
                    <img
                      src={normalizeImageUrl(post.featured_image) || ""}
                      alt={post.title}
                      className="w-full object-cover"
                    />
                  </div>
                )}

                <div
                  className="prose prose-lg max-w-none prose-headings:text-secondary prose-p:text-secondary/80 prose-a:text-primary-dark prose-strong:text-secondary"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-surface-dim px-3 py-1.5 text-xs font-medium text-muted"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">
                    About the Author
                  </h3>
                  <div className="rounded-2xl border border-border bg-white p-5">
                    <p className="text-sm font-semibold text-secondary">
                      {post.author?.full_name || "J Tech Solar, Starlink & CCTV Hub Team"}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Providing expert insights on solar, Starlink, and
                      electrical services across Nigeria.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">
                      Recent Posts
                    </h3>
                    <div className="space-y-3">
                      {relatedPosts.map((rp) => (
                        <Link
                          key={rp.id}
                          href={`/blog/${rp.slug}`}
                          className="block group"
                        >
                          <p className="text-sm font-medium text-secondary group-hover:text-primary-dark transition-colors line-clamp-2">
                            {rp.title}
                          </p>
                          <p className="text-xs text-muted mt-0.5">
                            {formatDate(rp.published_at || rp.created_at)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </Container>

          {relatedPosts.length > 0 && (
            <section className="bg-surface-dim py-16">
              <Container>
                <h2 className="text-2xl font-bold text-secondary mb-8">
                  Related Posts
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/blog/${rp.slug}`}
                      className="group block"
                    >
                      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-lg">
                        <div className="aspect-[16/10] bg-surface-dim overflow-hidden">
                          {rp.featured_image ? (
                            <img
                              src={normalizeImageUrl(rp.featured_image) || ""}
                              alt={rp.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <div className="h-16 w-16 rounded-2xl bg-primary/10" />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-base font-bold text-secondary group-hover:text-primary-dark transition-colors line-clamp-2">
                            {rp.title}
                          </h3>
                          <p className="mt-1 text-xs text-muted">
                            {formatDate(rp.published_at || rp.created_at)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark hover:text-primary transition-colors"
                  >
                    View All Posts
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Container>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
