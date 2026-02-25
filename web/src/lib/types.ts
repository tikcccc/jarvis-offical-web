/**
 * Shared TypeScript types for the isBIM Official Website
 */

// Product & Service Types
export interface Product {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: string;
  category?: "jarvis" | "service";
}

export interface FeatureBlock {
  title: string;
  content: string;
  icon?: string;
  layout?: "horizontal" | "vertical";
}

export interface Statistic {
  value: string;
  label: string;
  description?: string;
  highlight?: boolean;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  submenu?: NavItem[];
}

export interface MenuItem extends NavItem {
  icon?: string;
  description?: string;
}

// Section Props Types
export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  variant?: "default" | "minimal" | "full-screen";
  className?: string;
}

export interface CTASectionProps {
  text: string;
  buttonText: string;
  buttonHref: string;
  variant?: "default" | "centered" | "split";
  className?: string;
}

export interface ProductCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export interface FeatureBlockProps extends FeatureBlock {
  className?: string;
}

export interface StatisticsSectionProps {
  stats: Statistic[];
  layout?: "grid" | "horizontal";
  title?: string;
  className?: string;
}

export interface QuotationSectionProps {
  quote: string;
  author?: string;
  variant?: "default" | "large";
  className?: string;
}

export interface ScrollPromptProps {
  text?: string;
  className?: string;
}

export interface NarrativeSectionProps {
  title?: string;
  content: string | React.ReactNode;
  variant?: "single" | "multi-column";
  className?: string;
}

export interface SlideShowSectionProps {
  slides: Array<{
    image?: string;
    title: string;
    description?: string;
  }>;
  autoplay?: boolean;
  interval?: number;
  className?: string;
}

// Animation Component Props
export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export interface SlideInProps {
  children: React.ReactNode;
  direction: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

// Sanity CMS Types
export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  body?: unknown;
  author?: {
    name: string;
    image?: string;
  };
  mainImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
}

export interface SanityNews extends SanityPost {
  category?: string;
  featured?: boolean;
}

export interface SanityCareer {
  _id: string;
  title: string;
  slug: { current: string };
  pillar?: {
    _id?: string;
    title?: string;
    slug?: { current?: string };
    sortOrder?: number;
    description?: string;
  };
  team?: {
    _id?: string;
    title?: string;
    slug?: { current?: string };
    pillar?: {
      _id?: string;
      title?: string;
      slug?: { current?: string };
      sortOrder?: number;
      description?: string;
    };
    sortOrder?: number;
    description?: string;
  };
  locations?: Array<{
    _id?: string;
    title?: string;
    slug?: { current?: string };
  }>;
  workModel?: "onsite" | "hybrid" | "remote";
  employmentType?: "full-time" | "part-time" | "contract" | "internship" | "temporary";
  experienceLevel?: "intern" | "junior" | "mid" | "senior" | "lead" | "director";
  sections?: unknown;
  contentImage?: {
    asset?: { url?: string };
    alt?: string;
  };
  postedAt?: string;
  expiresAt?: string;
}

export interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  client: string;
  location: string;
  completionDate: string;
  description: string;
  services: string[];
  stats?: Statistic[];
  images?: Array<{
    asset: { url: string };
    alt?: string;
  }>;
  featured?: boolean;
}

export interface SanityApplicationSettings {
  _id: string;
  _type: "applicationSettings";
  url: string;
}

// Locale Types
export type Locale = "zh" | "en";

export interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}
