/**
 * Hooks Index
 * Centralized exports for all custom hooks.
 *
 * Usage:
 * ```tsx
 * import {
 *   useInView,
 *   useScrollProgress,
 *   useSmoothScrollTo,
 *   useLenis
 * } from "@/hooks";
 * ```
 */

export { useInView } from "./use-in-view";
export type { UseInViewOptions, UseInViewReturn } from "./use-in-view";

export { useScrollProgress } from "./use-scroll-progress";
export type {
  UseScrollProgressOptions,
  UseScrollProgressReturn,
} from "./use-scroll-progress";

export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  BREAKPOINTS,
} from "./use-media-query";
export type { BreakpointKey } from "./use-media-query";

export {
  useSmoothScrollTo,
  useScrollToElement,
  useScrollToTop,
} from "./use-smooth-scroll-to";
export type { ScrollToOptions, ScrollTarget } from "./use-smooth-scroll-to";

export { useBodyScrollLock } from "./use-body-scroll-lock";

export { useGsapAnimation, useGsapTimeline } from "./use-gsap-animation";
export type { GsapAnimationFn } from "./use-gsap-animation";

export { useAutoplay } from "./use-autoplay";
export type { UseAutoplayOptions, UseAutoplayReturn } from "./use-autoplay";

export { useInViewAnimation } from "./use-in-view-animation";
export type { UseInViewAnimationOptions } from "./use-in-view-animation";

/**
 * Lenis Smooth Scroll Hook
 * Re-exported from smooth-scroll-provider for unified imports
 *
 * @example
 * ```tsx
 * import { useLenis } from "@/hooks";
 *
 * function Component() {
 *   const { lenis } = useLenis();
 *
 *   const handleClick = () => {
 *     lenis?.scrollTo('#section', { offset: -100 });
 *   };
 * }
 * ```
 */
export { useLenis } from "@/components/smooth-scroll-provider";
