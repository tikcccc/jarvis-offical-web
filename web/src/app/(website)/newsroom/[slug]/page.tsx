import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/json-ld";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  NEWS_DETAIL_QUERY,
  NEWS_METADATA_QUERY,
  NEWS_LIST_QUERY,
} from "@/sanity/lib/queries";
import NewsDetailClient from "./news-detail-client";
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
interface NewsItem {
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

interface NewsMetadata {
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
 * Generate metadata for news detail page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  const siteUrl = getSiteUrl();
  const localizedPath = buildHref(`/newsroom/${slug}`, locale);
  const canonicalUrl = `${siteUrl}${localizedPath}`;
  const alternates = generateHreflangAlternates(`/newsroom/${slug}`, locale);

  const newsData = await sanityFetch<NewsMetadata | null>({
    query: NEWS_METADATA_QUERY,
    params: { slug },
    tags: [`sanity:news:${slug}`],
  });

  if (!newsData) {
    return { title: m.news_not_found_title({}, { languageTag: locale }) };
  }

  const title =
    newsData.seo?.metaTitle ||
    newsData.title ||
    m.menu_nav_newsroom({}, { languageTag: locale });
  const description = newsData.seo?.metaDescription || newsData.subtitle || newsData.excerpt || "";
  const publishedTime = newsData.publishedAt;
  const modifiedTime = newsData._updatedAt;
  const author = newsData.author || "isBIM Team";
  const keywords = newsData.seo?.keywords?.filter(Boolean);
  const ogImageSource = newsData.seo?.openGraphImage?.asset || newsData.mainImage?.asset;
  const fallbackOgImage = `${siteUrl}/images/og/newsroom.jpg`;
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
 * News Detail Page (Server Component)
 *
 * Architecture: Server Component + Sanity CMS + ISR
 * - Fetches full article content from Sanity
 * - Passes data to client component for interactivity
 * - Uses ISR for optimal performance
 */
export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  const t = (fn: MessageFn) => fn({}, { languageTag: locale });

  const newsDetail = await sanityFetch<NewsItem | null>({
    query: NEWS_DETAIL_QUERY,
    params: { slug },
    tags: [`sanity:news:${slug}`],
    cache: "no-store",
  });

  if (!newsDetail) {
    notFound();
  }

  const recentNewsRaw = await sanityFetch<NewsItem[]>({
    query: NEWS_LIST_QUERY,
    params: { start: 0, end: 4 },
    tags: ["sanity:news"],
    cache: "no-store",
  });

  const recentNews = recentNewsRaw
    .filter((item) => item._id !== newsDetail._id)
    .slice(0, 3);

  // Breadcrumb Schema for navigation
  const siteUrl = getSiteUrl();
  const homePath = buildHref("/", locale);
  const newsroomPath = buildHref("/newsroom", locale);
  const detailPath = buildHref(`/newsroom/${newsDetail.slug.current}`, locale);
  const canonicalUrl = `${siteUrl}${detailPath}`;
  const homeLabel = t(m.breadcrumb_home);
  const newsroomLabel = t(m.menu_nav_newsroom);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: homeLabel, url: `${siteUrl}${homePath}` },
    { name: newsroomLabel, url: `${siteUrl}${newsroomPath}` },
    { name: newsDetail.title, url: `${siteUrl}${detailPath}` },
  ]);

  const ogImageSource = newsDetail.seo?.openGraphImage?.asset || newsDetail.mainImage?.asset;
  const fallbackOgImage = `${siteUrl}/images/og/newsroom.jpg`;
  const ogImageUrl = ogImageSource
    ? (urlFor(ogImageSource as SanityImage)?.width(1200).height(630).fit("crop").url() || fallbackOgImage)
    : fallbackOgImage;

  // Article Schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: newsDetail.title,
    description: newsDetail.subtitle || newsDetail.excerpt,
    datePublished: newsDetail.publishedAt,
    dateModified: newsDetail.publishedAt,
    ...(ogImageUrl && { image: ogImageUrl }),
    author: {
      "@type": "Person",
      name: newsDetail.author || "isBIM Team",
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
      <JsonLd data={breadcrumbSchema} id="newsroom-detail-breadcrumb" />
      <JsonLd data={articleSchema} id="newsroom-detail-article" />

      {/* Main news detail content */}
      <main className="newsroom-page surface-noise-overlay min-h-screen">
        <div className="noise-grain" />

        {/* News detail client component handles display and interactivity */}
        <NewsDetailClient
          newsDetail={newsDetail}
          recentNews={recentNews}
        />
      </main>
    </>
  );
}
