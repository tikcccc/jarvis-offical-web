/**
 * Locale Route Builder
 *
 * Purpose:
 * - Type-safe routing with automatic locale prefixing
 * - Single source of truth for all route paths
 * - Eliminates hardcoded paths throughout the application
 * - Integrates seamlessly with Paraglide JS i18n
 *
 * Architecture:
 * - Pure functions accept locale parameter (for Server Components/Actions)
 * - React hooks use LocaleContext (for Client Components)
 * - Zero Hydration Mismatch by using consistent locale from Context
 *
 * Use Cases:
 * - Client Components: Use useLocalizedHref() hook
 * - Server Components: Use buildHref(path, params.locale)
 * - Server Actions: Use buildHref(path, locale)
 * - SEO/Metadata: Use buildHref(path, locale)
 *
 * Features:
 * - Automatic locale prefix injection
 * - TypeScript type safety for route keys
 * - Dual-mode design (pure functions + hooks)
 * - Prevents locale duplication
 * - Supports nested route objects
 */

import type { AvailableLanguageTag } from "@/paraglide/runtime";
import { ROUTES } from "@/lib/constants";
import { useLocale } from "./locale-context";

/**
 * Build a localized href by adding locale prefix (Pure Function)
 *
 * This is a pure function that accepts locale as parameter.
 * Use this in Server Components, Server Actions, or SEO functions.
 *
 * For Client Components, use useLocalizedHref() hook instead.
 *
 * @param path - The path to localize (e.g., "/about", "products/bim")
 * @param locale - The locale to use (e.g., "zh", "en")
 * @returns Localized path with locale prefix (e.g., "/zh/about", "/en/products/bim")
 *
 * @example
 * ```tsx
 * // In Server Component
 * export default function Page({ params }: { params: { locale: string } }) {
 *   const href = buildHref("/about", params.locale);
 *   // href = "/zh/about"
 * }
 *
 * // In generateMetadata
 * export async function generateMetadata({ params }) {
 *   const url = buildHref("/products", params.locale);
 *   return { alternates: { canonical: url } };
 * }
 * ```
 */
export function buildHref(path: string, locale: AvailableLanguageTag): string {
  // Already has locale prefix, return as-is
  if (path.startsWith(`/${locale}`)) {
    return path;
  }

  // Ensure path starts with "/"
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `/${locale}${cleanPath}`;
}

/**
 * Type-safe route builder using ROUTES constant (Pure Function)
 *
 * @param routeKey - Key from ROUTES object (e.g., "home", "about", "products")
 * @param locale - The locale to use (e.g., "zh", "en")
 * @param subKey - Optional sub-key for nested routes (e.g., "bim", "hvac")
 * @returns Localized route path
 *
 * @example
 * ```tsx
 * // In Server Component
 * linkTo("home", "zh") // Returns: "/zh"
 * linkTo("about", "en") // Returns: "/en/about"
 * linkTo("products", "zh", "bim") // Returns: "/zh/products/bim"
 * ```
 */
export function linkTo<T extends keyof typeof ROUTES>(
  routeKey: T,
  locale: AvailableLanguageTag,
  subKey?: string
): string {
  const route = ROUTES[routeKey];

  // Simple string route
  if (typeof route === "string") {
    return buildHref(route, locale);
  }

  // Nested object route
  if (subKey && typeof route === "object" && route !== null) {
    const subRoute = route[subKey as keyof typeof route];
    if (typeof subRoute === "string") {
      return buildHref(subRoute, locale);
    }
  }

  // Error: Invalid route configuration
  throw new Error(
    `Invalid route key: ${String(routeKey)}${subKey ? `.${subKey}` : ""}`
  );
}

/**
 * React hook for localized routing in Client Components
 *
 * Uses LocaleContext to get current locale, ensuring zero Hydration Mismatch.
 * Must be used within a LocaleProvider.
 *
 * @returns Object with locale, buildHref, and linkTo functions
 *
 * @example
 * ```tsx
 * function NavigationMenu() {
 *   const { locale, buildHref, linkTo } = useLocalizedHref();
 *
 *   return (
 *     <nav>
 *       <Link href={linkTo("home")}>Home</Link>
 *       <Link href={linkTo("about")}>About</Link>
 *       <Link href={linkTo("products", "bim")}>BIM</Link>
 *       <Link href={buildHref("/custom-path")}>Custom</Link>
 *       <p>Current locale: {locale}</p>
 *     </nav>
 *   );
 * }
 * ```
 */
export function useLocalizedHref() {
  const locale = useLocale();

  return {
    /** Current active locale (e.g., "zh", "en") */
    locale,
    /** Build localized href from path string */
    buildHref: (path: string) => buildHref(path, locale),
    /** Build localized href from route key (type-safe) */
    linkTo: <T extends keyof typeof ROUTES>(routeKey: T, subKey?: string) =>
      linkTo(routeKey, locale, subKey),
  };
}

/**
 * Check if a path already has a locale prefix (Pure Function)
 *
 * @param path - Path to check
 * @param locale - Locale to check for
 * @returns True if path starts with the locale prefix
 *
 * @example
 * ```tsx
 * hasLocalePrefix("/zh/about", "zh") // true
 * hasLocalePrefix("/about", "zh") // false
 * hasLocalePrefix("zh/about", "zh") // true
 * ```
 */
export function hasLocalePrefix(
  path: string,
  locale: AvailableLanguageTag
): boolean {
  return path.startsWith(`/${locale}`) || path.startsWith(`${locale}/`);
}

/**
 * Legacy compatibility exports
 * @deprecated Use the named exports instead for better type safety
 */
const routeBuilder = {
  buildHref,
  linkTo,
  useLocalizedHref,
  hasLocalePrefix,
};

export default routeBuilder;
