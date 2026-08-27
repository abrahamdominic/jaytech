import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "J Tech Solar, Starlink & CCTV Hub — Solar, Starlink & Electrical Services in Nigeria",
    template: "%s | J Tech Solar, Starlink & CCTV Hub",
  },
  description:
    "Nigeria's trusted partner for solar energy installations, Starlink internet setup, electrical repairs, and smart home solutions. Professional. Reliable. Affordable.",
  keywords: [
    "solar installation Nigeria",
    "Starlink Nigeria",
    "electrical services Lagos",
    "solar panels Lagos",
    "inverter installation",
    "J Tech Solar, Starlink & CCTV Hub",
    "solar energy Nigeria",
    "satellite internet Nigeria",
    "electrical repairs",
    "smart home Nigeria",
  ],
  authors: [{ name: "J Tech Solar, Starlink & CCTV Hub" }],
  creator: "J Tech Solar, Starlink & CCTV Hub",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://J Tech Solar, Starlink & CCTV Hub.ng",
    siteName: "J Tech Solar, Starlink & CCTV Hub",
    title: "J Tech Solar, Starlink & CCTV Hub — Solar, Starlink & Electrical Services in Nigeria",
    description:
      "Nigeria's trusted partner for solar energy installations, Starlink internet setup, electrical repairs, and smart home solutions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "J Tech Solar, Starlink & CCTV Hub — Solar, Starlink & Electrical Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "J Tech Solar, Starlink & CCTV Hub — Solar, Starlink & Electrical Services in Nigeria",
    description:
      "Nigeria's trusted partner for solar energy installations, Starlink internet setup, electrical repairs, and smart home solutions.",
    images: ["/og-image.png"],
    creator: "@J Tech Solar, Starlink & CCTV Hubng",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/images/jay.png",
    shortcut: "/images/jay.png",
    apple: "/images/jay.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-screen font-sans antialiased bg-surface text-secondary">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0f172a",
              color: "#fff",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "14px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
