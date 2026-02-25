"use client";

import * as m from "@/paraglide/messages";
import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import { JARVIS_POSTERS, JARVIS_VIDEOS } from "@/lib/media-config";
import { cn } from "@/lib/utils";
import styles from "./hero-section-1.module.css";

/**
 * Hero Section 1
 *
 * Full-screen hero section with:
 * - Video background (fixed position for parallax effect)
 * - Centered title with GSAP slide-up animation
 * - Scroll prompt indicator
 */

export function HeroSection1() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const hasAnimatedRef = useRef(false);

  const playTextAnimation = useCallback(() => {
    if (hasAnimatedRef.current) return;
    if (!titleRef.current || !subtitleRef.current) return;

    const titleSpans = titleRef.current.querySelectorAll(".line-mask span");
    const subtitle = subtitleRef.current;

    hasAnimatedRef.current = true;

    const readVar = (name: string, fallback: number) => {
      const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
      return Number.isFinite(val) ? val : fallback;
    };
    const titleDuration = readVar("--hero-title-duration", 1.2);
    const titleStagger = readVar("--hero-title-stagger", 0.2);
    const subtitleDuration = readVar("--hero-subtitle-duration", 1);
    const subtitleDelay = readVar("--hero-subtitle-delay", 1);

    gsap.to(titleSpans, {
      y: 0,
      duration: titleDuration,
      ease: "expo.out",
      stagger: titleStagger,
      delay: 0.2,
    });

    gsap.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: subtitleDuration,
      ease: "expo.out",
      delay: subtitleDelay,
    });
  }, []);

  useEffect(() => {
    // Start text animation immediately on mount, regardless of video state
    const timer = setTimeout(playTextAnimation, 100);
    return () => clearTimeout(timer);
  }, [playTextAnimation]);

  useEffect(() => {
    // Preload hero poster so the video has an immediate fallback frame
    const img = new Image();
    img.src = JARVIS_POSTERS.banner;
  }, []);

  return (
    <section className={cn("hero-section relative w-full overflow-hidden min-h-[92svh] sm:min-h-screen lg:min-h-[120vh] flex", styles.section)}>
      {/* Video Background (absolute position within section) */}
      <div className="absolute inset-0 z-[1]">
        {/* Gradient placeholder background - shows before video loads */}
        <div className={cn("absolute inset-0", styles.gradient)} />

        <video
          className="hero-video w-full h-full object-cover object-center relative z-10"
          poster={JARVIS_POSTERS.banner}
          playsInline
          autoPlay
          loop
          muted
          preload="auto"
        >
          <source src={JARVIS_VIDEOS.banner} type="video/mp4" />
        </video>
        {/* Dark overlay for better text contrast */}
        <div className={cn("absolute inset-0 z-20", styles.overlay)} />
      </div>

      {/* Hero Content - Inner Container */}
      <header className={cn("relative z-10 container-page grid place-items-center text-center px-6 sm:px-10 flex-1", styles.heroText)}>
        <div className="hero-content">
          {/* Animated Title */}
          <h1 ref={titleRef} className={cn("hero-title overflow-hidden font-hero-headline", styles.title)}>
            <div className="line-mask block overflow-hidden my-2">
              <span className="inline-block translate-y-full">
                {m.homepage_hero_title()}
              </span>
            </div>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className={cn("mt-6 opacity-0 translate-y-4 max-w-3xl mx-auto font-hero-subtitle", styles.subtitle)}
          >
            {m.homepage_hero_subtitle()}
          </p>

          {/* Scroll Prompt */}
          <div className="scroll-prompt absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70">
            <ChevronDown className="w-6 h-6 mb-2 animate-bounce" />
            <p className="font-label text-inverse-strong">{m.homepage_scroll_prompt()}</p>
          </div>
        </div>
      </header>
    </section>
  );
}
