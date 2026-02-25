"use client";

/**
 * Navigation Menu Structure
 *
 * Purpose:
 * - Define site-wide navigation menu hierarchy
 * - Include main menu and submenu (dropdown) configuration
 * - Used for Header and Footer navigation rendering
 * - Now integrated with type-safe route builder
 *
 * Note: This file only defines the structure with clean paths.
 * Use localizeNavItem() or localizeNavigation() helper functions in components
 * to automatically add locale prefixes using the route builder hook.
 *
 * Usage:
 * ```tsx
 * import { mainNavigation, localizeNavigation } from "@/data/navigation";
 * import { useLocalizedHref } from "@/lib/i18n";
 *
 * function MyNav() {
 *   const { buildHref } = useLocalizedHref();
 *   const localizedNav = localizeNavigation(mainNavigation, buildHref);
 *   // ...
 * }
 * ```
 */

import { ROUTES } from "@/lib/constants";

export interface NavigationItem {
  /** Display label (i18n key reference) */
  label: string;
  /** URL path (will be localized automatically) */
  href: string;
  /** Submenu items (for dropdown menus) */
  submenu?: NavigationItem[];
  /** Icon name or component (optional) */
  icon?: string;
  /** Description for mega menus (optional) */
  description?: string;
  /** Is this item highlighted? (e.g., "New" badge) */
  isHighlight?: boolean;
  /** Open in new tab? */
  external?: boolean;
}

/**
 * Helper function to localize navigation item hrefs
 * Automatically adds locale prefix to paths
 *
 * @param item - Navigation item to localize
 * @param buildHref - Build href function from useLocalizedHref() hook
 * @returns Localized navigation item
 */
export function localizeNavItem(
  item: NavigationItem,
  buildHref: (path: string) => string
): NavigationItem {
  return {
    ...item,
    href: buildHref(item.href),
    submenu: item.submenu?.map(subItem => localizeNavItem(subItem, buildHref)),
  };
}

/**
 * Helper function to localize all navigation items in array
 *
 * @param items - Array of navigation items
 * @param buildHref - Build href function from useLocalizedHref() hook
 * @returns Localized navigation items
 */
export function localizeNavigation(
  items: NavigationItem[],
  buildHref: (path: string) => string
): NavigationItem[] {
  return items.map(item => localizeNavItem(item, buildHref));
}

/**
 * Main Navigation Menu
 * Used in: Header, Topbar, Mobile Menu
 *
 * Structure:
 * - Top-level items appear in main navigation
 * - Items with submenu create dropdown/mega menus
 */
export const mainNavigation: NavigationItem[] = [
  {
    label: "About Us",
    href: ROUTES.ABOUT,
  },
  {
    label: "Services & Products",
    href: ROUTES.SERVICES_PRODUCTS,
    submenu: [
      {
        label: "JARVIS AI Suite",
        href: ROUTES.JARVIS.SUITE,
        description: "Comprehensive AI-powered construction management platform",
        isHighlight: true,
      },
      {
        label: "JARVIS Agent",
        href: ROUTES.JARVIS.AGENT,
        description: "AI-powered digital assistant for construction sites",
      },
      {
        label: "JARVIS Pay",
        href: ROUTES.JARVIS.PAY,
        description: "Smart payment and financial management system",
      },
      {
        label: "JARVIS Air",
        href: ROUTES.JARVIS.AIR,
        description: "Air quality and environmental monitoring",
      },
      {
        label: "JARVIS Eagle Eye",
        href: ROUTES.JARVIS.EAGLE_EYE,
        description: "Safety and security surveillance system",
      },
      {
        label: "JARVIS SSSS",
        href: ROUTES.JARVIS.SSSS,
        description: "Smart Site Safety System",
      },
      {
        label: "JARVIS DWSS",
        href: ROUTES.JARVIS.DWSS,
        description: "Digital Work Site System",
      },
      {
        label: "JARVIS CDCP",
        href: ROUTES.JARVIS.CDCP,
        description: "Carbon Data Collection Platform",
      },
      {
        label: "JARVIS Assets",
        href: ROUTES.JARVIS.ASSETS,
        description: "Asset management and tracking system",
      },
      {
        label: "JARVIS Project Management",
        href: ROUTES.JARVIS.JPM,
        description: "Comprehensive project management solution",
      },
      {
        label: "BIM Consultancy",
        href: ROUTES.BIM_CONSULTANCY,
        description: "Professional BIM consulting services",
      },
      {
        label: "Project Finance",
        href: ROUTES.PROJECT_FINANCE,
        description: "Construction project financing solutions",
      },
      {
        label: "Venture Investments",
        href: ROUTES.VENTURE_INVESTMENTS,
        description: "Strategic investments in construction technology",
      },
    ],
  },
  {
    label: "Newsroom",
    href: ROUTES.NEWSROOM,
  },
  {
    label: "Case Studies",
    href: ROUTES.CASE_STUDIES,
  },
  {
    label: "Careers",
    href: ROUTES.CAREERS,
  },
  {
    label: "Contact Us",
    href: ROUTES.CONTACT,
  },
];

/**
 * Footer Navigation
 * Used in: Footer component
 *
 * Organized by category for footer column layout.
 */
