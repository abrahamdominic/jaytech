"use client"

import Link from "next/link"
import {
  Sun,
  Wifi,
  Zap,
  Wrench,
  MessageSquare,
  Smartphone,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ServiceCard {
  title: string
  description: string
  icon?: LucideIcon
  image?: string
  slug: string
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

function serviceIcon(slug: string): LucideIcon {
  const key = Object.keys(iconMap).find((k) => slug.toLowerCase().includes(k))
  return key ? iconMap[key] : iconMap.default
}

const defaultServices: ServiceCard[] = [
  {
    title: "Solar Installation",
    description:
      "Complete solar panel installation for homes and businesses. Reduce your electricity bills with reliable, clean energy solutions.",
    icon: Sun,
    slug: "solar-installation",
  },
  {
    title: "Starlink Installation",
    description:
      "Get blazing fast satellite internet with professional Starlink setup. Perfect for remote and underserved areas across Nigeria.",
    icon: Wifi,
    image: "/images/jay5.jpg",
    slug: "starlink-installation",
  },
  {
    title: "Electrical Services",
    description:
      "Comprehensive electrical wiring, installations, and upgrades. Licensed professionals for residential and commercial projects.",
    icon: Zap,
    slug: "electrical-services",
  },
  {
    title: "Repairs & Maintenance",
    description:
      "Expert repair and routine maintenance for solar systems, electrical wiring, and all connected energy infrastructure.",
    icon: Wrench,
    slug: "repairs-maintenance",
  },
  {
    title: "Consultation",
    description:
      "Free expert consultation to assess your energy needs and recommend the most cost-effective solutions for your space.",
    icon: MessageSquare,
    slug: "consultation",
  },
  {
    title: "Electrical Gadgets",
    description:
      "Supply and installation of quality electrical appliances, inverters, batteries, and smart home devices.",
    icon: Smartphone,
    slug: "electrical-gadgets",
  },
]

interface ServicesSectionProps {
  services?: ServiceCard[]
}

export default function ServicesSection({ services = defaultServices }: ServicesSectionProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Services
          </p>
          <h2 className="mt-2 text-3xl font-bold text-secondary sm:text-4xl lg:text-5xl">
            What We Do Best
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            From solar panels to satellite internet, we deliver end-to-end
            energy and connectivity solutions across Nigeria.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon ?? serviceIcon(service.slug)
            return (
            <Link
              key={service.title}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30"
            >
              {service.image && (
                <div className="relative h-44 overflow-hidden bg-surface-dim">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <Icon className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-secondary">
                  Book This Service
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
              </div>
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
