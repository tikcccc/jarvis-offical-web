"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
}

/**
 * TypewriterText Component
 *
 * Creates a typewriter effect using GSAP for tech-style text animation.
 * Used for small labels, status indicators, and data-like text.
 */
export function TypewriterText({
  text,
  delay = 0,
  className = "",
}: TypewriterTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".char");

    gsap.killTweensOf(chars);
    gsap.set(chars, { opacity: 0 });

    const tl = gsap.timeline({ delay: delay });
    tl.to(chars, {
      opacity: 1,
      duration: 0.05,
      stagger: 0.02,
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, [text, delay]);

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="char inline-block whitespace-pre opacity-0"
        >
          {char}
        </span>
      ))}
    </div>
  );
}
