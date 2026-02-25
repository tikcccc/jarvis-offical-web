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

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  // Build image URL
  const imageUrl = news.mainImage
    ? urlFor(news.mainImage.asset)?.width(800).height(450).url()
    : null;

  const hasImage = !!imageUrl;

  return (
    <Link
      href={`/newsroom/${news.slug.current}`}
      className="group cursor-pointer flex flex-col h-full relative newsroom-card-shell"
    >
      {/* Header: Category and Date */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <span className="news-font-label newsroom-text-subtle group-hover:newsroom-text-primary transition-colors">
            [{news.category.title}]
          </span>
        </div>
        <span className="news-font-label newsroom-text-subtle">
          {news.publishedAt}
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="news-font-card mb-3 group-hover:underline decoration-1 underline-offset-4">
          {news.title}
        </h3>

        {/* Subtitle */}
        {news.subtitle && (
          <p className="news-font-body line-clamp-2 mb-4">
            {news.subtitle}
          </p>
        )}

        {/* Image or Body Preview */}
        {hasImage ? (
          <div className="mt-auto mb-4">
            <div className="newsroom-media-frame relative w-full aspect-[3/2]">
              <Image
                src={imageUrl}
                alt={news.mainImage?.alt || news.title}
                width={800}
                height={450}
                className="newsroom-media-img w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="relative mt-2 mb-4 flex-1">
            <div className="newsroom-excerpt-bar absolute left-0 top-0 bottom-0 w-px" />
            <p className="news-font-body leading-relaxed pl-4 line-clamp-[10]">
              {news.excerpt}...
            </p>
          </div>
        )}
      </div>

      {/* Footer: Read Button */}
      <div className="newsroom-card-footer mt-auto flex items-center justify-between -mx-0">
        <span className="news-font-label newsroom-cta-link">
          Read Story
        </span>
        <ArrowRight className="w-3 h-3 newsroom-icon-soft transition-all group-hover:text-[var(--newsroom-accent-cta)] group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
