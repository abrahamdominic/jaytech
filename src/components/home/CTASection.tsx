import Link from "next/link"
import { MessageCircle, ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary py-16 md:py-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Need Reliable Power or Connectivity?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          Whether it&apos;s solar energy, Starlink internet, or electrical services
          &mdash; J Tech Solar, Starlink & CCTV Hub has you covered. Let&apos;s build the solution that fits your needs.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-secondary shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5"
          >
            Book a Service
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-white/20 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
          >
            Talk to J Tech Solar, Starlink & CCTV Hub
          </Link>
          <a
            href="https://wa.me/2347043541420"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition-all duration-300 hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}
