import type { PortableTextBlock } from "@portabletext/types";

export interface CmsSlug {
  current: string;
}

export interface StrapiMediaFormat {
  url: string;
  width?: number;
  height?: number;
}

export interface StrapiMediaAsset {
  id?: number | string;
  documentId?: string;
  name?: string;
  alternativeText?: string | null;
  url: string;
  width?: number;
  height?: number;
  formats?: Record<string, StrapiMediaFormat>;
  mime?: string;
}

export interface CmsImage {
  asset: StrapiMediaAsset;
  alt: string;
}

export interface CmsPortableTextImage {
  _type: "image";
  _key: string;
  asset: StrapiMediaAsset;
  alt?: string;
}

export type CmsPortableText = Array<PortableTextBlock | CmsPortableTextImage>;

export interface CmsSeo {
  metaTitle?: string;
  metaDescription?: string;
  openGraphImage?: CmsImage;
  keywords?: string[];
}

export interface CmsCategory {
  _id: string;
  title: string;
  slug: CmsSlug;
  description?: string;
  sortOrder?: number;
}

export interface CmsNewsItem {
  _id: string;
  _type: "news";
  title: string;
  slug: CmsSlug;
  subtitle?: string;
  publishedAt: string;
  excerpt?: string;
  body?: CmsPortableText;
  mainImage?: CmsImage;
  category: CmsCategory;
  author: string;
  readTime: number;
  featured?: boolean;
  seo?: CmsSeo;
  _updatedAt?: string;
}

export interface CmsCaseStudyItem {
  _id: string;
  _type: "caseStudy";
  title: string;
  slug: CmsSlug;
  subtitle?: string;
  publishedAt: string;
  excerpt?: string;
  body?: CmsPortableText;
  mainImage?: CmsImage;
  category: CmsCategory;
  author: string;
  readTime: number;
  featured?: boolean;
  seo?: CmsSeo;
  _updatedAt?: string;
}

export interface CmsCareerPillar {
  _id: string;
  title: string;
  slug: CmsSlug;
  description?: string;
  sortOrder?: number;
}

export interface CmsCareerTeam {
  _id: string;
  title: string;
  slug: CmsSlug;
  pillar?: CmsCareerPillar;
  description?: string;
  sortOrder?: number;
}

export interface CmsCareerLocation {
  _id: string;
  title: string;
  slug: CmsSlug;
  address?: string;
}

export interface CmsCareerSection {
  _key: string;
  title: string;
  content?: CmsPortableText;
}

export interface CmsCareer {
  _id: string;
  _type: "career";
  title: string;
  slug: CmsSlug;
  team?: CmsCareerTeam;
  locations?: CmsCareerLocation[];
  workModel?: "onsite" | "hybrid" | "remote";
  employmentType?:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "temporary";
  experienceLevel?:
    | "intern"
    | "junior"
    | "mid"
    | "senior"
    | "lead"
    | "director";
  sortOrder?: number;
  sections?: CmsCareerSection[];
  contentImage?: CmsImage;
  postedAt?: string;
  expiresAt?: string;
  seo?: CmsSeo;
  _createdAt?: string;
  _updatedAt?: string;
}

export interface ApplicationSettings {
  _id: string;
  _type: "applicationSettings";
  url: string;
}

export interface SitemapEntry {
  slug: string;
  _updatedAt: string;
}

export interface ContactSubmissionInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  companyName: string;
  companyType?: string;
  jobTitle?: string;
  service: string;
  marketingConsent?: boolean;
  locale: "en" | "zh";
  submittedAt: string;
  sourcePage?: string;
  ipHash?: string;
  userAgent?: string;
}

export interface StrapiTextInlineNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface StrapiLinkInlineNode {
  type: "link";
  url: string;
  rel?: string;
  target?: string;
  children: StrapiTextInlineNode[];
}

export interface StrapiListItemInlineNode {
  type: "list-item";
  children: Array<StrapiTextInlineNode | StrapiLinkInlineNode>;
}

export type StrapiDefaultInlineNode =
  | StrapiTextInlineNode
  | StrapiLinkInlineNode;

export interface StrapiParagraphBlockNode {
  type: "paragraph";
  children: StrapiDefaultInlineNode[];
}

export interface StrapiQuoteBlockNode {
  type: "quote";
  children: StrapiDefaultInlineNode[];
}

export interface StrapiCodeBlockNode {
  type: "code";
  language?: string;
  children: StrapiDefaultInlineNode[];
}

export interface StrapiHeadingBlockNode {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: StrapiDefaultInlineNode[];
}

export interface StrapiListBlockNode {
  type: "list";
  format: "ordered" | "unordered";
  indentLevel?: number;
  children: Array<StrapiListItemInlineNode | StrapiListBlockNode>;
}

export interface StrapiImageBlockNode {
  type: "image";
  image: unknown;
  children: [{ type: "text"; text: "" }];
}

export type StrapiBlocksNode =
  | StrapiParagraphBlockNode
  | StrapiQuoteBlockNode
  | StrapiCodeBlockNode
  | StrapiHeadingBlockNode
  | StrapiListBlockNode
  | StrapiImageBlockNode;

export type StrapiBlocksContent = StrapiBlocksNode[];
