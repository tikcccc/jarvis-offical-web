'use client';

import * as m from '@/paraglide/messages';
import { Grid3x3, LayoutGrid, List } from 'lucide-react';

type LayoutMode = 'grid' | 'magazine' | 'feed';

interface NewsCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color: string;
}

interface NewsroomFiltersProps {
  categories: NewsCategory[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
}

export default function NewsroomFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  layoutMode,
  onLayoutChange,
}: NewsroomFiltersProps) {
  return (
    <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => onCategoryChange(null)}
          className={`newsroom-filter-btn ${!selectedCategory ? 'active' : ''}`}
        >
          {m.newsroom_all_categories()}
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category._id)}
            className={`newsroom-filter-btn ${
              selectedCategory === category._id ? 'active' : ''
            }`}
            style={{
              ...(selectedCategory === category._id && {
                backgroundColor: category.color,
                borderColor: category.color,
                color: '#ffffff',
              }),
            }}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Layout Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onLayoutChange('grid')}
          className={`newsroom-layout-btn ${layoutMode === 'grid' ? 'active' : ''}`}
          aria-label="Grid layout"
          title="Grid layout"
        >
          <LayoutGrid size={20} />
        </button>

        <button
          onClick={() => onLayoutChange('magazine')}
          className={`newsroom-layout-btn ${layoutMode === 'magazine' ? 'active' : ''}`}
          aria-label="Magazine layout"
          title="Magazine layout"
        >
          <Grid3x3 size={20} />
        </button>

        <button
          onClick={() => onLayoutChange('feed')}
          className={`newsroom-layout-btn ${layoutMode === 'feed' ? 'active' : ''}`}
          aria-label="Feed layout"
          title="Feed layout"
        >
          <List size={20} />
        </button>
      </div>
    </div>
  );
}
