"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./hero-section.module.css";

/**
 * HeroSection Props
 * @param productName - The product name to display (e.g., "JARVIS Pay")
 * @param productSubtitle - Optional subtitle below the product name
 * @param videoSrc - URL to the background video
 * @param posterSrc - Optional poster image for video fallback
 * @param metadata - Array of metadata strings displayed in sidebar
 * @param logoComponent - Optional custom logo component instead of text
 */
interface HeroSectionProps {
  productName: string;
  productSubtitle?: string;
  videoSrc: string;
  posterSrc?: string;
  metadata: string[];
  logoComponent?: React.ReactNode;
}

/**
 * HeroSection Component
 *
 * A sticky hero section that acts as the underlayer for product pages.
 * Features:
 * - Sticky positioning (stays fixed while content scrolls over)
 * - Full-screen video background with autoplay
 * - Gradient overlay for text legibility
 * - Elegant typography with balanced sizing
 * - Metadata sidebar with vertical accent line
 *
 * Based on product-template.html reference design with refined aesthetics.
 */
export function HeroSection({
  productName,
  productSubtitle,
  videoSrc,
  posterSrc,
  metadata,
  logoComponent,
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cleanedMetadata = metadata.filter((item) => item?.trim().length);

  useEffect(() => {
    // Ensure video plays on mount (Safari/iOS compatibility)
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked - user interaction required
        // Video will show poster or first frame
      });
    }
  }, []);

  return (
    <header
      className={cn("sticky top-0 h-screen z-0 overflow-hidden", styles.hero)}
    >
      {/* Background Video Layer - stays fixed (or slow parallax) */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          preload="metadata"
          className="w-full h-full object-cover"
          aria-label={`${productName} background video`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Gradient Overlay - enhanced for better depth and readability */}
        <div className={cn("absolute inset-0", styles.overlayVertical)} />
        <div className={cn("absolute inset-0", styles.overlayHorizontal)} />
      </div>

      {/* Foreground Content Layer - moves with narrative track */}
      <div
        data-hero-foreground="true"
        className={cn("relative z-10 h-full max-w-[1800px] mx-auto flex flex-col justify-end will-change-transform", styles.foreground, styles.heroPadding)}
      >
        {/* Main content area */}
        <div
          className={cn("flex flex-col md:flex-row justify-between items-start md:items-end w-full", styles.gapLg)}
        >
          {/* Left: Product Name - Anchored bottom-left */}
          <div
            className={cn("flex flex-col max-w-4xl", styles.gapSm)}
          >
            {logoComponent || <h1 className={styles.heroTitle}>{productName}</h1>}

            {/* Optional subtitle */}
            {productSubtitle && (
              <p className={cn("max-w-lg mt-2 md:pl-2", styles.heroSubtitle)}>
                {productSubtitle}
              </p>
            )}
          </div>

          {/* Right: Metadata - Bottom Right, Minimalist */}
          <div className="hidden md:flex flex-col items-end">
            <div
              className={cn("relative flex flex-col items-end pr-2 pl-8", styles.meta, styles.metaLine, styles.metadataLine, styles.gapSm, styles.metaColor)}
            >
              {cleanedMetadata.map((item, i) => (
                <span
                  key={i}
                  className={cn("max-w-[240px] text-right leading-tight hover:text-white", styles.metaItem)}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile metadata - horizontal layout */}
        <div
          className={cn("flex md:hidden mt-6 flex-wrap", styles.metaChip, styles.metaChipWrap)}
        >
          {cleanedMetadata.slice(0, 4).map((item, i) => (
            <span
              key={i}
              className={cn("px-3 py-1 rounded-full border backdrop-blur-[1px]", styles.metaChipItem)}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
