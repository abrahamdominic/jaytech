import type { Metadata } from "next"
import Link from "next/link"
import {
  Sun,
  Wifi,
  Zap,
  Wrench,
  Shield,
  Eye,
  Heart,
  Users,
  Target,
  Award,
  Lightbulb,
  Handshake,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Container from "@/components/ui/Container"

export const metadata: Metadata = {
  title: "About JayTech - Solar, Starlink & Electrical Services Nigeria",
  description:
    "Learn about JayTech, Nigeria's trusted partner for solar energy installations, Starlink internet setup, and professional electrical services.",
}

const values = [
  {
    icon: Shield,
    title: "Professionalism",
    description:
      "We uphold the highest standards of professional conduct in every project we undertake.",
  },
  {
    icon: CheckCircle,
    title: "Reliability",
    description:
      "Our clients count on us to deliver quality work on time, every time.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We stay ahead of the curve by embracing modern energy solutions and smart technologies.",
  },
  {
    icon: Heart,
    title: "Customer Focus",
    description:
      "Every solution we provide is tailored to meet the unique needs of our clients.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "We maintain open communication and honest pricing with no hidden charges.",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "We use premium materials and follow best practices to ensure lasting results.",
  },
]

const teamMembers = [
  {
    name: "Adebayo Johnson",
    role: "Founder & CEO",
    description:
      "Passionate about bringing reliable energy solutions to every Nigerian home and business.",
  },
  {
    name: "Chioma Okafor",
    role: "Head of Operations",
    description:
      "Ensures every project runs smoothly from consultation to completion.",
  },
  {
    name: "Emeka Nwankwo",
    role: "Lead Engineer",
    description:
      "Over 10 years of experience in solar installations and electrical engineering.",
  },
]

export default function AboutPage() {
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
              About JayTech
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Nigeria&apos;s trusted partner for solar energy, Starlink internet, and
              professional electrical services. Powering homes and businesses
              nationwide.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-primary">About Us</span>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-white py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-secondary sm:text-4xl">
                Our Story
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Founded in Lagos, Nigeria, JayTech began with a simple mission:
                to make reliable energy and connectivity accessible to every
                Nigerian. What started as a small team of passionate engineers
                has grown into one of the country&apos;s leading solar and
                technology companies.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Over the years, we have completed hundreds of solar installations,
                Starlink setups, and electrical projects across all 36 states
                and the FCT. Our commitment to quality workmanship and customer
                satisfaction has earned us the trust of homeowners, businesses,
                and institutions throughout Nigeria.
              </p>
            </div>
          </Container>
        </section>

        {/* Mission & Vision */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-border">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-secondary">
                  Our Mission
                </h3>
                <p className="mt-4 text-muted leading-relaxed">
                  To provide fast, reliable and professional solar, Starlink, and
                  electrical services to homes and businesses across Nigeria.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-border">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-secondary">
                  Our Vision
                </h3>
                <p className="mt-4 text-muted leading-relaxed">
                  To be Nigeria&apos;s most trusted and innovative energy solutions
                  company.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Core Values */}
        <section className="bg-white py-16 md:py-24">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-secondary sm:text-4xl">
                Our Core Values
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted">
                These principles guide every decision we make and every service
                we deliver.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-secondary">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Why Choose Us */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold text-secondary sm:text-4xl">
                  Why Choose JayTech?
                </h2>
                <p className="mt-4 text-muted leading-relaxed">
                  We combine technical expertise with a deep understanding of the
                  Nigerian market to deliver solutions that truly work.
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    "Certified and experienced engineers",
                    "Premium quality solar panels and equipment",
                    "Transparent pricing with no hidden fees",
                    "Nationwide coverage across all 36 states + FCT",
                    "Post-installation support and maintenance",
                    "Fast response times and reliable service",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm font-medium text-secondary">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                    <Sun className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-secondary">500+</p>
                  <p className="text-xs text-muted">Solar Installations</p>
                </div>
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                    <Wifi className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-secondary">200+</p>
                  <p className="text-xs text-muted">Starlink Setups</p>
                </div>
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-secondary">300+</p>
                  <p className="text-xs text-muted">Electrical Projects</p>
                </div>
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-secondary">36+</p>
                  <p className="text-xs text-muted">States Covered</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Team */}
        <section className="bg-white py-16 md:py-24">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-secondary sm:text-4xl">
                Meet Our Team
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted">
                The dedicated professionals behind JayTech&apos;s success.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="group text-center"
                >
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/10 transition-transform group-hover:scale-105">
                    <span className="text-3xl font-bold text-primary">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-secondary">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-primary">
                    {member.role}
                  </p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary py-16 md:py-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready to Power Your World?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Let us help you find the perfect solar, Starlink, or electrical
              solution for your home or business.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-secondary shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5"
              >
                Book a Service
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/20 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
