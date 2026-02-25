"use client";

/**
 * Typewriter Animation Component
 *
 * A reusable typewriter effect component with character-level animation.
 * Uses GSAP for smooth, performant animations.
 *
 * Features:
 * - Character-by-character reveal (true typewriter effect)
 * - Configurable speed and delay
 * - Optional cursor animation
 * - Completion callback support
 * - Full className customization
 *
 * @example
 * ```tsx
 * <TypewriterText text="Hello World" speed={50} />
 * <TypewriterText
 *   text="AI Products"
 *   className="text-emerald-400 font-bold"
 *   delay={0.5}
 *   onComplete={() => console.log('Done!')}
 * />
 * ```
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TypewriterTextProps {
  /** Text to animate */
  text: string;
  /** Custom className for styling */
  className?: string;
  /** Speed in milliseconds per character (default: 50) */
  speed?: number;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Show blinking cursor (default: false) */
  cursorVisible?: boolean;
  /** Cursor character (default: "|") */
  cursorChar?: string;
  /** Cursor color (default: currentColor) */
  cursorColor?: string;
  /** Reverse animation (characters disappear) */
  reverse?: boolean;
}

export function TypewriterText({
  text,
  className = "",
  speed,
  delay,
  onComplete,
  cursorVisible = false,
  cursorChar = "|",
  cursorColor = "currentColor",
  reverse = false,
}: TypewriterTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Update onComplete ref without triggering re-animation
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const readMotion = (name: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const charSpeed = speed ?? readMotion("--motion-typewriter-char-ms", 50);
  const baseDelay = delay ?? readMotion("--motion-typewriter-delay", 0);
  const blinkDuration = readMotion("--motion-typewriter-blink", 0.5);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container) return;

    let started = false;
    let timeline: gsap.core.Timeline | null = null;
    let cursorAnim: gsap.core.Tween | null = null;
    let revertWidth: (() => void) | null = null;

    const startAnimation = () => {
      if (started) return;
      started = true;

      if (cursor) {
        gsap.set(cursor, { x: 0, y: 0 });
      }

      // Clear container and create character spans
      // Key insight: Use visibility:hidden instead of display:none so characters
      // occupy space from the start, ensuring consistent line breaks
      // Group by words to prevent words from breaking across lines
      container.innerHTML = "";
      const charElements: HTMLElement[] = [];

      // Split text into words and spaces
      const tokens = text.split(/(\s+)/);

      tokens.forEach((token) => {
        const isSpace = /^\s+$/.test(token);

        if (isSpace) {
          // Handle spaces: create a single span for each space character
          token.split("").forEach(() => {
            const span = document.createElement("span");
            span.textContent = "\u00A0"; // Non-breaking space
            span.style.transition = "none";
            span.style.display = "inline-block";

            if (reverse) {
              span.style.visibility = "visible";
            } else {
              span.style.visibility = "hidden";
            }

            container.appendChild(span);
            charElements.push(span);
          });
        } else {
          // Handle words: wrap in a word container to keep word intact
          const wordContainer = document.createElement("span");
          wordContainer.style.display = "inline-block";
          wordContainer.style.whiteSpace = "nowrap"; // Prevent word from breaking

          token.split("").forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.transition = "none";
            span.style.display = "inline-block";

            if (reverse) {
              span.style.visibility = "visible";
            } else {
              span.style.visibility = "hidden";
            }

            wordContainer.appendChild(span);
            charElements.push(span);
          });

          container.appendChild(wordContainer);
        }
      });

      // Prevent layout reflow flicker when reversing by freezing the current width via minWidth
      if (reverse && container) {
        const originalMinWidth = container.style.minWidth;
        const measuredWidth = container.getBoundingClientRect().width;
        container.style.minWidth = `${measuredWidth}px`;
        revertWidth = () => {
          container.style.minWidth = originalMinWidth;
        };
      }

      // Calculate stagger time (convert ms to seconds)
      const staggerTime = charSpeed / 1000;

      // Create timeline
      timeline = gsap.timeline({
        delay: baseDelay,
        onComplete: () => {
          if (reverse && revertWidth) {
            revertWidth();
          }
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        },
      });

      // Animate characters based on direction using visibility
      if (reverse) {
        // For reverse: animate from last to first, visible to hidden
        const reversedElements = [...charElements].reverse();
        timeline?.to(reversedElements, {
          visibility: "hidden",
          duration: 0,
          stagger: staggerTime,
          ease: "none",
        });
      } else {
        // For forward: animate from first to last, hidden to visible, and move cursor along
        charElements.forEach((el, index) => {
          const at = index * staggerTime;
          timeline?.to(
            el,
            {
              visibility: "visible",
              duration: 0,
              ease: "none",
            },
            at
          );
          if (cursor && timeline) {
            timeline.to(
              cursor,
              {
                x: () => el.offsetLeft + el.offsetWidth,
                y: () => el.offsetTop,
                duration: 0,
                ease: "none",
              },
              at
            );
          }
        });
      }

      if (cursorVisible && cursor) {
        cursorAnim = gsap.to(cursor, {
          opacity: 0,
          repeat: -1,
          yoyo: true,
          duration: blinkDuration,
          ease: "steps(1)",
        });
      }
    };

    // Start animation with appropriate delay
    const timeoutId = setTimeout(startAnimation, reverse ? 0 : 50);

    return () => {
      clearTimeout(timeoutId);
      timeline?.kill();
      cursorAnim?.kill();
      if (reverse && revertWidth) {
        revertWidth();
      }

      // Don't show text on cleanup - keep container empty
      // This prevents flash of full text during React StrictMode double-invoke
      if (!started && container && !reverse) {
        container.textContent = "";
      }
    };
    // Only run once on mount with initial text
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="relative inline-block align-baseline">
      <span ref={containerRef} className={className} />
      {cursorVisible && (
        <span
          ref={cursorRef}
          className="absolute inline-block left-0 top-0 pointer-events-none"
          style={{ color: cursorColor }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}

/**
 * TypewriterWidth Component
 *
 * Width-based typewriter effect (similar to about-us page).
 * Uses width animation from 0% to 100% with steps easing.
 * Supports ScrollTrigger integration and cursor animation.
 *
 * @example
 * ```tsx
 * <TypewriterWidth
 *   text="WHY WE'RE HERE"
 *   className="text-5xl font-bold"
 *   duration={1.5}
 *   steps={40}
 *   cursorVisible
 *   hideCursorOnComplete
 *   scrollTrigger={{ trigger: "#section-1", start: "top 70%" }}
 * />
 * ```
 */

export interface TypewriterWidthProps {
  /** Text to animate */
  text: string;
  /** Custom className for styling */
  className?: string;
  /** Animation duration in seconds (default: 1.5) */
  duration?: number;
  /** Number of steps for typewriter effect (default: 40) */
  steps?: number;
  /** Show blinking cursor (default: false) */
  cursorVisible?: boolean;
  /** Cursor className for styling */
  cursorClassName?: string;
  /** Hide cursor after typing completes (default: false) */
  hideCursorOnComplete?: boolean;
  /** ScrollTrigger configuration (optional) */
  scrollTrigger?: ScrollTrigger.Vars;
  /** Callback when animation completes */
  onComplete?: () => void;
}

export function TypewriterWidth({
  text,
  className = "",
  duration,
  steps,
  cursorVisible = false,
  cursorClassName = "",
  hideCursorOnComplete = false,
  scrollTrigger,
  onComplete,
}: TypewriterWidthProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const onCompleteRef = useRef(onComplete);

  // Update onComplete ref without triggering re-animation
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const titleEl = titleRef.current;
    const cursorEl = cursorRef.current;
    if (!titleEl || hasAnimated.current) return;

    // Mark as animated to prevent re-execution
    hasAnimated.current = true;

    // Set initial state
    gsap.set(titleEl, { width: "0%" });
    if (cursorEl) {
      gsap.set(cursorEl, { left: "0%" });
    }

    // Create timeline with optional ScrollTrigger
    const readMotion = (name: string, fallback: number) => {
      if (typeof window === "undefined") return fallback;
      const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
      return Number.isFinite(val) ? val : fallback;
    };
    const widthDuration = duration ?? readMotion("--motion-typewriter-width-duration", 1.5);
    const widthSteps = steps ?? readMotion("--motion-typewriter-width-steps", 40);
    const blinkDuration = readMotion("--motion-typewriter-blink", 0.5);

    const tl = gsap.timeline({
      scrollTrigger: scrollTrigger
        ? {
            ...scrollTrigger,
            once: true,
          }
        : undefined,
      onComplete: () => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      },
    });

    // Animate title width
    tl.to(titleEl, {
      width: "100%",
      duration: widthDuration,
      ease: `steps(${widthSteps})`,
    });

    // Cursor blinking animation
    let blinkAnim: gsap.core.Tween | null = null;
    if (cursorVisible && cursorEl) {
      blinkAnim = gsap.to(cursorEl, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: blinkDuration,
        ease: "steps(1)",
      });
    }

    // Animate cursor position
    if (cursorEl) {
      tl.to(
        cursorEl,
        {
          left: "100%",
          duration: widthDuration,
          ease: `steps(${widthSteps})`,
        },
        "<"
      );

      // Hide cursor after typing completes
      if (hideCursorOnComplete && blinkAnim) {
        tl.call(() => {
          if (blinkAnim) {
            blinkAnim.kill();
          }
          // Directly hide cursor
          gsap.set(cursorEl, { opacity: 0 });
        });
      }
    }

    return () => {
      tl.kill();
      if (blinkAnim) blinkAnim.kill();
      // Allow re-init in React StrictMode double-invocation
      hasAnimated.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative inline-block">
      {/* Invisible placeholder for layout */}
      <span className={cn("select-none invisible", className)}>{text}</span>

      {/* Animated text */}
      <span
        ref={titleRef}
        className={cn(
          "absolute top-0 left-0 whitespace-nowrap overflow-hidden",
          className
        )}
        style={{ width: "0%" }}
      >
        {text}
      </span>

      {/* Cursor */}
      {cursorVisible && (
        <span
          ref={cursorRef}
          className={cn("absolute block", cursorClassName)}
          style={{ left: "0%" }}
        />
      )}
    </div>
  );
}

