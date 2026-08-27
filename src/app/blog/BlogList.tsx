"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { formatDate, normalizeImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Author {
  full_name: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
  category?: Category;
  author?: Author;
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(new Set(posts.map((p) => p.category?.name).filter(Boolean))) as string[],
  ];

  const filtered =
    selectedCategory === "all"
      ? posts
      : posts.filter((p) => p.category?.name === selectedCategory);

  return (
    <section className="py-16">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">
                Categories
              </h3>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "w-full text-left rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                      selectedCategory === cat
                        ? "bg-secondary text-white"
                        : "text-muted hover:text-secondary hover:bg-surface-dim"
                    )}
                  >
                    {cat === "all" ? "All Posts" : cat}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted">No posts found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {filtered.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-lg">
                      <div className="relative aspect-[16/10] bg-surface-dim overflow-hidden">
                        {post.featured_image ? (
                          <img
                            src={normalizeImageUrl(post.featured_image) || ""}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10" />
                          </div>
                        )}
                        {post.category && (
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                              {post.category.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-muted mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                          {post.author && (
                            <span>by {post.author.full_name}</span>
                          )}
                        </div>
                        <h2 className="text-lg font-bold text-secondary mb-2 line-clamp-2 group-hover:text-primary-dark transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted line-clamp-3 mb-3">
                          {post.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-dark group-hover:gap-2 transition-all">
                          Read More
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