export const footerNavigation = {
  products: {
    label: "Products",
    items: [
      { label: "JARVIS AI Suite", href: ROUTES.JARVIS.SUITE },
      { label: "JARVIS Agent", href: ROUTES.JARVIS.AGENT },
      { label: "JARVIS Pay", href: ROUTES.JARVIS.PAY },
      { label: "JARVIS Air", href: ROUTES.JARVIS.AIR },
      { label: "JARVIS Eagle Eye", href: ROUTES.JARVIS.EAGLE_EYE },
      { label: "JARVIS SSSS", href: ROUTES.JARVIS.SSSS },
      { label: "JARVIS DWSS", href: ROUTES.JARVIS.DWSS },
      { label: "JARVIS CDCP", href: ROUTES.JARVIS.CDCP },
    ],
  },
  services: {
    label: "Services",
    items: [
      { label: "BIM Consultancy", href: ROUTES.BIM_CONSULTANCY },
      { label: "Project Finance", href: ROUTES.PROJECT_FINANCE },
      { label: "Venture Investments", href: ROUTES.VENTURE_INVESTMENTS },
      { label: "Project Management", href: ROUTES.JARVIS.JPM },
    ],
  },
  company: {
    label: "Company",
    items: [
      { label: "About Us", href: ROUTES.ABOUT },
      { label: "Newsroom", href: ROUTES.NEWSROOM },
      { label: "Case Studies", href: ROUTES.CASE_STUDIES },
      { label: "Careers", href: ROUTES.CAREERS },
      { label: "Contact", href: ROUTES.CONTACT },
    ],
  },
  legal: {
    label: "Legal",
    items: [
      { label: "Privacy & Cookie Policy", href: "/privacy-cookie-policy" },
    ],
  },
};

/**
 * Mobile Menu Navigation
 * Simplified structure for mobile hamburger menu.
 * Can be same as mainNavigation or simplified version.
 */
export const mobileNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: ROUTES.HOME,
  },
  {
    label: "About",
    href: ROUTES.ABOUT,
  },
  {
    label: "JARVIS Suite",
    href: ROUTES.JARVIS.SUITE,
    submenu: [
      { label: "JARVIS Agent", href: ROUTES.JARVIS.AGENT },
      { label: "JARVIS Pay", href: ROUTES.JARVIS.PAY },
      { label: "JARVIS Air", href: ROUTES.JARVIS.AIR },
      { label: "JARVIS Eagle Eye", href: ROUTES.JARVIS.EAGLE_EYE },
      { label: "JARVIS SSSS", href: ROUTES.JARVIS.SSSS },
      { label: "JARVIS DWSS", href: ROUTES.JARVIS.DWSS },
      { label: "JARVIS CDCP", href: ROUTES.JARVIS.CDCP },
      { label: "JARVIS Assets", href: ROUTES.JARVIS.ASSETS },
    ],
  },
  {
    label: "Services",
    href: ROUTES.SERVICES_PRODUCTS,
    submenu: [
      { label: "BIM Consultancy", href: ROUTES.BIM_CONSULTANCY },
      { label: "Project Finance", href: ROUTES.PROJECT_FINANCE },
      { label: "Venture Investments", href: ROUTES.VENTURE_INVESTMENTS },
      { label: "Project Management", href: ROUTES.JARVIS.JPM },
    ],
  },
  {
    label: "Newsroom",
    href: ROUTES.NEWSROOM,
  },
  {
    label: "Case Studies",
    href: ROUTES.CASE_STUDIES,
  },
  {
    label: "Careers",
    href: ROUTES.CAREERS,
  },
  {
    label: "Contact",
    href: ROUTES.CONTACT,
  },
];

/**
 * Breadcrumb Helper
 * Generate breadcrumb data from current path.
 * Now uses hasLocalePrefix to properly detect locale prefixes.
 *
 * @param pathname - Current pathname
 * @param buildHref - Build href function from useLocalizedHref() hook
 * @returns Array of breadcrumb items
 *
 * @example
 * ```ts
 * const { buildHref } = useLocalizedHref();
 * const breadcrumbs = generateBreadcrumbs("/en/jarvis-agent", buildHref);
 * // Returns: [{ label: "Home", href: "/en" }, { label: "JARVIS Agent", href: "/en/jarvis-agent" }]
 * ```
 */
export function generateBreadcrumbs(
  pathname: string,
  buildHref: (path: string) => string
): NavigationItem[] {
  const breadcrumbs: NavigationItem[] = [
    { label: "Home", href: buildHref(ROUTES.HOME) },
  ];

  // Strip locale prefix if present (matches /en or /zh at start)
  const cleanPath = pathname.replace(/^\/(en|zh)/, "");

  if (cleanPath === "/" || cleanPath === "") {
    return breadcrumbs;
  }

  // Find matching navigation item
  const findInNav = (
    items: NavigationItem[],
    path: string
  ): NavigationItem | null => {
    for (const item of items) {
      if (item.href === path) return item;
      if (item.submenu) {
        const found = findInNav(item.submenu, path);
        if (found) return found;
      }
    }
    return null;
  };

  const current = findInNav(mainNavigation, cleanPath);
  if (current) {
    breadcrumbs.push({
      label: current.label,
      href: buildHref(current.href),
    });
  }

  return breadcrumbs;
}

/**
 * Get Active Navigation Item
 * Find the currently active navigation item based on pathname.
 * Now properly handles locale prefixes.
 */
export function getActiveNavItem(pathname: string): NavigationItem | null {
  // Strip locale prefix (matches /en or /zh at start)
  const cleanPath = pathname.replace(/^\/(en|zh)/, "");

  const findInNav = (
    items: NavigationItem[],
    path: string
  ): NavigationItem | null => {
    for (const item of items) {
      if (item.href === path) return item;
      if (item.submenu) {
        const found = findInNav(item.submenu, path);
        if (found) return found;
      }
    }
    return null;
  };

  return findInNav(mainNavigation, cleanPath);
}

const navigation = {
  mainNavigation,
  footerNavigation,
  mobileNavigation,
  generateBreadcrumbs,
  getActiveNavItem,
};

export default navigation;
