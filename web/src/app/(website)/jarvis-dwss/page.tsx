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
import JarvisDwssClient from "./jarvis-dwss-client";

/**
 * Generate SEO metadata for JARVIS DWSS page
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();

  return generateProductPageSEO(
    "dwss",
    m.jarvis_dwss_meta_title(),
    m.jarvis_dwss_meta_description(),
    locale
  );
}

export default async function JarvisDwssPage() {
  const locale = languageTag();
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const productsPath = buildHref("/services-products", locale);
  const productPath = buildHref("/jarvis-dwss", locale);

  const softwareSchema = createSoftwareApplicationSchema({
    name: "JARVIS DWSS",
    description:
      "Web-based portal for digital submission, review, and approval of construction works—streamline RISC, site diaries, and inspections.",
    applicationCategory: "ConstructionManagementApplication",
    operatingSystem: "Web-based, Cloud",
    softwareVersion: "3.9",
    provider: {
      name: "isBIM Technologies",
      url: siteUrl,
    },
    featureList: [
      "DEVB TC(W) No. 2/2023 compliant digital supervision",
      "Paperless RISC forms and site diaries",
      "AI compliance checks and mobile collaboration",
      "BIM-synced workflows with 70% faster approvals",
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
    { name: "JARVIS DWSS", url: `${siteUrl}${productPath}` },
  ]);

  return (
    <>
      {/* SEO Structured Data */}
      <JsonLd data={softwareSchema} id="jarvis-dwss-software-schema" />
      <JsonLd data={breadcrumbSchema} id="jarvis-dwss-breadcrumb-schema" />

      {/* Client Component - All m.*() translations executed client-side */}
      <JarvisDwssClient />
    </>
  );
}
