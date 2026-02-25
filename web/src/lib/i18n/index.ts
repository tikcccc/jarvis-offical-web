"use client";

/**
 * i18n Utilities Index
 * Centralized exports for all i18n-related utilities.
 *
 * Note: This is a Client Component because it re-exports utilities
 * that use React hooks and Context.
 *
 * Architecture:
 * - Pure functions (buildHref, linkTo, hasLocalePrefix) accept locale parameter
 * - React hooks (useLocalizedHref, useLocale, getCurrentLocale) use LocaleContext
 * - LocaleProvider wraps the app in root Layout
 *
 * Usage in Client Components:
 * ```tsx
 * import { useLocalizedHref, useLocale } from "@/lib/i18n";
 *
 * function MyComponent() {
 *   const { locale, buildHref, linkTo } = useLocalizedHref();
 *   // or
 *   const locale = useLocale();
 * }
 * ```
 *
 * Usage in Server Components:
 * ```tsx
 * import { buildHref, linkTo } from "@/lib/i18n";
 *
 * export default function Page({ params }: { params: { locale: string } }) {
 *   const href = buildHref("/about", params.locale);
 * }
 * ```
 */

// Locale Context exports
export { LocaleProvider, useLocale, useLocaleContext } from "./locale-context";

// Route builder exports
export {
  buildHref,
  linkTo,
  useLocalizedHref,
  hasLocalePrefix,
} from "./route-builder";

// Paraglide Navigation exports
// These components are locale-aware and should be used instead of Next.js native components
export { Link, useRouter, usePathname, redirect, permanentRedirect } from "../i18n";
