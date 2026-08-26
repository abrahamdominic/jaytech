"use client"

import Link from "next/link"
import { MapPin, Sun, Wifi, Zap, ArrowRight, ExternalLink } from "lucide-react"

interface FeaturedProject {
  title: string
  location: string
  service_type: string
  description: string
  image_url?: string
}

const defaultProjects: FeaturedProject[] = [
  {
    title: "Lekki Phase 1 Solar Installation",
    location: "Lekki, Lagos",
    service_type: "Solar Installation",
    description: "A 20kW solar system installation for a luxury duplex, providing 24/7 power backup with Tesla Powerwall integration.",
  },
  {
    title: "Abuja Estate Starlink Setup",
    location: "Gwarinpa, Abuja",
    service_type: "Starlink Installation",
    description: "High-speed satellite internet installation for a gated estate of 50+ homes, replacing slow broadband connections.",
  },
  {
    title: "Ikeja Factory Rewiring",
    location: "Ikeja, Lagos",
    service_type: "Electrical Services",
    description: "Complete electrical rewiring and upgrade for a manufacturing facility, improving safety and energy efficiency by 40%.",
  },
]

function ProjectIcon({ type }: { type: string }) {
  switch (type) {
    case "Solar Installation":
      return <Sun className="h-12 w-12 text-primary" />
    case "Starlink Installation":
      return <Wifi className="h-12 w-12 text-accent" />
    default:
      return <Zap className="h-12 w-12 text-primary" />
  }
}

function ServiceTag({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
      {type}
    </span>
  )
}

interface FeaturedProjectsGridProps {
  projects?: FeaturedProject[]
}

export default function FeaturedProjectsGrid({ projects = defaultProjects }: FeaturedProjectsGridProps) {
  return (
    <section className="bg-surface-dim py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Our Work
            </p>
            <h2 className="mt-2 text-3xl font-bold text-secondary sm:text-4xl lg:text-5xl">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Feature project: first one large */}
        {projects.length > 0 && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Hero project */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-secondary-light to-secondary lg:row-span-2">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <ProjectIcon type={projects[0].service_type} />
                <p className="mt-3 text-sm font-medium text-white/50">
                  {projects[0].service_type}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <ServiceTag type={projects[0].service_type} />
                <h3 className="mt-3 text-2xl font-bold text-white">
                  {projects[0].title}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-300">
                  <MapPin className="h-4 w-4" />
                  {projects[0].location}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300/80 line-clamp-3">
                  {projects[0].description}
                </p>
                <Link
                  href={`/projects`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  View Project
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Smaller projects */}
            {projects.slice(1).map((project) => (
              <div
                key={project.title}
                className="group overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative flex h-48 shrink-0 items-center justify-center bg-gradient-to-br from-secondary via-secondary-light to-secondary sm:h-auto sm:w-48">
                    <ProjectIcon type={project.service_type} />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-6">
                    <ServiceTag type={project.service_type} />
                    <h3 className="mt-3 text-lg font-bold text-secondary group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                      <MapPin className="h-3.5 w-3.5" />
                      {project.location}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
