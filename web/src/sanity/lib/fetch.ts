/**
 * Sanity Fetch Utilities
 *
 * Purpose:
 * - Type-safe wrapper around Sanity client.fetch with Next.js cache integration
 * - Tag-based revalidation for granular cache invalidation
 * - Consistent error handling and logging
 * - TypeScript inference for query results
 *
 * Cache Strategy:
 * - Uses Next.js fetch cache with revalidation tags
 * - Tags format: "sanity:{type}", "sanity:{type}:{id}", "sanity:all"
 * - Revalidate on-demand via: revalidateTag('sanity:post')
 *
 * Usage:
 * ```tsx
 * import { sanityFetch } from "@/sanity/lib/fetch";
 * import { IMAGE_ASSET_QUERY } from "@/sanity/lib/queries";
 *
 * // Basic fetch with type safety
 * const image = await sanityFetch({
 *   query: IMAGE_ASSET_QUERY,
 *   params: { slug: "home-cta" },
 *   tags: ["imageAsset", "home-cta"],
 * });
 *
 * // With custom revalidation
 * const posts = await sanityFetch({
 *   query: POSTS_QUERY,
 *   revalidate: 3600, // Revalidate every hour
 *   tags: ["post"],
 * });
 * ```
 */

import { type QueryParams } from "next-sanity";
import { client } from "./client";
import { isDevelopment } from "@/lib/env";

/**
 * Sanity fetch options
 */
export interface SanityFetchOptions {
  /** GROQ query string */
  query: string;
  /** Query parameters */
  params?: QueryParams;
  /** Cache tags for revalidation (automatically prefixed with "sanity:") */
  tags?: string[];
  /** Revalidation time in seconds (default: false for on-demand only) */
  revalidate?: number | false;
  /** Skip cache entirely (for dynamic/realtime data) */
  cache?: "force-cache" | "no-store";
}

/**
 * Type-safe Sanity fetch with Next.js cache integration
 *
 * @param options - Fetch configuration options
 * @returns Typed query result
 *
 * @example
 * ```tsx
 * const image = await sanityFetch<ImageAsset>({
 *   query: IMAGE_ASSET_QUERY,
 *   params: { slug: "home-cta" },
 *   tags: ["imageAsset"],
 * });
 * ```
 */
export async function sanityFetch<T = unknown>({
  query,
  params = {},
  tags = [],
  revalidate = false,
  cache,
}: SanityFetchOptions): Promise<T> {
  const prefixedTags = ["sanity:all", ...tags.map((tag) => `sanity:${tag}`)];

  // In development, log queries for debugging
  if (isDevelopment()) {
    console.log("[Sanity Fetch]", {
      query: query.slice(0, 100) + (query.length > 100 ? "..." : ""),
      params,
      tags: prefixedTags,
      revalidate,
    });
  }

  try {
    const data = await client.fetch<T>(query, params, {
      next: {
        revalidate: revalidate,
        tags: prefixedTags,
      },
      cache: cache,
    });

    return data;
  } catch (error) {
    console.error("[Sanity Fetch Error]", {
      query: query.slice(0, 200),
      params,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Helper to build cache tags for a document type
 *
 * @param type - Sanity document type
 * @param id - Optional document ID for more specific tagging
 * @returns Array of cache tags
 *
 * @example
 * ```tsx
 * const tags = buildCacheTags("post", "my-post-id");
 * // Returns: ["post", "post:my-post-id"]
 * ```
 */
export function buildCacheTags(type: string, id?: string): string[] {
  const tags = [type];
  if (id) {
    tags.push(`${type}:${id}`);
  }
  return tags;
}

/**
 * Common cache tag patterns for revalidation
 */
export const CACHE_TAGS = {
  /** All Sanity content */
  ALL: "sanity:all",
  /** All posts */
  POSTS: "sanity:post",
  /** All products */
  PRODUCTS: "sanity:product",
  /** All image assets */
  IMAGES: "sanity:imageAsset",
  /** All news items */
  NEWS: "sanity:news",
  /** All case studies */
  CASE_STUDIES: "sanity:caseStudy",
  /** All careers */
  CAREERS: "sanity:career",
  /** All projects */
  PROJECTS: "sanity:project",
} as const;

/**
 * Revalidation time presets (in seconds)
 */
export const REVALIDATE = {
  /** Never revalidate (manual only) */
  NEVER: false,
  /** Revalidate every minute */
  MINUTE: 60,
  /** Revalidate every 5 minutes */
  FIVE_MINUTES: 300,
  /** Revalidate every hour */
  HOUR: 3600,
  /** Revalidate every day */
  DAY: 86400,
  /** Revalidate every week */
  WEEK: 604800,
} as const;
