/**
 * ScrollReveal Animation Wrapper Component
 *
 * 用途：
 * - 滾動觸發的動畫包裝器
 * - 當元素進入視口時觸發動畫
 * - 結合useInView hook和Framer Motion
 *
 * 使用場景：
 * - 長頁面的分段內容reveal
 * - About Us頁面的多個narrative section
 * - 產品特性列表的逐個展示
 * - 統計數字的count-up動畫觸發
 * - 圖片畫廊的漸進加載
 */

"use client";

import type { Variants } from "framer-motion";
import { m } from "@/components/motion/lazy-motion";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks";
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
} from "@/lib/animation-variants";

export type AnimationType =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale";

export interface ScrollRevealProps {
  /** Content to animate */
  children: React.ReactNode;
  /** Animation type */
  animation?: AnimationType;
  /** Viewport visibility threshold (0-1) */
  threshold?: number;
  /** Trigger animation only once */
  triggerOnce?: boolean;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Additional CSS classes */
  className?: string;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
}

/**
 * Get animation variants based on type
 */
function getAnimationVariants(
  animation: AnimationType,
  duration?: number,
  delay?: number
): Variants {
  const baseVariants: Record<AnimationType, Variants> = {
    fade: fadeIn,
    "slide-up": fadeInUp,
    "slide-down": fadeInDown,
    "slide-left": fadeInLeft,
    "slide-right": fadeInRight,
    scale: scaleIn,
  };

  const variants = baseVariants[animation];

  // Apply custom duration/delay if provided
  if (duration || delay) {
    return {
      hidden: variants.hidden,
      visible: {
        ...variants.visible,
        transition: {
          ...(typeof variants.visible === "object" &&
          "transition" in variants.visible
            ? variants.visible.transition
            : {}),
          duration: duration ?? 0.5,
          delay: delay ?? 0,
        },
      },
    };
  }

  return variants;
}

/**
 * ScrollReveal - Animate elements when they enter viewport
 *
 * @example
 * ```tsx
 * // Basic fade-in
 * <ScrollReveal animation="fade">
 *   <div>Content here</div>
 * </ScrollReveal>
 *
 * // Slide up with custom settings
 * <ScrollReveal
 *   animation="slide-up"
 *   threshold={0.3}
 *   delay={0.2}
 *   duration={0.8}
 * >
 *   <StatisticsSection />
 * </ScrollReveal>
 *
 * // Trigger multiple times
 * <ScrollReveal animation="scale" triggerOnce={false}>
 *   <ProductCard />
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal({
  children,
  animation = "fade",
  threshold = 0.1,
  triggerOnce = true,
  delay,
  duration,
  className,
  rootMargin,
}: ScrollRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold,
    triggerOnce,
    rootMargin,
  });

  const variants = getAnimationVariants(animation, duration, delay);

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}

export default ScrollReveal;
