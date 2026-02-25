"use client";

import { m as motion } from "@/components/motion/lazy-motion";
import { ArrowLeft, Share2, Home, Tag } from "lucide-react";
import Image from "next/image";
import { Link } from "@/lib/i18n";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import type { ReactNode } from "react";
import type { Image as SanityImage } from "sanity";
import type { PortableTextBlock } from "@portabletext/types";
import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import * as m from "@/paraglide/messages";

type MessageFn = (params?: Record<string, never>, options?: { languageTag?: "en" | "zh" }) => string;

// Types for Sanity data
interface CaseStudyItem {
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
}

interface CaseDetailClientProps {
  caseDetail: CaseStudyItem;
  recentCases: CaseStudyItem[];
}

// Utility component for mono labels
const MonoLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`case-font-label case-studies-text-subtle ${className}`}>
    {children}
  </span>
);

export default function CaseDetailClient({
  caseDetail,
  recentCases,
}: CaseDetailClientProps) {
  const locale = useLocale() as "en" | "zh";
  const intlLocale = locale === "zh" ? "zh-HK" : "en-US";
  const t = (fn: MessageFn) => fn({}, { languageTag: locale });

  const imageUrl = caseDetail.mainImage
    ? urlFor(caseDetail.mainImage.asset)?.width(1600).height(685).url()
    : null;

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(intlLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Share article function
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: caseDetail.title,
          text: caseDetail.subtitle || caseDetail.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t(m.case_share_copied));
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.groupCollapsed('[CaseStudies][Debug] Detail payload');
      console.log('caseDetail', caseDetail);
      console.log('recentCases', recentCases);
      console.groupEnd();
    }
  }, [caseDetail, recentCases]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="case-studies-detail surface-noise-overlay pb-20 relative"
    >
      {/* Global noise texture overlay */}
      <div className="noise-grain" />

      <div className="container-content flex items-center gap-3 md:gap-4 py-3 md:py-4">
        <Link href="/case-studies" className="case-studies-back-btn case-font-body group">
          <ArrowLeft className="case-studies-back-icon transition-transform duration-200 group-hover:-translate-x-1" />
          {t(m.case_back_to_case_studies)}
        </Link>
      </div>

      {/* Article Content */}
      <article className="container-content pt-6 pb-12 md:py-12">
        {/* Article Header */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(180px,22%)_minmax(0,1fr)] xl:grid-cols-[minmax(180px,18%)_minmax(0,1fr)] gap-8 mb-8 md:mb-12">
          {/* Sidebar Metadata */}
          <div className="pt-2">
            <div className="flex flex-wrap gap-2 md:hidden">
              <span className="inline-flex items-center gap-2 rounded-full border case-studies-border-subtle px-3 py-1.5 case-studies-surface-muted case-font-label leading-tight">
                <span className="case-studies-text-subtle">{t(m.case_published_label)}</span>
                <span className="text-[var(--text-strong)]">{formatDate(caseDetail.publishedAt)}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border case-studies-border-subtle px-3 py-1.5 case-studies-surface-muted case-font-label leading-tight">
                <span className="case-studies-text-subtle">{t(m.case_category_label)}</span>
                <span className="text-[var(--text-strong)]">{caseDetail.category.title}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border case-studies-border-subtle px-3 py-1.5 case-studies-surface-muted case-font-label leading-tight">
                <span className="case-studies-text-subtle">{t(m.case_read_time_label)}</span>
                <span className="text-[var(--text-strong)]">
                  {caseDetail.readTime} {t(m.case_read_time_suffix)}
                </span>
              </span>
              {caseDetail.author && (
                <span className="inline-flex items-center gap-2 rounded-full border case-studies-border-subtle px-3 py-1.5 case-studies-surface-muted case-font-label leading-tight">
                  <span className="case-studies-text-subtle">{t(m.case_author_label)}</span>
                  <span className="text-[var(--text-strong)]">{caseDetail.author}</span>
                </span>
              )}
            </div>

            <div className="hidden md:block space-y-6">
              <div>
                <MonoLabel className="block mb-1">{t(m.case_published_label)}</MonoLabel>
                <div className="case-font-detail-meta text-[var(--text-muted)]">{formatDate(caseDetail.publishedAt)}</div>
              </div>
              <div>
                <MonoLabel className="block mb-1">{t(m.case_category_label)}</MonoLabel>
                <div className="flex flex-wrap gap-2">
                  <span className="case-font-detail-meta text-[var(--text-muted)]">{caseDetail.category.title}</span>
                </div>
              </div>
              <div>
                <MonoLabel className="block mb-1">{t(m.case_read_time_label)}</MonoLabel>
                <div className=" case-font-detail-meta text-[var(--text-muted)]">
                  {caseDetail.readTime} {t(m.case_read_time_suffix)}
                </div>
              </div>
              {caseDetail.author && (
                <div>
                  <MonoLabel className="block mb-1">{t(m.case_author_label)}</MonoLabel>
                  <div className=" case-font-detail-meta text-[var(--text-muted)]">{caseDetail.author}</div>
                </div>
              )}
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div>
            <h1 className="case-studies-article-title case-font-detail-title text-[var(--text-strong)] mb-6 leading-tight">
              {caseDetail.title}
            </h1>
            {caseDetail.subtitle && (
              <p className="case-studies-body case-font-detail-subtitle text-[var(--text-muted)] leading-relaxed border-l-2 case-studies-border-strong pl-6">
                {caseDetail.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {imageUrl ? (
          <div className="case-studies-media-frame case-studies-media-featured relative aspect-[21/9] w-full mb-16 overflow-hidden">
            <Image
              src={imageUrl}
              alt={caseDetail.mainImage?.alt || caseDetail.title}
              fill
              sizes="100vw"
              className="case-studies-media-img object-cover"
            />
          </div>
        ) : (
          <div className="case-studies-detail-divider" />
        )}

        {/* Article Body */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(180px,22%)_minmax(0,1fr)] xl:grid-cols-[minmax(180px,18%)_minmax(0,1fr)] gap-8">
          <div className="hidden md:block case-studies-detail-sidebar">
            <div className="case-studies-detail-sticky">
              <div className="case-studies-section-marker"></div>
              <MonoLabel>{t(m.case_scroll_down)}</MonoLabel>
            </div>
          </div>

          <div className="case-studies-prose case-font-body-lg text-[var(--text-muted)] max-w-none">
            <PortableText
              value={caseDetail.body || []}
              components={portableTextComponents}
            />
          </div>
        </div>

        {/* Tags Section */}
        {caseDetail.tags && caseDetail.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t case-studies-border-subtle">
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="w-4 h-4 case-studies-text-soft" />
              {caseDetail.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 case-font-label case-studies-surface-muted case-studies-text-muted hover:bg-[var(--case-studies-surface-quiet)] transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Recent Cases Section */}
      {recentCases.length > 0 && (
        <div className="container-content mt-20 pt-12 border-t case-studies-border-subtle">
          <h3 className="case-font-label-lg case-studies-text-primary mb-8">
            {t(m.case_recent_cases)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentCases.map((recent) => (
              <Link
                key={recent._id}
                href={`/case-studies/${recent.slug.current}`}
                className="group"
              >
                <RelatedCard
                  post={recent}
                  intlLocale={intlLocale}
                  readStoryLabel={t(m.case_read_story)}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t case-studies-border-subtle p-4 md:hidden z-50 flex items-center justify-between pb-8"
        style={{ backgroundColor: 'rgba(var(--case-studies-surface-card-rgb), 0.96)' }}
      >
        <Link href="/case-studies" className="p-2 case-studies-text-subtle hover:case-studies-text-primary case-font-label">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link href="/case-studies" className="flex items-center gap-2 case-font-label-lg case-studies-text-primary font-bold">
          <Home className="w-4 h-4" />
          {t(m.case_studies_title)}
        </Link>
        <button onClick={handleShare} className="p-2 case-studies-text-subtle hover:case-studies-text-primary case-font-label">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

// Related Article Card Component
function RelatedCard({
  post,
  intlLocale,
  readStoryLabel,
}: {
  post: CaseStudyItem;
  intlLocale: string;
  readStoryLabel: string;
}) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(533).url()
    : null;

  return (
    <div className="group cursor-pointer flex flex-col h-full relative case-studies-card-shell">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <MonoLabel className="group-hover:case-studies-text-primary transition-colors">
            [{post.category.title}]
          </MonoLabel>
        </div>
        <MonoLabel>
          {new Date(post.publishedAt).toLocaleDateString(intlLocale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </MonoLabel>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="case-font-card font-semibold text-[var(--text-strong)] mb-3 group-hover:underline decoration-1 underline-offset-4">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="case-studies-body-small case-font-body text-[var(--text-muted)] line-clamp-2 mb-4">
            {post.subtitle}
          </p>
        )}

        {imageUrl && (
          <div className="mt-auto mb-4">
            <div className="case-studies-media-frame relative w-full aspect-[3/2]">
              <Image
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="case-studies-media-img object-cover"
              />
            </div>
          </div>
        )}

        {!imageUrl && post.excerpt && (
          <div className="relative mt-2 mb-4 flex-1">
            <div className="case-studies-excerpt-bar absolute left-0 top-0 bottom-0 w-px" />
            <p className="case-studies-body-small case-font-body text-[var(--text-muted)] leading-relaxed pl-4 line-clamp-[10]">
              {post.excerpt}...
            </p>
          </div>
        )}
      </div>

      <div className="case-studies-card-footer mt-auto flex items-center justify-between -mx-0">
        <span className="case-font-label case-studies-cta-link">
          {readStoryLabel}
        </span>
        <ArrowRight className="w-3 h-3 case-studies-icon-soft transition-all group-hover:text-[var(--case-studies-accent-cta)] group-hover:translate-x-1" />
      </div>
    </div>
  );
}

// Portable Text Components for rich text rendering
const portableTextComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }: { children?: ReactNode }) => <strong>{children}</strong>,
    em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
    link: ({ value, children }: { value?: { href?: string }; children?: ReactNode }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-[var(--case-studies-accent-cta)] hover:underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    normal: ({ children }: { children?: ReactNode }) => (
      <p className="case-font-body-lg leading-relaxed text-[var(--text-muted)] mb-6 last:mb-0">
        {children}
      </p>
    ),
    h2: ({ children }: { children?: ReactNode }) => <h2 className="case-font-card font-semibold case-studies-text-primary mt-8 mb-4">{children}</h2>,
    h3: ({ children }: { children?: ReactNode }) => <h3 className="case-font-body-lg font-semibold case-studies-text-primary mt-6 mb-3">{children}</h3>,
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-4 case-studies-border-subtle pl-4 my-6 italic">
        {children}
      </blockquote>
    ),
  },
};

// Add ArrowRight icon component
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
