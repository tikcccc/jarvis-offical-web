/**
 * Dynamic Sitemap Generator
 *
 * Purpose:
 * - Generate XML sitemap dynamically from Sanity CMS content
 * - Include static pages and dynamic content (posts, products, news, etc.)
 * - Support multi-language with proper hreflang
 * - Cache with tag-based revalidation
 *
 * Access: /sitemap.xml
 *
 * Features:
 * - Automatic URL generation from Sanity content
 * - Last modified dates for better SEO
 * - Priority and change frequency optimization
 * - Locale-aware URLs (en/zh)
 */

import type { MetadataRoute } from "next";
import {
  getCareerSitemapEntries,
  getCaseStudySitemapEntries,
  getNewsSitemapEntries,
} from "@/strapi/lib";
import { ROUTES } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import { sourceLanguageTag } from "@/paraglide/runtime";

// Last commit timestamps of static page templates.
// Update this map when a static page's content/template changes significantly.
const STATIC_ROUTE_LAST_MODIFIED: Record<string, string> = {
  [ROUTES.HOME]: "2026-03-11T10:23:49+08:00",
  [ROUTES.ABOUT]: "2026-03-11T10:23:49+08:00",
  [ROUTES.SERVICES_PRODUCTS]: "2026-02-25T18:43:26+08:00",
  [ROUTES.CONTACT]: "2026-02-25T18:43:26+08:00",
  [ROUTES.NEWSROOM]: "2026-03-09T14:03:13+08:00",
  [ROUTES.CASE_STUDIES]: "2026-03-09T14:03:13+08:00",
  [ROUTES.CAREERS]: "2026-03-10T16:26:35+08:00",
  "/privacy-cookie-policy": "2026-03-11T12:43:46+08:00",
  "/privacy": "2026-03-11T12:43:46+08:00",
  "/terms": "2026-03-11T12:43:46+08:00",
  "/cookies": "2026-03-11T12:43:46+08:00",
  [ROUTES.JARVIS.AGENT]: "2026-03-11T12:43:46+08:00",
  [ROUTES.JARVIS.PAY]: "2026-02-25T18:43:26+08:00",
  [ROUTES.JARVIS.AIR]: "2026-02-25T18:43:26+08:00",
  [ROUTES.JARVIS.EAGLE_EYE]: "2026-02-25T18:43:26+08:00",
  [ROUTES.JARVIS.SSSS]: "2026-02-25T18:43:26+08:00",
  [ROUTES.JARVIS.DWSS]: "2026-02-25T18:43:26+08:00",
  [ROUTES.JARVIS.CDCP]: "2026-02-25T18:43:26+08:00",
  [ROUTES.JARVIS.ASSETS]: "2026-02-25T18:43:26+08:00",
  [ROUTES.BIM_CONSULTANCY]: "2026-02-25T18:43:26+08:00",
  [ROUTES.PROJECT_FINANCE]: "2026-02-25T18:43:26+08:00",
  [ROUTES.VENTURE_INVESTMENTS]: "2026-02-25T18:43:26+08:00",
};

const DEFAULT_STATIC_LAST_MODIFIED = "2026-03-11T00:00:00+08:00";

function getStaticLastModified(route: string): Date {
  return new Date(STATIC_ROUTE_LAST_MODIFIED[route] || DEFAULT_STATIC_LAST_MODIFIED);
}

function getLatestDynamicLastModified(
  entries: Array<{ _updatedAt: string }>
): Date | null {
  if (entries.length === 0) return null;

  return entries.reduce<Date | null>((latest, entry) => {
    const current = new Date(entry._updatedAt);
    if (Number.isNaN(current.getTime())) return latest;
    if (!latest || current > latest) return current;
    return latest;
  }, null);
}

function getListingLastModified(
  route: string,
  entries: Array<{ _updatedAt: string }>
): Date {
  const templateLastModified = getStaticLastModified(route);
  const latestContentLastModified = getLatestDynamicLastModified(entries);

  if (!latestContentLastModified) {
    return templateLastModified;
  }

  return latestContentLastModified > templateLastModified
    ? latestContentLastModified
    : templateLastModified;
}

