import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How J Tech Solar, Starlink & CCTV Hub collects, uses, stores, and protects your personal information when you use our solar, Starlink, and electrical services.",
}

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you use our services, including:
• Personal identification information: name, email address, phone number, WhatsApp number, and physical address.
• Service-related information: details about your energy needs, property information, project specifications, and booking preferences.
• Payment information: transaction details processed through our secure payment partner (Paystack). We do not store your card details on our servers.
• Communication data: messages, inquiries, and feedback you send through our website, email, WhatsApp, or phone.
• Technical information: IP address, browser type, device information, and usage data when you visit our website.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:
• Provide, maintain, and improve our services including solar installation, Starlink setup, electrical services, and repairs.
• Process bookings, payments, and send service confirmations and updates.
• Communicate with you about services, appointments, promotions, and respond to your inquiries.
• Send you technical alerts, support messages, and security updates.
• Personalize your experience and provide relevant recommendations.
• Comply with legal obligations and enforce our terms of service.
• Improve our website functionality, customer service, and business operations.`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
• With our technicians and service providers who need the information to deliver requested services.
• With payment processors (Paystack) to facilitate secure transactions.
• When required by law, regulation, legal process, or government request.
• To protect the rights, property, or safety of J Tech Solar, Starlink & CCTV Hub, our customers, or others.
• With your explicit consent for any other purpose.`,
  },
  {
    title: "4. Data Security",
    content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
• Encryption of sensitive data during transmission using SSL/TLS technology.
• Secure payment processing through PCI-DSS compliant partners (Paystack).
• Regular security assessments and updates to our systems.
• Access controls limiting who can view personal information.
While we strive to protect your information, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy. We retain booking and transaction records for a minimum of 6 years as required by Nigerian law. When your information is no longer needed, we will securely delete or anonymize it. You may request deletion of your personal data at any time, subject to legal retention requirements.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to:
• Access the personal information we hold about you.
• Request correction of inaccurate or incomplete information.
• Request deletion of your personal data, subject to legal requirements.
• Opt out of marketing communications at any time by clicking the unsubscribe link or contacting us.
• Withdraw consent for data processing where consent was previously given.
• Lodge a complaint with the relevant data protection authority in Nigeria.
To exercise any of these rights, please contact us at info@J Tech Solar, Starlink & CCTV Hub.ng.`,
  },
  {
    title: "7. Cookies and Tracking",
    content: `Our website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us:
• Remember your preferences and settings.
• Analyze website traffic and usage patterns.
• Improve website performance and functionality.
• Provide personalized content and recommendations.
You can control cookies through your browser settings. Disabling cookies may affect certain features of our website.`,
  },
  {
    title: "8. Third-Party Links",
    content: `Our website may contain links to third-party websites, including social media platforms. We are not responsible for the privacy practices or content of these external sites. We encourage you to read the privacy policies of any third-party site you visit.`,
  },
  {
    title: "9. Children's Privacy",
    content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without parental consent, we will take steps to delete that information promptly.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on this page with a revised "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "11. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
Email: info@J Tech Solar, Starlink & CCTV Hub.ng
Phone: +234 704 354 1420
WhatsApp: +234 704 354 1420
Address: Lagos, Nigeria`,
  },
]

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Your privacy matters to us. Learn how we collect, use, and protect your
              personal information.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-primary">Privacy Policy</span>
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
                  <div className="mt-3 text-sm leading-relaxed text-muted whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl bg-surface-dim border border-border p-6">
              <p className="text-sm text-muted">
                For privacy-related inquiries, contact our Data Protection Officer at{" "}
                <a href="mailto:info@J Tech Solar, Starlink & CCTV Hub.ng" className="font-medium text-primary hover:text-primary-dark">
                  info@J Tech Solar, Starlink & CCTV Hub.ng
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
