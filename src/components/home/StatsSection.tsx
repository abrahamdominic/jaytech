"use client"

import { useEffect, useRef, useState } from "react"
import {
  Users,
  FolderCheck,
  MapPin,
  Clock,
  ThumbsUp,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatItem {
  label: string
  value: number
  suffix: string
  icon: LucideIcon
}

const defaultStats: StatItem[] = [
  { label: "Customers Served", value: 500, suffix: "+", icon: Users },
  { label: "Projects Completed", value: 350, suffix: "+", icon: FolderCheck },
  { label: "States Covered", value: 20, suffix: "+", icon: MapPin },
  { label: "Years Experience", value: 8, suffix: "+", icon: Clock },
  { label: "Customer Satisfaction", value: 98, suffix: "%", icon: ThumbsUp },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

interface StatsSectionProps {
  stats?: StatItem[]
}

export default function StatsSection({ stats = defaultStats }: StatsSectionProps) {
  return (
    <section className="bg-surface-dim py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-secondary md:text-4xl">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
