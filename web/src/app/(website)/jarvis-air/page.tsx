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
import JarvisAirClient from "./jarvis-air-client";

/**
 * Generate SEO metadata for JARVIS Air page
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();

  return generateProductPageSEO(
    "air",
    m.jarvis_air_meta_title(),
    m.jarvis_air_meta_description(),
    locale
  );
}

export default async function JarvisAirPage() {
  const locale = languageTag();
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const productsPath = buildHref("/services-products", locale);
  const productPath = buildHref("/jarvis-air", locale);

  const softwareSchema = createSoftwareApplicationSchema({
    name: "JARVIS Air",
    description:
      "Generative design copilot for master plans, landscapes, and interiors with sub-60 second traffic and solar simulations.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web-based, Cloud",
    softwareVersion: "3.9",
    provider: {
      name: "isBIM Technologies",
      url: siteUrl,
    },
    featureList: [
      "Nation-scale generative master planning",
      "Traffic, solar, and carbon simulations in under 60 seconds",
      "Context-aware landscape and public realm with native planting",
      "Production-ready interiors with 360° VR tours and BOQ-linked specs",
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
    { name: "JARVIS Air", url: `${siteUrl}${productPath}` },
  ]);

  return (
    <>
      {/* SEO Structured Data */}
      <JsonLd data={softwareSchema} id="jarvis-air-software-schema" />
      <JsonLd data={breadcrumbSchema} id="jarvis-air-breadcrumb-schema" />

      {/* Client Component - All m.*() translations executed client-side */}
      <JarvisAirClient />
    </>
  );
}
