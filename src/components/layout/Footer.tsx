import Link from "next/link";
import {
  Zap,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react";
import Container from "@/components/ui/Container";

const services = [
  { label: "Solar Installation", href: "/services/solar-installation" },
  { label: "Starlink Setup", href: "/services/starlink" },
  { label: "Electrical Services", href: "/services/electrical" },
  { label: "Inverter Systems", href: "/services/inverter" },
  { label: "Repairs & Maintenance", href: "/services/repairs" },
  { label: "Smart Gadgets", href: "/services/gadgets" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/jaytechng",
    path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/jaytechng",
    path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/jaytechng",
    path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 3h11A3.5 3.5 0 0121 6.5v11a3.5 3.5 0 01-3.5 3.5h-11A3.5 3.5 0 013 17.5v-11A3.5 3.5 0 016.5 3z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/jaytechng",
    path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@jaytechng",
    path: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@jaytechng",
    path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.21a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-2-.78V6.69h2z",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      <div className="pt-16 pb-8">
        <Container>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 group mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-secondary font-black text-lg shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
                  J
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white leading-none">
                    <span className="text-primary">Jay</span>Tech
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white/50 leading-none mt-0.5">
                    Solar &amp; Tech
                  </span>
                </div>
              </Link>
              <p className="text-sm leading-relaxed text-white/60 max-w-xs mb-6">
                Nigeria&apos;s trusted partner for solar energy installations, Starlink internet
                setup, electrical repairs, and smart home solutions. Powering homes and businesses
                across Nigeria.
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-primary hover:text-secondary"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/90">
                Services
              </h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-primary"
                    >
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" />
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/90">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-primary"
                    >
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/90">
                Get in Touch
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="tel:+2347043541420"
                    className="group flex items-start gap-3 text-sm text-white/60 transition-colors hover:text-primary"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      +234 704 354 1420
                      <br />
                      <span className="text-white/40">Mon – Sat, 8am – 6pm</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/2347043541420"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-sm text-white/60 transition-colors hover:text-primary"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>
                      WhatsApp Us
                      <br />
                      <span className="text-white/40">Quick response guaranteed</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@jaytech.ng"
                    className="group flex items-start gap-3 text-sm text-white/60 transition-colors hover:text-primary"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>info@jaytech.ng</span>
                  </a>
                </li>
                <li>
                  <div className="group flex items-start gap-3 text-sm text-white/60">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      Lagos, Nigeria
                      <br />
                      <span className="text-white/40">Serving all 36 states + FCT</span>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      <div className="border-t border-white/10">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="text-xs text-white/40">
              &copy; {currentYear} JayTech. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-white/40">
              <span>Powered by</span>
              <Zap className="h-3 w-3 text-primary" />
              <span className="font-medium text-white/60">JayTech</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
