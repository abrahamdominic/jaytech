import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions governing the use of JayTech services, website, and platform for solar, Starlink, and electrical services in Nigeria.",
}

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing and using the JayTech website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use our website or services. These terms apply to all visitors, users, and customers of JayTech.`,
  },
  {
    title: "2. Services",
    content: `JayTech provides solar energy installation, Starlink internet setup, electrical services, repairs and maintenance, consultation, and electrical gadgets supply and installation across Nigeria. All services are subject to availability and confirmation by our team. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.`,
  },
  {
    title: "3. Booking and Scheduling",
    content: `When you book a service through our website, phone, WhatsApp, or any other channel, you are requesting our services subject to availability. A booking is not confirmed until you receive a confirmation notification from our team. We will make every effort to accommodate your preferred date and time, but actual scheduling may vary based on demand and location.`,
  },
  {
    title: "4. Pricing and Payment",
    content: `All prices displayed on our website are estimates and may vary based on specific project requirements, location, and equipment choices. Final pricing will be provided after consultation or site assessment. We accept payment via bank transfer, debit/credit cards (processed via Paystack), and cash. Full or partial payment may be required before service commencement as agreed during booking.`,
  },
  {
    title: "5. Cancellation and Refund Policy",
    content: `You may cancel a booked service up to 24 hours before the scheduled appointment at no charge. Cancellations within 24 hours may incur a nominal fee. Refunds for prepayments will be processed within 7-14 business days. If JayTech cancels a service, you will receive a full refund. For completed services, refunds are handled on a case-by-case basis within our warranty terms.`,
  },
  {
    title: "6. Warranty and Guarantees",
    content: `JayTech provides the following warranty coverage: Solar panel installations — 5-year warranty on workmanship; Inverters and batteries — 2-year manufacturer warranty; Electrical work — 1-year warranty on workmanship; Starlink installations — 1-year service guarantee on installation quality. Warranty claims must be submitted through our official channels. Warranty does not cover damage from misuse, natural disasters, unauthorized modifications, or normal wear and tear.`,
  },
  {
    title: "7. Liability Limitations",
    content: `JayTech shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our services. Our total liability for any claim shall not exceed the amount paid for the specific service giving rise to the claim. We are not responsible for delays caused by force majeure events including but not limited to natural disasters, government actions, power outages, or supply chain disruptions.`,
  },
  {
    title: "8. Customer Responsibilities",
    content: `Customers are responsible for providing accurate information during booking and consultation. You must ensure adequate access to the work site on the scheduled date. For solar and electrical installations, you must have proper authorization from property owners. You are responsible for obtaining any necessary permits or approvals from local authorities where required.`,
  },
  {
    title: "9. Intellectual Property",
    content: `All content on the JayTech website including text, graphics, logos, images, software, and other materials are the intellectual property of JayTech and are protected by Nigerian and international copyright laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.`,
  },
  {
    title: "10. Privacy",
    content: `Your use of our website and services is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using our services, you consent to the collection and use of information as described in our Privacy Policy.`,
  },
  {
    title: "11. Governing Law",
    content: `These Terms and Conditions shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Nigeria.`,
  },
  {
    title: "12. Changes to Terms",
    content: `JayTech reserves the right to update or modify these Terms and Conditions at any time without prior notice. Changes will be effective immediately upon posting on this page. We encourage you to review this page periodically for any updates. Your continued use of our services after any changes constitutes acceptance of the new terms.`,
  },
  {
    title: "13. Contact Information",
    content: `If you have any questions about these Terms and Conditions, please contact us at info@jaytech.ng or call us at +234 704 354 1420. You can also reach us via WhatsApp at +234 704 354 1420.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary-light to-secondary py-20 md:py-28">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Terms and Conditions
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Please read these terms carefully before using our services or website.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-primary">Terms & Conditions</span>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted mb-10">
              Last updated: January 1, 2025
            </p>

            <div className="space-y-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-xl font-bold text-secondary">{section.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl bg-surface-dim border border-border p-6">
              <p className="text-sm text-muted">
                If you have any questions about these terms, please contact us at{" "}
                <a href="mailto:info@jaytech.ng" className="font-medium text-primary hover:text-primary-dark">
                  info@jaytech.ng
                </a>{" "}
                or call{" "}
                <a href="tel:+2347043541420" className="font-medium text-primary hover:text-primary-dark">
                  +234 704 354 1420
                </a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
