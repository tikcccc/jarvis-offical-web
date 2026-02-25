"use client";

/**
 * SpotlightCard Component (Performance Optimized)
 *
 * Wrapper component that creates a mouse-following spotlight effect
 * Uses Framer Motion's useMotionValue and useMotionTemplate for GPU-accelerated tracking
 *
 * Performance Optimizations:
 * - Throttled mouse tracking with requestAnimationFrame
 * - Cached getBoundingClientRect with ResizeObserver
 * - Disabled during scroll for smooth scrolling
 * - Disabled on mobile devices
 */

import { useMotionTemplate, useMotionValue } from "framer-motion";
import { m } from "@/components/motion/lazy-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafIdRef = useRef<number>(0);
  const boundsRef = useRef<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cache getBoundingClientRect with ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateBounds = () => {
      boundsRef.current = container.getBoundingClientRect();
    };

    updateBounds();

    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(container);

    window.addEventListener("scroll", updateBounds, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateBounds);
    };
  }, []);

  // Detect scrolling to disable tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Throttled mouse move handler with RAF
  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    // Skip if mobile or scrolling
    if (isMobile || isScrolling) return;

    // Cancel previous RAF if still pending
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (!boundsRef.current) return;

      const { left, top } = boundsRef.current;
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    });
  }

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative group bg-gray-900 overflow-hidden border border-white/10 rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        // Hint browser for optimization
        contain: "layout style paint",
      }}
    >
      {!isMobile && (
        <m.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-80 z-10"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                120px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 72%
              )
            `,
            willChange: "background",
          }}
        />
      )}
      <div className="relative h-full w-full bg-gray-950/90 rounded-xl">
        {children}
      </div>
    </div>
  );
}
