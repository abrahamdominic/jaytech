import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/home/HeroSection"
import StatsSection from "@/components/home/StatsSection"
import ServicesSection from "@/components/home/ServicesSection"
import WhyChooseSection from "@/components/home/WhyChooseSection"
import ProjectsSection from "@/components/home/ProjectsSection"
import ReviewsSection from "@/components/home/ReviewsSection"
import HowItWorksSection from "@/components/home/HowItWorksSection"
import CTASection from "@/components/home/CTASection"
import FAQSection from "@/components/home/FAQSection"
import { createClient } from "@/lib/supabase/server"
import { normalizeImageUrl, sanitizeBrandText } from "@/lib/utils"
import type { Service, Project, Review, FAQ } from "@/types/database"

export const metadata: Metadata = {
  title: "J Tech Solar, Starlink & CCTV Hub - Solar, Starlink & Electrical Services Nigeria",
  description:
    "Nigeria's trusted partner for solar energy installations, Starlink internet setup, electrical repairs, and smart home solutions. Professional. Reliable. Affordable.",
  openGraph: {
    title: "J Tech Solar, Starlink & CCTV Hub - Solar, Starlink & Electrical Services Nigeria",
    description:
      "Nigeria's trusted partner for solar energy installations, Starlink internet setup, electrical repairs, and smart home solutions.",
    url: "https://J Tech Solar, Starlink & CCTV Hub.ng",
    siteName: "J Tech Solar, Starlink & CCTV Hub",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "images/jay.png",
        width: 1200,
        height: 630,
        alt: "J Tech Solar, Starlink & CCTV Hub - Solar, Starlink & Electrical Services",
      },
    ],
  },
}

async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(6)
    return (data as Service[]) || []
  } catch {
    return []
  }
}

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("projects")
      .select("*, project_images(image_url, caption, display_order)")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(3)
    return (data as Project[]) || []
  } catch {
    return []
  }
}

async function getReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(6)
    return (data as Review[]) || []
  } catch {
    return []
  }
}

async function getFAQs(): Promise<FAQ[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(8)
    return (data as FAQ[]) || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [services, projects, reviews, faqs] = await Promise.all([
    getServices(),
    getProjects(),
    getReviews(),
    getFAQs(),
  ])

  const mappedServices = services.map((s) => ({
    title: s.title,
    description: s.short_description || s.description,
    slug: s.slug,
  }))

  const mappedProjects = projects.map((p) => ({
    title: p.title,
    location: p.location,
    service_type: p.service_type,
    description: p.description,
    image: normalizeImageUrl(p.project_images?.[0]?.image_url),
  }))

  const mappedReviews = reviews.map((r) => ({
    name: sanitizeBrandText(r.name) || r.name,
    rating: r.rating,
    review: sanitizeBrandText(r.review),
    service_used: sanitizeBrandText(r.service_used),
    created_at: r.created_at,
    image_url: r.image_url,
  }))

  const mappedFAQs = faqs.map((f) => ({
    question: sanitizeBrandText(f.question),
    answer: sanitizeBrandText(f.answer),
  }))

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection services={mappedServices.length > 0 ? mappedServices : undefined} />
        <WhyChooseSection />
        <ProjectsSection projects={mappedProjects.length > 0 ? mappedProjects : undefined} />
        <ReviewsSection reviews={mappedReviews.length > 0 ? mappedReviews : undefined} />
        <HowItWorksSection />
        <CTASection />
        <FAQSection faqs={mappedFAQs.length > 0 ? mappedFAQs : undefined} />
      </main>
      <Footer />
    </div>
  )
}
