"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HeroBackground Props
 */
interface HeroBackgroundProps {
  videoSrc: string;
  posterSrc?: string;
  productName: string;
}

/**
 * HeroBackground Component
 *
 * Fixed background layer with video that stays in place during scroll.
 * This is completely decoupled from the foreground content.
 * Hides when scrolled past the narrative section to prevent covering footer.
 */
export function HeroBackground({
  videoSrc,
  posterSrc,
  productName,
}: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(true);

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

  useEffect(() => {
    // Hide background when scrolled past hero + narrative sections
    const handleScroll = () => {
      // Hide when hero is scrolled beyond 1.5x the viewport height
      const scrollThreshold = window.innerHeight * 1.5;
      const shouldBeVisible = window.scrollY < scrollThreshold;

      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden transition-opacity duration-300"
      style={{
        backgroundColor: "var(--product-surface-dark)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Video Background */}
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

      {/* Gradient Overlay - 從底部純黑漸變到頂部透明 (參考原型設計) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
    </div>
  );
}
