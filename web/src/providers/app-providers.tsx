/**
 * App Providers
 *
 * Purpose:
 * - Unified provider composition layer for the application
 * - Centralizes all context providers in one place
 * - Simplifies layout structure and provider management
 * - Ensures correct provider nesting order
 *
 * Providers included:
 * 1. QueryProvider - TanStack Query for server state
 * 2. SmoothScrollProvider - Lenis smooth scrolling
 *
 * Usage:
 * ```tsx
 * // In app/[locale]/layout.tsx
 * import { AppProviders } from "@/providers/app-providers";
 *
 * export default function Layout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AppProviders>
 *           {children}
 *         </AppProviders>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { MotionProvider } from "@/components/motion/lazy-motion";

interface AppProvidersProps {
  children: ReactNode;
  /**
   * Enable smooth scrolling with Lenis
   * @default true
   */
  enableSmoothScroll?: boolean;
  /**
   * Enable React Query
   * @default true
   */
  enableQuery?: boolean;
}

/**
 * AppProviders - Unified provider composition
 *
 * Wraps the application with all necessary context providers.
 * Providers are nested in the correct order for optimal performance.
 *
 * @example
 * ```tsx
 * // Default usage with all providers
 * <AppProviders>
 *   {children}
 * </AppProviders>
 *
 * // Disable specific providers
 * <AppProviders enableSmoothScroll={false}>
 *   {children}
 * </AppProviders>
 * ```
 */
export function AppProviders({
  children,
  enableSmoothScroll = true,
  enableQuery = true,
}: AppProvidersProps) {
  // Build provider tree from inside out
  let result = <>{children}</>;

  // Framer Motion features (lazy-loaded via LazyMotion)
  result = <MotionProvider>{result}</MotionProvider>;

  // Smooth scroll provider (innermost - needs query for potential data fetching)
  if (enableSmoothScroll) {
    result = <SmoothScrollProvider>{result}</SmoothScrollProvider>;
  }

  // Query provider (outermost - other providers might need to fetch data)
  if (enableQuery) {
    result = <QueryProvider>{result}</QueryProvider>;
  }

  return result;
}

/**
 * Re-export individual providers for flexible usage
 */
export { QueryProvider } from "./query-provider";
export { SmoothScrollProvider, useLenis } from "@/components/smooth-scroll-provider";

export default AppProviders;
