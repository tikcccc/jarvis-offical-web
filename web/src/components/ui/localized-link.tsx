"use client";

import { Link, useRouter } from "@/lib/i18n";
import { useRef, useEffect, useCallback, type ComponentProps, type MouseEvent, type FocusEvent } from "react";

/**
 * LocalizedLink Component with Intent-Based Prefetching
 *
 * A wrapper around Paraglide's Link component with intelligent prefetch strategies:
 * - "auto": Default Next.js/Paraglide prefetch behavior (prefetch on viewport entry)
 * - "hover": Prefetch when user hovers or focuses on the link (fastest perceived navigation)
 * - "viewport": Prefetch when link enters viewport using IntersectionObserver
 * - "idle": Prefetch during browser idle time using requestIdleCallback
 * - "off": Disable all prefetching (use for low-priority links)
 *
 * Why this improves navigation speed:
 * - "hover" mode gives ~200-500ms head start before click (fastest UX)
 * - "viewport" mode loads routes as user scrolls (good for long pages)
 * - "idle" mode uses spare CPU cycles without blocking main thread
 * - Eliminates the "first click delay" caused by on-demand route loading
 *
 * Usage:
 * ```tsx
 * import { LocalizedLink } from "@/components/ui/localized-link";
 * import { ROUTES } from "@/lib/constants";
 *
 * // Hover-based prefetch (recommended for important CTAs)
 * <LocalizedLink href={ROUTES.CONTACT} prefetchMode="hover">
 *   Contact Us
 * </LocalizedLink>
 *
 * // Viewport-based prefetch (good for footer/sidebar links)
 * <LocalizedLink href={ROUTES.ABOUT} prefetchMode="viewport">
 *   About
 * </LocalizedLink>
 *
 * // Idle prefetch (for less important links)
 * <LocalizedLink href={ROUTES.PRIVACY} prefetchMode="idle">
 *   Privacy Policy
 * </LocalizedLink>
 *
 * // Default auto mode (Next.js behavior)
 * <LocalizedLink href={ROUTES.HOME}>
 *   Home
 * </LocalizedLink>
 * ```
 */

export type PrefetchMode = "auto" | "hover" | "viewport" | "idle" | "off";

export interface LocalizedLinkProps extends Omit<ComponentProps<typeof Link>, "locale" | "prefetch"> {
  /**
   * The route path. Use ROUTES constants for type safety.
   * @example href={ROUTES.HOME}
   * @example href="/about-us"
   */
  href: string;

  /**
   * Prefetch strategy:
   * - "auto": Next.js default (prefetch on viewport) - **default**
   * - "hover": Prefetch on mouse hover/focus (fastest perceived speed)
   * - "viewport": Prefetch when link enters viewport
   * - "idle": Prefetch during browser idle time
   * - "off": Disable prefetching
   *
   * @default "auto"
   */
  prefetchMode?: PrefetchMode;

  /**
   * Custom onMouseEnter handler (will be called alongside prefetch logic)
   */
  onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void;

  /**
   * Custom onFocus handler (will be called alongside prefetch logic)
   */
  onFocus?: (e: FocusEvent<HTMLAnchorElement>) => void;
}

export function LocalizedLink({
  href,
  prefetchMode = "auto",
  children,
  onMouseEnter,
  onFocus,
  ...props
}: LocalizedLinkProps) {
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const hasPrefetched = useRef(false);

  // Core prefetch function
  const prefetchRoute = useCallback(() => {
    if (hasPrefetched.current) return;

    try {
      router.prefetch(href);
      hasPrefetched.current = true;
    } catch (error) {
      // Silently fail - prefetch is an optimization, not critical
      console.debug(`Prefetch failed for ${href}:`, error);
    }
  }, [href, router]);

  // Mode: "hover" - Prefetch on mouse enter or focus
  const handleMouseEnter = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    if (prefetchMode === "hover") {
      prefetchRoute();
    }
    onMouseEnter?.(e);
  }, [prefetchMode, prefetchRoute, onMouseEnter]);

  const handleFocus = useCallback((e: FocusEvent<HTMLAnchorElement>) => {
    if (prefetchMode === "hover") {
      prefetchRoute();
    }
    onFocus?.(e);
  }, [prefetchMode, prefetchRoute, onFocus]);

  // Mode: "viewport" - Prefetch when link enters viewport
  useEffect(() => {
    if (prefetchMode !== "viewport" || !linkRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchRoute();
            observer.disconnect(); // Only prefetch once
          }
        });
      },
      {
        rootMargin: "50px", // Start prefetching 50px before link enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(linkRef.current);

    return () => observer.disconnect();
  }, [prefetchMode, prefetchRoute]);

  // Mode: "idle" - Prefetch during browser idle time
  useEffect(() => {
    if (prefetchMode !== "idle") return;

    // Feature detection for requestIdleCallback
    if (typeof window === "undefined") return;

    const requestIdleCallbackFn =
      window.requestIdleCallback ||
      ((cb: IdleRequestCallback) => window.setTimeout(cb, 1));

    const cancelIdleCallbackFn =
      window.cancelIdleCallback ||
      window.clearTimeout;

    const idleCallbackId = requestIdleCallbackFn(() => {
      prefetchRoute();
    }, { timeout: 2000 }); // Fallback: prefetch after 2s if browser never idles

    return () => cancelIdleCallbackFn(idleCallbackId);
  }, [prefetchMode, prefetchRoute]);

  // Determine Next.js prefetch prop based on mode
  const shouldUseLinkPrefetch = prefetchMode === "auto";

  return (
    <Link
      ref={linkRef}
      href={href}
      prefetch={shouldUseLinkPrefetch}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </Link>
  );
}
