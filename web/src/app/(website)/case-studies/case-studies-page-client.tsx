"use client";

import React, { useEffect, useState } from "react";
import { m } from '@/components/motion/lazy-motion';
import {
  ArrowRight,
  LayoutGrid, List, AlignJustify,
  MoveRight,
} from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Link } from '@/lib/i18n';
import type { PortableTextBlock } from '@portabletext/types';
import type { Image as SanityImage } from 'sanity';
import { useLocale } from "@/lib/i18n/locale-context";
import * as m18n from "@/paraglide/messages";

// --- Types ---
interface CaseStudyPost {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  mainImage?: {
    asset: SanityImage;
    alt: string;
  };
  publishedAt: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  readTime: number;
  tags?: string[];
  category: {
    _id: string;
    title: string;
    slug: { current: string };
    color: string;
  };
  author: string;
  featured?: boolean;
}

interface CaseStudyCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color: string;
}

type LayoutMode = 'grid' | 'feed' | 'magazine';
type CategoryFilter = string | 'All';
// Shared cubic-bezier easing (must be a 4-value tuple for Framer Motion)
const MOTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// --- Animation Variants (match prototype exactly) ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: MOTION_EASE
    }
  }
};

// Use fixed UTC formatting to avoid hydration mismatches across time zones
const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC' }).format(new Date(dateString));

// --- Utility Components ---

// MonoLabel: font-mono text-xs tracking-wider uppercase text-gray-500
const MonoLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`case-font-label case-studies-text-subtle ${className}`}>
    {children}
  </span>
);

// --- Hero Section Component ---
function HeroSection({
  post,
  readFeaturedLabel,
  heading,
}: {
  post: CaseStudyPost;
  readFeaturedLabel: string;
  heading: string;
}) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(1920).height(1080).url()
    : null;
  const hasImage = !!imageUrl;

  // Hero animation variants
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: MOTION_EASE }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: MOTION_EASE }
    }
  };

  return (
    <Link href={`/case-studies/${post.slug.current}`}>
      <div className="relative w-full h-[80vh] min-h-[600px] mb-12 group overflow-hidden case-studies-hero-surface cursor-pointer">

        {/* Background Image with Slow Zoom + Fade Effect */}
        {hasImage && (
          <m.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, ease: MOTION_EASE }}
            whileHover={{ scale: 1.025 }}
          >
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              priority
              sizes="100vw"
              className="w-full h-full object-cover"
            />
          </m.div>
        )}

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-transparent opacity-80" />

        {/* Content Container - Flex Column Space Between */}
        <m.div
          className="absolute inset-0 z-20 flex flex-col justify-between w-full"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full max-w-[90%] md:max-w-[88%] xl:max-w-[1700px] mx-auto px-0 md:px-6">
            {/* TOP: Case Studies Masthead (Inside Hero) */}
            <m.div
              className="pt-24 md:pt-32"
              variants={titleVariants}
            >
              <h1 className="case-studies-hero-title case-font-hero">
                {heading}
              </h1>
            </m.div>
          </div>

          {/* BOTTOM: Featured Article Info */}
          <div className="w-full max-w-[90%] md:max-w-[88%] xl:max-w-[1700px] mx-auto px-0 md:px-6 pb-8 md:pb-12">
            {/* Category Tag */}
            <m.div className="flex gap-3 mb-6" variants={heroItemVariants}>
              <span className="case-studies-hero-badge case-font-mono-xs">
                {post.category.title}
              </span>
            </m.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <m.div className="flex gap-3 mb-6" variants={heroItemVariants}>
            {post.tags.map(tag => (
              <span key={tag} className="case-studies-hero-badge case-font-mono-xs">
                {tag}
              </span>
            ))}
          </m.div>
        )}

        {/* Date */}
        <m.div className="mb-4" variants={heroItemVariants}>
          <span className="case-font-label case-studies-text-inverse-sub">
            {formatDate(post.publishedAt)}
          </span>
        </m.div>

            {/* Title */}
            <m.h2
              className="case-font-headline case-studies-text-inverse-strong mb-6 leading-[1.1]"
              variants={heroItemVariants}
            >
              {post.title}
            </m.h2>

            {/* Subtitle */}
            {post.subtitle && (
              <m.p
                className="case-font-subtitle case-studies-text-inverse-muted max-w-2xl leading-relaxed border-l-2 border-white/30 pl-6"
                variants={heroItemVariants}
              >
                {post.subtitle}
              </m.p>
            )}

            {/* Read More CTA with Arrow */}
            <m.div className="mt-8 flex items-center gap-3" variants={heroItemVariants}>
              <span className="case-font-label-lg case-studies-text-inverse-strong">
                {readFeaturedLabel}
              </span>
              <MoveRight className="w-5 h-5 md:w-6 md:h-6 case-studies-text-inverse transition-transform duration-300 group-hover:translate-x-2" />
            </m.div>
          </div>
        </m.div>
      </div>
    </Link>
  );
}

