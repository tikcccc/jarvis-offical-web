import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  CASE_STUDY_DETAIL_QUERY,
  CASE_STUDY_METADATA_QUERY,
  CASE_STUDY_LIST_QUERY,
} from "@/sanity/lib/queries";
import CaseDetailClient from "./case-detail-client";
import type { Image as SanityImage } from "sanity";
import type { PortableTextBlock } from "@portabletext/types";
import { getSiteUrl } from "@/lib/env";
import { buildHref } from "@/lib/i18n/route-builder";
import {
  isAvailableLanguageTag,
  sourceLanguageTag,
  type AvailableLanguageTag,
} from "@/paraglide/runtime";
import { generateHreflangAlternates } from "@/lib/seo";
import { urlFor } from "@/sanity/lib/image";
import * as m from "@/paraglide/messages";

export const revalidate = 0; // Always fresh per locale
export const dynamic = "force-dynamic";

type MessageFn = (params?: Record<string, never>, options?: { languageTag?: AvailableLanguageTag }) => string;

// Types for Sanity data
interface CaseStudyItem {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  publishedAt: string;
  excerpt?: string;
  body?: PortableTextBlock[]; // Rich text array
  mainImage?: {
    asset: SanityImage;
    alt: string;
  };
  category: {
    _id: string;
    title: string;
    slug: { current: string };
    color: string;
  };
  tags?: string[];
  author: string;
  readTime: number;
  featured?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: {
      asset: SanityImage;
      alt?: string;
    };
    keywords?: string[];
  };
}

interface CaseStudyMetadata {
  title?: string;
  subtitle?: string;
  excerpt?: string;
  mainImage?: {
    asset: SanityImage;
    alt?: string;
  };
  publishedAt?: string;
  author?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: {
      asset: SanityImage;
      alt?: string;
    };
    keywords?: string[];
  };
  _updatedAt?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for case detail page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  const siteUrl = getSiteUrl();
  const localizedPath = buildHref(`/case-studies/${slug}`, locale);
  const canonicalUrl = `${siteUrl}${localizedPath}`;
  const alternates = generateHreflangAlternates(`/case-studies/${slug}`, locale);

  const caseData = await sanityFetch<CaseStudyMetadata | null>({
    query: CASE_STUDY_METADATA_QUERY,
    params: { slug },
    tags: [`caseStudy:${slug}`],
  });

  if (!caseData) {
    return { title: m.case_not_found_title({}, { languageTag: locale }) };
  }

  const title =
    caseData.seo?.metaTitle ||
    caseData.title ||
    m.menu_nav_case_studies({}, { languageTag: locale });
  const description = caseData.seo?.metaDescription || caseData.subtitle || caseData.excerpt || "";
  const publishedTime = caseData.publishedAt;
  const modifiedTime = caseData._updatedAt;
  const author = caseData.author || "isBIM Team";
  const keywords = caseData.seo?.keywords?.filter(Boolean);
  const ogImageSource = caseData.seo?.openGraphImage?.asset || caseData.mainImage?.asset;
  const fallbackOgImage = `${siteUrl}/images/og/case-studies.jpg`;
  const ogImageUrl = ogImageSource
    ? (urlFor(ogImageSource)?.width(1200).height(630).fit("crop").url() || fallbackOgImage)
    : fallbackOgImage;

  return {
    title,
    description,
    keywords: keywords && keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates.languages,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime,
      modifiedTime,
      authors: [author],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Case Studies Detail Page (Server Component)
 *
 * Architecture: Server Component + Sanity CMS + ISR
 * - Fetches full article content from Sanity
 * - Passes data to client component for interactivity
 * - Uses ISR for optimal performance
 */
export default async function CaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  const t = (fn: MessageFn) => fn({}, { languageTag: locale });

  const caseDetail = await sanityFetch<CaseStudyItem | null>({
    query: CASE_STUDY_DETAIL_QUERY,
    params: { slug },
    tags: [`caseStudy:${slug}`],
    cache: "no-store",
  });

  if (!caseDetail) {
    notFound();
  }

  const recentCasesRaw = await sanityFetch<CaseStudyItem[]>({
    query: CASE_STUDY_LIST_QUERY,
    params: { start: 0, end: 4 },
    tags: ["caseStudy"],
    cache: "no-store",
  });

  const recentCases = recentCasesRaw
    .filter((item) => item._id !== caseDetail._id)
    .slice(0, 3);

  // Breadcrumb Schema for navigation
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const caseStudiesPath = buildHref("/case-studies", locale);
  const detailPath = buildHref(`/case-studies/${caseDetail.slug.current}`, locale);
  const canonicalUrl = `${siteUrl}${detailPath}`;
  const homeLabel = t(m.breadcrumb_home);
  const caseStudiesLabel = t(m.menu_nav_case_studies);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: homeLabel, url: `${siteUrl}${homePath}` },
    { name: caseStudiesLabel, url: `${siteUrl}${caseStudiesPath}` },
    { name: caseDetail.title, url: `${siteUrl}${detailPath}` },
  ]);

  const ogImageSource = caseDetail.seo?.openGraphImage?.asset || caseDetail.mainImage?.asset;
  const fallbackOgImage = `${siteUrl}/images/og/case-studies.jpg`;
  const ogImageUrl = ogImageSource
    ? (urlFor(ogImageSource as SanityImage)?.width(1200).height(630).fit("crop").url() || fallbackOgImage)
    : fallbackOgImage;

  // Article Schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: caseDetail.title,
    description: caseDetail.subtitle || caseDetail.excerpt,
    datePublished: caseDetail.publishedAt,
    dateModified: caseDetail.publishedAt,
    ...(ogImageUrl && { image: ogImageUrl }),
    author: {
      "@type": "Person",
      name: caseDetail.author || "isBIM Team",
    },
    publisher: {
      "@type": "Organization",
      name: "isBIM",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icons/isbim_black.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      {/* SEO: Structured Data */}
      <JsonLd data={breadcrumbSchema} id="case-studies-detail-breadcrumb" />
      <JsonLd data={articleSchema} id="case-studies-detail-article" />

      {/* Main case detail content */}
      <main className="case-studies-page surface-noise-overlay min-h-screen">
        <div className="noise-grain" />

        {/* Case detail client component handles display and interactivity */}
        <CaseDetailClient
          caseDetail={caseDetail}
          recentCases={recentCases}
        />
      </main>
    </>
  );
}
