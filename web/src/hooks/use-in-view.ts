/**
 * useInView Hook
 *
 * 用途：
 * - 檢測元素是否進入視口（viewport）
 * - 基於Intersection Observer API實現
 * - 用於觸發滾動動畫和懶加載
 *
 * 使用場景：
 * - 滾動時觸發元素的淡入動畫
 * - 圖片懶加載（進入視口才加載）
 * - 統計數字的count-up動畫觸發
 * - 視頻自動播放/暫停控制
 * - 頁面分段的scroll-reveal效果
 */

"use client";

import { useEffect, useRef, useState, RefObject } from "react";

export interface UseInViewOptions {
  /** 觸發閾值，0-1之間或數組，默認0.1 */
  threshold?: number | number[];
  /** 是否只觸發一次，默認false */
  triggerOnce?: boolean;
  /** 視口邊距，例如"-100px" 或 "10% 20px" */
  rootMargin?: string;
  /** 初始值，用於SSR，默認false */
  initialInView?: boolean;
}

export interface UseInViewReturn<T extends HTMLElement = HTMLElement> {
  /** 綁定到目標元素的ref */
  ref: RefObject<T | null>;
  /** 元素是否在視口內 */
  inView: boolean;
  /** IntersectionObserverEntry對象 */
  entry: IntersectionObserverEntry | null;
}

/**
 * useInView - 檢測元素是否進入視口
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
 *
 *   return (
 *     <div ref={ref}>
 *       {inView ? 'Visible!' : 'Not visible'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): UseInViewReturn<T> {
  const {
    threshold = 0.1,
    triggerOnce = false,
    rootMargin = "0px",
    initialInView = false,
  } = options;

  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(initialInView);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  // Track if we've already triggered (for triggerOnce)
  const hasTriggered = useRef(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    // If triggerOnce and already triggered, don't observe
    if (triggerOnce && hasTriggered.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        const isIntersecting = observerEntry.isIntersecting;

        setInView(isIntersecting);
        setEntry(observerEntry);

        // Handle triggerOnce
        if (isIntersecting && triggerOnce) {
          hasTriggered.current = true;
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, inView, entry };
}

export default useInView;
