"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { NavItem } from "./Header";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function MobileNav({ isOpen, onClose, navItems }: MobileNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary p-1">
                <img
                  src="/images/jay.png"
                  alt="J Tech Solar, Starlink & CCTV Hub"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="flex flex-col">
                <span className="text-lg font-bold leading-none">
                  <span className="text-primary">J Tech Solar</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted leading-none mt-0.5">
                  Starlink &amp; CCTV Hub
                </span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-dim text-secondary transition-colors hover:bg-secondary hover:text-white cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-6">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary-dark"
                          : "text-secondary hover:bg-surface-dim"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border px-6 py-6 space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/booking" onClick={onClose}>
                Book a Service
              </Link>
            </Button>
            <a
              href="tel:+2347043541420"
              className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-secondary transition-colors hover:bg-surface-dim"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
