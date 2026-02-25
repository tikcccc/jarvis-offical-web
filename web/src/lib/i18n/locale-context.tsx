"use client";

/**
 * Locale Context for i18n
 *
 * Purpose:
 * - Provide locale from root Layout to all Client Components
 * - Eliminate Hydration Mismatch by ensuring SSR and Client use same locale
 * - Single source of truth for current locale in Client Components
 *
 * Architecture:
 * - Layout reads locale from headers (after await) and passes to Provider
 * - Client Components use useLocale() hook to access locale from Context
 * - Pure functions accept locale parameter for Server Components/Actions
 *
 * Usage in Client Components:
 * ```tsx
 * function MyComponent() {
 *   const locale = useLocale();
 *   // Use locale for logic
 * }
 * ```
 *
 * Usage with routing:
 * ```tsx
 * function MyComponent() {
 *   const { locale, buildHref, linkTo } = useLocalizedHref();
 *   // Automatically uses locale from Context
 * }
 * ```
 */

import React, { createContext, useContext } from "react";
import { setLanguageTag, type AvailableLanguageTag } from "@/paraglide/runtime";

/**
 * Locale Context Type
 */
interface LocaleContextValue {
  /** Current active locale (e.g., "zh", "en") */
  locale: AvailableLanguageTag;
  /** Setter to update locale in client (keeps Context in sync on locale switch) */
  setLocale: (locale: AvailableLanguageTag) => void;
}

/**
 * Locale Context
 * Provides current locale to all Client Components
 */
const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

/**
 * Locale Provider Props
 */
interface LocaleProviderProps {
  /** Current locale from Layout (read from headers) */
  locale: AvailableLanguageTag;
  /** Child components */
  children: React.ReactNode;
}

/**
 * Locale Provider Component
 *
 * Wraps the application to provide locale to all Client Components.
 * Should be used in root Layout after reading locale from headers.
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * export default async function RootLayout({ children }) {
 *   const headersList = await headers();
 *   const locale = headersList.get("x-language-tag") ?? sourceLanguageTag;
 *
 *   return (
 *     <LanguageProvider>
 *       <html lang={locale}>
 *         <body>
 *           <LocaleProvider locale={locale}>
 *             {children}
 *           </LocaleProvider>
 *         </body>
 *       </html>
 *     </LanguageProvider>
 *   );
 * }
 * ```
 */
export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  const [currentLocale, setCurrentLocale] = React.useState<AvailableLanguageTag>(locale);

  // Sync with server-provided locale when it changes (e.g., navigation)
  React.useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  // Keep Paraglide runtime in sync with LocaleContext for client navigation.
  React.useEffect(() => {
    setLanguageTag(() => currentLocale);
  }, [currentLocale]);

  return (
    <LocaleContext.Provider value={{ locale: currentLocale, setLocale: setCurrentLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Hook to access current locale from Context
 *
 * Must be used within a LocaleProvider.
 * For Client Components only - Server Components should use params.locale.
 *
 * @returns Current locale string
 * @throws Error if used outside LocaleProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const locale = useLocale();
 *
 *   if (locale === "zh") {
 *     // Chinese-specific logic
 *   }
 *
 *   return <div>Current locale: {locale}</div>;
 * }
 * ```
 */
export function useLocale(): AvailableLanguageTag {
  const context = useContext(LocaleContext);

  if (context === undefined) {
    throw new Error(
      "useLocale must be used within a LocaleProvider. " +
      "Make sure your root Layout wraps children with <LocaleProvider>."
    );
  }

  return context.locale;
}

/**
 * Hook to access full locale context (for advanced use cases)
 *
 * @returns Locale context value
 * @throws Error if used outside LocaleProvider
 */
export function useLocaleContext(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (context === undefined) {
    throw new Error(
      "useLocaleContext must be used within a LocaleProvider. " +
      "Make sure your root Layout wraps children with <LocaleProvider>."
    );
  }

  return context;
}
