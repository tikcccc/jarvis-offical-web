"use client";

/**
 * Hero Section Client Component
 *
 * Large title with typewriter effect and shimmer on "AI Products"
 * Subtitle with left border accent
 * Character-level typewriter animation (no cursor)
 * i18n support
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import * as messages from "@/paraglide/messages";
import { TypewriterText } from "@/components/animations";
import shimmerStyles from "@/components/animations/text-shimmer.module.css";

export function HeroSectionClient() {
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const subtitleEl = subtitleRef.current;
    if (!subtitleEl) return;

    // Wait for subtitle to be triggered
    if (showSubtitle) {
      gsap.fromTo(
        subtitleEl,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }
  }, [showSubtitle]);

  // Get text from i18n
  const title1 = messages.services_products_title_1
    ? messages.services_products_title_1()
    : "Services &";
  const title2 = messages.services_products_title_2
    ? messages.services_products_title_2()
    : "AI Products";

  const title2Display = title2.replace(" ", "\u00a0");

  return (
    <section className="container mx-auto px-6 pt-32 pb-16 relative z-10">
      <div className="max-w-5xl">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-[var(--services-text)] mb-8 leading-[0.9]">
          {/* First line - Services & */}
          <span className="tracking-normal">
            <TypewriterText
              text={title1}
              className="text-[var(--services-text)] tracking-normal"
              speed={40}
              delay={0}
            />
          </span>
          <br />
          {/* Second line - AI Products with shimmer */}
          <span className="tracking-normal">
            <TypewriterText
              text={title2Display}
              className={`font-semibold tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-400 bg-[length:200%_auto] ${shimmerStyles.textShimmer}`}
              speed={40}
              delay={title1.length * 0.04 + 0.1}
              onComplete={() => {
                setShowSubtitle(true);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("services-hero-title-complete"));
                }
              }}
            />
          </span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl leading-relaxed text-[var(--services-muted)] font-light max-w-2xl border-l-2 border-[var(--services-border)] pl-6 opacity-0"
        >
          {messages.services_products_subtitle_1
            ? messages.services_products_subtitle_1()
            : "Intelligent infrastructure for the next century."}{" "}
          <br />
          <span className="text-[var(--services-text)] font-normal">
            {messages.services_products_subtitle_2
              ? messages.services_products_subtitle_2()
              : "Seamless fusion of expertise and AI."}
          </span>
        </p>
      </div>
    </section>
  );
}
