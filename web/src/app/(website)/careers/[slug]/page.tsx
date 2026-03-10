import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Timer,
  Users,
} from "lucide-react";
import { Link } from "@/lib/i18n";
import {
  formatDate,
  formatEmploymentType,
  formatExperience,
  formatWorkModel,
} from "../careers-formatters";
import styles from "./career-detail.module.css";
import { cn } from "@/lib/utils";
import {
  sourceLanguageTag,
  isAvailableLanguageTag,
  type AvailableLanguageTag,
} from "@/paraglide/runtime";
import * as m from "@/paraglide/messages";
import { getSiteUrl } from "@/lib/env";
import { buildHref } from "@/lib/i18n/route-builder";
import { generateHreflangAlternates } from "@/lib/seo";
import {
  getApplicationSettings,
  getCareerBySlug,
  type CmsPortableTextImage,
} from "@/strapi/lib";
import { urlFor } from "@/strapi/lib/image";

export const revalidate = 0;

type MessageFn = (params?: Record<string, never>, options?: { languageTag?: AvailableLanguageTag }) => string;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  const siteUrl = getSiteUrl();
  const localizedPath = buildHref(`/careers/${slug}`, locale);
  const canonicalUrl = `${siteUrl}${localizedPath}`;
  const alternates = generateHreflangAlternates(`/careers/${slug}`, locale);
  const career = await getCareerBySlug(slug);

  if (!career) {
    return { title: m.careers_role_details({}, { languageTag: locale }) };
  }

  const title = career.seo?.metaTitle || career.title;
  const description = career.seo?.metaDescription || `Join isBIM as ${career.title}.`;
  const ogImageSource = career.seo?.openGraphImage?.asset;
  const fallbackOgImage = `${siteUrl}/images/og/careers.jpg`;
  const ogImageUrl =
    ogImageSource
      ? urlFor(ogImageSource).width(1200).height(630).fit("crop").url() ||
        fallbackOgImage
      : fallbackOgImage;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates.languages,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
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

const portableTextComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => (
      <strong className={styles.proseStrong}>{children}</strong>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className={styles.proseLink}
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className={cn(styles.proseParagraph, "font-body-lg mb-4")}>{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className={cn(styles.sectionHeading, "font-body-xxlg mt-12 mb-6")}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={cn(styles.sectionHeading, "font-body-xlg mt-10 mb-5")}>
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className={cn(styles.proseParagraph, "border-l-4 pl-4 italic my-6")}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="space-y-2 mb-6">{children}</ul>,
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 mb-6">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className={cn(styles.proseParagraph, "font-body-lg flex items-start gap-3")}>
        <span
          className={cn(
            styles.proseListBulletMarker,
            "mt-2.5 w-1.5 h-1.5 rounded-full shrink-0"
          )}
        />
        <span className="flex-1">{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className={cn(styles.proseParagraph, "font-body-lg")}>{children}</li>
    ),
  },
  types: {
    image: ({ value }: { value?: CmsPortableTextImage }) => {
      const imageUrl = value?.asset ? urlFor(value.asset).url() : null;
      if (!imageUrl) return null;

      return (
        <div className="my-8">
          <Image
            src={imageUrl}
            alt={value?.alt || "Career content image"}
            width={value?.asset.width || 1200}
            height={value?.asset.height || 675}
            className="w-full h-auto rounded-sm"
          />
        </div>
      );
    },
  },
};

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;
  const t = (fn: MessageFn) => fn({}, { languageTag: locale });

  const [career, applicationSettings] = await Promise.all([
    getCareerBySlug(slug).catch(() => null),
    getApplicationSettings().catch(() => null),
  ]);

  if (!career) {
    notFound();
  }

  const teamTitle = career.team?.title || t(m.careers_team_default);
  const pillarTitle = career.team?.pillar?.title || t(m.careers_pillar_default);
  const locations = (career.locations || [])
    .map((loc) => loc?.title)
    .filter(Boolean) as string[];
  const primaryLocation = locations[0] || t(m.careers_location_default);

  const workModelLabel = formatWorkModel(career.workModel, locale);
  const employmentTypeLabel = formatEmploymentType(career.employmentType, locale);
  const experienceLabel = formatExperience(career.experienceLevel, locale);
  const postedLabel = career.postedAt ? formatDate(career.postedAt, locale) : null;
  const expiresLabel = career.expiresAt ? formatDate(career.expiresAt, locale) : null;
  const applicationUrl =
    applicationSettings?.url || "https://forms.jarvisbim.com.cn/f/5ae840d915fd604188882302";

  return (
    <main className="surface-noise-overlay min-h-screen">
      <div className="noise-grain" />

      <div className="container-content pt-28 pb-20">
        <div className={styles.backRow}>
          <Link
            href="/careers"
            className={cn(styles.backLink, "group flex items-center font-body-base")}
          >
            <ArrowLeft
              size={18}
              className="mr-3 group-hover:-translate-x-1 transition-transform"
            />
            {t(m.careers_back_to_positions)}
          </Link>
          <span className={cn(styles.pillarLabel, "hidden md:block font-label-sm tracking-[0.2em]")}>
            {pillarTitle}
          </span>
        </div>

        <header className="mb-20">
          <div className={cn(styles.metaRow, "flex flex-wrap items-center gap-6 mb-6 pb-6 font-body-base")}>
            <div className="flex items-center gap-2">
              <Users size={16} />
              {teamTitle}
            </div>

            <span className={styles.metaSeparator}>/</span>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {primaryLocation}
            </div>

            {expiresLabel && (
              <>
                <span className={styles.metaSeparator}>/</span>
                <div className="flex items-center gap-2">
                  <Timer size={16} />
                  <span className={styles.metaDeadlineLabel}>
                    {t(m.careers_closing_date_label)}: {expiresLabel}
                  </span>
                </div>
              </>
            )}
          </div>

          <h1 className={cn(styles.title, "font-hero-headline mb-8")}>
            {career.title}
          </h1>

          <div className="flex flex-col md:flex-row gap-6">
            <a
              href={applicationUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "btn-primary w-full md:w-auto inline-flex items-center justify-center gap-3 font-body-base",
                styles.applyButton
              )}
            >
              {t(m.careers_apply_cta)} <ArrowUpRight size={18} />
            </a>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-20">
          <div className="flex-grow">
            <div className={styles.richText}>
              {career.sections?.length ? (
                career.sections.map((section) => (
                  <section key={section._key} className="mb-14">
                    <h3 className={cn(styles.sectionHeading, "font-body-xxlg mt-12 mb-6 flex items-center gap-3")}>
                      <span className={cn(styles.sectionAccent, "w-4 h-0.5 inline-block")} />
                      {section.title}
                    </h3>
                    <PortableText
                      value={section.content || []}
                      components={portableTextComponents}
                    />
                  </section>
                ))
              ) : (
                <p className={cn(styles.proseParagraph, "font-body-lg")}>
                  {t(m.careers_description_pending)}
                </p>
              )}
            </div>
          </div>

          <aside className="hidden lg:block w-72 shrink-0">
            <div className={cn(styles.sidebar, "sticky top-44 p-6")}>
              <h4 className={cn(styles.sidebarTitle, "font-label-sm mb-4")}>
                {t(m.careers_role_details)}
              </h4>

              <div className="space-y-6">
                <div>
                  <p className={cn(styles.sidebarLabel, "font-label-sm mb-2")}>
                    {t(m.careers_department_label)}
                  </p>
                  <p className={cn(styles.sidebarValue, "font-body-base")}>{teamTitle}</p>
                </div>

                {experienceLabel && (
                  <div>
                    <p className={cn(styles.sidebarLabel, "font-label-sm mb-2")}>
                      {t(m.careers_seniority_label)}
                    </p>
                    <p className={cn(styles.sidebarValue, "font-body-base")}>{experienceLabel}</p>
                  </div>
                )}

                {workModelLabel && (
                  <div>
                    <p className={cn(styles.sidebarLabel, "font-label-sm mb-2")}>
                      {t(m.careers_work_mode_label)}
                    </p>
                    <p className={cn(styles.sidebarValue, "font-body-base")}>{workModelLabel}</p>
                  </div>
                )}

                <div>
                  <p className={cn(styles.sidebarLabel, "font-label-sm mb-2")}>
                    {t(m.careers_office_label)}
                  </p>
                  <p className={cn(styles.sidebarValue, "font-body-base")}>
                    {locations.join(", ") || t(m.careers_location_default)}
                  </p>
                </div>

                {employmentTypeLabel && (
                  <div>
                    <p className={cn(styles.sidebarLabel, "font-label-sm mb-2")}>
                      {t(m.careers_employment_label)}
                    </p>
                    <p className={cn(styles.sidebarValue, "font-body-base")}>{employmentTypeLabel}</p>
                  </div>
                )}

                {postedLabel && (
                  <div>
                    <p className={cn(styles.sidebarLabel, "font-label-sm mb-2")}>
                      {t(m.careers_posted_label)}
                    </p>
                    <p className={cn(styles.sidebarValue, "font-body-base")}>{postedLabel}</p>
                  </div>
                )}

                {expiresLabel && (
                  <div>
                    <p className={cn(styles.sidebarLabel, "font-label-sm mb-2")}>
                      {t(m.careers_closing_date_label)}
                    </p>
                    <p className={cn(styles.sidebarStrongValue, "font-body-base")}>
                      {expiresLabel}
                    </p>
                  </div>
                )}

                <a
                  href={applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(styles.sidebarAction, "font-body-base pt-4 inline-flex items-center justify-between w-full")}
                >
                  {t(m.careers_submit_application)} <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
