/**
 * Sanity GROQ Queries
 *
 * Purpose:
 * - Centralized GROQ query definitions
 * - Type-safe query strings with defineQuery
 * - Reusable query patterns for common data fetching
 *
 * Query Patterns:
 * - List queries: Fetch multiple documents with filtering/sorting
 * - Single queries: Fetch one document by slug/id
 * - Projection: Select specific fields to reduce payload
 *
 * Usage:
 * ```tsx
 * import { sanityFetch } from "@/sanity/lib/fetch";
 * import { IMAGE_ASSET_BY_SLUG_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
 *
 * const image = await sanityFetch({
 *   query: IMAGE_ASSET_BY_SLUG_QUERY,
 *   params: { slug: "home-cta" },
 *   tags: ["imageAsset"],
 * });
 * ```
 */

import { defineQuery } from "next-sanity";

/**
 * Post Queries
 */

/** Fetch all posts ordered by creation date (newest first) */
export const POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    _type,
    _createdAt,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    publishedAt,
    mainImage
  }`
);

/** Fetch a single post by slug */
export const POST_BY_SLUG_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    _createdAt,
    _updatedAt,
    title,
    slug,
    publishedAt,
    body,
    mainImage
  }`
);

/**
 * Product Queries
 */

/** Fetch all products */
export const PRODUCTS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current)] | order(name asc) {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    name,
    slug,
    description,
    mainImage,
    price,
    category
  }`
);

/** Fetch a single product by slug */
export const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    name,
    slug,
    description,
    mainImage,
    price,
    category
  }`
);

/**
 * Image Asset Queries
 */

/** Fetch all image assets */
export const IMAGE_ASSETS_QUERY = defineQuery(
  `*[_type == "imageAsset"] | order(title asc) {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    alt,
    file,
    slug
  }`
);

/** Fetch a single image asset by slug */
export const IMAGE_ASSET_BY_SLUG_QUERY = defineQuery(
  `*[_type == "imageAsset" && slug.current == $slug][0] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    alt,
    file,
    slug
  }`
);

/**
 * News Queries
 */

/** Fetch all news categories */
export const NEWS_CATEGORIES_QUERY = defineQuery(
  `*[_type == "newsCategory" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc) {
    _id,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    sortOrder,
    slug,
    description,
    color
  }`
);

/** Fetch featured news article (latest featured) */
export const FEATURED_NEWS_QUERY = defineQuery(
  `*[_type == "news" && featured == true && defined(slug.current)] | order(publishedAt desc)[0] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    body,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime,
    featured
  }`
);

/** Fetch news list with pagination */
export const NEWS_LIST_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    body,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime,
    featured
  }`
);

/** Fetch menu news: 1 featured + 1 latest non-featured */
export const MENU_LATEST_NEWS_QUERY = defineQuery(
  `(
    (
      *[_type == "news" && featured == true && defined(slug.current)]
        | order(publishedAt desc)[0...1]
    ) + (
      *[_type == "news" && defined(slug.current) && featured != true]
        | order(publishedAt desc)[0...1]
    )
  )[]{
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    publishedAt,
    featured,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    readTime
  }`
);

/** Fetch news by category with pagination */
export const NEWS_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "news" && category._ref == $categoryId && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime,
    featured
  }`
);

/** Fetch a single news article by slug with full details */
export const NEWS_DETAIL_QUERY = defineQuery(
  `*[_type == "news" && slug.current == $slug][0] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    body,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime,
    featured,
    seo {
      metaTitle,
      metaDescription,
      openGraphImage {
        asset,
        alt
      },
      keywords
    },
    _createdAt,
    _updatedAt
  }`
);

/** Fetch related news articles by category (excluding current article) */
export const RELATED_NEWS_QUERY = defineQuery(
  `*[_type == "news" && category._ref == $categoryId && slug.current != $currentSlug && defined(slug.current)] | order(publishedAt desc) [0...3] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime
  }`
);

/**
 * Case Study Queries
 */

/** Fetch all case study categories */
export const CASE_STUDY_CATEGORIES_QUERY = defineQuery(
  `*[_type == "caseStudyCategory" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc) {
    _id,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    sortOrder,
    slug,
    description,
    color
  }`
);

/** Fetch featured case study (latest featured) */
export const FEATURED_CASE_STUDY_QUERY = defineQuery(
  `*[_type == "caseStudy" && featured == true && defined(slug.current)] | order(publishedAt desc)[0] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    body,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime,
    featured
  }`
);

/** Fetch case study list with pagination */
export const CASE_STUDY_LIST_QUERY = defineQuery(
  `*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    body,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime,
    featured
  }`
);