/**
 * TypewriterLines Component
 *
 * Animates multiple lines of text in sequence.
 * Perfect for multi-line titles with typewriter effects.
 *
 * @example
 * ```tsx
 * <TypewriterLines
 *   lines={[
 *     { text: "Services &", className: "text-white" },
 *     { text: "AI Products", className: "text-emerald-400 font-bold" }
 *   ]}
 *   speed={40}
 * />
 * ```
 */

export interface TypewriterLine {
  text: string;
  className?: string;
  delay?: number;
}

export interface TypewriterLinesProps {
  /** Array of lines to animate */
  lines: TypewriterLine[];
  /** Speed in milliseconds per character (default: 50) */
  speed?: number;
  /** Delay before first line starts (default: 0) */
  initialDelay?: number;
  /** Gap between lines in seconds (default: 0.1) */
  lineGap?: number;
  /** Container className */
  className?: string;
  /** Callback when all lines complete */
  onComplete?: () => void;
}

export function TypewriterLines({
  lines,
  speed,
  initialDelay,
  lineGap,
  className = "",
  onComplete,
}: TypewriterLinesProps) {
  const completedCount = useRef(0);
  const [startedLines, setStartedLines] = useState<Set<number>>(new Set([0])); // Track which lines have started animating

  const readMotion = (name: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const charSpeed = speed ?? readMotion("--motion-typewriter-char-ms", 50);
  const baseDelay = initialDelay ?? readMotion("--motion-typewriter-delay", 0);
  const gap = lineGap ?? readMotion("--motion-typewriter-line-gap", 0.1);

  const handleLineComplete = () => {
    completedCount.current += 1;
    if (completedCount.current === lines.length && onComplete) {
      onComplete();
    }
  };

  // Schedule line start tracking based on delay
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    lines.forEach((_, index) => {
      if (index === 0) return; // First line starts immediately

      const lineDelay = lines
        .slice(0, index)
        .reduce((acc, prevLine) => {
          const charCount = prevLine.text.length;
          return acc + (charCount * charSpeed) / 1000 + gap;
        }, baseDelay);

      const timer = setTimeout(() => {
        setStartedLines((prev) => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
      }, lineDelay * 1000);

      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [lines, charSpeed, baseDelay, gap]);

  return (
    <span className="relative inline-block w-full">
      {/* Invisible placeholder to reserve space and prevent layout shift */}
      <span className="invisible select-none pointer-events-none" aria-hidden="true">
        {lines.map((line, index) => (
          <span key={`placeholder-${index}`} className={cn("block", line.className)}>
            {line.text}
          </span>
        ))}
      </span>

      {/* Animated typewriter content (absolutely positioned over placeholder) */}
      <span className={cn("absolute inset-0", className)}>
        {lines.map((line, index) => {
          // Calculate cumulative delay
          const lineDelay = lines
            .slice(0, index)
            .reduce((acc, prevLine) => {
              const charCount = prevLine.text.length;
              return acc + (charCount * charSpeed) / 1000 + gap;
        }, baseDelay);

          const hasStarted = startedLines.has(index);

          return (
            <span
              key={index}
              className="block"
              style={{
                // Hide lines that haven't started yet without affecting layout
                visibility: hasStarted ? 'visible' : 'hidden',
                position: hasStarted ? 'relative' : 'absolute',
                height: hasStarted ? 'auto' : 0,
                overflow: hasStarted ? 'visible' : 'hidden',
              }}
            >
              <TypewriterText
                text={line.text}
                className={line.className}
                speed={speed}
                delay={lineDelay}
                onComplete={handleLineComplete}
              />
            </span>
          );
        })}
      </span>
    </span>
  );
}

/**
 * TypewriterLinesReverse Component
 *
 * Animates multiple lines of text with reverse typewriter effect (characters disappear).
 * Lines animate from last to first, but display order remains correct.
 * Each line's characters disappear from end to start.
 *
 * @example
 * ```tsx
 * <TypewriterLinesReverse
 *   lines={[
 *     { text: "Services &", className: "text-white" },
 *     { text: "AI Products", className: "text-emerald-400 font-bold" }
 *   ]}
 *   speed={30}
 * />
 * // Result: "AI Products" disappears first, then "Services &"
 * ```
 */
export function TypewriterLinesReverse({
  lines,
  speed,
  initialDelay,
  lineGap,
  className = "",
  onComplete,
}: TypewriterLinesProps) {
  const completedCount = useRef(0);
  const containerRef = useRef<HTMLSpanElement>(null);

  const readMotion = (name: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const charSpeed = speed ?? readMotion("--motion-typewriter-char-ms", 50);
  const baseDelay = initialDelay ?? readMotion("--motion-typewriter-delay", 0);
  const gap = lineGap ?? readMotion("--motion-typewriter-line-gap", 0.1);

  const handleLineComplete = () => {
    completedCount.current += 1;
    if (completedCount.current === lines.length && onComplete) {
      onComplete();
    }
  };

  // Freeze container dimensions on mount to prevent layout shift during reverse animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Measure and freeze dimensions before animation starts
    const rect = container.getBoundingClientRect();
    container.style.minWidth = `${rect.width}px`;
    container.style.minHeight = `${rect.height}px`;

    return () => {
      // Clean up on unmount
      container.style.minWidth = "";
      container.style.minHeight = "";
    };
  }, []);

  return (
    <span ref={containerRef} className={className}>
      {/* Map through original lines to maintain visual order */}
      {lines.map((line, visualIndex) => {
        // Calculate cumulative delay: sum of all lines that should disappear before this one
        // Lines that appear later visually (higher index) should disappear first
        let cumulativeDelay = baseDelay;

        // For the last line (visualIndex === lines.length - 1), delay = initialDelay
        // For the second to last line, delay = initialDelay + last line's duration
        // And so on...
        for (let i = lines.length - 1; i > visualIndex; i--) {
          const lineChars = lines[i].text.length;
          cumulativeDelay += (lineChars * charSpeed) / 1000 + gap;
        }

        return (
          <span key={visualIndex} className="block">
            <TypewriterText
              text={line.text}
              className={line.className}
              speed={speed}
              delay={cumulativeDelay}
              reverse={true}
              onComplete={handleLineComplete}
            />
          </span>
        );
      })}
    </span>
  );
}
