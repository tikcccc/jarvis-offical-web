/**
 * Application Constants
 *
 * Purpose:
 * - Define application-wide route constants (ROUTES)
 * - Define all page URL paths
 * - Include JARVIS products, services, navigation configuration
 * - Avoid hardcoded strings for centralized management
 *
 * Usage:
 * ```tsx
 * import { ROUTES, JARVIS_PRODUCTS } from "@/lib/constants";
 *
 * <Link href={ROUTES.JARVIS.AGENT}>JARVIS Agent</Link>
 * ```
 */

/**
 * Application Routes
 * All page paths used in the application.
 */
export const ROUTES = {
  /** Home page */
  HOME: "/",

  /** About Us page */
  ABOUT: "/about-us",

  /** Services & Products overview */
  SERVICES_PRODUCTS: "/services-products",

  /** JARVIS AI Suite pages */
  JARVIS: {
    /** JARVIS AI Suite overview */
    SUITE: "/jarvis-ai-suite",
    /** JARVIS Agent - AI Assistant */
    AGENT: "/jarvis-agent",
    /** JARVIS Pay - Payment System */
    PAY: "/jarvis-pay",
    /** JARVIS Air - Air Quality Monitoring */
    AIR: "/jarvis-air",
    /** JARVIS Eagle Eye - Safety Monitoring */
    EAGLE_EYE: "/jarvis-eagle-eye",
    /** JARVIS SSSS - Smart Safety System */
    SSSS: "/jarvis-ssss",
    /** JARVIS DWSS - Digital Work Site System */
    DWSS: "/jarvis-dwss",
    /** JARVIS CDCP - Carbon Data Collection Platform */
    CDCP: "/jarvis-cdcp",
    /** JARVIS Assets - Asset Management */
    ASSETS: "/jarvis-assets",
    /** JARVIS JPM - Project Management */
    JPM: "/jarvis-jpm",
  },

  /** BIM Consultancy Services */
  BIM_CONSULTANCY: "/bim-consultancy",

  /** Project Finance */
  PROJECT_FINANCE: "/project-finance",

  /** Venture Investments */
  VENTURE_INVESTMENTS: "/venture-investments",

  /** Newsroom */
  NEWSROOM: "/newsroom",

  /** Case Studies */
  CASE_STUDIES: "/case-studies",

  /** Careers */
  CAREERS: "/careers",

  /** Contact Us */
  CONTACT: "/contact",
} as const;

/**
 * JARVIS Product IDs
 * Numeric identifiers for each JARVIS product.
 */
export const JARVIS_PRODUCT_IDS = {
  AGENT: 1,
  PAY: 2,
  AIR: 3,
  EAGLE_EYE: 4,
  SSSS: 5,
  DWSS: 6,
  CDCP: 7,
  ASSETS: 8,
} as const;

/**
 * JARVIS Products Configuration
 * Maps product IDs to their routes and slugs.
 */
export const JARVIS_PRODUCTS = [
  { id: JARVIS_PRODUCT_IDS.AGENT, slug: "agent", route: ROUTES.JARVIS.AGENT },
  { id: JARVIS_PRODUCT_IDS.PAY, slug: "pay", route: ROUTES.JARVIS.PAY },
  { id: JARVIS_PRODUCT_IDS.AIR, slug: "air", route: ROUTES.JARVIS.AIR },
  { id: JARVIS_PRODUCT_IDS.EAGLE_EYE, slug: "eagle-eye", route: ROUTES.JARVIS.EAGLE_EYE },
  { id: JARVIS_PRODUCT_IDS.SSSS, slug: "ssss", route: ROUTES.JARVIS.SSSS },
  { id: JARVIS_PRODUCT_IDS.DWSS, slug: "dwss", route: ROUTES.JARVIS.DWSS },
  { id: JARVIS_PRODUCT_IDS.CDCP, slug: "cdcp", route: ROUTES.JARVIS.CDCP },
  { id: JARVIS_PRODUCT_IDS.ASSETS, slug: "assets", route: ROUTES.JARVIS.ASSETS },
] as const;

/**
 * Site Configuration
 * Basic site metadata and configuration.
 */