// --- Main Page Component ---

interface CaseStudiesPageClientProps {
  initialCaseStudies: CaseStudyPost[];
  categories: CaseStudyCategory[];
  featuredCaseStudy: CaseStudyPost | null;
}

export default function CaseStudiesPageClient({
  initialCaseStudies,
  categories,
  featuredCaseStudy,
}: CaseStudiesPageClientProps) {
  const locale = useLocale() as "en" | "zh";

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.groupCollapsed('[CaseStudies][Debug] Initial payload');
      console.log('featuredCaseStudy', featuredCaseStudy);
      console.log('categories', categories);
      console.log('initialCaseStudies length', initialCaseStudies.length);
      console.log('initialCaseStudies slugs', initialCaseStudies.map(n => n.slug?.current));
      console.log('initialCaseStudies', initialCaseStudies);
      console.groupEnd();
    }
  }, [initialCaseStudies, categories, featuredCaseStudy]);

  return (
    <div className="case-studies-page surface-noise-overlay">
      {/* Global noise texture overlay */}
      <div className="noise-grain" />

      <CaseStudiesListView
        key="list"
        caseStudyData={initialCaseStudies}
        categories={categories}
        featuredCaseStudy={featuredCaseStudy}
        locale={locale}
      />
    </div>
  );
}

// --- List View Container ---

