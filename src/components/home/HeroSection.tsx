"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users,
  FolderCheck,
  MapPin,
  Award,
} from "lucide-react"

const heroBackgrounds = ["/images/jay1.jpg", "/images/jay2.jpg", "/images/jay3.jpg"]

const stats = [
  { label: "Customers Served", value: 500, suffix: "+", icon: Users },
  { label: "Projects Completed", value: 350, suffix: "+", icon: FolderCheck },
  { label: "States Covered", value: 20, suffix: "+", icon: MapPin },
  { label: "Years Experience", value: 8, suffix: "+", icon: Award },
]

export default function HeroSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % heroBackgrounds.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary">
      {/* Rotating background images */}
      <div className="absolute inset-0 pointer-events-none">
        {heroBackgrounds.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden="true"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary/85 to-secondary/80" />
      </div>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-fade-in" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-fade-in delay-200" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary/5 blur-2xl animate-fade-in delay-300" />
        <div className="absolute top-20 right-1/3 h-3 w-3 rounded-full bg-primary/40 animate-fade-in-up delay-400" />
        <div className="absolute top-1/2 left-[20%] h-2 w-2 rounded-full bg-accent/30 animate-fade-in-up delay-500" />
        <div className="absolute bottom-1/3 right-[16%] h-4 w-4 rounded-full bg-primary/20 animate-fade-in-up delay-500" />

        {/* Geometric decorative elements */}
        <div className="absolute top-1/4 right-16 h-32 w-32 rotate-45 border border-primary/10 rounded-lg hidden lg:block" />
        <div className="absolute bottom-1/3 left-20 h-20 w-20 rotate-12 border border-accent/10 rounded-lg hidden lg:block" />
        <div className="absolute top-1/2 right-1/4 h-16 w-16 -rotate-45 border border-primary/5 rounded hidden lg:block" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight animate-fade-in-up">
            Powering Your World.{" "}
            <span className="gradient-text">
              Connecting You to What Matters.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-slate-300 leading-relaxed animate-fade-in-up delay-100">
            Professional solar installation, Starlink setup, electrical
            solutions and reliable energy services delivered nationwide.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-secondary shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Book a Service
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/20 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
            >
              Get a Free Consultation
            </Link>
          </div>
        </div>

        {/* Image/visual placeholder area */}
        <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-12 xl:right-20 w-80 h-80 rounded-2xl overflow-hidden animate-fade-in delay-300">
          <div className="relative w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary-light border border-white/10 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-white/40 font-medium">J Tech Solar, Starlink & CCTV Hub Solutions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 w-full animate-fade-in-up delay-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 md:gap-4">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                    {stat.suffix}
                  </p>
                  <p className="text-xs md:text-sm text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
