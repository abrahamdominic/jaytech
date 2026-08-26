"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

const defaultFAQs: FAQItem[] = [
  {
    question: "How long does a solar installation take?",
    answer: "A typical residential solar installation takes 1-3 days depending on the system size and complexity. Commercial installations may take 1-2 weeks. We'll provide a detailed timeline during your consultation.",
  },
  {
    question: "How fast is Starlink internet in Nigeria?",
    answer: "Starlink delivers speeds of 50-200 Mbps in most areas across Nigeria, which is significantly faster than most traditional ISPs. Actual speeds may vary based on location, weather, and network congestion.",
  },
  {
    question: "Do you offer payment plans?",
    answer: "Yes! We offer flexible payment options including installment plans for larger projects. You can split your payment into manageable portions. Contact us to discuss the best plan for your budget.",
  },
  {
    question: "What areas do you serve?",
    answer: "We operate across all 36 states in Nigeria including the FCT Abuja. Our technicians are available nationwide, and we can schedule installations in both urban and rural areas.",
  },
  {
    question: "What warranty do you provide?",
    answer: "We provide a 5-year warranty on all solar panel installations, 2-year warranty on inverters and batteries, and a 1-year warranty on electrical work. Starlink installations come with a 1-year service guarantee.",
  },
  {
    question: "How do I book a service?",
    answer: "You can book through our website by clicking 'Book a Service', call us directly, send us a WhatsApp message, or fill out our contact form. We'll get back to you within 2 hours during business hours.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, debit/credit cards via Paystack, and cash payments. All online payments are secured and you'll receive an invoice and receipt for every transaction.",
  },
  {
    question: "Do you provide after-sales support?",
    answer: "Absolutely! We offer ongoing maintenance, monitoring, and repair services after installation. Our support team is available via phone, WhatsApp, and email. We also offer annual maintenance packages.",
  },
]

interface FAQSectionProps {
  faqs?: FAQItem[]
}

export default function FAQSection({ faqs = defaultFAQs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-bold text-secondary sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking
            for, feel free to contact us.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={faq.question}
                className={cn(
                  "rounded-xl border transition-all duration-300",
                  isOpen
                    ? "border-primary/30 bg-primary/5 shadow-sm"
                    : "border-border bg-white hover:border-primary/20"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-secondary">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 flex-shrink-0 text-muted transition-transform duration-300",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
