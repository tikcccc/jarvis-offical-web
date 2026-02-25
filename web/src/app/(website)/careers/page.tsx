import type { Metadata } from "next";
import { headers } from "next/headers";
import { PageHeader } from "@/components/ui/page-header";
import CareersListClient from "./careers-list-client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CAREERS_QUERY, APPLICATION_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { ApplicationSettings, Career } from "@/sanity/lib/types";
import { generateCareersPageSEO } from "@/lib/seo-generators";
import {
  isAvailableLanguageTag,
  sourceLanguageTag,
  type AvailableLanguageTag,
} from "@/paraglide/runtime";
import { JsonLd, createJobPostingSchema } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/env";
import { buildHref } from "@/lib/i18n/route-builder";
import * as m from "@/paraglide/messages";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type MessageFn = (params?: Record<string, never>, options?: { languageTag?: AvailableLanguageTag }) => string;

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  return generateCareersPageSEO(locale);
}

export default async function CareersPage() {
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  const t = (fn: MessageFn) => fn({}, { languageTag: locale });

  type CareerQueryResult = Career & { isDraft?: boolean };
  const [careers, applicationSettings] = await Promise.all([
    sanityFetch<CareerQueryResult[]>({
      query: CAREERS_QUERY,
      tags: ["career"],
      revalidate,
      cache: "no-store",
    }).catch(() => []),
    sanityFetch<ApplicationSettings | null>({
      query: APPLICATION_SETTINGS_QUERY,
      tags: ["applicationSettings"],
      cache: "no-store",
    }).catch(() => null),
  ]);

  const publishedCareers = careers.filter((career) => !career.isDraft);
  const siteUrl = getSiteUrl();
  const applicationUrl = applicationSettings?.url || "https://forms.jarvisbim.com.cn/f/5ae840d915fd604188882302";

  const employmentTypeMap: Record<string, string> = {
    "full-time": "FULL_TIME",
    "part-time": "PART_TIME",
    "contract": "CONTRACTOR",
    "internship": "INTERN",
    "temporary": "TEMPORARY",
  };

  const jobPostings = publishedCareers.map((career) => {
    const employmentType = career.employmentType
      ? employmentTypeMap[career.employmentType] || career.employmentType
      : undefined;
    const location = career.locations?.[0]?.title || "Hong Kong";
    const descriptionParts = [
      career.team?.description,
      career.team?.pillar?.description,
    ].filter(Boolean) as string[];
    const description = descriptionParts.length > 0
      ? descriptionParts.join(" ")
      : `Join isBIM as a ${career.title}.`;
    const jobUrl = `${siteUrl}${buildHref(`/careers/${career.slug.current}`, locale)}`;

    const baseSchema = createJobPostingSchema({
      title: career.title,
      description,
      datePosted: career.postedAt || career._createdAt,
      employmentType,
      hiringOrganization: {
        name: "isBIM",
        url: siteUrl,
        logo: `${siteUrl}/icons/isbim_black.svg`,
      },
      jobLocation: {
        city: location,
        country: "Hong Kong",
        address: location,
      },
    });

    return {
      ...baseSchema,
      url: jobUrl,
      ...(applicationUrl && { applicationUrl }),
      ...(career.expiresAt && { validThrough: career.expiresAt }),
    };
  });

  return (
    <main className="careers-page surface-noise-overlay min-h-screen">
      <div className="noise-grain" />
      {jobPostings.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": jobPostings,
          }}
          id="careers-jobpostings"
        />
      )}

      <PageHeader
        title={t(m.careers_page_header_title)}
        subtitle={t(m.careers_page_header_subtitle)}
      />

      <CareersListClient careers={publishedCareers} />
    </main>
  );
}