function CaseStudiesListView({
  caseStudyData,
  categories,
  featuredCaseStudy,
  locale,
}: {
  caseStudyData: CaseStudyPost[];
  categories: CaseStudyCategory[];
  featuredCaseStudy: CaseStudyPost | null;
  locale: "en" | "zh";
}) {
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [filter, setFilter] = useState<CategoryFilter>('All');

  // Drop draft categories from Sanity to keep filter ids in sync with published case refs
  const publishedCategories = categories.filter(
    (cat) => !cat._id.startsWith('drafts.')
  );

  const derivedCategories: CaseStudyCategory[] =
    publishedCategories.length > 0
      ? publishedCategories
      : Array.from(
          new Map(
            caseStudyData.map((post) => [
              post.category._id,
              {
                _id: post.category._id,
                title: post.category.title,
                slug: post.category.slug,
                description: "",
                color: post.category.color,
              } as CaseStudyCategory,
            ])
          ).values()
        );

  // Sort by date (newest first)
  const sortedCaseStudyData = [...caseStudyData].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const filteredData = filter === 'All'
    ? sortedCaseStudyData
    : sortedCaseStudyData.filter(post => post.category._id === filter);

  // Hero post logic (NOT affected by filter):
  // - If featured case exists: ALWAYS use featured case (regardless of filter)
  // - Otherwise: use newest article from ALL cases (not filtered)
  const heroPost = featuredCaseStudy
    ? featuredCaseStudy
    : sortedCaseStudyData.length > 0
      ? sortedCaseStudyData[0]
      : null;

  // List without hero (filtered data, excluding hero post)
  const filteredWithoutHero = heroPost
    ? filteredData.filter((post) => post._id !== heroPost._id)
    : filteredData;

  const hasFilteredResults = filteredWithoutHero.length > 0;

  // Featured card logic for grid view:
  // Use the newest article from the filtered remaining list
  const newestPost = hasFilteredResults ? filteredWithoutHero[0] : null;

  // Remaining list data (exclude the featured card post)
  const gridListData = newestPost ? filteredWithoutHero.slice(1) : [];
  const listData = filteredWithoutHero;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Hero Section (Magazine Cover Style with Embedded Title) */}
      {heroPost && (
        <HeroSection
          post={heroPost}
          readFeaturedLabel={m18n.case_read_story({}, { languageTag: locale })}
          heading={m18n.case_studies_title({}, { languageTag: locale })}
        />
      )}

      {/* Container for Controls & List */}
      <div className="container-content">
        {/* Controls Area */}
        <div className="mb-12 border-b case-studies-border-strong pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            {/* Category Filter */}
            <div className="case-studies-filter-section">
              {['All', ...derivedCategories.map(cat => cat._id)].map((catId) => {
                const cat = derivedCategories.find(c => c._id === catId);
                const label =
                  catId === "All"
                    ? m18n.case_studies_all_categories({}, { languageTag: locale })
                    : cat?.title ?? "";
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => setFilter(catId as CategoryFilter)}
                    className={`case-studies-filter-btn ${filter === catId ? 'active' : ''}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <h2 className="case-font-section case-studies-text-primary">
              {m18n.case_studies_title({}, { languageTag: locale })}
            </h2>
          </div>

          {/* Layout Switcher */}
          <div className="case-studies-layout-toggle">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`case-studies-layout-btn ${layout === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('magazine')}
              className={`case-studies-layout-btn ${layout === 'magazine' ? 'active' : ''}`}
              title="Strategic View"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('feed')}
              className={`case-studies-layout-btn ${layout === 'feed' ? 'active' : ''}`}
              title="Data Feed"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Layout Renderer */}
        <div className="min-h-[500px]">
          {!hasFilteredResults ? (
            <div className="py-20 text-center case-studies-border border-dashed case-studies-surface-quiet">
              <p className="case-studies-label-xs case-studies-text-soft">
                {m18n.case_studies_no_articles({}, { languageTag: locale })}
              </p>
            </div>
          ) : (
            <m.div
              key={`${layout}-${filter}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* GRID VIEW: Newest article as featured card (full width), then regular cards */}
              {layout === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {newestPost && (
                    <m.div variants={itemVariants} key={newestPost._id} className="col-span-1 md:col-span-2 lg:col-span-3">
                      <FeaturedGridCard post={newestPost} />
                    </m.div>
                  )}

                  {gridListData.map((post) => (
                    <m.div variants={itemVariants} key={post._id}>
                      <GridCard post={post} />
                    </m.div>
                  ))}
                </div>
              )}

              {layout === 'magazine' && (
                <div className="flex flex-col gap-12 max-w-5xl">
                  {listData.map((post) => (
                    <m.div variants={itemVariants} key={post._id}>
                      <MagazineCard post={post} />
                    </m.div>
                  ))}
                </div>
              )}

              {layout === 'feed' && (
                <div className="border-t case-studies-border-subtle">
                  {listData.map((post) => (
                    <m.div variants={itemVariants} key={post._id}>
                      <FeedRow post={post} />
                    </m.div>
                  ))}
                </div>
              )}
            </m.div>
          )}
        </div>
      </div>
    </m.div>
  );
}

// --- Cards & Components ---

function FeaturedGridCard({ post }: { post: CaseStudyPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(1200).height(675).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/case-studies/${post.slug.current}`}
      className="case-studies-card-featured group"
    >
      {hasImage && (
        <div className="case-studies-card-featured-image">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="case-studies-card-featured-content">
        <div className="flex justify-between items-start case-studies-mb-sm">
          <div className="flex gap-2">
            <MonoLabel className="case-studies-text-soft group-hover:case-studies-text-primary transition-colors">
              [{post.category.title}]
            </MonoLabel>
          </div>
          <MonoLabel>{formatDate(post.publishedAt)}</MonoLabel>
        </div>

        <h3 className="case-studies-card-title-featured case-font-card-lg case-studies-text-primary case-studies-mb-sm group-hover:underline decoration-2 underline-offset-8">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="case-studies-subtitle case-font-body case-studies-text-muted case-studies-mb">
            {post.subtitle}
          </p>
        )}

        {!hasImage && post.excerpt && (
          <p className="case-studies-excerpt-mono case-font-body case-studies-text-muted case-studies-mb line-clamp-4 border-l-2 case-studies-border-soft pl-4">
            {post.excerpt}
          </p>
        )}

        <div className="case-studies-card-footer">
          <span className="case-font-label-lg case-studies-text-primary group-hover:case-studies-text-accent transition-colors">
            Read Case
          </span>
          <ArrowRight className="w-4 h-4 group-hover:case-studies-text-accent group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function GridCard({ post }: { post: CaseStudyPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(533).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <Link href={`/case-studies/${post.slug.current}`} className="case-studies-card-shell group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <MonoLabel className="case-studies-text-soft group-hover:case-studies-text-primary transition-colors">[{post.category.title}]</MonoLabel>
        </div>
        <MonoLabel className="case-studies-text-subtle">{formatDate(post.publishedAt)}</MonoLabel>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="case-font-card font-semibold leading-tight case-studies-text-primary mb-3 group-hover:underline decoration-1 underline-offset-4">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="case-font-body leading-relaxed case-studies-text-muted line-clamp-2 mb-4">
            {post.subtitle}
          </p>
        )}

        {hasImage && (
          <div className="mt-auto mb-4">
          <div className="relative w-full aspect-[3/2] case-studies-surface-muted overflow-hidden border case-studies-border-subtle">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
          </div>
        )}

        {!hasImage && post.excerpt && (
          <div className="relative mt-2 mb-4 flex-1">
            <div className="absolute left-0 top-0 bottom-0 w-px case-studies-border-subtle group-hover:case-studies-text-accent transition-colors" />
            <p className="case-font-body-lg case-studies-text-soft leading-relaxed pl-4 line-clamp-[10]">
              {post.excerpt}...
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t case-studies-border-subtle flex items-center justify-between group-hover:case-studies-surface-quiet -mx-0 px-2 pb-2 transition-colors rounded-b-sm">
        <span className="case-font-label case-studies-text-subtle group-hover:case-studies-text-accent transition-colors">
          Read Case
        </span>
        <ArrowRight className="w-3 h-3 case-studies-text-soft group-hover:case-studies-text-accent group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

function MagazineCard({ post }: { post: CaseStudyPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(500).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/case-studies/${post.slug.current}`}
      className={`case-studies-card-shell group grid gap-8 items-start
        ${hasImage ? 'grid-cols-1 md:grid-cols-[2fr_3fr]' : 'grid-cols-1'}
      `}
    >
      {hasImage && (
        <div className="relative aspect-[4/3] md:aspect-[16/10] case-studies-surface-muted overflow-hidden border case-studies-border-subtle">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col h-full justify-center">
      <div className="flex items-center gap-4 mb-4">
        <MonoLabel>{formatDate(post.publishedAt)}</MonoLabel>
          <div className="h-px w-8 case-studies-border-subtle"></div>
        <MonoLabel className="case-studies-text-soft group-hover:case-studies-text-primary transition-colors">
          [{post.category.title}]
        </MonoLabel>
      </div>
        <h3 className={`leading-tight mb-4 transition-colors group-hover:case-studies-text-accent
          ${hasImage ? 'case-font-card' : 'case-font-section'}
          font-semibold case-studies-text-primary
        `}>
          {post.title}
        </h3>
        <p className="case-font-body case-studies-text-muted leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
          {post.excerpt ? post.excerpt.substring(0, hasImage ? 180 : 300) : post.subtitle}...
        </p>
        <span className="flex items-center gap-2 case-font-label font-semibold mt-auto group-hover:translate-x-2 transition-transform case-studies-text-accent">
          Read Case <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

function FeedRow({ post }: { post: CaseStudyPost }) {
  return (
    <Link
      href={`/case-studies/${post.slug.current}`}
      className="case-studies-feed-row group"
    >
      <div className="w-32 shrink-0">
        <MonoLabel className="case-studies-text-subtle group-hover:case-studies-text-primary transition-colors">
          {formatDate(post.publishedAt)}
        </MonoLabel>
      </div>
      <div className="flex-1">
        <h3 className="case-font-body font-semibold case-studies-text-primary group-hover:case-studies-text-accent transition-colors">
          {post.title}
        </h3>
      </div>
      <div className="w-auto hidden md:block shrink-0">
        <span className="case-font-label case-studies-text-soft">
          {post.category.title}
        </span>
      </div>
    </Link>
  );
}

// --- Detail View Component ---
