/**
 * Animation Configurations
 *
 * Purpose:
 * - Unified management of GSAP, Framer Motion, and Lenis animation configs
 * - Provides reusable animation variants and presets
 * - Ensures consistent animation style across the site
 * - Now integrated with design-tokens.ts for centralized values
 *
 * This file contains configuration presets for animations,
 * extracted from existing implementations to maintain consistency.
 */

import { gsap } from "gsap";
import type { LenisOptions } from "lenis";
import { DESIGN_TOKENS } from "./design-tokens";

/**
 * Animation Durations (in seconds)
 * Standardized durations used across the application.
 * Re-exported from design tokens for convenience.
 */
export const ANIMATION_DURATIONS = DESIGN_TOKENS.animation.duration;

/**
 * GSAP Easing Functions
 * Common easing functions extracted from existing components.
 */
export const GSAP_EASINGS = {
  /** Smooth exponential easing - Used in hero-section-1 */
  expoOut: "expo.out",
  /** Power curve easing - Used in interactive-carousel */
  power2Out: "power2.out",
  /** Elastic bounce - Used in interactive-carousel return */
  elasticOut: "elastic.out(1, 0.6)",
  /** Standard power easing */
  power1InOut: "power1.inOut",
  /** Smooth power curve */
  power3Out: "power3.out",
  /** Strong power curve */
  power4Out: "power4.out",
} as const;

/**
 * Framer Motion Easing Arrays
 * Cubic bezier curves for custom easing.
 * Now referencing design tokens for consistency.
 */
export const FRAMER_EASINGS = {
  /** Smooth custom easing - Used in menu-overlay */
  smooth: DESIGN_TOKENS.animation.easing.smooth,
  /** Standard ease out */
  easeOut: DESIGN_TOKENS.animation.easing.easeOut,
  /** Standard ease in out */
  easeInOut: DESIGN_TOKENS.animation.easing.easeInOut,
  /** Linear (no easing) */
  linear: DESIGN_TOKENS.animation.easing.linear,
} as const;

/**
 * GSAP Animation Presets
 * Reusable GSAP animation configurations using design tokens.
 */
export const GSAP_PRESETS = {
  /**
   * Hero Title Slide Up
   * Used in: hero-section-1.tsx
   */
  heroTitleSlideUp: {
    y: 0,
    duration: ANIMATION_DURATIONS.extraSlow,
    ease: GSAP_EASINGS.expoOut,
    stagger: DESIGN_TOKENS.animation.stagger.slow,
    delay: ANIMATION_DURATIONS.normal,
  },

  /**
   * Subtitle Fade In
   * Used in: hero-section-1.tsx
   */
  subtitleFadeIn: {
    opacity: 1,
    y: 0,
    duration: ANIMATION_DURATIONS.verySlow,
    ease: GSAP_EASINGS.expoOut,
    delay: ANIMATION_DURATIONS.page,
  },

  /**
   * Velocity-based Parallax
   * Used in: interactive-carousel.tsx
   */
  velocityParallax: (targetY: number) => ({
    y: targetY,
    duration: ANIMATION_DURATIONS.fast,
    ease: GSAP_EASINGS.power2Out,
  }),

  /**
   * Elastic Return
   * Used in: interactive-carousel.tsx (return to original position)
   */
  elasticReturn: {
    y: 0,
    duration: ANIMATION_DURATIONS.verySlow,
    ease: GSAP_EASINGS.elasticOut,
  },

  /**
   * Scroll Fade In
   * Generic scroll-triggered fade in
   */
  scrollFadeIn: {
    opacity: 1,
    y: 0,
    duration: ANIMATION_DURATIONS.slow,
    ease: GSAP_EASINGS.power3Out,
  },

  /**
   * Parallax Vertical
   * Standard parallax scrolling effect
   */
  parallaxVertical: (distance: number) => ({
    y: distance,
    ease: "none",
    scrollTrigger: {
      scrub: 1,
    },
  }),
} as const;

/**
 * Framer Motion Spring Configurations
 * Physics-based animations using design tokens.
 * Re-exported for convenience and backward compatibility.
 */
export const SPRING_CONFIGS = DESIGN_TOKENS.animation.spring;

/**
 * Lenis Smooth Scroll Configuration
 * Default configuration for Lenis smooth scrolling.
 * Based on: smooth-scroll-provider.tsx implementation
 */
export const LENIS_CONFIG: Partial<LenisOptions> = {
  duration: ANIMATION_DURATIONS.extraSlow,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
};

/**
 * GSAP ScrollTrigger Default Config
 * Common ScrollTrigger configurations.
 */
