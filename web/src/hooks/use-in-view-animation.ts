/**
 * useInViewAnimation Hook
 *
 * Specialized hook for reversible scroll-driven animations.
 * Adds/removes CSS classes based on viewport intersection.
 *
 * Usage:
 * - Product template feature sections
 * - Scroll reveal animations that reverse on scroll up
 * - Any element needing reversible enter/exit animations
 *
 * @example
 * ```tsx
 * function FeatureCard() {
 *   const ref = useInViewAnimation<HTMLDivElement>({
 *     activeClass: "feature-active",
 *     threshold: 0.3,
 *   });
 *
 *   return <div ref={ref}>Animates in/out on scroll</div>;
 * }
 * ```
 */

"use client";

import { useEffect, useRef, RefObject } from "react";
import { VIEWPORT_THRESHOLDS } from "@/lib/animations";

export interface UseInViewAnimationOptions {
  /** CSS class to add when in view (default: "in-view") */
  activeClass?: string;
  /** Intersection threshold 0-1 (default: 0.3 from VIEWPORT_THRESHOLDS.low) */
  threshold?: number;
  /** Root margin for intersection (default: "0px") */
  rootMargin?: string;
  /** Only trigger once, don't reverse (default: false) */
  once?: boolean;
  /** Callback when entering view */
  onEnter?: () => void;
  /** Callback when leaving view */
  onLeave?: () => void;
}

/**
 * useInViewAnimation - Adds/removes CSS class based on viewport visibility
 *
 * Unlike useInView which returns a boolean state, this hook directly
 * manipulates the element's classList for better performance with CSS animations.
 */
export function useInViewAnimation<T extends HTMLElement = HTMLElement>(
  options: UseInViewAnimationOptions = {}
): RefObject<T | null> {
  const {
    activeClass = "in-view",
    threshold = VIEWPORT_THRESHOLDS.low,
    rootMargin = "0px",
    once = false,
    onEnter,
    onLeave,
  } = options;

  const ref = useRef<T | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    // If once mode and already triggered, skip
    if (once && hasTriggered.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(activeClass);
            onEnter?.();

            if (once) {
              hasTriggered.current = true;
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            // Only remove class if not in "once" mode
            entry.target.classList.remove(activeClass);
            onLeave?.();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [activeClass, threshold, rootMargin, once, onEnter, onLeave]);

  return ref;
}

export default useInViewAnimation;
