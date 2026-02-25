/**
 * useMediaQuery Hook
 *
 * Purpose:
 * - Detect if current screen size matches specified CSS media query
 * - Enable responsive component logic (not just CSS)
 * - Render different content/behavior based on device type
 *
 * Use cases:
 * - Mobile: hamburger menu; Desktop: full navigation
 * - Switch component layouts based on screen width
 * - Different animation effects for tablet vs desktop
 * - Conditional rendering (hide heavy components on mobile)
 */

"use client";

import { useEffect, useState } from "react";
import { BREAKPOINTS as BREAKPOINT_VALUES } from "@/lib/design-tokens";

/**
 * Breakpoint queries built from design tokens
 */
export const BREAKPOINTS = {
  sm: `(min-width: ${BREAKPOINT_VALUES.sm}px)`,
  md: `(min-width: ${BREAKPOINT_VALUES.md}px)`,
  lg: `(min-width: ${BREAKPOINT_VALUES.lg}px)`,
  xl: `(min-width: ${BREAKPOINT_VALUES.xl}px)`,
  "2xl": `(min-width: ${BREAKPOINT_VALUES["2xl"]}px)`,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * useMediaQuery - 檢測媒體查詢是否匹配
 *
 * @param query - CSS媒體查詢字符串
 * @returns boolean - 是否匹配媒體查詢
 *
 * @example
 * ```tsx
 * function Component() {
 *   const isMobile = !useMediaQuery("(min-width: 768px)");
 *   const isDesktop = useMediaQuery("(min-width: 1024px)");
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileNav /> : <DesktopNav />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using with BREAKPOINTS constant
 * import { useMediaQuery, BREAKPOINTS } from "@/hooks/use-media-query";
 *
 * function Component() {
 *   const isTabletUp = useMediaQuery(BREAKPOINTS.md);
 *
 *   return isTabletUp ? <LargeComponent /> : <SmallComponent />;
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  // Default to false for SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Handler for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Legacy browsers (Safari < 14)
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Helper hooks for common breakpoints
 */
export function useIsMobile(): boolean {
  return !useMediaQuery(BREAKPOINTS.md);
}

export function useIsTablet(): boolean {
  const isAboveMd = useMediaQuery(BREAKPOINTS.md);
  const isBelowLg = !useMediaQuery(BREAKPOINTS.lg);
  return isAboveMd && isBelowLg;
}

export function useIsDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.lg);
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.xl);
}

export default useMediaQuery;
