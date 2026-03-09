import type { Metadata } from "next";
import { headers } from "next/headers";
import { generateCaseStudiesPageSEO } from "@/lib/seo-generators";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";
import CaseStudiesPageClient from "./case-studies-page-client";
import {
  isAvailableLanguageTag,
  sourceLanguageTag,
  type AvailableLanguageTag,
} from "@/paraglide/runtime";
import { getSiteUrl } from "@/lib/env";
import { buildHref } from "@/lib/i18n/route-builder";
import * as m from "@/paraglide/messages";
import {
  getCaseStudies,
  getCaseStudyCategories,
  getFeaturedCaseStudy,
  type CmsCaseStudyItem,
  type CmsCategory,
} from "@/strapi/lib";

export const revalidate = 0; // Disable ISR: always fetch fresh data
export const dynamic = "force-dynamic";

type MessageFn = (params?: Record<string, never>, options?: { languageTag?: AvailableLanguageTag }) => string;

/**
 * Case Studies Page Metadata
 *
 * Enhanced SEO emphasizing:
 * - isBIM brand and company updates
 * - Construction technology case studies
 * - Hong Kong location
 * - AI and construction tech innovation
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  return generateCaseStudiesPageSEO(locale);
}

/**
 * Case Studies Page (Server Component)
 *
 * Architecture: Server Component + Sanity CMS + ISR
 * - Fetches case study data from Sanity with cache tags
 * - Passes data to client components for interactivity
 * - Uses ISR for optimal performance
 */
export default async function CaseStudiesPage() {
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  const t = (fn: MessageFn) => fn({}, { languageTag: locale });

  // Fetch data from Strapi CMS
  const [caseStudies, categories, featuredCaseStudy] = await Promise.all([
    getCaseStudies(12),
    getCaseStudyCategories(),
    getFeaturedCaseStudy(),
  ]).catch(() => {
    // Fallback to empty data if Strapi fetch fails
    return [[], [], null] as [CmsCaseStudyItem[], CmsCategory[], CmsCaseStudyItem | null];
  });

  // Breadcrumb Schema for navigation
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const caseStudiesPath = buildHref("/case-studies", locale);
  const homeLabel = t(m.breadcrumb_home);
  const caseStudiesLabel = t(m.menu_nav_case_studies);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: homeLabel, url: `${siteUrl}${homePath}` },
    { name: caseStudiesLabel, url: `${siteUrl}${caseStudiesPath}` },
  ]);

  return (
    <>
      {/* SEO: Structured Data */}
      <JsonLd data={breadcrumbSchema} id="case-studies-breadcrumb" />

      {/* Main case studies content - using client component matching prototype */}
      <main className="case-studies-page min-h-screen">
        {/* Client component handles all display, routing and interactivity */}
        <CaseStudiesPageClient
          initialCaseStudies={caseStudies}
          categories={categories}
          featuredCaseStudy={featuredCaseStudy}
        />
      </main>
    </>
  );
}
