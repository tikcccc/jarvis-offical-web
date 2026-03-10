import { getStrapiApiToken, getStrapiUrl } from "@/lib/env";
import { blocksToPlainText, blocksToPortableText } from "./blocks";
import type {
  ApplicationSettings,
  CmsCareer,
  CmsCareerLocation,
  CmsCareerPillar,
  CmsCareerSection,
  CmsCareerTeam,
  CmsCaseStudyItem,
  CmsCategory,
  CmsImage,
  CmsNewsItem,
  CmsSeo,
  ContactSubmissionInput,
  SitemapEntry,
  StrapiBlocksContent,
  StrapiMediaAsset,
} from "./types";

type QueryValue = string | number | boolean | null | undefined;
type QueryEntry = [string, QueryValue];

type StrapiEnvelope<T> = {
  data: T;
  meta?: unknown;
};

const NEWS_ENDPOINT = "news-items";
const NEWS_CATEGORY_ENDPOINT = "news-categories";
const CASE_STUDY_ENDPOINT = "case-studies";
const CASE_STUDY_CATEGORY_ENDPOINT = "case-study-categories";
const CAREER_ENDPOINT = "careers";
const APPLICATION_SETTING_ENDPOINT = "application-setting";
const CONTACT_SUBMISSION_ENDPOINT = "contact-submissions";

function createPopulateEntries(paths: string[]): QueryEntry[] {
  return paths.map((path, index) => [`populate[${index}]`, path]);
}

const NEWS_POPULATE = createPopulateEntries([
  "mainImage",
  "category",
  "seo",
]);

const CAREER_POPULATE = createPopulateEntries([
  "team",
  "team.pillar",
  "locations",
  "seo",
]);

const CASE_STUDY_POPULATE = createPopulateEntries([
  "mainImage",
  "category",
  "seo",
]);

const asString = (value: unknown) =>
  typeof value === "string" ? value : "";

const asNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" ? value : fallback;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function flattenEntity<T extends Record<string, unknown>>(
  value: unknown
): T | null {
  if (!value) return null;

  const raw = isObject(value) && "data" in value ? value.data : value;
  if (!isObject(raw)) return null;

  if ("attributes" in raw && isObject(raw.attributes)) {
    return {
      ...raw.attributes,
      id: raw.id,
      documentId: raw.documentId,
    } as unknown as T;
  }

  return raw as unknown as T;
}

function flattenCollection<T extends Record<string, unknown>>(value: unknown): T[] {
  if (!value) return [];

  const raw = isObject(value) && "data" in value ? value.data : value;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => flattenEntity<T>(entry))
    .filter((entry): entry is T => Boolean(entry));
}

function arrayOfStrings(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const strings = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return strings.length > 0 ? strings : undefined;
}

function parseDelimitedText(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return arrayOfStrings(value);
  if (typeof value !== "string") return undefined;

  const items = value
    .split(/[\n,，、]+/g)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return value.slice(0, maxLength).trimEnd();
}

function deriveExcerpt(
  explicitExcerpt: unknown,
  body: StrapiBlocksContent | undefined,
  subtitle: string | undefined
) {
  const manualExcerpt = asString(explicitExcerpt).trim();
  if (manualExcerpt) return manualExcerpt;

  const bodyText = truncateText(blocksToPlainText(body), 280);
  if (bodyText) return bodyText;

  return subtitle;
}

function appendQuery(url: URL, entries: QueryEntry[]) {
  for (const [key, value] of entries) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.append(key, String(value));
  }
}

async function strapiFetch<T>(
  endpoint: string,
  query: QueryEntry[] = [],
  init: RequestInit = {}
): Promise<T> {
  const url = new URL(`/api/${endpoint}`, getStrapiUrl());
  appendQuery(url, query);

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  const token = getStrapiApiToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers,
    cache: init.method && init.method !== "GET" ? "no-store" : "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `[Strapi] ${response.status} ${response.statusText} for ${endpoint}: ${body}`
    );
  }

  return response.json() as Promise<T>;
}

