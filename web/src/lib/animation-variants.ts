/**
 * Animation Variants Library
 *
 * Centralized Framer Motion animation variants extracted from components.
 * This file contains reusable animation configurations that maintain
 * visual consistency across the application.
 *
 * Now integrated with design-tokens.ts for centralized values.
 *
 * Usage:
 * ```tsx
 * import { cardVariants, fadeInUp } from "@/lib/animation-variants";
 *
 * <motion.div variants={cardVariants} animate="center" />
 * ```
 */

import { Variants } from "framer-motion";
import { DESIGN_TOKENS } from "./design-tokens";

// Extract commonly used values for cleaner code
const { duration, easing, stagger, spring } = DESIGN_TOKENS.animation;

/**
 * Card Position Variants
 * Used in: interactive-carousel.tsx
 *
 * Spring-based carousel card positioning with depth effect.
 */
export const cardVariants: Variants = {
  center: {
    x: "0%",
    scale: 1,
    zIndex: 10,
    opacity: 1,
    filter: "brightness(1)",
    transition: {
      duration: duration.medium,
      type: spring.carousel.type,
      stiffness: spring.carousel.stiffness,
      damping: spring.carousel.damping,
    },
  },
  left: {
    x: "-105%",
    scale: 1,
    zIndex: 5,
    opacity: 0.6,
    filter: "brightness(0.4)",
    transition: {
      duration: duration.medium,
      type: spring.carousel.type,
      stiffness: spring.carousel.stiffness,
      damping: spring.carousel.damping,
    },
  },
  right: {
    x: "105%",
    scale: 1,
    zIndex: 5,
    opacity: 0.6,
    filter: "brightness(0.4)",
    transition: {
      duration: duration.medium,
      type: spring.carousel.type,
      stiffness: spring.carousel.stiffness,
      damping: spring.carousel.damping,
    },
  },
  hidden: {
    x: "0%",
    scale: 0.8,
    zIndex: 0,
    opacity: 0,
    transition: { duration: duration.normal },
  },
};

/**
 * Overlay Variants
 * Used in: menu-overlay.tsx
 *
 * Full-screen overlay fade-in/out with custom easing.
 */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.fast, ease: easing.smooth },
  },
  exit: { opacity: 0, transition: { duration: duration.fast } },
};

/**
 * Stagger Container
 * Used in: menu-overlay.tsx, footer.tsx
 *
 * Container for staggered children animations.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.tight,
      delayChildren: stagger.normal,
    },
  },
  exit: { opacity: 0 },
};

/**
 * Fade In Up
 * Used in: menu-overlay.tsx, multiple components
 *
 * Gentle fade-in with upward motion.
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
};

/**
 * Panel Slide In
 * Used in: menu-overlay.tsx
 *
 * Side panel slide-in with staggered children.
 */
export const panelVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
      when: "beforeChildren" as const,
      staggerChildren: stagger.normal,
    },
  },
  exit: { opacity: 0, x: 10, transition: { duration: duration.instant } },
};

/**
 * Video Appear/Disappear
 * Used in: section4-platform-list.tsx
 *
 * Scale + fade animation for video elements.
 */
export const videoAppear: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
};

/**
 * Title Shift Animation
 * Used in: section4-platform-list.tsx
 *
 * Horizontal shift on hover (use as animate prop, not variants).
 */
export const titleShift = {
  hover: { x: 20 },
  rest: { x: 0 },
};

/**
 * Arrow Icon Animation
 * Used in: section4-platform-list.tsx
 *
 * Fade + shift animation for arrow icons.
 */
export const arrowIcon = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: -10 },
};

/**
 * Nav Bar Fade In
 * Used in: topbar.tsx
 *
 * Initial fade-in for navigation bar.
 */
export const navBarFadeIn: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: easing.easeOut },
  },
};

/**
 * Success Message
 * Used in: footer.tsx
 *
 * Small fade-in with upward motion for success messages.
 */
export const successMessage: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
};

/**
 * Hover Scale Variants
 * Common hover/tap interactions for buttons and interactive elements.
 */
export const hoverScale = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const hoverScaleSubtle = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

/**
 * Link Hover Bounce
 * Used in: footer.tsx
 *
 * Subtle horizontal bounce on link hover.
 */
export const linkHoverBounce = {
  hover: {
    x: 3,
    transition: {
      type: spring.snappy.type,
      stiffness: spring.snappy.stiffness,
      damping: spring.snappy.damping,
    },
  },
  rest: { x: 0 },
};

/**
 * Progress Bar Animation
 * Used in: interactive-carousel.tsx
 *
 * Linear progress bar animation (use as transition prop).
 */
export const progressBarTransition = (durationMs: number) => ({
  duration: durationMs / 1000,
  ease: "linear" as const,
});

/**
 * Page Transition - Brush Effect
 * Used in: page-transition.tsx
 *
 * Complex parallax brush transition for page changes.
 */
export const brushTransition: Variants = {
  hidden: { x: "-200vw" },
  visible: {
    x: "200vw",
    transitionEnd: {
      x: "-200vw", // Seamless loop
    },
    transition: {
      duration: duration.verySlow,
      ease: easing.smooth,
    },
  },
  exit: { x: "0%" },
};

/**
 * Logo Bounce
 * Used in: page-transition.tsx
 *
 * Continuous bounce animation for loading logo.
 */
export const logoBounce = {
  animate: {
    y: [0, -20, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: duration.medium,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Fade In (Simple)
 * Generic fade-in animation.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.fast },
  },
};

/**
 * Fade In Down
 * Opposite of fadeInUp.
 */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
};

/**
 * Fade In Left
 * Slide in from left.
 */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
};

/**
 * Fade In Right
 * Slide in from right.
 */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
};

/**
 * Scale In
 * Scale from small to normal size.
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
};

/**
 * Scale Out
 * Scale from normal to large (emphasis effect).
 */
export const scaleOut: Variants = {
  hidden: { opacity: 0, scale: 1 },
  visible: {
    opacity: 1,
    scale: 1.05,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
};
