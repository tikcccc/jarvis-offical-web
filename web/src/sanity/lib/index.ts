/**
 * Sanity Library - Barrel Export
 *
 * Convenient single import point for all Sanity utilities
 *
 * Usage:
 * ```tsx
 * // Instead of multiple imports:
 * import { client } from "@/sanity/lib/client";
 * import { sanityFetch } from "@/sanity/lib/fetch";
 * import { IMAGE_ASSET_BY_SLUG_QUERY } from "@/sanity/lib/queries";
 *
 * // Use barrel export:
 * import {
 *   client,
 *   sanityFetch,
 *   IMAGE_ASSET_BY_SLUG_QUERY,
 *   buildCacheTags,
 *   REVALIDATE
 * } from "@/sanity/lib";
 * ```
 */

// Client exports
export { client, writeClient, previewClient, projectId, dataset, apiVersion } from "./client";

// Fetch utilities
export {
  sanityFetch,
  buildCacheTags,
  CACHE_TAGS,
  REVALIDATE,
  type SanityFetchOptions,
} from "./fetch";

// Image utilities
export { urlFor } from "./image";

// Query definitions
export * from "./queries";

// Type definitions
export type * from "./types";

// SEO helpers
export {
  generatePostMetadata,
  generateProductMetadata,
  generateNewsMetadata,
  generateCaseStudyMetadata,
  generateCareerMetadata,
  generateProjectMetadata,
} from "./seo";
