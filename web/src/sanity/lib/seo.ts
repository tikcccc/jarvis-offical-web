/**
 * Sanity SEO Helpers
 *
 * Purpose:
 * - Bridge between Sanity CMS and Next.js metadata generation
 * - Type-safe metadata builders using Sanity data
 * - Reusable patterns for different content types
 *
 * Usage:
 * ```tsx
 * import { generatePostMetadata } from "@/sanity/lib/seo";
 *
 * export async function generateMetadata({ params }) {
 *   return generatePostMetadata(params.slug, params.locale);
 * }
 * ```
 */

import type { Metadata } from "next";
import type { Image } from "sanity";
import { sanityFetch, buildCacheTags, REVALIDATE } from "./fetch";
import {
  POST_METADATA_QUERY,
  PRODUCT_METADATA_QUERY,
  NEWS_METADATA_QUERY,
  CASE_STUDY_METADATA_QUERY,
  CAREER_METADATA_QUERY,
  PROJECT_METADATA_QUERY,
} from "./queries";
import { urlFor } from "./image";
import { generatePageMetadata, COMMON_KEYWORDS } from "@/lib/seo";

/**
 * Generate metadata for a post
 *
 * @param slug - Post slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generatePostMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const post = await sanityFetch<{
      title: string;
      mainImage?: Image;
      publishedAt?: string;
      _updatedAt: string;
    } | null>({
      query: POST_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("post", slug),
      revalidate: REVALIDATE.HOUR,
    });

    if (!post) {
      return generatePageMetadata({
        title: "Post Not Found",
        description: "The requested post could not be found.",
        path: `/posts/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const imageUrl = post.mainImage ? urlFor(post.mainImage)?.width(1200).height(630).url() : undefined;

    return generatePageMetadata({
      title: post.title,
      description: `Read more about ${post.title}`,
      path: `/posts/${slug}`,
      locale,
      image: imageUrl,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      keywords: [...COMMON_KEYWORDS, "blog", "news"],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate post metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading Post",
      description: "An error occurred while loading the post.",
      path: `/posts/${slug}`,
      locale,
      noIndex: true,
    });
  }
}

/**
 * Generate metadata for a product
 *
 * @param slug - Product slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generateProductMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const product = await sanityFetch<{
      name: string;
      description?: string;
      mainImage?: Image;
    } | null>({
      query: PRODUCT_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("product", slug),
      revalidate: REVALIDATE.DAY,
    });

    if (!product) {
      return generatePageMetadata({
        title: "Product Not Found",
        description: "The requested product could not be found.",
        path: `/products/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const imageUrl = product.mainImage ? urlFor(product.mainImage)?.width(1200).height(630).url() : undefined;

    return generatePageMetadata({
      title: product.name,
      description: product.description || `Learn more about ${product.name}`,
      path: `/products/${slug}`,
      locale,
      image: imageUrl,
      keywords: [...COMMON_KEYWORDS, "product", "solution"],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate product metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading Product",
      description: "An error occurred while loading the product.",
      path: `/products/${slug}`,
      locale,
      noIndex: true,
    });
  }
}

/**
 * Generate metadata for a news article
 *
 * @param slug - News slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generateNewsMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const news = await sanityFetch<{
      title: string;
      subtitle?: string;
      mainImage?: Image;
      publishedAt?: string;
      _updatedAt: string;
    } | null>({
      query: NEWS_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("news", slug),
      revalidate: REVALIDATE.HOUR,
    });

    if (!news) {
      return generatePageMetadata({
        title: "News Not Found",
        description: "The requested news article could not be found.",
        path: `/newsroom/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const imageUrl = news.mainImage ? urlFor(news.mainImage)?.width(1200).height(630).url() : undefined;

    return generatePageMetadata({
      title: news.title,
      description: news.subtitle || `Read the latest news: ${news.title}`,
      path: `/newsroom/${slug}`,
      locale,
      image: imageUrl,
      type: "article",
      publishedTime: news.publishedAt,
      modifiedTime: news._updatedAt,
      keywords: [...COMMON_KEYWORDS, "news", "updates", "announcements"],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate news metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading News",
      description: "An error occurred while loading the news article.",
      path: `/newsroom/${slug}`,
      locale,
      noIndex: true,
    });
  }
}

/**
 * Generate metadata for a case study
 *
 * @param slug - Case study slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generateCaseStudyMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const caseStudy = await sanityFetch<{
      title: string;
      subtitle?: string;
      mainImage?: Image;
      publishedAt?: string;
      _updatedAt: string;
    } | null>({
      query: CASE_STUDY_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("caseStudy", slug),
      revalidate: REVALIDATE.HOUR,
    });

    if (!caseStudy) {
      return generatePageMetadata({
        title: "Case Study Not Found",
        description: "The requested case study could not be found.",
        path: `/case-studies/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const imageUrl = caseStudy.mainImage
      ? urlFor(caseStudy.mainImage)?.width(1200).height(630).url()
      : undefined;

    return generatePageMetadata({
      title: caseStudy.title,
      description: caseStudy.subtitle || `Explore case study: ${caseStudy.title}`,
      path: `/case-studies/${slug}`,
      locale,
      image: imageUrl,
      type: "article",
      publishedTime: caseStudy.publishedAt,
      modifiedTime: caseStudy._updatedAt,
      keywords: [...COMMON_KEYWORDS, "case study", "project", "portfolio"],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate case study metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading Case Study",
      description: "An error occurred while loading the case study.",
      path: `/case-studies/${slug}`,
      locale,
      noIndex: true,
    });
  }
}

/**
 * Generate metadata for a career position
 *
 * @param slug - Career slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generateCareerMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const career = await sanityFetch<{
      title: string;
      locations?: Array<{ title?: string; slug?: string }>;
      pillar?: { title?: string; slug?: string; sortOrder?: number };
      team?: { title?: string; pillar?: { title?: string; slug?: string; sortOrder?: number } };
      employmentType?: string;
      workModel?: string;
      sections?: Array<{ title?: string; text?: string }>;
      seo?: {
        metaTitle?: string;
        metaDescription?: string;
        openGraphImage?: Image;
        keywords?: string[];
      };
      _updatedAt?: string;
    } | null>({
      query: CAREER_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("career", slug),
      revalidate: REVALIDATE.DAY,
    });

    if (!career) {
      return generatePageMetadata({
        title: "Career Position Not Found",
        description: "The requested career position could not be found.",
        path: `/careers/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const title = career.seo?.metaTitle || career.title;
    const teamTitle = career.team?.title;
    const pillar = career.team?.pillar?.title;
    const sectionSnippet =
      career.sections
        ?.map((s) => (s?.text || "").trim())
        .find((text) => text.length > 0) || "";
    const makeExcerpt = (text: string, max = 160) => {
      if (!text) return "";
      return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
    };
    const locationTitle =
      career.locations?.[0]?.title || career.locations?.[0]?.slug || "";
    const description =
      career.seo?.metaDescription ||
      makeExcerpt(sectionSnippet) ||
      `Join our team as ${career.title}${teamTitle ? ` in ${teamTitle}` : ""}${
        locationTitle ? ` (${locationTitle})` : ""
      }`;
    const imageUrl = career.seo?.openGraphImage
      ? urlFor(career.seo.openGraphImage)?.width(1200).height(630).url()
      : undefined;
    const keywords = [
      ...COMMON_KEYWORDS,
      "careers",
      "jobs",
      "hiring",
      career.title,
      teamTitle ?? "",
      pillar ?? "",
      career.employmentType ?? "",
      career.workModel ?? "",
      ...(career.seo?.keywords ?? []),
    ].filter(Boolean);

    return generatePageMetadata({
      title,
      description,
      path: `/careers/${slug}`,
      locale,
      image: imageUrl,
      modifiedTime: career._updatedAt,
      keywords,
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate career metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading Career",
      description: "An error occurred while loading the career position.",
      path: `/careers/${slug}`,
      locale,
      noIndex: true,
    });
  }
}

/**
 * Generate metadata for a project
 *
 * @param slug - Project slug
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export async function generateProjectMetadata(
  slug: string,
  locale: string = "en"
): Promise<Metadata> {
  try {
    const project = await sanityFetch<{
      title: string;
      description?: string;
      coverImage?: Image;
      client?: string;
    } | null>({
      query: PROJECT_METADATA_QUERY,
      params: { slug },
      tags: buildCacheTags("project", slug),
      revalidate: REVALIDATE.DAY,
    });

    if (!project) {
      return generatePageMetadata({
        title: "Project Not Found",
        description: "The requested project could not be found.",
        path: `/projects/${slug}`,
        locale,
        noIndex: true,
      });
    }

    const imageUrl = project.coverImage ? urlFor(project.coverImage)?.width(1200).height(630).url() : undefined;

    const description =
      project.description || `Explore our project: ${project.title}${project.client ? ` for ${project.client}` : ""}`;

    return generatePageMetadata({
      title: project.title,
      description,
      path: `/projects/${slug}`,
      locale,
      image: imageUrl,
      keywords: [...COMMON_KEYWORDS, "project", "case study", "portfolio"],
    });
  } catch (error) {
    console.error(`[SEO] Failed to generate project metadata for slug: ${slug}`, error);
    return generatePageMetadata({
      title: "Error Loading Project",
      description: "An error occurred while loading the project.",
      path: `/projects/${slug}`,
      locale,
      noIndex: true,
    });
  }
}
