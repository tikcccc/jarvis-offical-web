/**
 * useSmoothScrollTo Hook
 *
 * Purpose:
 * - Programmatic smooth scrolling functionality
 * - Integrated with Lenis for smooth scroll transitions
 * - Used for anchor jumping, back-to-top, etc.
 *
 * Use Cases:
 * - "Back to top" button click
 * - Navigation anchor scrolling to page sections
 * - Multi-step form section jumping
 * - FAQ expand scroll to question
 * - CTA button scroll to form section
 */

"use client";

import { useCallback } from "react";
import { useLenis } from "@/components/smooth-scroll-provider";

export interface ScrollToOptions {
  /** Offset from target position (negative = above target) */
  offset?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Whether to trigger immediately without animation */
  immediate?: boolean;
  /** Easing function */
  easing?: (t: number) => number;
  /** Callback when scroll completes */
  onComplete?: () => void;
}

export type ScrollTarget = string | number | HTMLElement | "top" | "bottom";

/**
 * useSmoothScrollTo - Programmatic smooth scrolling with Lenis
 *
 * @returns scrollTo function for triggering smooth scroll
 *
 * @example
 * ```tsx
 * function Component() {
 *   const scrollTo = useSmoothScrollTo();
 *
 *   return (
 *     <>
 *       <button onClick={() => scrollTo('top')}>
 *         Back to Top
 *       </button>
 *       <button onClick={() => scrollTo('#contact', { offset: -100 })}>
 *         Go to Contact
 *       </button>
 *       <button onClick={() => scrollTo(500)}>
 *         Scroll to 500px
 *       </button>
 *     </>
 *   );
 * }
 * ```
 */
export function useSmoothScrollTo() {
  const { lenis } = useLenis();

  const scrollTo = useCallback(
    (target: ScrollTarget, options: ScrollToOptions = {}) => {
      const {
        offset = 0,
        duration,
        immediate = false,
        easing,
        onComplete,
      } = options;

      // Handle special string targets
      let resolvedTarget: string | number | HTMLElement = target as string | number | HTMLElement;

      if (target === "top") {
        resolvedTarget = 0;
      } else if (target === "bottom") {
        resolvedTarget = document.documentElement.scrollHeight;
      }

      // If Lenis is available, use it
      if (lenis) {
        lenis.scrollTo(resolvedTarget, {
          offset,
          duration,
          immediate,
          easing,
          onComplete,
        });
        return;
      }

      // Fallback to native scroll when Lenis is not available
      let targetPosition: number;

      if (typeof resolvedTarget === "number") {
        targetPosition = resolvedTarget;
      } else if (typeof resolvedTarget === "string") {
        const element = document.querySelector(resolvedTarget);
        if (!element) {
          console.warn(`[useSmoothScrollTo] Element not found: ${resolvedTarget}`);
          return;
        }
        targetPosition = element.getBoundingClientRect().top + window.scrollY;
      } else if (resolvedTarget instanceof HTMLElement) {
        targetPosition = resolvedTarget.getBoundingClientRect().top + window.scrollY;
      } else {
        console.warn(`[useSmoothScrollTo] Invalid target: ${target}`);
        return;
      }

      // Apply offset
      targetPosition += offset;

      // Native smooth scroll fallback
      if (immediate) {
        // Instant scroll without animation
        window.scrollTo({
          top: targetPosition,
          behavior: "auto",
        });
        if (onComplete) onComplete();
      } else {
        // Smooth scroll with animation
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
        // Trigger onComplete callback (approximate timing for native scroll)
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }
    },
    [lenis]
  );

  return scrollTo;
}

/**
 * useScrollToElement - Convenience hook for scrolling to a specific element ref
 *
 * @example
 * ```tsx
 * function Component() {
 *   const targetRef = useRef<HTMLDivElement>(null);
 *   const scrollToTarget = useScrollToElement(targetRef);
 *
 *   return (
 *     <>
 *       <button onClick={() => scrollToTarget({ offset: -100 })}>
 *         Go to Section
 *       </button>
 *       <div ref={targetRef}>Target Section</div>
 *     </>
 *   );
 * }
 * ```
 */
export function useScrollToElement(
  elementRef: React.RefObject<HTMLElement | null>
) {
  const scrollTo = useSmoothScrollTo();

  return useCallback(
    (options: ScrollToOptions = {}) => {
      if (elementRef.current) {
        scrollTo(elementRef.current, options);
      }
    },
    [scrollTo, elementRef]
  );
}

/**
 * useScrollToTop - Convenience hook for scrolling to top
 *
 * @example
 * ```tsx
 * function BackToTopButton() {
 *   const scrollToTop = useScrollToTop();
 *
 *   return (
 *     <button onClick={scrollToTop}>
 *       Back to Top
 *     </button>
 *   );
 * }
 * ```
 */
export function useScrollToTop() {
  const scrollTo = useSmoothScrollTo();

  return useCallback(
    (options: ScrollToOptions = {}) => {
      scrollTo("top", options);
    },
    [scrollTo]
  );
}

export default useSmoothScrollTo;
