/**
 * Services & Products Page
 *
 * Showcases isBIM's services and AI products with:
 * - Dark cyberpunk aesthetic with emerald accents
 * - Interactive Bento grid layout
 * - Mouse-following spotlight effects
 * - Smooth animations and transitions
 *
 * Note: This page uses its own dark theme that overrides the website layout background.
 * FooterDark is rendered by the page-specific layout (layout.tsx in this directory).
 */

import type { Metadata } from "next";
import { BackgroundLayers } from "@/components/services-products/background-layers";
import { HeroSection } from "@/components/services-products/hero-section";
import { ServicesGrid } from "@/components/services-products/services-grid";
import { CtaSection } from "@/components/services-products/cta-section";
import { generateServicesPageSEO } from "@/lib/seo-generators";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";
import { languageTag } from "@/paraglide/runtime";
import { getSiteUrl } from "@/lib/env";
import { buildHref } from "@/lib/i18n/route-builder";

/**
 * Generate metadata for Services & Products page
 *
 * Enhanced SEO emphasizing:
 * - Comprehensive construction technology solutions
 * - Combination of AI products (JARVIS Suite) and professional services
 * - Hong Kong location and dual identity (AI + Construction tech)
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  return generateServicesPageSEO(locale);
}

export default function ServicesProductsPage() {
  const locale = languageTag();
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const servicesPath = buildHref("/services-products", locale);

  // Breadcrumb Schema for navigation
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}${homePath}` },
    { name: "Services & Products", url: `${siteUrl}${servicesPath}` },
  ]);

  return (
    <main className="services-page selection:bg-[var(--services-accent-muted)] selection:text-[var(--services-selection-text)]">
      {/* SEO: Structured Data */}
      <JsonLd data={breadcrumbSchema} id="services-products-breadcrumb" />

      {/* Background Layers */}
      <BackgroundLayers />

      {/* Hero Section */}
      <HeroSection />

      {/* Bento Grid Section */}
      <ServicesGrid />

      {/* Final CTA Section */}
      <CtaSection />
    </main>
  );
}
