/**
 * JsonLd Component
 *
 * Purpose:
 * - Server component for injecting JSON-LD structured data
 * - Helps search engines understand page content semantically
 * - Improves SEO with rich snippets in search results
 * - Supports Schema.org types (Organization, Product, Article, etc.)
 *
 * Usage:
 * ```tsx
 * import { JsonLd } from "@/components/seo/json-ld";
 *
 * // In layout or page
 * <JsonLd data={{
 *   "@context": "https://schema.org",
 *   "@type": "Organization",
 *   "name": "isBIM",
 *   "url": "https://www.isbim.com.hk"
 * }} />
 * ```
 *
 * SEO Impact:
 * - Enables rich snippets in Google/Baidu search results
 * - Helps with Knowledge Graph inclusion
 * - Required for certain SERP features (breadcrumbs, FAQ, etc.)
 * - Critical for e-commerce product listings
 */

import Script from "next/script";

export interface JsonLdProps {
  /** Schema.org structured data object */
  data: Record<string, unknown>;
  /** Optional script ID for debugging */
  id?: string;
}

/**
 * JsonLd Server Component
 *
 * Renders JSON-LD structured data for search engines
 *
 * @param data - Schema.org compliant object
 * @param id - Optional ID for the script tag
 *
 * @example Organization Schema
 * ```tsx
 * <JsonLd data={{
 *   "@context": "https://schema.org",
 *   "@type": "Organization",
 *   "name": "isBIM",
 *   "url": "https://www.isbim.com.hk",
 *   "logo": "https://www.isbim.com.hk/logo.png",
 *   "sameAs": [
 *     "https://www.linkedin.com/company/isbim",
 *     "https://www.facebook.com/isbim"
 *   ]
 * }} />
 * ```
 *
 * @example Product Schema
 * ```tsx
 * <JsonLd data={{
 *   "@context": "https://schema.org",
 *   "@type": "Product",
 *   "name": "JARVIS Agent",
 *   "description": "AI-powered construction management",
 *   "brand": {
 *     "@type": "Brand",
 *     "name": "isBIM"
 *   },
 *   "offers": {
 *     "@type": "Offer",
 *     "url": "https://www.isbim.com.hk/jarvis-agent",
 *     "priceCurrency": "HKD",
 *     "price": "Contact for pricing",
 *     "availability": "https://schema.org/InStock"
 *   }
 * }} />
 * ```
 *
 * @example Article Schema
 * ```tsx
 * <JsonLd data={{
 *   "@context": "https://schema.org",
 *   "@type": "Article",
 *   "headline": "The Future of Construction AI",
 *   "datePublished": "2025-01-15",
 *   "author": {
 *     "@type": "Organization",
 *     "name": "isBIM"
 *   }
 * }} />
 * ```
 */
export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <Script
      id={id || "json-ld"}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, process.env.NODE_ENV === "development" ? 2 : 0),
      }}
      strategy="afterInteractive"
    />
  );
}

/**
 * Pre-built JSON-LD schemas for common use cases
 */

/**
 * Organization Schema Helper
 */
export interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    email?: string;
    telephone?: string;
    contactType?: string;
  };
}

export function createOrganizationSchema(props: OrganizationSchemaProps) {
  const { name, url, logo, description, sameAs, contactPoint } = props;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
    ...(contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        ...(contactPoint.email && { email: contactPoint.email }),
        ...(contactPoint.telephone && { telephone: contactPoint.telephone }),
        ...(contactPoint.contactType && { contactType: contactPoint.contactType }),
      },
    }),
  };
}

/**
 * Product Schema Helper
 */
export interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  url?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
  };
}

export function createProductSchema(props: ProductSchemaProps) {
  const { name, description, image, brand, url, offers } = props;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    ...(image && { image }),
    ...(url && { url }),
    ...(brand && {
      brand: {
        "@type": "Brand",
        name: brand,
      },
    }),
    ...(offers && {
      offers: {
        "@type": "Offer",
        ...(offers.url && { url: offers.url }),
        ...(offers.price && { price: offers.price }),
        ...(offers.priceCurrency && { priceCurrency: offers.priceCurrency }),
        ...(offers.availability && { availability: offers.availability }),
      },
    }),
  };
}

/**
 * JobPosting Schema Helper
 */
export interface JobPostingSchemaProps {
  title: string;
  description: string;
  datePosted: string;
  employmentType?: string;
  hiringOrganization: {
    name: string;
    url: string;
    logo?: string;
  };
  jobLocation?: {
    city?: string;
    country?: string;
    address?: string;
  };
  baseSalary?: {
    currency: string;
    value: number;
    unitText?: string;
  };
}

export function createJobPostingSchema(props: JobPostingSchemaProps) {
  const {
    title,
    description,
    datePosted,
    employmentType,
    hiringOrganization,
    jobLocation,
    baseSalary,
  } = props;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted,
    ...(employmentType && { employmentType }),
    hiringOrganization: {
      "@type": "Organization",
      name: hiringOrganization.name,
      sameAs: hiringOrganization.url,
      ...(hiringOrganization.logo && { logo: hiringOrganization.logo }),
    },
    ...(jobLocation && {
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          ...(jobLocation.city && { addressLocality: jobLocation.city }),
          ...(jobLocation.country && { addressCountry: jobLocation.country }),
          ...(jobLocation.address && { streetAddress: jobLocation.address }),
        },
      },
    }),
    ...(baseSalary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: baseSalary.currency,
        value: {
          "@type": "QuantitativeValue",
          value: baseSalary.value,
          ...(baseSalary.unitText && { unitText: baseSalary.unitText }),
        },
      },
    }),
  };
}

/**
 * Breadcrumb Schema Helper
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * SoftwareApplication Schema Helper
 *
 * For JARVIS AI products - better semantic understanding than Product schema
 * Emphasizes software/AI nature of the platform
 */
export interface SoftwareApplicationSchemaProps {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  softwareVersion?: string;
  provider?: {
    name: string;
    url: string;
  };
  screenshot?: string;
  featureList?: string[];
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
  };
}

export function createSoftwareApplicationSchema(
  props: SoftwareApplicationSchemaProps
) {
  const {
    name,
    description,
    applicationCategory,
    operatingSystem = "Web-based, Cloud",
    softwareVersion = "3.7",
    provider,
    screenshot,
    featureList,
    offers,
    aggregateRating,
  } = props;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory,
    operatingSystem,
    softwareVersion,
    ...(provider && {
      provider: {
        "@type": "Organization",
        name: provider.name,
        url: provider.url,
      },
    }),
    ...(screenshot && { screenshot }),
    ...(featureList &&
      featureList.length > 0 && { featureList: featureList.join(", ") }),
    ...(offers && {
      offers: {
        "@type": "Offer",
        ...(offers.url && { url: offers.url }),
        ...(offers.price && { price: offers.price }),
        ...(offers.priceCurrency && { priceCurrency: offers.priceCurrency }),
        ...(offers.availability && { availability: offers.availability }),
      },
    }),
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        ratingCount: aggregateRating.ratingCount,
      },
    }),
  };
}
