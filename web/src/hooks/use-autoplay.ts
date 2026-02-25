/**
 * useAutoplay Hook
 *
 * Purpose:
 * - Autoplay functionality for carousels, sliders, etc.
 * - Support pause/resume (e.g., pause on hover)
 * - Auto cleanup timer
 *
 * Use Cases:
 * - Image carousel/slider
 * - Auto-switching tab component
 * - News ticker
 * - Product showcase carousel
 *
 * Features:
 * - Auto pause/resume mechanism
 * - Auto cleanup on unmount
 * - Support dynamic duration changes
 * - TypeScript type safe
 */

"use client";

import { useEffect, useRef, useCallback } from "react";

export interface UseAutoplayOptions {
  /** Autoplay interval duration in milliseconds */
  duration: number;
  /** Whether autoplay is enabled */
  enabled?: boolean;
  /** Whether autoplay is currently paused */
  paused?: boolean;
}

export interface UseAutoplayReturn {
  /** Start autoplay manually */
  start: () => void;
  /** Stop autoplay manually */
  stop: () => void;
  /** Pause autoplay (can be resumed) */
  pause: () => void;
  /** Resume autoplay */
  resume: () => void;
  /** Reset the timer (restart from 0) */
  reset: () => void;
}

/**
 * useAutoplay - Autoplay functionality for carousels and sliders
 *
 * @param callback - Function to call on each interval
 * @param options - Autoplay configuration
 * @returns Control functions for autoplay
 *
 * @example
 * ```tsx
 * // Basic autoplay carousel
 * function Carousel() {
 *   const [currentIndex, setCurrentIndex] = useState(0);
 *   const [isPaused, setIsPaused] = useState(false);
 *
 *   const goToNext = () => {
 *     setCurrentIndex((prev) => (prev + 1) % slides.length);
 *   };
 *
 *   useAutoplay(goToNext, {
 *     duration: 5000,
 *     paused: isPaused
 *   });
 *
 *   return (
 *     <div
 *       onMouseEnter={() => setIsPaused(true)}
 *       onMouseLeave={() => setIsPaused(false)}
 *     >
 *       <img src={slides[currentIndex]} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With manual controls
 * function AdvancedCarousel() {
 *   const [index, setIndex] = useState(0);
 *   const { pause, resume, reset } = useAutoplay(
 *     () => setIndex(prev => prev + 1),
 *     { duration: 3000 }
 *   );
 *
 *   return (
 *     <div>
 *       <button onClick={pause}>Pause</button>
 *       <button onClick={resume}>Resume</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAutoplay(
  callback: () => void,
  options: UseAutoplayOptions
): UseAutoplayReturn {
  const { duration, enabled = true, paused = false } = options;

  // Use ReturnType for cross-environment compatibility (browser/Node)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(paused);

  // Update paused ref when prop changes
  useEffect(() => {
    isPausedRef.current = paused;
  }, [paused]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!enabled || isPausedRef.current) return;

    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        callback();
      }
    }, duration);
  }, [callback, duration, enabled, clearTimer]);

  const start = useCallback(() => {
    isPausedRef.current = false;
    startTimer();
  }, [startTimer]);

  const stop = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    if (intervalRef.current === null) {
      startTimer();
    }
  }, [startTimer]);

  const reset = useCallback(() => {
    clearTimer();
    startTimer();
  }, [clearTimer, startTimer]);

  // Setup autoplay on mount and when dependencies change
  useEffect(() => {
    if (enabled && !paused) {
      startTimer();
    } else {
      clearTimer();
    }

    return () => {
      clearTimer();
    };
  }, [enabled, paused, startTimer, clearTimer]);

  return {
    start,
    stop,
    pause,
    resume,
    reset,
  };
}

export default useAutoplay;