/**
 * Generate sitemap with static pages and dynamic Sanity content
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const defaultLocale = sourceLanguageTag;
  const withLocale = (route: string, locale: string) =>
    `${siteUrl}/${locale}${route === "/" ? "" : route}`;

  // Fetch all dynamic content slugs from Strapi
  const [news, caseStudies, careers] = await Promise.all([
    getNewsSitemapEntries().catch(() => []),
    getCaseStudySitemapEntries().catch(() => []),
    getCareerSitemapEntries().catch(() => []),
  ]);

  // Static pages (high priority, frequent changes)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: withLocale(ROUTES.HOME, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.HOME),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          en: withLocale(ROUTES.HOME, "en"),
          zh: withLocale(ROUTES.HOME, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.ABOUT, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.ABOUT),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: withLocale(ROUTES.ABOUT, "en"),
          zh: withLocale(ROUTES.ABOUT, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.SERVICES_PRODUCTS, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.SERVICES_PRODUCTS),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: withLocale(ROUTES.SERVICES_PRODUCTS, "en"),
          zh: withLocale(ROUTES.SERVICES_PRODUCTS, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.NEWSROOM, defaultLocale),
      lastModified: getListingLastModified(ROUTES.NEWSROOM, news),
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: {
          en: withLocale(ROUTES.NEWSROOM, "en"),
          zh: withLocale(ROUTES.NEWSROOM, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.CASE_STUDIES, defaultLocale),
      lastModified: getListingLastModified(ROUTES.CASE_STUDIES, caseStudies),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: withLocale(ROUTES.CASE_STUDIES, "en"),
          zh: withLocale(ROUTES.CASE_STUDIES, "zh"),
        },
      },
    },
    {
      url: withLocale(ROUTES.CAREERS, defaultLocale),
      lastModified: getListingLastModified(ROUTES.CAREERS, careers),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: withLocale(ROUTES.CAREERS, "en"),
          zh: withLocale(ROUTES.CAREERS, "zh"),
        },
      },
    },
    // Note: Contact page included but under redesign (lower priority)
    {
      url: withLocale(ROUTES.CONTACT, defaultLocale),
      lastModified: getStaticLastModified(ROUTES.CONTACT),
      changeFrequency: "monthly",
      priority: 0.5, // Lower priority - page under redesign
      alternates: {
        languages: {
          en: withLocale(ROUTES.CONTACT, "en"),
          zh: withLocale(ROUTES.CONTACT, "zh"),
        },
      },
    },
  ];

  // Legal pages (low priority, rare updates)
  const legalRoutes = [
    "/privacy-cookie-policy",
    "/privacy",
    "/terms",
    "/cookies",
  ];

  const legalPages: MetadataRoute.Sitemap = legalRoutes.map((route) => ({
    url: withLocale(route, defaultLocale),
    lastModified: getStaticLastModified(route),
    changeFrequency: "yearly" as const,
    priority: 0.3,
    alternates: {
      languages: {
        en: withLocale(route, "en"),
        zh: withLocale(route, "zh"),
      },
    },
  }));

  // JARVIS product pages (excluding SUITE - under redesign)
  const jarvisPages: MetadataRoute.Sitemap = Object.values(ROUTES.JARVIS)
    .filter((route) => route !== ROUTES.JARVIS.SUITE) // Exclude /jarvis-ai-suite
    .map((route) => ({
      url: withLocale(route, defaultLocale),
      lastModified: getStaticLastModified(route),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: withLocale(route, "en"),
          zh: withLocale(route, "zh"),
        },
      },
    }));

  // BIM Consultancy, Project Finance, Venture Investments
  const servicePages: MetadataRoute.Sitemap = [
    ROUTES.BIM_CONSULTANCY,
    ROUTES.PROJECT_FINANCE,
    ROUTES.VENTURE_INVESTMENTS,
  ].map((route) => ({
    url: withLocale(route, defaultLocale),
    lastModified: getStaticLastModified(route),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: withLocale(route, "en"),
        zh: withLocale(route, "zh"),
      },
    },
  }));

  // Dynamic Sanity content pages
  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: withLocale(`/newsroom/${item.slug}`, defaultLocale),
    lastModified: new Date(item._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: withLocale(`/newsroom/${item.slug}`, "en"),
        zh: withLocale(`/newsroom/${item.slug}`, "zh"),
      },
    },
  }));

  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((item) => ({
    url: withLocale(`/case-studies/${item.slug}`, defaultLocale),
    lastModified: new Date(item._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: withLocale(`/case-studies/${item.slug}`, "en"),
        zh: withLocale(`/case-studies/${item.slug}`, "zh"),
      },
    },
  }));

  const careerPages: MetadataRoute.Sitemap = careers.map((career) => ({
    url: withLocale(`/careers/${career.slug}`, defaultLocale),
    lastModified: new Date(career._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: withLocale(`/careers/${career.slug}`, "en"),
        zh: withLocale(`/careers/${career.slug}`, "zh"),
      },
    },
  }));

  // Combine all pages
  return [
    ...staticPages,
    ...legalPages,
    ...jarvisPages,
    ...servicePages,
    ...newsPages,
    ...caseStudyPages,
    ...careerPages,
  ];
}
