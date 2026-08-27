"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import MobileNav from "./MobileNav";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof Zap;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Zap },
  { label: "Services", href: "/services", icon: Zap },
  { label: "Projects", href: "/projects", icon: Zap },
  { label: "Blog", href: "/blog", icon: Zap },
  { label: "Contact", href: "/contact", icon: Phone },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
          isScrolled
            ? "bg-white/90 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <Container>
          <div className="flex h-18 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary p-1 shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
                <img
                  src="/images/jay.png"
                  alt="J Tech Solar, Starlink & CCTV Hub"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-secondary leading-none">
                  J Tech Solar
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted leading-none mt-0.5">
                  Starlink &amp; CCTV Hub
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary-dark bg-primary/10"
                        : "text-secondary hover:text-primary-dark hover:bg-primary/5"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:+2347043541420"
                className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+234 704 354 1420</span>
              </a>
              <Button size="default" asChild>
                <Link href="/booking">Book a Service</Link>
              </Button>
            </div>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-dim text-secondary transition-colors hover:bg-secondary hover:text-white lg:hidden cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </header>

      <MobileNav
        isOpen={isMobileOpen}
        onClose={closeMobile}
        navItems={navItems}
      />

      <div className="h-18" />
    </>
  );
}
