import { Metadata } from "next";
import {
  JsonLd,
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
} from "@/components/seo/json-ld";
import { generateProductPageSEO } from "@/lib/seo-generators";
import { getSiteUrl } from "@/lib/env";
import { buildHref } from "@/lib/i18n/route-builder";
import { languageTag } from "@/paraglide/runtime";
import * as m from "@/paraglide/messages";
import AgentClient from "./agent-client";

/**
 * Generate SEO metadata for JARVIS Agent page
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();

  return generateProductPageSEO(
    "agent",
    m.jarvis_agent_meta_title(),
    m.jarvis_agent_meta_description(),
    locale
  );
}

export default async function JarvisAgentPage() {
  const locale = languageTag();
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const productsPath = buildHref("/services-products", locale);
  const productPath = buildHref("/jarvis-agent", locale);

  const softwareSchema = createSoftwareApplicationSchema({
    name: "JARVIS Agent",
    description:
      "Agentic execution platform for construction teams to automate email workflows, compliance operations, and tendering coordination.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web-based, Cloud",
    softwareVersion: "3.7",
    provider: {
      name: "isBIM Technologies",
      url: siteUrl,
    },
    featureList: [
      "Thread-aware email responses",
      "Compliance-grounded answers",
      "Tender scoring matrix automation",
      "Workflow routing and approvals",
      "Audit-ready operation logs",
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
    { name: "Products", url: `${siteUrl}${productsPath}` },
    { name: "JARVIS Agent", url: `${siteUrl}${productPath}` },
  ]);

  return (
    <>
      <JsonLd data={softwareSchema} id="jarvis-agent-software-schema" />
      <JsonLd data={breadcrumbSchema} id="jarvis-agent-breadcrumb-schema" />
      <AgentClient />
    </>
  );
}
