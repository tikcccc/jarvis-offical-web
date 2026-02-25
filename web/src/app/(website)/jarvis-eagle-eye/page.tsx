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
import JarvisEagleEyeClient from "./jarvis-eagle-eye-client";

/**
 * Generate SEO metadata for JARVIS Eagle Eye page
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();

  return generateProductPageSEO(
    "eagleEye",
    m.jarvis_eagle_eye_meta_title(),
    m.jarvis_eagle_eye_meta_description(),
    locale
  );
}

export default async function JarvisEagleEyePage() {
  const locale = languageTag();
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const productsPath = buildHref("/services-products", locale);
  const productPath = buildHref("/jarvis-eagle-eye", locale);

  const softwareSchema = createSoftwareApplicationSchema({
    name: "JARVIS Eagle Eye",
    description:
      "All-in-one digital twin for construction—capture, map, and monitor sites with 360° precision, no site visits required.",
    applicationCategory: "ConstructionMonitoringApplication",
    operatingSystem: "Web-based, Cloud",
    softwareVersion: "3.9",
    provider: {
      name: "isBIM Technologies",
      url: siteUrl,
    },
    featureList: [
      "360° site capture and BIM mapping",
      "AI shooting plans and remote progress tracking",
      "IoT anomaly detection and compliance monitoring",
      "Executive dashboards and stakeholder collaboration",
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
    { name: "JARVIS Eagle Eye", url: `${siteUrl}${productPath}` },
  ]);

  return (
    <>
      {/* SEO Structured Data */}
      <JsonLd data={softwareSchema} id="jarvis-eagle-eye-software-schema" />
      <JsonLd data={breadcrumbSchema} id="jarvis-eagle-eye-breadcrumb-schema" />

      {/* Client Component - All m.*() translations executed client-side */}
      <JarvisEagleEyeClient />
    </>
  );
}
