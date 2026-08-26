import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, MessageCircle } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import BookingForm from "@/components/booking/BookingForm"

export const metadata: Metadata = {
  title: "Book a Service - JayTech",
  description:
    "Book a solar, Starlink, or electrical service with JayTech. Tell us about your project and we'll get back to you within 2 hours.",
  openGraph: {
    title: "Book a Service - JayTech",
    description:
      "Book a solar, Starlink, or electrical service with JayTech. Tell us about your project and we'll get back to you.",
    type: "website",
  },
}

export default function BookingPage() {
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
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Book a Service
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Tell us about your project and we&apos;ll get back to you with a
              personalized plan and quote.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-primary">Book a Service</span>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-surface-dim py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <BookingForm />
          </div>
        </section>

        {/* WhatsApp Quick Contact */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-green-600/20 bg-green-600/5 p-8 sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary">
                    Need Help Booking?
                  </h3>
                  <p className="text-sm text-muted">
                    Chat with us on WhatsApp for instant assistance.
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/2347043541420?text=Hello%20JayTech!%20I%27d%20like%20to%20book%20a%20service."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/30 active:scale-[0.98]"
              >
                Chat on WhatsApp
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