/** Fetch case studies by category with pagination */
export const CASE_STUDY_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "caseStudy" && category._ref == $categoryId && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime,
    featured
  }`
);

/** Fetch a single case study by slug with full details */
export const CASE_STUDY_DETAIL_QUERY = defineQuery(
  `*[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    body,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime,
    featured,
    seo {
      metaTitle,
      metaDescription,
      openGraphImage {
        asset,
        alt
      },
      keywords
    },
    _createdAt,
    _updatedAt
  }`
);

/** Fetch related case studies by category (excluding current case) */
export const RELATED_CASE_STUDIES_QUERY = defineQuery(
  `*[_type == "caseStudy" && category._ref == $categoryId && slug.current != $currentSlug && defined(slug.current)] | order(publishedAt desc) [0...3] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    subtitle,
    publishedAt,
    mainImage {
      asset,
      alt
    },
    category->{
      _id,
      title,
      sortOrder
    },
    author,
    readTime
  }`
);

/**
 * Career Queries
 */

/** Fetch the global application URL (singleton) */
export const APPLICATION_SETTINGS_QUERY = defineQuery(
  `*[_type == "applicationSettings" && _id == "applicationSettings"][0] {
    _id,
    _type,
    url
  }`
);

/** Fetch all open career positions */
export const CAREERS_QUERY = defineQuery(
  `*[_type == "career" && defined(slug.current)] | order(coalesce(team->sortOrder, team->pillar->sortOrder, sortOrder, 1000) asc, postedAt desc, _createdAt desc) {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    team->{
      _id,
      title,
      slug,
      pillar->{
        _id,
        title,
        slug,
        sortOrder,
        description
      },
      sortOrder,
      description
    },
    locations[]->{
      _id,
      title,
      slug
    },
    workModel,
    employmentType,
    experienceLevel,
    postedAt,
    expiresAt,
    sections,
    contentImage{
      ...,
      alt
    },
    sortOrder
  }`
);

/** Fetch a single career position by slug */
export const CAREER_BY_SLUG_QUERY = defineQuery(
  `*[_type == "career" && slug.current == $slug][0] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    team->{
      _id,
      title,
      slug,
      pillar->{
        _id,
        title,
        slug,
        sortOrder,
        description
      },
      sortOrder,
      description
    },
    locations[]->{
      _id,
      title,
      slug
    },
    workModel,
    employmentType,
    experienceLevel,
    sections,
    postedAt,
    expiresAt,
    sortOrder,
    seo
  }`
);

/**
 * Project Queries
 */

/** Fetch all projects ordered by completion date (newest first) */
export const PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)] | order(completedAt desc) {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    client,
    completedAt,
    coverImage,
    category
  }`
);

/** Fetch a single project by slug */
export const PROJECT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0] {
    _id,
    _type,
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    slug,
    client,
    completedAt,
    description,
    coverImage,
    gallery,
    category
  }`
);

/**
 * SEO Metadata Queries
 * Lightweight queries for metadata generation only
 */

/** Fetch post metadata for SEO */
export const POST_METADATA_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    publishedAt,
    _updatedAt
  }`
);

/** Fetch product metadata for SEO */
export const PRODUCT_METADATA_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0] {
    name,
    description,
    mainImage
  }`
);

/** Fetch news metadata for SEO */
export const NEWS_METADATA_QUERY = defineQuery(
  `*[_type == "news" && slug.current == $slug][0] {
    title,
    subtitle,
    mainImage,
    publishedAt,
    author,
    seo {
      metaTitle,
      metaDescription,
      openGraphImage,
      keywords
    },
    _updatedAt
  }`
);

/** Fetch case study metadata for SEO */
export const CASE_STUDY_METADATA_QUERY = defineQuery(
  `*[_type == "caseStudy" && slug.current == $slug][0] {
    title,
    subtitle,
    mainImage,
    publishedAt,
    author,
    seo {
      metaTitle,
      metaDescription,
      openGraphImage,
      keywords
    },
    _updatedAt
  }`
);

/** Fetch career metadata for SEO */
export const CAREER_METADATA_QUERY = defineQuery(
  `*[_type == "career" && slug.current == $slug][0] {
    "isDraft": string::startsWith(_id, "drafts."),
    title,
    locations[]->{
      title,
      slug
    },
    team->{
      title,
      pillar->{
        title,
        slug,
        sortOrder
      }
    },
    employmentType,
    workModel,
    sections[]{
      title,
      "text": pt::text(content)
    },
    contentImage{
      ...,
      alt
    },
    seo,
    _updatedAt
  }`
);

/** Fetch project metadata for SEO */
export const PROJECT_METADATA_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0] {
    title,
    description,
    coverImage,
    client
  }`
);

/**
 * Sitemap Queries
 * Ultra-lightweight queries for sitemap generation (only slugs + dates)
 */

/** Fetch all post slugs for sitemap */
export const POSTS_SITEMAP_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }`
);

/** Fetch all product slugs for sitemap */
export const PRODUCTS_SITEMAP_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }`
);

/** Fetch all news slugs for sitemap */
export const NEWS_SITEMAP_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }`
);

/** Fetch all case study slugs for sitemap */
export const CASE_STUDIES_SITEMAP_QUERY = defineQuery(
  `*[_type == "caseStudy" && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }`
);

/** Fetch all career slugs for sitemap */
export const CAREERS_SITEMAP_QUERY = defineQuery(
  `*[_type == "career" && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }`
);

/** Fetch all project slugs for sitemap */
export const PROJECTS_SITEMAP_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }`
);
