import {
  ClipboardList,
  MessageSquare,
  Calendar,
  CheckCircle,
} from "lucide-react"

interface Step {
  number: number
  title: string
  description: string
  icon: typeof ClipboardList
}

const steps: Step[] = [
  {
    number: 1,
    title: "Choose a Service",
    description: "Browse our range of solar, Starlink, and electrical services to find what you need.",
    icon: ClipboardList,
  },
  {
    number: 2,
    title: "Tell Us What You Need",
    description: "Fill out a quick form or speak with our team about your specific requirements.",
    icon: MessageSquare,
  },
  {
    number: 3,
    title: "Schedule an Appointment",
    description: "Pick a date and time that works for you. We offer flexible scheduling.",
    icon: Calendar,
  },
  {
    number: 4,
    title: "JayTech Handles the Job",
    description: "Our certified technicians arrive on time and deliver quality work.",
    icon: CheckCircle,
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Simple Process
          </p>
          <h2 className="mt-2 text-3xl font-bold text-secondary sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Getting started with JayTech is easy. Just follow these four simple steps.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connection line (desktop) */}
          <div className="absolute top-12 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 lg:block" />

          <div className="grid gap-12 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Numbered circle */}
                <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-dim border-4 border-primary/20">
                  <step.icon className="h-10 w-10 text-primary" />
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/30">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-secondary">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
