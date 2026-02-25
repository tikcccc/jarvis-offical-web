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
interface NewsPost {
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

interface NewsCategory {
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
  <span className={`news-font-label newsroom-text-subtle ${className}`}>
    {children}
  </span>
);

// --- Hero Section Component ---
function HeroSection({ post, readFeaturedLabel }: { post: NewsPost; readFeaturedLabel: string }) {
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
    <Link href={`/newsroom/${post.slug.current}`}>
      <div className="relative w-full h-[80vh] min-h-[600px] mb-12 group overflow-hidden newsroom-hero-surface cursor-pointer">

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
            {/* TOP: Newsroom Masthead (Inside Hero) */}
            <m.div
              className="pt-24 md:pt-32"
              variants={titleVariants}
            >
              <h1 className="newsroom-hero-title news-font-hero">
                Newsroom
              </h1>
            </m.div>
          </div>

          {/* BOTTOM: Featured Article Info */}
          <div className="w-full max-w-[90%] md:max-w-[88%] xl:max-w-[1700px] mx-auto px-0 md:px-6 pb-8 md:pb-12">
            {/* Category Tag */}
            <m.div className="flex gap-3 mb-6" variants={heroItemVariants}>
              <span className="newsroom-hero-badge news-font-mono-xs">
                {post.category.title}
              </span>
            </m.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <m.div className="flex gap-3 mb-6" variants={heroItemVariants}>
            {post.tags.map(tag => (
              <span key={tag} className="newsroom-hero-badge news-font-mono-xs">
                {tag}
              </span>
            ))}
          </m.div>
        )}

        {/* Date */}
        <m.div className="mb-4" variants={heroItemVariants}>
          <span className="news-font-label newsroom-text-inverse-sub">
            {formatDate(post.publishedAt)}
          </span>
        </m.div>

            {/* Title */}
            <m.h2
              className="news-font-headline newsroom-text-inverse-strong mb-6 leading-[1.1]"
              variants={heroItemVariants}
            >
              {post.title}
            </m.h2>

            {/* Subtitle */}
            {post.subtitle && (
              <m.p
                className="news-font-subtitle newsroom-text-inverse-muted max-w-2xl leading-relaxed border-l-2 border-white/30 pl-6"
                variants={heroItemVariants}
              >
                {post.subtitle}
              </m.p>
            )}

            {/* Read More CTA with Arrow */}
            <m.div className="mt-8 flex items-center gap-3" variants={heroItemVariants}>
              <span className="news-font-label-lg newsroom-text-inverse-strong">
                {readFeaturedLabel}
              </span>
              <MoveRight className="w-5 h-5 md:w-6 md:h-6 newsroom-text-inverse transition-transform duration-300 group-hover:translate-x-2" />
            </m.div>
          </div>
        </m.div>
      </div>
    </Link>
  );
}

// --- Main Page Component ---

interface NewsroomPageClientProps {
  initialNews: NewsPost[];
  categories: NewsCategory[];
  featuredNews: NewsPost | null;
}

export default function NewsroomPageClient({
  initialNews,
  categories,
  featuredNews,
}: NewsroomPageClientProps) {
  const locale = useLocale() as "en" | "zh";

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.groupCollapsed('[Newsroom][Debug] Initial payload');
      console.log('featuredNews', featuredNews);
      console.log('categories', categories);
      console.log('initialNews length', initialNews.length);
      console.log('initialNews slugs', initialNews.map(n => n.slug?.current));
      console.log('initialNews', initialNews);
      console.groupEnd();
    }
  }, [initialNews, categories, featuredNews]);

  return (
    <div className="newsroom-page surface-noise-overlay">
      {/* Global noise texture overlay */}
      <div className="noise-grain" />

      <NewsListView
        key="list"
        newsData={initialNews}
        categories={categories}
        featuredNews={featuredNews}
        locale={locale}
      />
    </div>
  );
}

// --- List View Container ---

