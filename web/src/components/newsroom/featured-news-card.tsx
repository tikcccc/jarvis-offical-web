'use client';

import Image from 'next/image';
import { Link } from '@/lib/i18n';
import { urlFor } from '@/sanity/lib/image';
import { ArrowRight } from 'lucide-react';
import type { Image as SanityImage } from 'sanity';

interface NewsItem {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  subtitle?: string;
  publishedAt: string;
  excerpt?: string;
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
}

interface FeaturedNewsCardProps {
  news: NewsItem;
}

export default function FeaturedNewsCard({ news }: FeaturedNewsCardProps) {
  // Build image URL with larger dimensions for featured card
  const imageUrl = news.mainImage
    ? urlFor(news.mainImage.asset)?.width(1400).height(600).url()
    : null;

  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/newsroom/${news.slug.current}`}
      className="group cursor-pointer newsroom-card-featured flex flex-col md:flex-row h-full"
    >
      {/* Image Section */}
      {hasImage && (
        <div className="newsroom-media-frame newsroom-media-featured w-full md:w-1/2 aspect-[16/9] md:aspect-auto relative border-b md:border-b-0 md:border-r newsroom-border-subtle">
          <Image
            src={imageUrl}
            alt={news.mainImage?.alt || news.title}
            width={1400}
            height={600}
            className="newsroom-media-img w-full h-full object-cover"
            priority
          />
        </div>
      )}

      {/* Content Section */}
      <div className={`newsroom-card-padding-lg flex flex-col justify-center ${hasImage ? 'w-full md:w-1/2' : 'w-full'}`}>
        {/* Header: Category and Date */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-2">
            <span className="news-font-label newsroom-text-subtle group-hover:newsroom-text-primary transition-colors">
              [{news.category.title}]
            </span>
          </div>
          <span className="news-font-label newsroom-text-subtle">
            {news.publishedAt}
          </span>
        </div>

        {/* Title */}
        <h3 className="newsroom-card-title-featured news-font-card-lg mb-6 group-hover:underline decoration-2 underline-offset-8">
          {news.title}
        </h3>

        {/* Subtitle */}
        {news.subtitle && (
          <p className="news-font-body leading-relaxed font-light mb-8">
            {news.subtitle}
          </p>
        )}

        {/* Excerpt (for non-image cards) */}
        {!hasImage && news.excerpt && (
          <p className="news-font-body leading-relaxed line-clamp-4 mb-6 border-l-2 newsroom-border-subtle pl-4">
            {news.excerpt}
          </p>
        )}

        {/* Footer: Read Button */}
        <div className="newsroom-card-footer mt-auto pt-4 flex items-center justify-between w-full border-t border-transparent">
          <span className="news-font-label-sm newsroom-cta-link">
            Read Story
          </span>
          <ArrowRight className="w-4 h-4 newsroom-icon-soft transition-all group-hover:text-[var(--newsroom-accent-cta)] group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