export const SCROLL_TRIGGER_DEFAULTS = {
  /**
   * Standard Reveal
   * Trigger when element reaches center of viewport
   */
  standard: {
    trigger: null, // Set dynamically
    start: "top center",
    end: "bottom center",
    toggleActions: "play none none reverse",
  },

  /**
   * Pin Section
   * Pin element while scrolling
   */
  pin: {
    trigger: null, // Set dynamically
    start: "top top",
    end: "bottom bottom",
    pin: true,
    pinSpacing: true,
  },

  /**
   * Parallax Scrub
   * Smooth parallax effect synced with scroll
   */
  parallax: {
    trigger: null, // Set dynamically
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
  },

  /**
   * Fade In On Enter
   * Fade in once when entering viewport
   */
  fadeInOnce: {
    trigger: null, // Set dynamically
    start: "top 80%",
    toggleActions: "play none none none",
    once: true,
  },
} as const;

/**
 * Stagger Configuration
 * Timing for staggered animations from design tokens.
 */
export const STAGGER_CONFIG = DESIGN_TOKENS.animation.stagger;

/**
 * Delay Configuration
 * Common delay values for sequential animations.
 */
export const DELAY_CONFIG = {
  /** No delay */
  none: 0,
  /** Tiny delay (0.1s) */
  tiny: 0.1,
  /** Short delay (0.2s) */
  short: 0.2,
  /** Normal delay (0.5s) - Used in hero-section-1 */
  normal: ANIMATION_DURATIONS.normal,
  /** Long delay (1.0s) */
  long: ANIMATION_DURATIONS.verySlow,
  /** Very long delay (1.5s) - Used in hero-section-1 subtitle */
  veryLong: ANIMATION_DURATIONS.page,
} as const;

/**
 * Viewport Thresholds
 * Common threshold values for Intersection Observer and ScrollTrigger.
 * Re-exported from design tokens.
 */
export const VIEWPORT_THRESHOLDS = DESIGN_TOKENS.viewport;

/**
 * Helper: Create GSAP Timeline with default settings
 */
export function createTimeline(options?: gsap.TimelineVars) {
  return gsap.timeline({
    defaults: {
      ease: GSAP_EASINGS.power3Out,
      duration: ANIMATION_DURATIONS.normal,
    },
    ...options,
  });
}

/**
 * Helper: Create ScrollTrigger-enabled animation
 */
export function createScrollAnimation(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars,
  scrollTriggerConfig?: ScrollTrigger.Vars
) {
  return gsap.from(target, {
    ...vars,
    scrollTrigger: {
      ...SCROLL_TRIGGER_DEFAULTS.standard,
      ...scrollTriggerConfig,
      trigger: (scrollTriggerConfig?.trigger || target) as gsap.DOMTarget,
    },
  });
}

/**
 * Autoplay Duration
 * Used in: interactive-carousel.tsx
 */
export const AUTOPLAY_DURATION = 5000; // 5 seconds

/**
 * Product Template Animation Timings
 * Based on product-template.html reference design
 * Used in: product-template/hero-section, narrative-track, feature-section
 */
export const PRODUCT_TEMPLATE_ANIMATIONS = {
  /** Character reveal (staggered wave effect) */
  charReveal: {
    duration: 0.8,
    ease: "cubic-bezier(0.2, 0.65, 0.3, 0.9)",
    stagger: 0.025, // 25ms per character - faster, more fluid reveal
  },

  /** Block-level fade-in animation with elastic bounce-up */
  blockFadeIn: {
    duration: 0.6,
    ease: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Elastic easing for bounce effect
  },

  /** Index line growth animation (reversible) */
  indexLineGrow: {
    enter: {
      duration: 1.0,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      delay: 0.2,
    },
    exit: {
      duration: 0.5,
      ease: "ease-out",
    },
  },

  /** Background color transition timing */
  bgColorTransition: {
    duration: 0.3,
    ease: "linear",
  },

  /** Gradient text reveal timing */
  gradientReveal: {
    duration: 0.5,
    ease: "ease-in-out",
  },

  /** Scroll progress thresholds for narrative track */
  scrollThresholds: {
    /** Stage 1 text reveal starts */
    stage1Start: 0.15,
    /** Background color transition starts */
    bgTransitionStart: 0.2,
    /** Stage 2 text reveal starts */
    stage2Start: 0.4,
    /** Background color transition ends */
    bgTransitionEnd: 0.45,
    /** Gradient effect activates */
    gradientActive: 0.5,
    /** Bottom section reveals */
    bottomReveal: 0.65,
  },
} as const;

const animationsConfig = {
  ANIMATION_DURATIONS,
  GSAP_EASINGS,
  FRAMER_EASINGS,
  GSAP_PRESETS,
  SPRING_CONFIGS,
  LENIS_CONFIG,
  SCROLL_TRIGGER_DEFAULTS,
  STAGGER_CONFIG,
  DELAY_CONFIG,
  VIEWPORT_THRESHOLDS,
  AUTOPLAY_DURATION,
  PRODUCT_TEMPLATE_ANIMATIONS,
};

export default animationsConfig;
