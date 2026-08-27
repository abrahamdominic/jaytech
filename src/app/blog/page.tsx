import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogList from "./BlogList";

export const metadata: Metadata = {
  title: "Blog & Guides",
  description:
    "Expert tips, guides, and news about solar energy, Starlink internet, and electrical services in Nigeria from J Tech Solar, Starlink & CCTV Hub.",
};

const BLOG_FALLBACK = [
  {
    id: "1",
    title: "How to Choose the Right Solar System for Your Home",
    slug: "choosing-right-solar-system",
    excerpt:
      "Discover the key factors to consider when selecting a solar energy system for your Nigerian home, from capacity to budget.",
    content: "",
    featured_image: "/images/jay20.jpeg",
    tags: ["solar", "guide"],
    published_at: "2025-06-15T10:00:00Z",
    created_at: "2025-06-15T10:00:00Z",
    category: { id: "1", name: "Solar Energy", slug: "solar-energy" },
    author: { full_name: "J Tech Solar, Starlink & CCTV Hub Team" },
  },
  {
    id: "2",
    title: "Starlink in Nigeria: What You Need to Know in 2025",
    slug: "starlink-nigeria-2025",
    excerpt:
      "Everything about Starlink satellite internet availability, pricing, and installation in Nigeria.",
    content: "",
    featured_image: "/images/jay18.jpeg",
    tags: ["starlink", "internet"],
    published_at: "2025-05-20T10:00:00Z",
    created_at: "2025-05-20T10:00:00Z",
    category: { id: "2", name: "Starlink", slug: "starlink" },
    author: { full_name: "J Tech Solar, Starlink & CCTV Hub Team" },
  },
  {
    id: "3",
    title: "Common Electrical Problems in Nigerian Homes",
    slug: "common-electrical-problems",
    excerpt:
      "Learn about the most frequent electrical issues in Nigerian homes and how to prevent them.",
    content: "",
    featured_image: "/images/jay19.jpeg",
    tags: ["electrical", "maintenance"],
    published_at: "2025-04-10T10:00:00Z",
    created_at: "2025-04-10T10:00:00Z",
    category: { id: "3", name: "Electrical", slug: "electrical" },
    author: { full_name: "J Tech Solar, Starlink & CCTV Hub Team" },
  },
];

export default async function BlogPage() {
  let posts = BLOG_FALLBACK;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*, category:blog_categories(*), author:profiles(full_name)")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (data && data.length > 0) {
      posts = data;
    }
  } catch {
    // use fallback
  }

  return (
    <>
      <Header />
      <main>
        <section className="bg-secondary py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Blog &amp; Guides
            </h1>
            <div className="mt-4 flex items-center gap-3 justify-center">
              <div className="h-1 w-12 rounded-full bg-primary" />
              <div className="h-1 w-6 rounded-full bg-primary/50" />
              <div className="h-1 w-3 rounded-full bg-primary/30" />
            </div>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Expert tips, guides, and news about solar energy, Starlink
              internet, and electrical services.
            </p>
          </div>
        </section>
        <BlogList posts={posts} />
      </main>
      <Footer />
    </>
  );
}
