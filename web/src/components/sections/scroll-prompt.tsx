/**
 * ScrollPrompt Component
 *
 * 用途：
 * - 提示用戶向下滾動的視覺指示器
 * - 引導用戶探索頁面內容
 *
 * 使用場景：
 * - 所有JARVIS產品詳情頁（根據web.md）
 * - 顯示"Scroll to Explore"文字
 * - 通常放在Hero Section下方
 */

"use client";

import { m } from "@/components/motion/lazy-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollProgress, useSmoothScrollTo } from "@/hooks";

export interface ScrollPromptProps {
  /** Prompt text, defaults to "Scroll to Explore" */
  text?: string;
  /** Additional CSS classes */
  className?: string;
  /** Target to scroll to when clicked (CSS selector or number) */
  scrollTarget?: string | number;
  /** Scroll offset from target */
  scrollOffset?: number;
  /** Threshold (scrollY pixels) at which prompt starts to fade */
  fadeThreshold?: number;
}

/**
 * ScrollPrompt - Visual indicator to prompt users to scroll down
 *
 * @example
 * ```tsx
 * <ScrollPrompt text="Scroll to Explore" />
 *
 * // With click-to-scroll functionality
 * <ScrollPrompt
 *   text="Discover More"
 *   scrollTarget="#next-section"
 *   scrollOffset={-100}
 * />
 * ```
 */
export function ScrollPrompt({
  text = "Scroll to Explore",
  className,
  scrollTarget,
  scrollOffset = 0,
  fadeThreshold = 100,
}: ScrollPromptProps) {
  const { scrollY } = useScrollProgress();
  const scrollTo = useSmoothScrollTo();

  // Calculate opacity based on scroll position
  const opacity = Math.max(0, 1 - scrollY / fadeThreshold);

  // Handle click to scroll
  const handleClick = () => {
    if (scrollTarget) {
      scrollTo(scrollTarget, { offset: scrollOffset });
    } else {
      // Default: scroll down by one viewport height
      scrollTo(window.innerHeight, { offset: 0 });
    }
  };

  // Don't render if fully faded
  if (opacity <= 0) return null;

  const readVar = (name: string, fallback: number) => {
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const appearDuration = readVar("--scroll-prompt-appear", 0.6);
  const appearDelay = readVar("--scroll-prompt-delay", 1.5);
  const bounceDuration = readVar("--scroll-prompt-bounce", 1.5);

  return (
    <m.div
      className={cn(
        "flex flex-col items-center justify-center gap-2 cursor-pointer select-none",
        className
      )}
      style={{ opacity }}
      onClick={handleClick}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: appearDuration, delay: appearDelay }}
      aria-label={text}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {/* Text */}
      <span className="text-sm italic text-muted tracking-wide">
        {text}
      </span>

      {/* Bouncing Arrow */}
      <m.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: bounceDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="w-5 h-5 text-subtle" />
      </m.div>
    </m.div>
  );
}

export default ScrollPrompt;
