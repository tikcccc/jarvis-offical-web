/**
 * useGsapAnimation Hook
 *
 * 用途：
 * - 簡化 GSAP 動畫的 React 整合
 * - 自動處理 cleanup（kill tweens/timelines）
 * - 避免重複的 useRef + useEffect 樣板代碼
 *
 * 使用場景：
 * - Hero section 的標題動畫
 * - Scroll-triggered 動畫
 * - 元素進場/離場動畫
 * - 任何需要 GSAP 的組件動畫
 *
 * 特性：
 * - 自動綁定 ref 到目標元素
 * - 組件卸載時自動 kill 動畫
 * - 支持 Tween 和 Timeline
 * - TypeScript 類型安全
 */

"use client";

import { useEffect, useRef, type DependencyList } from "react";
import { gsap } from "gsap";

/**
 * Animation function that receives the element and returns GSAP animation
 */
export type GsapAnimationFn<T extends HTMLElement> = (
  element: T
) => gsap.core.Tween | gsap.core.Timeline | void;

/**
 * useGsapAnimation - Simplify GSAP animations in React components
 *
 * @param animationFn - Function that creates and returns GSAP animation
 * @param deps - Dependency array for re-triggering animation
 * @returns ref - Ref to attach to the animated element
 *
 * @example
 * ```tsx
 * // Basic fade in animation
 * function Component() {
 *   const ref = useGsapAnimation<HTMLDivElement>((el) => {
 *     return gsap.from(el, { opacity: 0, y: 20, duration: 1 });
 *   });
 *
 *   return <div ref={ref}>Animated content</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Timeline animation with stagger
 * function HeroTitle({ text }: { text: string }) {
 *   const ref = useGsapAnimation<HTMLHeadingElement>((el) => {
 *     const words = el.querySelectorAll('.word');
 *     const tl = gsap.timeline();
 *     tl.from(words, {
 *       y: 100,
 *       opacity: 0,
 *       duration: 1.2,
 *       stagger: 0.2,
 *       ease: "expo.out"
 *     });
 *     return tl;
 *   }, [text]);
 *
 *   return (
 *     <h1 ref={ref}>
 *       {text.split(' ').map((word, i) => (
 *         <span key={i} className="word">{word}</span>
 *       ))}
 *     </h1>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // ScrollTrigger animation
 * function ScrollSection() {
 *   const ref = useGsapAnimation<HTMLElement>((el) => {
 *     return gsap.from(el, {
 *       opacity: 0,
 *       y: 50,
 *       scrollTrigger: {
 *         trigger: el,
 *         start: "top 80%",
 *         end: "top 20%",
 *         scrub: 1,
 *       }
 *     });
 *   });
 *
 *   return <section ref={ref}>Content</section>;
 * }
 * ```
 */
export function useGsapAnimation<T extends HTMLElement = HTMLDivElement>(
  animationFn: GsapAnimationFn<T>,
  deps: DependencyList = []
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Execute animation function
    const animation = animationFn(element);

    // Cleanup function
    return () => {
      if (animation) {
        // Kill the animation (works for both Tween and Timeline)
        animation.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationFn, ...deps]);

  return ref;
}

/**
 * useGsapTimeline - Create a GSAP timeline with automatic cleanup
 *
 * @param setupFn - Function that receives timeline and element
 * @param deps - Dependency array
 * @returns ref - Ref to attach to the container element
 *
 * @example
 * ```tsx
 * function SequenceAnimation() {
 *   const ref = useGsapTimeline<HTMLDivElement>((tl, el) => {
 *     const title = el.querySelector('.title');
 *     const subtitle = el.querySelector('.subtitle');
 *
 *     tl.from(title, { opacity: 0, y: 20, duration: 0.8 })
 *       .from(subtitle, { opacity: 0, y: 10, duration: 0.6 }, "-=0.4");
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       <h1 className="title">Title</h1>
 *       <p className="subtitle">Subtitle</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useGsapTimeline<T extends HTMLElement = HTMLDivElement>(
  setupFn: (timeline: gsap.core.Timeline, element: T) => void,
  deps: DependencyList = []
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create timeline
    const tl = gsap.timeline();

    // Setup timeline with user function
    setupFn(tl, element);

    // Cleanup
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupFn, ...deps]);

  return ref;
}

export default useGsapAnimation;