function mapId(entity: Record<string, unknown>) {
  return asString(entity.documentId) || String(entity.id ?? "");
}

function mapSlug(value: unknown) {
  return { current: asString(value) };
}

function mapMedia(value: unknown): CmsImage | undefined {
  const media = flattenEntity<Record<string, unknown>>(value);
  if (!media) return undefined;

  const url = asString(media.url);
  if (!url) return undefined;

  const asset: StrapiMediaAsset = {
    id: typeof media.id === "number" || typeof media.id === "string" ? media.id : undefined,
    documentId: asString(media.documentId) || undefined,
    name: asString(media.name) || undefined,
    alternativeText: asString(media.alternativeText) || undefined,
    url,
    width: typeof media.width === "number" ? media.width : undefined,
    height: typeof media.height === "number" ? media.height : undefined,
    mime: asString(media.mime) || undefined,
    formats: isObject(media.formats)
      ? (media.formats as StrapiMediaAsset["formats"])
      : undefined,
  };

  return {
    asset,
    alt: asset.alternativeText || asset.name || "",
  };
}

function mapSeo(value: unknown): CmsSeo | undefined {
  const seo = flattenEntity<Record<string, unknown>>(value);
  if (!seo) return undefined;

  const mapped: CmsSeo = {
    metaTitle: asString(seo.metaTitle) || undefined,
    metaDescription: asString(seo.metaDescription) || undefined,
    openGraphImage: mapMedia(seo.openGraphImage),
    keywords: parseDelimitedText(seo.keywords),
  };

  if (
    !mapped.metaTitle &&
    !mapped.metaDescription &&
    !mapped.openGraphImage &&
    !mapped.keywords
  ) {
    return undefined;
  }

  return mapped;
}

function mapCategory(value: unknown): CmsCategory {
  const category = flattenEntity<Record<string, unknown>>(value) ?? {};

  return {
    _id: mapId(category),
    title: asString(category.title),
    slug: mapSlug(category.slug),
    description: asString(category.description) || undefined,
    sortOrder: typeof category.sortOrder === "number" ? category.sortOrder : undefined,
  };
}

function mapNews(value: unknown): CmsNewsItem {
  const item = flattenEntity<Record<string, unknown>>(value) ?? {};
  const subtitle = asString(item.subtitle) || undefined;
  const body = item.body as StrapiBlocksContent | undefined;

  return {
    _id: mapId(item),
    _type: "news",
    title: asString(item.title),
    slug: mapSlug(item.slug),
    subtitle,
    publishedAt: asString(item.publishedAt),
    excerpt: deriveExcerpt(item.excerpt, body, subtitle),
    body: blocksToPortableText(body),
    mainImage: mapMedia(item.mainImage),
    category: mapCategory(item.category),
    author: asString(item.author) || "isBIM Team",
    readTime: asNumber(item.readTime, 5),
    featured: Boolean(item.featured),
    seo: mapSeo(item.seo),
    _updatedAt:
      asString(item.updatedAt) || asString(item.publishedAt) || undefined,
  };
}

function mapCaseStudy(value: unknown): CmsCaseStudyItem {
  const item = flattenEntity<Record<string, unknown>>(value) ?? {};
  const subtitle = asString(item.subtitle) || undefined;
  const body = item.body as StrapiBlocksContent | undefined;

  return {
    _id: mapId(item),
    _type: "caseStudy",
    title: asString(item.title),
    slug: mapSlug(item.slug),
    subtitle,
    publishedAt: asString(item.publishedAt),
    excerpt: deriveExcerpt(item.excerpt, body, subtitle),
    body: blocksToPortableText(body),
    mainImage: mapMedia(item.mainImage),
    category: mapCategory(item.category),
    author: asString(item.author) || "isBIM Team",
    readTime: asNumber(item.readTime, 5),
    featured: Boolean(item.featured),
    seo: mapSeo(item.seo),
    _updatedAt:
      asString(item.updatedAt) || asString(item.publishedAt) || undefined,
  };
}

