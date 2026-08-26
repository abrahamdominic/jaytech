import type { Metadata } from "next"
import Link from "next/link"
import {
  CheckCircle,
  Star,
  Clock,
  ArrowRight,
  ChevronRight,
  Image as ImageIcon,
  Quote,
} from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"
import type { Service, Review } from "@/types/database"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getService(slug: string): Promise<Service | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("services")
      .select("*, service_faqs(*), service_gallery(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()
    return (data as Service) || null
  } catch {
    return null
  }
}

async function getServiceReviews(serviceId: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("service_id", serviceId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(5)
    return (data as Review[]) || []
  } catch {
    return []
  }
}

async function getAllServiceSlugs() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("services")
      .select("slug")
      .eq("is_active", true)
    return ((data as { slug: string }[]) || []).map((s) => ({ slug: s.slug }))
  } catch {
    return [
      { slug: "solar-installation" },
      { slug: "starlink-installation" },
      { slug: "electrical-services" },
      { slug: "repairs-maintenance" },
      { slug: "consultation" },
      { slug: "electrical-gadgets" },
    ]
  }
}

export async function generateStaticParams() {
  return getAllServiceSlugs()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) {
    return { title: "Service Not Found" }
  }

  return {
    title: service.meta_title || service.title,
    description: service.meta_description || service.short_description,
    openGraph: {
      title: service.meta_title || service.title,
      description: service.meta_description || service.short_description,
      type: "website",
    },
  }
}

function getPriceDisplay(service: Service): string {
  switch (service.pricing_type) {
    case "fixed":
      return service.starting_price === 0 ? "Free" : formatCurrency(service.starting_price)
    case "starting":
      return `From ${formatCurrency(service.starting_price)}`
    case "range":
      return `${formatCurrency(service.price_range_min)} - ${formatCurrency(service.price_range_max)}`
    case "request_quote":
      return "Request a Quote"
    default:
      return "Contact for Pricing"
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-primary text-primary"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  )
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex flex-col items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary">Service Not Found</h1>
            <p className="mt-4 text-lg text-muted">
              The service you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button size="lg" asChild className="mt-8">
              <Link href="/services">
                Browse All Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const reviews = await getServiceReviews(service.id)
  const faqs = service.service_faqs || []
  const gallery = service.service_gallery || []

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary py-20 md:py-28">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/services" className="hover:text-primary transition-colors">
                Services
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary">{service.title}</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h1 className="text-4xl font-bold text-white sm:text-5xl">
                  {service.title}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-slate-300">
                  {service.description}
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/booking">
                      Book This Service
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">
                      Get a Free Quote
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary-light border border-white/10">
                  {service.hero_image_url ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${service.hero_image_url})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm text-white/40 font-medium">{service.title}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Banner */}
        <section className="bg-primary/5 border-y border-primary/10 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted">Estimated Price:</span>
                <span className="text-2xl font-bold text-secondary">
                  {getPriceDisplay(service)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Clock className="h-4 w-4" />
                <span>Estimated Duration: {service.estimated_duration}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        {service.benefits && service.benefits.length > 0 && (
          <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
                Benefits
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {service.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface-dim p-5"
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                    <span className="text-sm font-medium text-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* What's Included & Equipment */}
        <section className="bg-surface-dim py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              {service.includes && service.includes.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
                    What&apos;s Included
                  </h2>
                  <ul className="mt-8 space-y-4">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.equipment && service.equipment.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
                    Equipment Used
                  </h2>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {service.equipment.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-secondary shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        {service.process_steps && service.process_steps.length > 0 && (
          <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
                Our Process
              </h2>
              <div className="relative mt-10">
                <div className="absolute top-12 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 lg:block" />
                <div className="grid gap-8 lg:grid-cols-4">
                  {service.process_steps.map((step, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center">
                      <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
                        <span className="text-lg font-bold text-primary">{i + 1}</span>
                      </div>
                      <h3 className="text-base font-bold text-secondary">{step.step}</h3>
                      <p className="mt-1 max-w-[200px] text-sm text-muted">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="bg-surface-dim py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-secondary sm:text-3xl">Gallery</h2>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    className="group relative h-48 overflow-hidden rounded-xl border border-border bg-white"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${img.image_url})` }}
                    />
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-xs text-white font-medium">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
                Customer Reviews
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="relative rounded-2xl bg-surface-dim p-6 border border-border"
                  >
                    <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
                    <StarRating rating={review.rating} />
                    <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-4">
                      &ldquo;{review.review}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {getInitials(review.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary truncate">
                          {review.name}
                        </p>
                        <p className="text-xs text-muted">{review.service_used}</p>
                      </div>
                      <p className="text-xs text-muted">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="bg-surface-dim py-16 md:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
                Frequently Asked Questions
              </h2>
              <div className="mt-8 space-y-3">
                {faqs
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((faq) => (
                    <details
                      key={faq.id}
                      className="group rounded-xl border border-border bg-white"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left">
                        <span className="text-base font-semibold text-secondary">
                          {faq.question}
                        </span>
                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-300 group-open:rotate-90" />
                      </summary>
                      <div className="px-6 pb-5 text-sm leading-relaxed text-muted">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary py-16 md:py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Get Started with {service.title}?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Book this service today and let our certified technicians handle the rest.
              Quality workmanship guaranteed.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/booking">
                  Book This Service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Talk to Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
