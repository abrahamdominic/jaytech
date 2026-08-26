import type { Metadata } from "next"
import Link from "next/link"
import { Sun, Wifi, Zap, Wrench, MessageSquare, Smartphone, ArrowRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import SectionHeading from "@/components/ui/SectionHeading"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import type { Service } from "@/types/database"

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore JayTech's full range of solar installation, Starlink internet setup, electrical services, repairs, and smart home solutions across Nigeria.",
  openGraph: {
    title: "Our Services | JayTech",
    description:
      "Explore JayTech's full range of solar installation, Starlink internet setup, electrical services, repairs, and smart home solutions.",
  },
}

const iconMap: Record<string, LucideIcon> = {
  solar: Sun,
  starlink: Wifi,
  electrical: Zap,
  repair: Wrench,
  consultation: MessageSquare,
  gadgets: Smartphone,
  wifi: Wifi,
  wrench: Wrench,
  default: Zap,
}

const fallbackServices: Service[] = [
  {
    id: "1",
    category_id: null,
    title: "Solar Installation",
    slug: "solar-installation",
    description:
      "Complete solar panel installation for homes and businesses. We handle everything from site assessment to system design, installation, and commissioning.",
    short_description:
      "Complete solar panel installation for homes and businesses. Reduce your electricity bills with reliable, clean energy solutions.",
    image_url: "",
    hero_image_url: "",
    benefits: [
      "Reduce electricity bills by up to 80%",
      "24/7 uninterrupted power supply",
      "Increase property value",
      "Environmentally friendly energy",
    ],
    includes: [
      "Free site assessment",
      "Custom system design",
      "Professional installation",
      "System commissioning",
    ],
    equipment: ["Solar panels", "Inverters", "Batteries", "Mounting structures"],
    process_steps: [
      { step: "Site Assessment", description: "We evaluate your location and energy needs" },
      { step: "System Design", description: "Custom solar solution designed for you" },
      { step: "Installation", description: "Professional installation by certified technicians" },
      { step: "Commissioning", description: "System testing and handover" },
    ],
    estimated_duration: "1-3 days",
    pricing_type: "starting",
    starting_price: 250000,
    price_range_min: 250000,
    price_range_max: 5000000,
    meta_title: "Solar Installation Nigeria | JayTech",
    meta_description: "Professional solar panel installation services across Nigeria",
    is_active: true,
    display_order: 1,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "2",
    category_id: null,
    title: "Starlink Installation",
    slug: "starlink-installation",
    description:
      "Get blazing-fast satellite internet with professional Starlink setup. Perfect for remote and underserved areas across Nigeria.",
    short_description:
      "Get blazing-fast satellite internet with professional Starlink setup. Perfect for remote and underserved areas.",
    image_url: "",
    hero_image_url: "",
    benefits: [
      "High-speed internet (50-200 Mbps)",
      "Works in remote areas",
      "Low latency connection",
      "No data caps",
    ],
    includes: [
      "Site survey for dish placement",
      "Starlink kit procurement",
      "Professional installation",
      "Network configuration",
    ],
    equipment: ["Starlink dish", "Mounting hardware", "Cables", "Router"],
    process_steps: [
      { step: "Site Survey", description: "Find optimal dish placement" },
      { step: "Procurement", description: "Source genuine Starlink equipment" },
      { step: "Installation", description: "Mount and align the dish" },
      { step: "Configuration", description: "Set up network and test speeds" },
    ],
    estimated_duration: "2-4 hours",
    pricing_type: "starting",
    starting_price: 75000,
    price_range_min: 75000,
    price_range_max: 200000,
    meta_title: "Starlink Installation Nigeria | JayTech",
    meta_description: "Professional Starlink satellite internet installation across Nigeria",
    is_active: true,
    display_order: 2,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "3",
    category_id: null,
    title: "Electrical Services",
    slug: "electrical-services",
    description:
      "Comprehensive electrical wiring, installations, and upgrades. Licensed professionals for residential and commercial projects.",
    short_description:
      "Comprehensive electrical wiring, installations, and upgrades. Licensed professionals for residential and commercial projects.",
    image_url: "",
    hero_image_url: "",
    benefits: [
      "Licensed and certified electricians",
      "Safety-compliant work",
      "Residential and commercial",
      "Energy-efficient solutions",
    ],
    includes: [
      "Electrical assessment",
      "Wiring and rewiring",
      "Panel upgrades",
      "Safety inspection",
    ],
    equipment: ["Wiring", "Circuit breakers", "Distribution panels", "Conduits"],
    process_steps: [
      { step: "Assessment", description: "Evaluate electrical needs" },
      { step: "Planning", description: "Design electrical layout" },
      { step: "Installation", description: "Execute wiring and installations" },
      { step: "Testing", description: "Full safety inspection and testing" },
    ],
    estimated_duration: "1-7 days",
    pricing_type: "request_quote",
    starting_price: 0,
    price_range_min: 0,
    price_range_max: 0,
    meta_title: "Electrical Services Nigeria | JayTech",
    meta_description: "Professional electrical wiring and installation services across Nigeria",
    is_active: true,
    display_order: 3,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "4",
    category_id: null,
    title: "Repairs & Maintenance",
    slug: "repairs-maintenance",
    description:
      "Expert repair and routine maintenance for solar systems, electrical wiring, and all connected energy infrastructure.",
    short_description:
      "Expert repair and routine maintenance for solar systems, electrical wiring, and all connected energy infrastructure.",
    image_url: "",
    hero_image_url: "",
    benefits: [
      "Fast response times",
      "Preventive maintenance plans",
      "Genuine replacement parts",
      "Extended system lifespan",
    ],
    includes: [
      "Diagnostic assessment",
      "Fault repair",
      "Preventive maintenance",
      "System health check",
    ],
    equipment: ["Diagnostic tools", "Replacement parts", "Testing equipment"],
    process_steps: [
      { step: "Diagnosis", description: "Identify the issue" },
      { step: "Quotation", description: "Provide transparent pricing" },
      { step: "Repair", description: "Fix the issue with quality parts" },
      { step: "Verification", description: "Test and confirm everything works" },
    ],
    estimated_duration: "2-8 hours",
    pricing_type: "starting",
    starting_price: 15000,
    price_range_min: 15000,
    price_range_max: 200000,
    meta_title: "Solar & Electrical Repairs Nigeria | JayTech",
    meta_description: "Expert repair and maintenance services for solar and electrical systems",
    is_active: true,
    display_order: 4,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "5",
    category_id: null,
    title: "Consultation",
    slug: "consultation",
    description:
      "Free expert consultation to assess your energy needs and recommend the most cost-effective solutions for your space.",
    short_description:
      "Free expert consultation to assess your energy needs and recommend the most cost-effective solutions for your space.",
    image_url: "",
    hero_image_url: "",
    benefits: [
      "Expert energy assessment",
      "Cost-effective recommendations",
      "No obligation",
      "Customized solutions",
    ],
    includes: [
      "On-site or virtual consultation",
      "Energy needs assessment",
      "Solution recommendation",
      "Budget planning",
    ],
    equipment: [],
    process_steps: [
      { step: "Schedule", description: "Book a free consultation slot" },
      { step: "Assessment", description: "We evaluate your energy needs" },
      { step: "Recommendation", description: "Receive a tailored solution" },
      { step: "Quote", description: "Get a detailed, transparent quote" },
    ],
    estimated_duration: "1-2 hours",
    pricing_type: "fixed",
    starting_price: 0,
    price_range_min: 0,
    price_range_max: 0,
    meta_title: "Free Energy Consultation Nigeria | JayTech",
    meta_description: "Free expert consultation for solar, Starlink, and electrical solutions",
    is_active: true,
    display_order: 5,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    id: "6",
    category_id: null,
    title: "Electrical Gadgets",
    slug: "electrical-gadgets",
    description:
      "Supply and installation of quality electrical appliances, inverters, batteries, and smart home devices.",
    short_description:
      "Supply and installation of quality electrical appliances, inverters, batteries, and smart home devices.",
    image_url: "",
    hero_image_url: "",
    benefits: [
      "Quality branded products",
      "Professional installation",
      "Warranty included",
      "After-sales support",
    ],
    includes: [
      "Product sourcing",
      "Delivery",
      "Installation",
      "Configuration and training",
    ],
    equipment: ["Inverters", "Batteries", "Smart devices", "Appliances"],
    process_steps: [
      { step: "Consultation", description: "Discuss your needs and budget" },
      { step: "Procurement", description: "Source the right products" },
      { step: "Delivery", description: "Deliver to your location" },
      { step: "Installation", description: "Install and configure devices" },
    ],
    estimated_duration: "1-2 days",
    pricing_type: "starting",
    starting_price: 50000,
    price_range_min: 50000,
    price_range_max: 3000000,
    meta_title: "Electrical Gadgets & Smart Home Nigeria | JayTech",
    meta_description: "Quality electrical appliances, inverters, and smart home devices",
    is_active: true,
    display_order: 6,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
]

function mapServiceIcon(slug: string): LucideIcon {
  const key = Object.keys(iconMap).find((k) => slug.toLowerCase().includes(k))
  return key ? iconMap[key] : iconMap.default
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

async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    return (data as Service[] | null) && (data as Service[]).length > 0
      ? (data as Service[])
      : fallbackServices
  } catch {
    return fallbackServices
  }
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary py-20 md:py-28">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Our Services
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              From solar panels to satellite internet, we deliver end-to-end energy and
              connectivity solutions across Nigeria.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-primary">Services</span>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="What We Offer"
              subtitle="Comprehensive energy and connectivity solutions tailored to your needs"
            />

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = mapServiceIcon(service.slug)
                return (
                  <div
                    key={service.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary">
                      {service.image_url ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${service.image_url})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Icon className="h-12 w-12 text-primary/60" />
                          <p className="mt-2 text-xs font-medium text-white/40">
                            {service.title}
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-secondary">
                          {getPriceDisplay(service)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
                        {service.short_description || service.description}
                      </p>
                      <div className="mt-4 text-xs text-muted">
                        Estimated duration: {service.estimated_duration}
                      </div>
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button size="sm" asChild className="flex-1">
                          <Link href="/booking">
                            Book This Service
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild className="flex-1">
                          <Link href={`/services/${service.slug}`}>
                            Learn More
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
