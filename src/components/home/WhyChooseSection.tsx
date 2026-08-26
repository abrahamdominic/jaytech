import {
  ShieldCheck,
  MapPinned,
  Clock,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Headphones,
  Heart,
} from "lucide-react"

interface FeatureCard {
  title: string
  description: string
  icon: typeof ShieldCheck
}

const defaultFeatures: FeatureCard[] = [
  {
    title: "Professional Technicians",
    description: "Certified and experienced technicians who deliver high-quality work every time.",
    icon: ShieldCheck,
  },
  {
    title: "Nationwide Service",
    description: "We operate across all 36 states in Nigeria, bringing our services to your doorstep.",
    icon: MapPinned,
  },
  {
    title: "Fast Response",
    description: "Quick response times with same-day consultations and flexible scheduling.",
    icon: Clock,
  },
  {
    title: "Quality Equipment",
    description: "We use only premium-grade solar panels, inverters, and electrical components.",
    icon: BadgeCheck,
  },
  {
    title: "Transparent Pricing",
    description: "No hidden fees. Get detailed quotes upfront so you know exactly what you're paying for.",
    icon: Banknote,
  },
  {
    title: "Reliable Installations",
    description: "Built to last with industry-standard practices and thorough quality checks.",
    icon: CheckCircle2,
  },
  {
    title: "After-Sales Support",
    description: "Ongoing maintenance and support long after your installation is complete.",
    icon: Headphones,
  },
  {
    title: "Customer-Focused Service",
    description: "Your satisfaction is our priority. We listen, customize, and deliver beyond expectations.",
    icon: Heart,
  },
]

interface WhyChooseSectionProps {
  features?: FeatureCard[]
}

export default function WhyChooseSection({ features = defaultFeatures }: WhyChooseSectionProps) {
  return (
    <section className="bg-surface-dim py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Why JayTech
          </p>
          <h2 className="mt-2 text-3xl font-bold text-secondary sm:text-4xl lg:text-5xl">
            Why Choose JayTech
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            We combine expertise, quality materials, and unmatched customer service to deliver results that last.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-white p-6 shadow-sm border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary">
                <feature.icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold text-secondary">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
