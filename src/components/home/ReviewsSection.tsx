"use client"

import { Star, Quote } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

interface ReviewCard {
  name: string
  rating: number
  review: string
  service_used: string
  created_at: string
  image_url?: string
}

const defaultReviews: ReviewCard[] = [
  {
    name: "Adewale Johnson",
    rating: 5,
    review: "J Tech Solar, Starlink & CCTV Hub did an amazing job installing our solar panels. The team was professional, punctual, and the system has been running flawlessly for 6 months. Our electricity bills dropped by 80%! Highly recommended.",
    service_used: "Solar Installation",
    created_at: "2025-11-15",
  },
  {
    name: "Chioma Okonkwo",
    rating: 5,
    review: "We struggled with poor internet for years until J Tech Solar, Starlink & CCTV Hub set up our Starlink. The installation was quick and the speed is incredible. My kids can finally attend online classes without interruptions.",
    service_used: "Starlink Installation",
    created_at: "2025-10-22",
  },
  {
    name: "Emeka Nwankwo",
    rating: 4,
    review: "Excellent electrical wiring for our new office building. The team was thorough and followed all safety standards. The project was completed on time and within budget. Will definitely use them again.",
    service_used: "Electrical Services",
    created_at: "2025-09-10",
  },
  {
    name: "Fatima Abubakar",
    rating: 5,
    review: "Fast response time! Our inverter stopped working and J Tech Solar, Starlink & CCTV Hub had a technician at our door within 3 hours. The repair was done on the spot and everything has been working perfectly since.",
    service_used: "Repairs & Maintenance",
    created_at: "2025-12-01",
  },
  {
    name: "Oluwaseun Adeyemi",
    rating: 5,
    review: "The consultation was incredibly helpful. J Tech Solar, Starlink & CCTV Hub's team assessed our energy needs and designed a custom solar solution that fit our budget perfectly. We're saving so much on electricity now.",
    service_used: "Consultation",
    created_at: "2026-01-05",
  },
]

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

interface ReviewsSectionProps {
  reviews?: ReviewCard[]
}

export default function ReviewsSection({ reviews = defaultReviews }: ReviewsSectionProps) {
  return (
    <section className="bg-surface-dim py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-bold text-secondary sm:text-4xl lg:text-5xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name + review.created_at}
              className="relative rounded-2xl bg-white p-6 shadow-sm border border-border transition-all duration-300 hover:shadow-lg"
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
                <div className="text-right">
                  <p className="text-xs text-muted">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
