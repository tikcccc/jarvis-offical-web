/**
 * Sanity Type Definitions
 *
 * Purpose:
 * - TypeScript types for all Sanity document schemas
 * - Type-safe query results
 * - Matches schema definitions in schemaTypes/
 *
 * Usage:
 * ```tsx
 * import type { ImageAsset, Post, Product } from "@/sanity/lib/types";
 *
 * const image: ImageAsset = await sanityFetch({...});
 * ```
 */

import type { Image, Slug, PortableTextBlock } from "sanity";

/**
 * Base document fields (common to all Sanity documents)
 */
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

/**
 * Image Asset document type
 * Standalone image with metadata
 */
export interface ImageAsset extends SanityDocument {
  _type: "imageAsset";
  title: string;
  alt?: string;
  file?: Image;
  slug: Slug;
}

/**
 * Post document type
 */
export interface Post extends SanityDocument {
  _type: "post";
  title: string;
  slug: Slug;
  publishedAt?: string;
  body?: PortableTextBlock[]; // Block content
  mainImage?: Image;
}

/**
 * Product document type
 */
export interface Product extends SanityDocument {
  _type: "product";
  name: string;
  slug: Slug;
  description?: string;
  mainImage?: Image;
  price?: number;
  category?: string;
}

/**
 * News document type
 */
export interface News extends SanityDocument {
  _type: "news";
  title: string;
  slug: Slug;
  publishedAt?: string;
  body?: PortableTextBlock[];
 coverImage?: Image;
}

/**
 * Case Study document type
 */
export interface CaseStudy extends SanityDocument {
  _type: "caseStudy";
  title: string;
  slug: Slug;
  subtitle?: string;
  publishedAt?: string;
  body?: PortableTextBlock[];
  mainImage?: Image;
  category?: {
    _id: string;
    title: string;
    sortOrder?: number;
  };
  tags?: string[];
  author?: string;
  readTime?: number;
  featured?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: Image;
    keywords?: string[];
  };
}

/**
 * Career document type
 */
export interface CareerPillar extends SanityDocument {
  _type: "careerPillar";
  title: string;
  slug: Slug;
  description?: string;
  sortOrder?: number;
}

export interface CareerTeam extends SanityDocument {
  _type: "careerTeam";
  title: string;
  slug: Slug;
  pillar?: CareerPillar;
  description?: string;
  sortOrder?: number;
}

export interface CareerLocation extends SanityDocument {
  _type: "careerLocation";
  title: string;
  slug: Slug;
}

export interface CareerSection {
  _key: string;
  title: string;
  content?: PortableTextBlock[];
}

export interface Career extends SanityDocument {
  _type: "career";
  title: string;
  slug: Slug;
  team?: CareerTeam;
  locations?: CareerLocation[];
  workModel: "onsite" | "hybrid" | "remote";
  employmentType?: "full-time" | "part-time" | "contract" | "internship" | "temporary";
  experienceLevel?: "intern" | "junior" | "mid" | "senior" | "lead" | "director";
  sortOrder?: number;
  sections?: CareerSection[];
  contentImage?: Image;
  postedAt?: string;
  expiresAt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: Image;
    keywords?: string[];
  };
}

/**
 * Application settings (singleton)
 */
export interface ApplicationSettings extends SanityDocument {
  _type: "applicationSettings";
  url: string;
}

/**
 * Project document type
 */
export interface Project extends SanityDocument {
  _type: "project";
  title: string;
  slug: Slug;
  client?: string;
  completedAt?: string;
  description?: string;
  coverImage?: Image;
  gallery?: Image[];
  category?: string;
}

/**
 * SEO Metadata type
 * Minimal fields needed for generating page metadata
 */
export interface SeoMetadata {
  title: string;
  description?: string;
  image?: Image;
  keywords?: string[];
}
