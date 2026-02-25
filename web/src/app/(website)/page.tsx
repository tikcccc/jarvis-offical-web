import type { Metadata } from "next";
import { HeroSection1 } from "@/components/sections/hero-section-1";
import { InteractiveCarouselLazy } from "@/components/sections/interactive-carousel-lazy";
import { Section3Placeholder } from "@/components/sections/section3-placeholder";
import { Section4PlatformList } from "@/components/sections/section4-platform-list";
import { Section5CTA } from "@/components/sections/section5-cta";
import { generatePageMetadata } from "@/lib/seo";
import { composeKeywords } from "@/lib/seo-generators";
import { JsonLd, createOrganizationSchema, createSoftwareApplicationSchema } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/env";
import { languageTag } from "@/paraglide/runtime";

/**
 * Generate metadata for home page
 * Enhanced with dual identity (AI + Construction) and Hong Kong emphasis
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  const keywords = composeKeywords("home", [], locale);
  const title = locale === "zh"
    ? "AI 与建筑科技公司 | isBIM 香港"
    : "AI & Construction Technology Company | isBIM Hong Kong";
  const description = locale === "zh"
    ? "isBIM 是香港领先的 AI 科技公司与建筑科技公司，提供 JARVIS AI 套件、BIM 咨询与创新建造解决方案，为全球基础设施项目加速交付。"
    : "isBIM is Hong Kong's leading AI technology company and construction technology company. We deliver JARVIS AI Suite, BIM consultancy, and innovative construction solutions for global infrastructure projects. Combining artificial intelligence with construction industry expertise.";
  const imageAlt = locale === "zh"
    ? "isBIM - 来自香港的 AI 与建筑科技平台"
    : "isBIM - AI and Construction Technology Platform from Hong Kong";

  return generatePageMetadata({
    title,
    description,
    path: "/",
    locale,
    image: "/images/og/home.jpg",
    imageAlt,
    keywords,
  });
}

export default function Home() {
  const siteUrl = getSiteUrl();

  // Organization Schema - isBIM company information
  const organizationSchema = createOrganizationSchema({
    name: "isBIM Limited",
    url: siteUrl,
    logo: `${siteUrl}/icons/isbim_black.svg`,
    description: "Hong Kong's leading AI and construction technology company delivering JARVIS AI Suite and innovative construction solutions for global infrastructure projects.",
    sameAs: [
      "https://www.linkedin.com/company/isbim",
      "https://www.facebook.com/isbim",
      "https://twitter.com/isbim",
    ],
    contactPoint: {
      email: "info@isbim.com.hk",
      telephone: "+852-xxxx-xxxx",
      contactType: "Customer Service",
    },
  });

  // SoftwareApplication Schema - JARVIS AI Suite
  const jarvisSuiteSchema = createSoftwareApplicationSchema({
    name: "JARVIS AI Suite",
    description: "Comprehensive AI-powered construction management platform combining Agent, Pay, Air, Eagle Eye, SSSS, DWSS, CDCP, and Assets modules for end-to-end infrastructure project delivery.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web-based, Cloud",
    softwareVersion: "3.7",
    provider: {
      name: "isBIM Limited",
      url: siteUrl,
    },
    featureList: [
      "AI Invoice Scanning & Document Automation",
      "Payment Certification & SOPL Compliance",
      "Generative Design AI",
      "Site Monitoring & Digital Twin",
      "AI Safety Management",
      "Digital Supervision",
      "BIM Data Collaboration",
      "Facility Management & Predictive Maintenance",
    ],
    offers: {
      url: `${siteUrl}/services-products`,
      price: "Contact for pricing",
      priceCurrency: "HKD",
      availability: "https://schema.org/InStock",
    },
  });

  return (
    <div className="home-page w-full overflow-x-hidden bg-white">
      {/* SEO: Structured Data for Search Engines */}
      <JsonLd data={organizationSchema} id="organization-schema" />
      <JsonLd data={jarvisSuiteSchema} id="jarvis-suite-schema" />

      {/* Section 1: Hero with video background - Full width */}
      <div className="relative w-full">
        <HeroSection1 />
      </div>

      {/* Section 2: Interactive Tab Carousel with animations (full-width wrap) */}
      <div className="relative w-full">
        <InteractiveCarouselLazy />
      </div>

      {/* Full-bleed white wrapper to cover edges beneath the carousel */}
      <div className="relative w-full bg-white">
        <section className="w-full bg-white">
          <div className="container-page">
            <div className="h-16 md:h-24" aria-hidden="true" />
            {/* Section 3: Wide-format narrative text aggregation */}
            <Section3Placeholder />

            {/* Section 4: AI Platforms with video hover animation */}
            <Section4PlatformList />
          </div>
        </section>
      </div>

      {/* Section 5: Call to Action with dual-column layout (full-width gray background) */}
      <Section5CTA imageUrl="/images/cta/cta.png" imageAlt="Call to action" />
    </div>
  );
}
