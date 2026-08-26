"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  ChevronRight,
  Loader2,
} from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  service_type: z.string().min(1, "Please select a service type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

const serviceTypes = [
  "Solar Installation",
  "Starlink Installation",
  "Electrical Services",
  "Repairs & Maintenance",
  "Consultation",
  "Electrical Gadgets",
  "General Inquiry",
]

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+234 704 354 1420",
    href: "tel:+2347043541420",
    description: "Mon - Sat, 8am - 6pm",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@jaytech.ng",
    href: "mailto:info@jaytech.ng",
    description: "We reply within 24 hours",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+234 704 354 1420",
    href: "https://wa.me/2347043541420",
    description: "Quick response guaranteed",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Lagos, Nigeria",
    href: null,
    description: "Serving all 36 states + FCT",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Sat: 8am - 6pm",
    href: null,
    description: "Sunday: Emergency only",
  },
]

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      service_type: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message")
      }

      toast.success("Message sent successfully! We'll get back to you soon.")
      reset()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to send message"
      if (msg.includes("not configured") || msg.includes("503")) {
        toast.error("Service temporarily unavailable. Please call us at +234 704 354 1420.")
      } else {
        toast.error("Failed to send message. Please try again or call us directly.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
              Get in Touch
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Have a question or ready to start your project? Reach out to us and our team
              will respond within 2 hours during business hours.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-primary">Contact</span>
            </div>
          </div>
        </section>

        {/* Form + Sidebar */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Form */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
                  Send Us a Message
                </h2>
                <p className="mt-2 text-muted">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input
                      label="Full Name"
                      placeholder="e.g. John Doe"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="e.g. john@example.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="e.g. 08012345678"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                    <div className="w-full">
                      <label className="mb-1.5 block text-sm font-medium text-secondary">
                        Service Type
                      </label>
                      <select
                        className="flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        {...register("service_type")}
                      >
                        <option value="">Select a service</option>
                        {serviceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.service_type?.message && (
                        <p className="mt-1.5 text-xs text-danger font-medium">
                          {errors.service_type.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Input
                    label="Subject"
                    placeholder="e.g. Solar installation inquiry"
                    error={errors.subject?.message}
                    {...register("subject")}
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell us about your project or inquiry..."
                    rows={5}
                    error={errors.message?.message}
                    {...register("message")}
                  />

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-2xl bg-surface-dim border border-border p-6">
                    <h3 className="text-lg font-bold text-secondary">
                      Contact Information
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      Reach out through any of these channels.
                    </p>
                    <div className="mt-6 space-y-5">
                      {contactInfo.map((item) => (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted">
                              {item.label}
                            </p>
                            {item.href ? (
                              <a
                                href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : undefined}
                                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="mt-0.5 block text-sm font-semibold text-secondary hover:text-primary transition-colors"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p className="mt-0.5 text-sm font-semibold text-secondary">
                                {item.value}
                              </p>
                            )}
                            <p className="text-xs text-muted">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="rounded-2xl overflow-hidden border border-border bg-surface-dim">
                    <div className="relative h-48 bg-gradient-to-br from-secondary via-secondary-light to-secondary">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <MapPin className="h-8 w-8 text-primary/60" />
                        <p className="mt-2 text-xs font-medium text-white/40">
                          Lagos, Nigeria
                        </p>
                        <p className="text-[10px] text-white/30">
                          Serving all 36 states + FCT
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    href="https://wa.me/2347043541420"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-green-600/20 bg-green-600/5 p-5 transition-all hover:bg-green-600/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-secondary">Chat on WhatsApp</p>
                      <p className="text-xs text-muted">Instant response during business hours</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