function NewsListView({
  newsData,
  categories,
  featuredNews,
  locale,
}: {
  newsData: NewsPost[];
  categories: NewsCategory[];
  featuredNews: NewsPost | null;
  locale: "en" | "zh";
}) {
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [filter, setFilter] = useState<CategoryFilter>('All');

  // Drop draft categories coming from Sanity to keep filter ids in sync with published news refs
  const publishedCategories = categories.filter(
    (cat) => !cat._id.startsWith('drafts.')
  );

  const derivedCategories: NewsCategory[] =
    publishedCategories.length > 0
      ? publishedCategories
      : Array.from(
          new Map(
            newsData.map((post) => [
              post.category._id,
              {
                _id: post.category._id,
                title: post.category.title,
                slug: post.category.slug,
                description: "",
                color: post.category.color,
              } as NewsCategory,
            ])
          ).values()
        );

  // Sort by date (newest first)
  const sortedNewsData = [...newsData].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const filteredData = filter === 'All'
    ? sortedNewsData
    : sortedNewsData.filter(post => post.category._id === filter);

  // Hero post logic (NOT affected by filter):
  // - If featured news exists: ALWAYS use featured news (regardless of filter)
  // - Otherwise: use newest article from ALL news (not filtered)
  const heroPost = featuredNews
    ? featuredNews
    : sortedNewsData.length > 0
      ? sortedNewsData[0]
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
          readFeaturedLabel={m18n.news_read_story({}, { languageTag: locale })}
        />
      )}

      {/* Container for Controls & List */}
      <div className="container-content">
        {/* Controls Area */}
        <div className="mb-12 border-b newsroom-border-strong pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            {/* Category Filter */}
            <div className="newsroom-filter-section">
              {['All', ...derivedCategories.map(cat => cat._id)].map((catId) => {
                const cat = derivedCategories.find(c => c._id === catId);
                const label =
                  catId === "All"
                    ? m18n.newsroom_all_categories({}, { languageTag: locale })
                    : cat?.title ?? "";
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => setFilter(catId as CategoryFilter)}
                    className={`newsroom-filter-btn ${filter === catId ? 'active' : ''}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <h2 className="news-font-section newsroom-text-primary">
              {m18n.newsroom_title({}, { languageTag: locale })}
            </h2>
          </div>

          {/* Layout Switcher */}
          <div className="newsroom-layout-toggle">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`newsroom-layout-btn ${layout === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('magazine')}
              className={`newsroom-layout-btn ${layout === 'magazine' ? 'active' : ''}`}
              title="Strategic View"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('feed')}
              className={`newsroom-layout-btn ${layout === 'feed' ? 'active' : ''}`}
              title="Data Feed"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Layout Renderer */}
        <div className="min-h-[500px]">
          {!hasFilteredResults ? (
            <div className="py-20 text-center newsroom-border border-dashed newsroom-surface-quiet">
              <p className="newsroom-label-xs newsroom-text-soft">No More Intelligence Found</p>
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
                <div className="border-t newsroom-border-subtle">
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

function FeaturedGridCard({ post }: { post: NewsPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(1200).height(675).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/newsroom/${post.slug.current}`}
      className="newsroom-card-featured group"
    >
      {hasImage && (
        <div className="newsroom-card-featured-image">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="newsroom-card-featured-content">
        <div className="flex justify-between items-start newsroom-mb-sm">
          <div className="flex gap-2">
            <MonoLabel className="newsroom-text-soft group-hover:newsroom-text-primary transition-colors">
              [{post.category.title}]
            </MonoLabel>
          </div>
          <MonoLabel>{formatDate(post.publishedAt)}</MonoLabel>
        </div>

        <h3 className="newsroom-card-title-featured news-font-card-lg newsroom-text-primary newsroom-mb-sm group-hover:underline decoration-2 underline-offset-8">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="newsroom-subtitle news-font-body newsroom-text-muted newsroom-mb">
            {post.subtitle}
          </p>
        )}

        {!hasImage && post.excerpt && (
          <p className="newsroom-excerpt-mono news-font-body newsroom-text-muted newsroom-mb line-clamp-4 border-l-2 newsroom-border-soft pl-4">
            {post.excerpt}
          </p>
        )}

        <div className="newsroom-card-footer">
          <span className="news-font-label-lg newsroom-text-primary group-hover:newsroom-text-accent transition-colors">
            Read Story
          </span>
          <ArrowRight className="w-4 h-4 group-hover:newsroom-text-accent group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function GridCard({ post }: { post: NewsPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(533).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <Link href={`/newsroom/${post.slug.current}`} className="newsroom-card-shell group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <MonoLabel className="newsroom-text-soft group-hover:newsroom-text-primary transition-colors">[{post.category.title}]</MonoLabel>
        </div>
        <MonoLabel className="newsroom-text-subtle">{formatDate(post.publishedAt)}</MonoLabel>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="news-font-card font-semibold leading-tight newsroom-text-primary mb-3 group-hover:underline decoration-1 underline-offset-4">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="news-font-body leading-relaxed newsroom-text-muted line-clamp-2 mb-4">
            {post.subtitle}
          </p>
        )}

        {hasImage && (
          <div className="mt-auto mb-4">
          <div className="relative w-full aspect-[3/2] newsroom-surface-muted overflow-hidden border newsroom-border-subtle">
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
            <div className="absolute left-0 top-0 bottom-0 w-px newsroom-border-subtle group-hover:newsroom-text-accent transition-colors" />
            <p className="news-font-body-lg newsroom-text-soft leading-relaxed pl-4 line-clamp-[10]">
              {post.excerpt}...
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t newsroom-border-subtle flex items-center justify-between group-hover:newsroom-surface-quiet -mx-0 px-2 pb-2 transition-colors rounded-b-sm">
        <span className="news-font-label newsroom-text-subtle group-hover:newsroom-text-accent transition-colors">
          Read Story
        </span>
        <ArrowRight className="w-3 h-3 newsroom-text-soft group-hover:newsroom-text-accent group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

function MagazineCard({ post }: { post: NewsPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset)?.width(800).height(500).url()
    : null;
  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/newsroom/${post.slug.current}`}
      className={`newsroom-card-shell group grid gap-8 items-start
        ${hasImage ? 'grid-cols-1 md:grid-cols-[2fr_3fr]' : 'grid-cols-1'}
      `}
    >
      {hasImage && (
        <div className="relative aspect-[4/3] md:aspect-[16/10] newsroom-surface-muted overflow-hidden border newsroom-border-subtle">
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
          <div className="h-px w-8 newsroom-border-subtle"></div>
        <MonoLabel className="newsroom-text-soft group-hover:newsroom-text-primary transition-colors">
          [{post.category.title}]
        </MonoLabel>
      </div>
        <h3 className={`leading-tight mb-4 transition-colors group-hover:newsroom-text-accent
          ${hasImage ? 'news-font-card' : 'news-font-section'}
          font-semibold newsroom-text-primary
        `}>
          {post.title}
        </h3>
        <p className="news-font-body newsroom-text-muted leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
          {post.excerpt ? post.excerpt.substring(0, hasImage ? 180 : 300) : post.subtitle}...
        </p>
        <span className="flex items-center gap-2 news-font-label font-semibold mt-auto group-hover:translate-x-2 transition-transform newsroom-text-accent">
          Read Full Briefing <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

function FeedRow({ post }: { post: NewsPost }) {
  return (
    <Link
      href={`/newsroom/${post.slug.current}`}
      className="newsroom-feed-row group"
    >
      <div className="w-32 shrink-0">
        <MonoLabel className="newsroom-text-subtle group-hover:newsroom-text-primary transition-colors">
          {formatDate(post.publishedAt)}
        </MonoLabel>
      </div>
      <div className="flex-1">
        <h3 className="news-font-body font-semibold newsroom-text-primary group-hover:newsroom-text-accent transition-colors">
          {post.title}
        </h3>
      </div>
      <div className="w-auto hidden md:block shrink-0">
        <span className="news-font-label newsroom-text-soft">
          {post.category.title}
        </span>
      </div>
    </Link>
  );
}

// --- Detail View Component ---
