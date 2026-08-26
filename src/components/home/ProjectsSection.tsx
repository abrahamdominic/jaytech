"use client"

import Link from "next/link"
import { MapPin, Sun, Wifi, Zap, ArrowRight } from "lucide-react"

interface ProjectCard {
  title: string
  location: string
  service_type: string
  description: string
  image_url?: string
}

const defaultProjects: ProjectCard[] = [
  {
    title: "Lekki Phase 1 Solar Installation",
    location: "Lagos State",
    service_type: "Solar Installation",
    description: "A 20kW solar system installation for a luxury duplex, providing 24/7 power backup with Tesla Powerwall integration.",
    image_url: undefined,
  },
  {
    title: "Abuja Estate Starlink Setup",
    location: "FCT Abuja",
    service_type: "Starlink Installation",
    description: "High-speed satellite internet installation for a gated estate of 50+ homes, replacing slow broadband connections.",
    image_url: undefined,
  },
  {
    title: "Ikeja Factory Rewiring",
    location: "Lagos State",
    service_type: "Electrical Services",
    description: "Complete electrical rewiring and upgrade for a manufacturing facility, improving safety and energy efficiency by 40%.",
    image_url: undefined,
  },
]

function ProjectIcon({ type }: { type: string }) {
  switch (type) {
    case "Solar Installation":
      return <Sun className="h-8 w-8 text-primary" />
    case "Starlink Installation":
      return <Wifi className="h-8 w-8 text-accent" />
    default:
      return <Zap className="h-8 w-8 text-primary" />
  }
}

function ServiceTag({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      {type}
    </span>
  )
}

interface ProjectsSectionProps {
  projects?: ProjectCard[]
}

export default function ProjectsSection({ projects = defaultProjects }: ProjectsSectionProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Portfolio
          </p>
          <h2 className="mt-2 text-3xl font-bold text-secondary sm:text-4xl lg:text-5xl">
            Our Featured Projects
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Take a look at some of the projects we&apos;ve delivered across Nigeria.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image placeholder */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ProjectIcon type={project.service_type} />
                  <p className="mt-2 text-xs font-medium text-white/40">
                    {project.service_type}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <ServiceTag type={project.service_type} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-secondary-light hover:-translate-y-0.5"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
