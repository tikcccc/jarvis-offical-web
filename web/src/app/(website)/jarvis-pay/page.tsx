import { Metadata } from "next";
import {
  JsonLd,
  createSoftwareApplicationSchema,
  createBreadcrumbSchema,
} from "@/components/seo/json-ld";
import { generateProductPageSEO } from "@/lib/seo-generators";
import { getSiteUrl } from "@/lib/env";
import { buildHref } from "@/lib/i18n/route-builder";
import { languageTag } from "@/paraglide/runtime";
import * as m from "@/paraglide/messages";
import JarvisPayClient from "./jarvis-pay-client";

/**
 * Generate SEO metadata for JARVIS Pay page
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();

  return generateProductPageSEO(
    "pay",
    m.jarvis_pay_meta_title(),
    m.jarvis_pay_meta_description(),
    locale
  );
}

export default async function JarvisPayPage() {
  const locale = languageTag();
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const productsPath = buildHref("/services-products", locale);
  const productPath = buildHref("/jarvis-pay", locale);

  // SEO Schema Data (static strings to avoid server-side m.*() in content)
  const softwareSchema = createSoftwareApplicationSchema({
    name: "JARVIS Pay",
    description:
      "AI-driven payment and contract management platform for transparent cash flow, compliance, and multi-tier collaboration.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web-based, Cloud",
    softwareVersion: "3.7",
    provider: {
      name: "isBIM Technologies",
      url: siteUrl,
    },
    featureList: [
      "Transparent Payment Tracking",
      "Multi-tier Contract Management",
      "Automated Compliance",
      "Real-time Cash Flow Visibility",
      "AI-powered Risk Assessment",
    ],
    offers: {
      price: "Contact for pricing",
      priceCurrency: "HKD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}${productPath}`,
    },
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}${homePath}` },
    {
      name: "Products",
      url: `${siteUrl}${productsPath}`,
    },
    { name: "JARVIS Pay", url: `${siteUrl}${productPath}` },
  ]);

  return (
    <>
      {/* SEO Structured Data */}
      <JsonLd data={softwareSchema} id="jarvis-pay-software-schema" />
      <JsonLd data={breadcrumbSchema} id="jarvis-pay-breadcrumb-schema" />

      {/* Client Component - All m.*() translations executed client-side */}
      <JarvisPayClient />
    </>
  );
}