function mapCareerPillar(value: unknown): CmsCareerPillar | undefined {
  const pillar = flattenEntity<Record<string, unknown>>(value);
  if (!pillar) return undefined;

  return {
    _id: mapId(pillar),
    title: asString(pillar.title),
    slug: mapSlug(pillar.slug),
    description: asString(pillar.description) || undefined,
    sortOrder:
      typeof pillar.sortOrder === "number" ? pillar.sortOrder : undefined,
  };
}

function mapCareerTeam(value: unknown): CmsCareerTeam | undefined {
  const team = flattenEntity<Record<string, unknown>>(value);
  if (!team) return undefined;

  return {
    _id: mapId(team),
    title: asString(team.title),
    slug: mapSlug(team.slug),
    pillar: mapCareerPillar(team.pillar),
    description: asString(team.description) || undefined,
    sortOrder: typeof team.sortOrder === "number" ? team.sortOrder : undefined,
  };
}

function mapCareerLocation(value: unknown): CmsCareerLocation {
  const location = flattenEntity<Record<string, unknown>>(value) ?? {};

  return {
    _id: mapId(location),
    title: asString(location.title),
    slug: mapSlug(location.slug),
    address: asString(location.address) || undefined,
  };
}

function mapCareerSection(value: unknown): CmsCareerSection | undefined {
  const section = flattenEntity<Record<string, unknown>>(value);
  if (!section) return undefined;

  return {
    _key: mapId(section) || asString(section.__component) || `section-${Date.now()}`,
    title: asString(section.title),
    content: blocksToPortableText(
      section.content as StrapiBlocksContent | undefined
    ),
  };
}

function mapCareer(value: unknown): CmsCareer {
  const item = flattenEntity<Record<string, unknown>>(value) ?? {};
  const locations = flattenCollection<Record<string, unknown>>(item.locations);
  const sections = Array.isArray(item.sections) ? item.sections : [];

  return {
    _id: mapId(item),
    _type: "career",
    title: asString(item.title),
    slug: mapSlug(item.slug),
    team: mapCareerTeam(item.team),
    locations: locations.map((location) => mapCareerLocation(location)),
    workModel:
      asString(item.workModel) as CmsCareer["workModel"] | undefined,
    employmentType:
      asString(item.employmentType) as CmsCareer["employmentType"] | undefined,
    experienceLevel:
      asString(item.experienceLevel) as CmsCareer["experienceLevel"] | undefined,
    sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : undefined,
    sections: sections
      .map((section) => mapCareerSection(section))
      .filter((section): section is CmsCareerSection => Boolean(section)),
    postedAt: asString(item.postedAt) || undefined,
    expiresAt: asString(item.expiresAt) || undefined,
    seo: mapSeo(item.seo),
    _createdAt: asString(item.createdAt) || undefined,
    _updatedAt:
      asString(item.updatedAt) || asString(item.publishedAt) || undefined,
  };
}

function mapApplicationSettings(value: unknown): ApplicationSettings | null {
  const settings = flattenEntity<Record<string, unknown>>(value);
  if (!settings) return null;

  return {
    _id: mapId(settings),
    _type: "applicationSettings",
    url: asString(settings.url),
  };
}

function mapSitemapEntry(value: unknown): SitemapEntry {
  const item = flattenEntity<Record<string, unknown>>(value) ?? {};
  return {
    slug: asString(item.slug),
    _updatedAt: asString(item.updatedAt) || new Date().toISOString(),
  };
}

export async function getNewsList(limit = 12): Promise<CmsNewsItem[]> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(NEWS_ENDPOINT, [
    ...NEWS_POPULATE,
    ["filters[publishedAt][$notNull]", true],
    ["sort[0]", "publishedAt:desc"],
    ["pagination[pageSize]", limit],
  ]);

  return flattenCollection<Record<string, unknown>>(response).map((item) =>
    mapNews(item)
  );
}

