/**
 * Design Tokens
 *
 * Centralized design system tokens for consistent theming across the application.
 * These tokens define colors, spacing, typography, animation timing, and other
 * design primitives used throughout the project.
 *
 * Usage:
 * ```tsx
 * import { DESIGN_TOKENS } from "@/lib/design-tokens";
 *
 * // In Tailwind CSS
 * <div className="p-4" style={{ padding: DESIGN_TOKENS.spacing.md }} />
 *
 * // In GSAP
 * gsap.to(element, { duration: DESIGN_TOKENS.animation.duration.normal });
 *
 * // In Framer Motion
 * <motion.div animate={{ transition: { duration: DESIGN_TOKENS.animation.duration.fast } }} />
 * ```
 */

/**
 * Brand Colors
 * Primary brand colors used throughout the application
 */
export const BRAND_COLORS = {
  /** Primary brand blue */
  primary: "#2563eb",
  /** Secondary darker blue */
  secondary: "#1e40af",
  /** Accent lighter blue */
  accent: "#3b82f6",
  /** Accent hover state */
  accentHover: "#60a5fa",
} as const;

/**
 * Neutral Colors (Grayscale)
 * Used for text, backgrounds, borders, and subtle UI elements
 */
export const NEUTRAL_COLORS = {
  0: "#ffffff",
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
  950: "#0a0a0a",
  1000: "#000000",
} as const;

/**
 * Semantic Colors
 * Context-specific colors for success, warning, error states
 */
export const SEMANTIC_COLORS = {
  success: "#10b981",
  successLight: "#34d399",
  successDark: "#059669",
  warning: "#f59e0b",
  warningLight: "#fbbf24",
  warningDark: "#d97706",
  error: "#ef4444",
  errorLight: "#f87171",
  errorDark: "#dc2626",
  info: "#3b82f6",
  infoLight: "#60a5fa",
  infoDark: "#2563eb",
} as const;

/**
 * Product Template Theme
 * Used for all JARVIS product showcase pages
 * Based on product-template.html reference design
 */
export const PRODUCT_TEMPLATE_COLORS = {
  /** Immersive dark background (#1E1F2B) */
  darkBg: "#1E1F2B",
  /** Light content background (#F2F2F2) */
  lightBg: "#F2F2F2",
  /** Main text color (dark) */
  textMain: "#1E1F2B",
  /** Muted text color */
  textMuted: "#454256",
  /** Accent gradient - purple to cyan */
  accentGradient: {
    from: "#9881F3",
    to: "#13C9BA",
    deg: 93,
  },
} as const;

/**
 * Spacing Scale
 * Consistent spacing values based on 4px base unit
 */
export const SPACING = {
  /** 0px */
  none: "0",
  /** 4px */
  xs: "0.25rem",
  /** 8px */
  sm: "0.5rem",
  /** 12px */
  base: "0.75rem",
  /** 16px */
  md: "1rem",
  /** 20px */
  lg: "1.25rem",
  /** 24px */
  xl: "1.5rem",
  /** 32px */
  "2xl": "2rem",
  /** 40px */
  "3xl": "2.5rem",
  /** 48px */
  "4xl": "3rem",
  /** 64px */
  "5xl": "4rem",
  /** 80px */
  "6xl": "5rem",
  /** 96px */
  "7xl": "6rem",
  /** 128px */
  "8xl": "8rem",
} as const;

/**
 * Border Radius
 * Rounded corner values for UI elements
 */
export const RADIUS = {
  none: "0",
  sm: "0.125rem",    // 2px
  base: "0.25rem",   // 4px
  md: "0.375rem",    // 6px
  lg: "0.5rem",      // 8px
  xl: "0.75rem",     // 12px
  "2xl": "1rem",     // 16px
  "3xl": "1.5rem",   // 24px
  full: "9999px",
} as const;

/**
 * Box Shadows
 * Elevation and depth effects
 */
export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const;

/**
 * Z-Index Layers
 * Standardized layering system for stacking contexts
 */
export const Z_INDEX = {
  /** Below content (-1) */
  below: -1,
  /** Base content layer (0) */
  base: 0,
  /** Dropdown menus (10) */
  dropdown: 10,
  /** Sticky elements (20) */
  sticky: 20,
  /** Fixed elements (30) */
  fixed: 30,
  /** Overlay backdrop (40) */
  overlay: 40,
  /** Modal dialogs (50) */
  modal: 50,
  /** Popover/Tooltip (60) */
  popover: 60,
  /** Toast notifications (70) */
  toast: 70,
} as const;

/**
 * Typography Scale
 * Font sizes and line heights
 */