export const SITE_CONFIG = {
  /** Site name */
  name: "isBIM",
  /** Site title */
  title: "isBIM - Building Information Modeling Platform",
  /** Site description */
  description:
    "isBIM provides comprehensive BIM solutions and JARVIS AI-powered construction management platform for modern infrastructure projects.",
  /** Site URL (production) */
  url: "https://isbim.com",
  /** Default locale */
  defaultLocale: "zh",
  /** Available locales */
  locales: ["en", "zh"],
  /** Social media links */
  social: {
    linkedin: "https://linkedin.com/company/isbim",
    twitter: "https://twitter.com/isbim",
    facebook: "https://facebook.com/isbim",
    youtube: "https://youtube.com/@isbim",
  },
  /** Contact information */
  contact: {
    email: "info@isbim.com",
    phone: "+86 123 4567 8900",
  },
} as const;

/**
 * Service Categories
 * Types of services offered by isBIM.
 */
export const SERVICE_CATEGORIES = {
  /** JARVIS AI Suite */
  JARVIS_SUITE: "jarvis-suite",
  /** BIM Consultancy */
  BIM_CONSULTANCY: "bim-consultancy",
  /** Project Finance */
  PROJECT_FINANCE: "project-finance",
  /** Venture Investments */
  VENTURE_INVESTMENTS: "venture-investments",
} as const;

/**
 * Navigation Menu Structure IDs
 * Used for identifying menu items and active states.
 */
export const NAV_IDS = {
  HOME: "home",
  ABOUT: "about",
  SERVICES: "services",
  JARVIS_SUITE: "jarvis-suite",
  NEWSROOM: "newsroom",
  CASE_STUDIES: "case-studies",
  CAREERS: "careers",
  CONTACT: "contact",
} as const;

/**
 * API Endpoints
 * External API endpoints (if needed).
 */
export const API_ENDPOINTS = {
  /** Sanity CMS Project ID */
  SANITY_PROJECT_ID: "4y8vgu6z",
  /** Sanity Dataset */
  SANITY_DATASET: "production",
  /** Sanity API Version */
  SANITY_API_VERSION: "2024-01-01",
} as const;

/**
 * Form Validation Constants
 * Common validation rules.
 */
export const VALIDATION = {
  /** Email regex pattern */
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  /** Phone regex pattern (basic) */
  PHONE_REGEX: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  /** Minimum password length */
  PASSWORD_MIN_LENGTH: 8,
  /** Maximum text field length */
  TEXT_MAX_LENGTH: 500,
} as const;

/**
 * Date/Time Formats
 * Standard date and time formatting.
 */
export const DATE_FORMATS = {
  /** Short date: MM/DD/YYYY */
  SHORT: "MM/DD/YYYY",
  /** Long date: Month DD, YYYY */
  LONG: "MMMM DD, YYYY",
  /** ISO date: YYYY-MM-DD */
  ISO: "YYYY-MM-DD",
  /** Time: HH:MM AM/PM */
  TIME: "hh:mm A",
} as const;

/**
 * Carousel Configuration
 * Settings for carousel components.
 */
export const CAROUSEL_CONFIG = {
  /** Auto-play duration (ms) */
  AUTOPLAY_DURATION: 5000,
  /** Transition duration (ms) */
  TRANSITION_DURATION: 600,
  /** Number of visible slides */
  SLIDES_TO_SHOW: 1,
} as const;

/**
 * Feature Flags
 * Toggle features on/off.
 */
export const FEATURE_FLAGS = {
  /** Enable dark mode toggle */
  DARK_MODE: false,
  /** Enable search functionality */
  SEARCH: false,
  /** Enable chatbot */
  CHATBOT: false,
  /** Enable analytics */
  ANALYTICS: true,
} as const;

const constants = {
  ROUTES,
  JARVIS_PRODUCT_IDS,
  JARVIS_PRODUCTS,
  SITE_CONFIG,
  SERVICE_CATEGORIES,
  NAV_IDS,
  API_ENDPOINTS,
  VALIDATION,
  DATE_FORMATS,
  CAROUSEL_CONFIG,
  FEATURE_FLAGS,
};

export default constants;