export async function getFeaturedNews(): Promise<CmsNewsItem | null> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(NEWS_ENDPOINT, [
    ...NEWS_POPULATE,
    ["filters[publishedAt][$notNull]", true],
    ["filters[featured][$eq]", true],
    ["sort[0]", "publishedAt:desc"],
    ["pagination[pageSize]", 1],
  ]);

  const [item] = flattenCollection<Record<string, unknown>>(response);
  return item ? mapNews(item) : null;
}

export async function getNewsCategories(): Promise<CmsCategory[]> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(
    NEWS_CATEGORY_ENDPOINT,
    [
      ["sort[0]", "sortOrder:asc"],
      ["sort[1]", "title:asc"],
      ["pagination[pageSize]", 100],
    ]
  );

  return flattenCollection<Record<string, unknown>>(response).map((item) =>
    mapCategory(item)
  );
}

export async function getNewsBySlug(slug: string): Promise<CmsNewsItem | null> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(NEWS_ENDPOINT, [
    ...NEWS_POPULATE,
    ["filters[slug][$eq]", slug],
    ["filters[publishedAt][$notNull]", true],
    ["pagination[pageSize]", 1],
  ]);

  const [item] = flattenCollection<Record<string, unknown>>(response);
  return item ? mapNews(item) : null;
}

export async function getMenuNews(): Promise<CmsNewsItem[]> {
  const [featured, latest] = await Promise.all([
    getFeaturedNews(),
    strapiFetch<StrapiEnvelope<unknown[]>>(NEWS_ENDPOINT, [
      ...NEWS_POPULATE,
      ["filters[publishedAt][$notNull]", true],
      ["filters[featured][$eq]", false],
      ["sort[0]", "publishedAt:desc"],
      ["pagination[pageSize]", 1],
    ]),
  ]);

  const latestItems = flattenCollection<Record<string, unknown>>(latest).map((item) =>
    mapNews(item)
  );

  return [featured, ...latestItems].filter(
    (item): item is CmsNewsItem => Boolean(item)
  );
}

export async function getMenuCaseStudies(): Promise<CmsCaseStudyItem[]> {
  const [featured, latest] = await Promise.all([
    getFeaturedCaseStudy(),
    strapiFetch<StrapiEnvelope<unknown[]>>(CASE_STUDY_ENDPOINT, [
      ...CASE_STUDY_POPULATE,
      ["filters[publishedAt][$notNull]", true],
      ["filters[featured][$eq]", false],
      ["sort[0]", "publishedAt:desc"],
      ["pagination[pageSize]", 1],
    ]),
  ]);

  const latestItems = flattenCollection<Record<string, unknown>>(latest).map(
    (item) => mapCaseStudy(item)
  );

  return [featured, ...latestItems].filter(
    (item): item is CmsCaseStudyItem => Boolean(item)
  );
}

export async function getCaseStudies(limit = 12): Promise<CmsCaseStudyItem[]> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(
    CASE_STUDY_ENDPOINT,
    [
      ...CASE_STUDY_POPULATE,
      ["filters[publishedAt][$notNull]", true],
      ["sort[0]", "publishedAt:desc"],
      ["pagination[pageSize]", limit],
    ]
  );

  return flattenCollection<Record<string, unknown>>(response).map((item) =>
    mapCaseStudy(item)
  );
}

export async function getFeaturedCaseStudy(): Promise<CmsCaseStudyItem | null> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(
    CASE_STUDY_ENDPOINT,
    [
      ...CASE_STUDY_POPULATE,
      ["filters[publishedAt][$notNull]", true],
      ["filters[featured][$eq]", true],
      ["sort[0]", "publishedAt:desc"],
      ["pagination[pageSize]", 1],
    ]
  );

  const [item] = flattenCollection<Record<string, unknown>>(response);
  return item ? mapCaseStudy(item) : null;
}

