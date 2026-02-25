/**
 * useScrollProgress Hook
 *
 * Purpose:
 * - Track page or element scroll progress (percentage 0-1)
 * - Used for scroll progress bars, parallax effects, etc.
 *
 * Use Cases:
 * - Page top scroll progress bar
 * - Trigger animations based on scroll progress
 * - Reading progress indicator for long articles
 * - Multi-step form progress indicator
 */

"use client";

import { useEffect, useState, useCallback, RefObject } from "react";

export interface UseScrollProgressOptions {
  /** Optional: monitor specific element instead of entire page */
  target?: RefObject<HTMLElement | null>;
  /** Use RAF throttling for optimization, default true */
  useRAF?: boolean;
}

export interface UseScrollProgressReturn {
  /** Scroll progress, 0-1 range */
  scrollProgress: number;
  /** Current scroll position in pixels */
  scrollY: number;
  /** Total scrollable height */
  scrollHeight: number;
}

/**
 * useScrollProgress - 追蹤滾動進度
 *
 * @example
 * ```tsx
 * function ProgressBar() {
 *   const { scrollProgress } = useScrollProgress();
 *
 *   return (
 *     <div
 *       className="fixed top-0 left-0 h-1 bg-blue-500"
 *       style={{ width: `${scrollProgress * 100}%` }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Track scroll progress of a specific element
 * function Component() {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   const { scrollProgress } = useScrollProgress({ target: containerRef });
 *
 *   return (
 *     <div ref={containerRef} className="overflow-y-auto h-96">
 *       Content here...
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollProgress(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn {
  const { target, useRAF = true } = options;

  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);

  const updateScrollProgress = useCallback(() => {
    if (typeof window === "undefined") return;

    let currentScrollY: number;
    let totalScrollHeight: number;
    let viewportHeight: number;

    if (target?.current) {
      // Track specific element
      const element = target.current;
      currentScrollY = element.scrollTop;
      totalScrollHeight = element.scrollHeight;
      viewportHeight = element.clientHeight;
    } else {
      // Track entire page
      currentScrollY = window.scrollY;
      totalScrollHeight = document.documentElement.scrollHeight;
      viewportHeight = window.innerHeight;
    }

    const maxScroll = totalScrollHeight - viewportHeight;
    const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

    setScrollY(currentScrollY);
    setScrollHeight(totalScrollHeight);
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
  }, [target]);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (useRAF) {
        if (!ticking) {
          rafId = requestAnimationFrame(() => {
            updateScrollProgress();
            ticking = false;
          });
          ticking = true;
        }
      } else {
        updateScrollProgress();
      }
    };

    // Initial calculation
    updateScrollProgress();

    // Determine scroll target
    const scrollTarget = target?.current || window;

    // Add listener to target or window
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    // Also listen for resize to recalculate
    window.addEventListener("resize", updateScrollProgress, { passive: true });

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollProgress);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [target, useRAF, updateScrollProgress]);

  return { scrollProgress, scrollY, scrollHeight };
}

export default useScrollProgress;
