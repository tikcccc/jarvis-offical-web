"use client";

/**
 * Background Layers Component
 *
 * Renders the dark cyberpunk-style background layers:
 * 1. Noise texture overlay
 * 2. Tech grid pattern with radial fade
 * 3. Ambient emerald glow from top-center
 *
 * Grid sheen runs continuously, but only starts after hero title animation completes
 * (event: "services-hero-title-complete").
 */

import { useEffect, useState } from "react";

export function BackgroundLayers() {
  const [sheenRunning, setSheenRunning] = useState(false);

  useEffect(() => {
    let started = false;
    const startSheen = () => {
      if (started) return;
      started = true;
      setSheenRunning(true);
    };

    window.addEventListener("services-hero-title-complete", startSheen);
    return () => window.removeEventListener("services-hero-title-complete", startSheen);
  }, []);

  return (
    <>
      {/* Noise Texture Overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10 bg-[url('/images/noise.svg')] bg-repeat will-change-opacity"
      />

      {/* Tech Grid Pattern */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          maskImage: "radial-gradient(circle at 50% 0%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, black 40%, transparent 85%)",
        }}
      />

      {/* Grid Sheen Sweep (starts on event) */}
      <div
        className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
        style={{
          maskImage: "radial-gradient(circle at 50% 0%, black 35%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, black 35%, transparent 85%)",
        }}
      >
        <div className={`grid-sheen-overlay${sheenRunning ? " grid-sheen-overlay--run" : ""}`} />
      </div>

      {/* Ambient Emerald Glow */}
      <div
        className="fixed left-1/2 -translate-x-1/2 w-full h-[80vh] pointer-events-none"
        style={{
          top: "-20%",
          zIndex: 0,
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
    </>
  );
}
