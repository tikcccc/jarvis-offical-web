'use client';

import { useState } from 'react';
import * as m from '@/paraglide/messages';
import FeaturedNewsCard from './featured-news-card';
import NewsCard from './news-card';
import type { Image as SanityImage } from 'sanity';

type LayoutMode = 'grid' | 'magazine' | 'feed';

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
  featured?: boolean;
}

interface NewsCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color: string;
}

interface NewsroomListProps {
  initialNews: NewsItem[];
  categories: NewsCategory[];
  featuredNews: NewsItem | null;
}

export default function NewsroomList({
  initialNews,
  categories,
  featuredNews,
}: NewsroomListProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter news by category
  const filteredNews = selectedCategory
    ? initialNews.filter((news) => news.category._id === selectedCategory)
    : initialNews;

  // Only hide the featured card on the list when we're actually showing it
  const showFeatured = Boolean(featuredNews && !selectedCategory);

  // Separate featured from regular news (if not already separated)
  const regularNews = showFeatured
    ? filteredNews.filter((news) => news._id !== featuredNews!._id)
    : filteredNews;

  const hasRegularNews = regularNews.length > 0;

  return (
    <div className="newsroom-container">
      <div className="newsroom-content newsroom-section">
        {/* Page Header with Title and Layout Toggle */}
        <div className="mb-8 border-b newsroom-border-strong pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="news-font-section">
              {m.newsroom_title()}
            </h1>

            {/* Layout Controls */}
            <div className="flex items-center gap-2 border newsroom-border-subtle p-1 newsroom-surface-card">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`newsroom-layout-btn ${layoutMode === 'grid' ? 'active' : ''}`}
                title="Grid layout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
                </svg>
              </button>

              <button
                onClick={() => setLayoutMode('magazine')}
                className={`newsroom-layout-btn ${layoutMode === 'magazine' ? 'active' : ''}`}
                title="Magazine layout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2"/>
                  <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2"/>
                </svg>
              </button>

              <button
                onClick={() => setLayoutMode('feed')}
                className={`newsroom-layout-btn ${layoutMode === 'feed' ? 'active' : ''}`}
                title="Feed layout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="8" y1="6" x2="21" y2="6" strokeWidth="2"/>
                  <line x1="8" y1="12" x2="21" y2="12" strokeWidth="2"/>
                  <line x1="8" y1="18" x2="21" y2="18" strokeWidth="2"/>
                  <line x1="3" y1="6" x2="4" y2="6" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="4" y2="12" strokeWidth="2"/>
                  <line x1="3" y1="18" x2="4" y2="18" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`newsroom-filter-btn ${!selectedCategory ? 'active' : ''}`}
            >
              {m.newsroom_all_categories()}
            </button>

            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`newsroom-filter-btn ${selectedCategory === category._id ? 'active' : ''}`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Featured News (if exists and no category filter) */}
        {showFeatured && featuredNews && (
          <div className="mb-12 newsroom-animate-in">
            <FeaturedNewsCard news={featuredNews} />
          </div>
        )}

        {/* News Grid/Magazine/Feed */}
        {hasRegularNews ? (
          <div
            className={`
              ${layoutMode === 'grid' ? 'newsroom-grid' : ''}
              ${layoutMode === 'magazine' ? 'newsroom-magazine' : ''}
              ${layoutMode === 'feed' ? 'newsroom-feed' : ''}
            `}
          >
            {regularNews.map((news, index) => (
              <div
                key={news._id}
                className={`
                  newsroom-animate-in
                  ${index === 0 ? 'newsroom-animate-delay-100' : ''}
                  ${index === 1 ? 'newsroom-animate-delay-200' : ''}
                  ${index === 2 ? 'newsroom-animate-delay-300' : ''}
                  ${index === 3 ? 'newsroom-animate-delay-400' : ''}
                `}
              >
                <NewsCard news={news} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="newsroom-body">
              {selectedCategory
                ? m.newsroom_no_articles_in_category()
                : m.newsroom_no_articles()}
            </p>
          </div>
        )}

        {/* Load More Button (placeholder for future pagination) */}
        {regularNews.length >= 12 && (
          <div className="mt-12 text-center">
            <button
              className="newsroom-filter-btn newsroom-filter-btn-wide"
              onClick={() => {
                // TODO: Implement load more functionality
                console.log('Load more articles');
              }}
            >
              {m.newsroom_load_more()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
