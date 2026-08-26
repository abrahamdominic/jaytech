import type { Metadata } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://jaytech.ng"

interface GenerateMetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
}

export function generateMetadata({
  title,
  description,
  path = "",
  image = "/og-image.png",
  type = "website",
  publishedTime,
  modifiedTime,
}: GenerateMetadataOptions): Metadata {
  const url = `${BASE_URL}${path}`
  const fullTitle = title.includes("JayTech") ? title : `${title} | JayTech`

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "JayTech",
      locale: "en_NG",
      type,
      images: [
        {
          url: image.startsWith("http") ? image : `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.startsWith("http") ? image : `${BASE_URL}${image}`],
    },
    alternates: {
      canonical: url,
    },
  }
}

interface LocalBusinessSchemaProps {
  name?: string
  description?: string
  url?: string
  telephone?: string
  email?: string
  address?: string
  city?: string
  state?: string
}

export function generateLocalBusinessSchema({
  name = "JayTech",
  description = "Nigeria's trusted partner for solar energy installations, Starlink internet setup, electrical repairs, and smart home solutions.",
  url = BASE_URL,
  telephone = "+2347043541420",
  email = "info@jaytech.ng",
  address = "Lagos, Nigeria",
  city = "Lagos",
  state = "Lagos",
}: LocalBusinessSchemaProps = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    telephone,
    email,
    image: `${BASE_URL}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressRegion: state,
      addressCountry: "NG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.5244,
      longitude: 3.3792,
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://facebook.com/jaytechng",
      "https://twitter.com/jaytechng",
      "https://instagram.com/jaytechng",
      "https://linkedin.com/company/jaytechng",
      "https://youtube.com/@jaytechng",
    ],
  }
}

interface ServiceSchemaProps {
  name: string
  description: string
  url?: string
  price?: number | null
  image?: string
}

export function generateServiceSchema({
  name,
  description,
  url,
  price = null,
  image,
}: ServiceSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: url || `${BASE_URL}/services`,
    provider: {
      "@type": "LocalBusiness",
      name: "JayTech",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    ...(image && { image }),
    ...(price !== null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "NGN",
        price: price.toString(),
        availability: "https://schema.org/InStock",
      },
    }),
  }
}

interface FAQSchemaProps {
  items: { question: string; answer: string }[]
}

export function generateFAQSchema({ items }: FAQSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

interface BlogPostingSchemaProps {
  title: string
  description: string
  url: string
  image?: string
  author?: string
  datePublished: string
  dateModified?: string
}

export function generateBlogPostingSchema({
  title,
  description,
  url,
  image,
  author = "JayTech Team",
  datePublished,
  dateModified,
}: BlogPostingSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "JayTech",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/favicon.ico`,
      },
    },
    datePublished,
    ...(dateModified && { dateModified }),
    ...(image && { image }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
}
