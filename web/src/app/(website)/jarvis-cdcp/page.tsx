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
import JarvisCdcpClient from "./jarvis-cdcp-client";

/**
 * Generate SEO metadata for JARVIS CDCP page
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();

  return generateProductPageSEO(
    "cdcp",
    m.jarvis_cdcp_meta_title(),
    m.jarvis_cdcp_meta_description(),
    locale
  );
}

export default async function JarvisCdcpPage() {
  const locale = languageTag();
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const productsPath = buildHref("/services-products", locale);
  const productPath = buildHref("/jarvis-cdcp", locale);

  const softwareSchema = createSoftwareApplicationSchema({
    name: "JARVIS CDCP",
    description:
      "Single source of truth for project data—end version chaos, unify teams, accelerate delivery.",
    applicationCategory: "CommonDataEnvironment",
    operatingSystem: "Web-based, Cloud",
    softwareVersion: "3.9",
    provider: {
      name: "isBIM Technologies",
      url: siteUrl,
    },
    featureList: [
      "Single source of truth for drawings, specs, and RFIs",
      "BIM-native access across Revit, IFC, and 100+ formats",
      "Active-active mirroring with 99.99% uptime",
      "Ecosystem sync across JARVIS products",
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
    { name: "JARVIS CDCP", url: `${siteUrl}${productPath}` },
  ]);

  return (
    <>
      {/* SEO Structured Data */}
      <JsonLd data={softwareSchema} id="jarvis-cdcp-software-schema" />
      <JsonLd data={breadcrumbSchema} id="jarvis-cdcp-breadcrumb-schema" />

      {/* Client Component - All m.*() translations executed client-side */}
      <JarvisCdcpClient />
    </>
  );
}