export const TYPOGRAPHY = {
  fontSize: {
    xs: "0.75rem",     // 12px
    sm: "0.875rem",    // 14px
    base: "1rem",      // 16px
    lg: "1.125rem",    // 18px
    xl: "1.25rem",     // 20px
    "2xl": "1.5rem",   // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",     // 48px
    "6xl": "3.75rem",  // 60px
    "7xl": "4.5rem",   // 72px
    "8xl": "6rem",     // 96px
    "9xl": "8rem",     // 128px
  },
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

/**
 * Animation Timing
 * Duration values in seconds for consistent animation timing
 */
export const ANIMATION_DURATION = {
  /** 150ms - Instant feedback */
  instant: 0.15,
  /** 300ms - Fast transitions */
  fast: 0.3,
  /** 500ms - Normal transitions */
  normal: 0.5,
  /** 600ms - Medium transitions */
  medium: 0.6,
  /** 800ms - Slow transitions */
  slow: 0.8,
  /** 1000ms - Very slow transitions */
  verySlow: 1.0,
  /** 1200ms - Extra slow (hero animations) */
  extraSlow: 1.2,
  /** 1500ms - Page transitions */
  page: 1.5,
} as const;

/**
 * Animation Easing
 * Cubic bezier curves for natural motion
 */
export const ANIMATION_EASING = {
  /** Linear (no easing) */
  linear: [0, 0, 1, 1] as const,
  /** Ease in (slow start) */
  easeIn: [0.4, 0, 1, 1] as const,
  /** Ease out (slow end) */
  easeOut: [0, 0, 0.2, 1] as const,
  /** Ease in-out (slow start and end) */
  easeInOut: [0.4, 0, 0.2, 1] as const,
  /** Smooth custom curve - used in menu-overlay */
  smooth: [0.22, 1, 0.36, 1] as const,
  /** Spring bounce effect */
  spring: [0.34, 1.56, 0.64, 1] as const,
} as const;

/**
 * Animation Stagger
 * Delay between staggered animations in seconds
 */
export const ANIMATION_STAGGER = {
  /** 50ms - Very tight stagger */
  veryTight: 0.05,
  /** 80ms - Tight stagger (used in menu) */
  tight: 0.08,
  /** 100ms - Normal stagger */
  normal: 0.1,
  /** 150ms - Relaxed stagger */
  relaxed: 0.15,
  /** 200ms - Slow stagger (used in hero) */
  slow: 0.2,
} as const;

/**
 * Framer Motion Spring Presets
 * Physics-based spring configurations
 */
export const SPRING_PRESETS = {
  /** Gentle spring (used in general UI) */
  gentle: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
  },
  /** Carousel spring (used in interactive-carousel) */
  carousel: {
    type: "spring" as const,
    stiffness: 80,
    damping: 20,
  },
  /** Bouncy spring */
  bouncy: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
  },
  /** Snappy spring (quick response) */
  snappy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  },
  /** Stiff spring (minimal bounce) */
  stiff: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  },
} as const;

/**
 * Viewport Thresholds
 * IntersectionObserver thresholds for scroll animations
 */
export const VIEWPORT_THRESHOLDS = {
  /** 10% visible */
  minimal: 0.1,
  /** 25% visible */
  quarter: 0.25,
  /** 30% visible (used in statistics-section) */
  low: 0.3,
  /** 50% visible */
  half: 0.5,
  /** 75% visible */
  threeQuarters: 0.75,
  /** 80% visible */
  high: 0.8,
  /** 100% visible */
  full: 1.0,
} as const;

/**
 * Breakpoints
 * Responsive design breakpoints (pixels)
 */
export const BREAKPOINTS = {
  /** Small devices (640px and up) */
  sm: 640,
  /** Medium devices (768px and up) */
  md: 768,
  /** Large devices (1024px and up) */
  lg: 1024,
  /** Extra large devices (1280px and up) */
  xl: 1280,
  /** 2X large devices (1536px and up) */
  "2xl": 1536,
} as const;

/**
 * Media Queries
 * Pre-built media query strings
 */
export const MEDIA_QUERIES = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  "2xl": `(min-width: ${BREAKPOINTS["2xl"]}px)`,
} as const;

/**
 * Opacity Scale
 * Consistent opacity values
 */
export const OPACITY = {
  0: "0",
  5: "0.05",
  10: "0.1",
  20: "0.2",
  30: "0.3",
  40: "0.4",
  50: "0.5",
  60: "0.6",
  70: "0.7",
  80: "0.8",
  90: "0.9",
  95: "0.95",
  100: "1",
} as const;

/**
 * Complete Design Tokens Object
 * Aggregated tokens for easy import
 */
export const DESIGN_TOKENS = {
  colors: {
    brand: BRAND_COLORS,
    neutral: NEUTRAL_COLORS,
    semantic: SEMANTIC_COLORS,
    productTemplate: PRODUCT_TEMPLATE_COLORS,
  },
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  zIndex: Z_INDEX,
  typography: TYPOGRAPHY,
  animation: {
    duration: ANIMATION_DURATION,
    easing: ANIMATION_EASING,
    stagger: ANIMATION_STAGGER,
    spring: SPRING_PRESETS,
  },
  viewport: VIEWPORT_THRESHOLDS,
  breakpoints: BREAKPOINTS,
  mediaQueries: MEDIA_QUERIES,
  opacity: OPACITY,
} as const;

export default DESIGN_TOKENS;
