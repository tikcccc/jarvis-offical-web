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
import JarvisSsssClient from "./jarvis-ssss-client";

/**
 * Generate SEO metadata for JARVIS SSSS page
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();

  return generateProductPageSEO(
    "ssss",
    m.jarvis_ssss_meta_title(),
    m.jarvis_ssss_meta_description(),
    locale
  );
}

export default async function JarvisSsssPage() {
  const locale = languageTag();
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const productsPath = buildHref("/services-products", locale);
  const productPath = buildHref("/jarvis-ssss", locale);

  const softwareSchema = createSoftwareApplicationSchema({
    name: "JARVIS SSSS",
    description:
      "AI-orchestrated site safety: wearables, cameras, instant alerts—mandated compliance, zero accidents.",
    applicationCategory: "SafetyManagementApplication",
    operatingSystem: "Web-based, Cloud",
    softwareVersion: "3.9",
    provider: {
      name: "isBIM Technologies",
      url: siteUrl,
    },
    featureList: [
      "DEVB Technical Circular No. 3/2023 compliance",
      "10-module AI safety framework",
      "Real-time IoT safety alerts and dashboards",
      "Zero-accident, proactive safety intelligence",
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
    { name: "JARVIS SSSS", url: `${siteUrl}${productPath}` },
  ]);

  return (
    <>
      {/* SEO Structured Data */}
      <JsonLd data={softwareSchema} id="jarvis-ssss-software-schema" />
      <JsonLd data={breadcrumbSchema} id="jarvis-ssss-breadcrumb-schema" />

      {/* Client Component - All m.*() translations executed client-side */}
      <JarvisSsssClient />
    </>
  );
}
