"use client";

import React, { useRef, useLayoutEffect } from "react";
import { m } from "@/components/motion/lazy-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as messages from "@/paraglide/messages";
import { ROUTES } from "@/lib/constants";
import { LocalizedLink } from "@/components/ui/localized-link";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/smart-image";
import styles from "./section5-cta.module.css";

interface Section5CTAProps {
  imageUrl?: string;
  imageAlt?: string;
}

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Section5CTA({ imageUrl, imageAlt }: Section5CTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const readVar = (name: string, fallback: number) => {
        const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
        return Number.isFinite(val) ? val : fallback;
      };
      const imageDuration = readVar("--cta-image-duration", 1.2);
      const textDuration = readVar("--cta-text-duration", 0.8);
      const textStagger = readVar("--cta-text-stagger", 0.15);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.from(imageRef.current, {
        x: -80,
        opacity: 0,
        duration: imageDuration,
        ease: "power3.out",
      });

      tl.from(
        [titleRef.current, subtitleRef.current, buttonRef.current],
        {
          y: 40,
          opacity: 0,
          duration: textDuration,
          stagger: textStagger,
          ease: "power3.out",
        },
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className={cn("w-full section-padding flex flex-col", styles.section)}
    >
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md items-center">
          <div
            ref={imageRef}
            className={cn(
              "relative aspect-[4/3] w-full max-w-[520px] sm:max-w-[560px] lg:max-w-[600px] xl:max-w-[640px] overflow-hidden md:ml-auto lg:-translate-x-25",
              styles.media,
              styles.mediaBg
            )}
          >
            <SmartImage
              src={imageUrl ?? "/images/cta/cta.webp"}
              sources={[
                { src: "/images/cta/cta.avif", type: "image/avif" },
                { src: "/images/cta/cta.webp", type: "image/webp" },
              ]}
              fallbackSrc="/images/cta/cta.png"
              alt={imageAlt ?? "Modern business technology and collaboration"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              imageClassName="object-cover"
              preload
              priority
              fetchPriority="high"
            />
            <div className={cn("absolute inset-0", styles.mediaOverlay)} />
          </div>

          <div
            ref={textWrapperRef}
            className="flex flex-col items-center text-center justify-center md:px-6 lg:px-8"
          >
            <h2
              ref={titleRef}
              className={cn("text-balance mb-6 font-container-title", styles.title)}
            >
              {messages.section5_cta_title()}
            </h2>

            <p
              ref={subtitleRef}
              className={cn("max-w-lg text-pretty mx-auto font-body-lg", styles.subtitle)}
            >
              {messages.section5_cta_subtitle()}
            </p>

            <div ref={buttonRef} className="stack-lg mt-6 sm:mt-8">
              <m.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    "h-12 sm:h-14 px-8 sm:px-10 transition-all font-body-base",
                    styles.buttonText,
                    styles.buttonVariant,
                    styles.buttonTransition
                  )}
                >
                  <LocalizedLink href={ROUTES.CONTACT} prefetchMode="hover">
                    {messages.section5_cta_button()}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </LocalizedLink>
                </Button>
              </m.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