export async function getCaseStudyCategories(): Promise<CmsCategory[]> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(
    CASE_STUDY_CATEGORY_ENDPOINT,
    [
      ["sort[0]", "sortOrder:asc"],
      ["sort[1]", "title:asc"],
      ["pagination[pageSize]", 100],
    ]
  );

  return flattenCollection<Record<string, unknown>>(response).map((item) =>
    mapCategory(item)
  );
}

export async function getCaseStudyBySlug(
  slug: string
): Promise<CmsCaseStudyItem | null> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(
    CASE_STUDY_ENDPOINT,
    [
      ...CASE_STUDY_POPULATE,
      ["filters[slug][$eq]", slug],
      ["filters[publishedAt][$notNull]", true],
      ["pagination[pageSize]", 1],
    ]
  );

  const [item] = flattenCollection<Record<string, unknown>>(response);
  return item ? mapCaseStudy(item) : null;
}

export async function getCareers(): Promise<CmsCareer[]> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(CAREER_ENDPOINT, [
    ...CAREER_POPULATE,
    ["filters[publishedAt][$notNull]", true],
    ["sort[0]", "sortOrder:asc"],
    ["sort[1]", "postedAt:desc"],
    ["sort[2]", "updatedAt:desc"],
    ["pagination[pageSize]", 100],
  ]);

  return flattenCollection<Record<string, unknown>>(response).map((item) =>
    mapCareer(item)
  );
}

export async function getCareerBySlug(slug: string): Promise<CmsCareer | null> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(CAREER_ENDPOINT, [
    ...CAREER_POPULATE,
    ["filters[slug][$eq]", slug],
    ["filters[publishedAt][$notNull]", true],
    ["pagination[pageSize]", 1],
  ]);

  const [item] = flattenCollection<Record<string, unknown>>(response);
  return item ? mapCareer(item) : null;
}

export async function getApplicationSettings(): Promise<ApplicationSettings | null> {
  const response = await strapiFetch<StrapiEnvelope<unknown>>(
    APPLICATION_SETTING_ENDPOINT
  );

  return mapApplicationSettings(response);
}

export async function getNewsSitemapEntries(): Promise<SitemapEntry[]> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(NEWS_ENDPOINT, [
    ["fields[0]", "slug"],
    ["fields[1]", "updatedAt"],
    ["filters[publishedAt][$notNull]", true],
    ["pagination[pageSize]", 500],
  ]);

  return flattenCollection<Record<string, unknown>>(response).map((item) =>
    mapSitemapEntry(item)
  );
}

export async function getCaseStudySitemapEntries(): Promise<SitemapEntry[]> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(
    CASE_STUDY_ENDPOINT,
    [
      ["fields[0]", "slug"],
      ["fields[1]", "updatedAt"],
      ["filters[publishedAt][$notNull]", true],
      ["pagination[pageSize]", 500],
    ]
  );

  return flattenCollection<Record<string, unknown>>(response).map((item) =>
    mapSitemapEntry(item)
  );
}

export async function getCareerSitemapEntries(): Promise<SitemapEntry[]> {
  const response = await strapiFetch<StrapiEnvelope<unknown[]>>(CAREER_ENDPOINT, [
    ["fields[0]", "slug"],
    ["fields[1]", "updatedAt"],
    ["filters[publishedAt][$notNull]", true],
    ["pagination[pageSize]", 500],
  ]);

  return flattenCollection<Record<string, unknown>>(response).map((item) =>
    mapSitemapEntry(item)
  );
}

export async function createContactSubmission(input: ContactSubmissionInput) {
  await strapiFetch<StrapiEnvelope<unknown>>(CONTACT_SUBMISSION_ENDPOINT, [], {
    method: "POST",
    body: JSON.stringify({ data: input }),
  });
}
