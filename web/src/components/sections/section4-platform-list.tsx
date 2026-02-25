"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "@/lib/i18n";
import { m } from "@/components/motion/lazy-motion";
import { ArrowRight } from "lucide-react";
import * as messages from "@/paraglide/messages";
import { JARVIS_POSTERS, JARVIS_VIDEOS } from "@/lib/media-config";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import styles from "./section4-platform-list.module.css";

// Platform data structure
interface PlatformItem {
  id: string;
  titleKey: keyof typeof platformTitles;
  descKey: keyof typeof platformDescs;
  version: string;
  videoUrl: string;
  posterUrl?: string;
  route: string;
}

// Map keys to message functions
const platformTitles = {
  agent: () => messages.section4_agent_title(),
  pay: () => messages.section4_pay_title(),
  air: () => messages.section4_air_title(),
  eagleeye: () => messages.section4_eagleeye_title(),
  ssss: () => messages.section4_ssss_title(),
  dwss: () => messages.section4_dwss_title(),
  cdcp: () => messages.section4_cdcp_title(),
  assets: () => messages.section4_assets_title(),
};

const platformDescs = {
  agent: () => messages.section4_agent_desc(),
  pay: () => messages.section4_pay_desc(),
  air: () => messages.section4_air_desc(),
  eagleeye: () => messages.section4_eagleeye_desc(),
  ssss: () => messages.section4_ssss_desc(),
  dwss: () => messages.section4_dwss_desc(),
  cdcp: () => messages.section4_cdcp_desc(),
  assets: () => messages.section4_assets_desc(),
};

const platforms: PlatformItem[] = [
  {
    id: "01",
    titleKey: "agent",
    descKey: "agent",
    version: "/0.1",
    videoUrl: JARVIS_VIDEOS.agent,
    posterUrl: JARVIS_POSTERS.agent,
    route: ROUTES.JARVIS.AGENT,
  },
  {
    id: "02",
    titleKey: "pay",
    descKey: "pay",
    version: "/0.2",
    videoUrl: JARVIS_VIDEOS.pay,
    posterUrl: JARVIS_POSTERS.pay,
    route: ROUTES.JARVIS.PAY,
  },
  {
    id: "03",
    titleKey: "air",
    descKey: "air",
    version: "/0.3",
    videoUrl: JARVIS_VIDEOS.air,
    posterUrl: JARVIS_POSTERS.air,
    route: ROUTES.JARVIS.AIR,
  },
  {
    id: "04",
    titleKey: "eagleeye",
    descKey: "eagleeye",
    version: "/0.4",
    videoUrl: JARVIS_VIDEOS.eagleEye,
    posterUrl: JARVIS_POSTERS.eagleEye,
    route: ROUTES.JARVIS.EAGLE_EYE,
  },
  {
    id: "05",
    titleKey: "ssss",
    descKey: "ssss",
    version: "/0.5",
    videoUrl: JARVIS_VIDEOS.ssss,
    posterUrl: JARVIS_POSTERS.ssss,
    route: ROUTES.JARVIS.SSSS,
  },
  {
    id: "06",
    titleKey: "dwss",
    descKey: "dwss",
    version: "/0.6",
    videoUrl: JARVIS_VIDEOS.dwss,
    posterUrl: JARVIS_POSTERS.dwss,
    route: ROUTES.JARVIS.DWSS,
  },
  {
    id: "07",
    titleKey: "cdcp",
    descKey: "cdcp",
    version: "/0.7",
    videoUrl: JARVIS_VIDEOS.cdcp,
    posterUrl: JARVIS_POSTERS.cdcp,
    route: ROUTES.JARVIS.CDCP,
  },
  {
    id: "08",
    titleKey: "assets",
    descKey: "assets",
    version: "/0.8",
    videoUrl: JARVIS_VIDEOS.assets,
    posterUrl: JARVIS_POSTERS.assets,
    route: ROUTES.JARVIS.ASSETS,
  },
];

// Schedule work without blocking UI; fall back to setTimeout on unsupported browsers
const scheduleIdle = (cb: () => void) => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    (window as typeof window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback?.(cb);
  } else {
    setTimeout(cb, 0);
  }
};

export function Section4PlatformList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const posterUrls = platforms.map((p) => p.posterUrl).filter(Boolean) as string[];
  const readVar = (name: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const motionFast = readVar("--motion-fast", 0.3);
  const motionBase = readVar("--motion-base", 0.5);
  const springStiffness = readVar("--spring-stiffness", 200);
  const springDamping = readVar("--spring-damping", 20);

  // IntersectionObserver: Track viewport visibility
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Preload a couple of posters so hover previews show immediately
  useEffect(() => {
    if (!isInViewport) return;
    posterUrls.slice(0, 3).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [isInViewport, posterUrls]);

  // Hover handler: load/play video on demand
  const handleHover = useCallback((index: number) => {
    setHoveredIndex(index);

    if (!isInViewport) return;

    // Play current video
    const video = videoRefs.current[index];
    if (video) {
      scheduleIdle(() => {
        if (video.readyState >= 2) {
          video.play().catch(() => {});
          return;
        }
        const onCanPlay = () => {
          video.removeEventListener("canplay", onCanPlay);
          video.play().catch(() => {});
        };
        video.addEventListener("canplay", onCanPlay, { once: true });
      });
    }
  }, [isInViewport]);

  const handleLeave = useCallback(() => {
    if (hoveredIndex !== null) {
      const video = videoRefs.current[hoveredIndex];
      if (video) {
        video.pause();
      }
    }
    setHoveredIndex(null);
  }, [hoveredIndex]);

  // Touch preview for mobile without affecting click-to-navigate
  const handleTouchStart = useCallback(
    (index: number) => {
      handleHover(index);
    },
    [handleHover]
  );

  return (
    <section
      ref={sectionRef}
      className={cn("w-full section-padding flex flex-col gap-lg", styles.section)}
    >
      <div className="container-content-wide">
        <h2 className={cn("mb-12 sm:mb-16 font-container-title", styles.title)}>
          {messages.section4_title()}
        </h2>

        <div className="flex flex-col">
          {platforms.map((item, index) => (
            <PlatformRow
              key={item.id}
              item={item}
              index={index}
              href={item.route}
              isHovered={hoveredIndex === index}
              isInViewport={isInViewport}
              videoRef={(el) => (videoRefs.current[index] = el)}
              onHover={() => handleHover(index)}
              onLeave={handleLeave}
              onTouchStart={() => handleTouchStart(index)}
              motionFast={motionFast}
              motionBase={motionBase}
              springStiffness={springStiffness}
              springDamping={springDamping}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformRow({
  item,
  href,
  isHovered,
  isInViewport,
  videoRef,
  onHover,
  onLeave,
  onTouchStart,
  motionFast,
  motionBase,
  springStiffness,
  springDamping,
}: {
  item: PlatformItem;
  href: string;
  index: number;
  isHovered: boolean;
  isInViewport: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  onHover: () => void;
  onLeave: () => void;
  onTouchStart: () => void;
  motionFast: number;
  motionBase: number;
  springStiffness: number;
  springDamping: number;
}) {
  const handleMouseEnter = () => {
    if (isInViewport) {
      onHover();
    }
  };

  const shouldAttachMedia = isInViewport && isHovered;

  return (
    <Link
      href={href}
      prefetch={isHovered}
      className={cn("relative block border-t py-6 sm:py-10 group cursor-pointer", styles.divider)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onTouchStart={onTouchStart}
    >
      {/* Grid Layout: Left (Text) - Middle (Video) - Right (Title) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-center">

        {/* 1. Left Section: Description Text */}
        <div className="lg:col-span-3 flex flex-col justify-between relative min-h-[200px] gap-sm">
          <div className="z-10 pointer-events-none">
            <p className={cn("font-body-lg", styles.bodyLarge)}>
              {platformDescs[item.descKey]()}
            </p>
          </div>
          <span className={cn("font-label", styles.labelSm, "text-subtle block mt-auto")}>
            {item.version}
          </span>
        </div>

        {/* 2. Middle Section: Video Container */}
        <div className="lg:col-span-4 relative flex items-center justify-center">
          {/* Single video element with opacity transition */}
          <m.div
            animate={{
              opacity: isHovered && isInViewport ? 1 : 0,
              scale: isHovered && isInViewport ? 1 : 0.95
            }}
            transition={{ duration: motionFast, ease: "easeOut" }}
            className="w-full flex items-center justify-center z-20"
            style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
          >
            <div className={cn("aspect-video w-full max-w-[420px] sm:max-w-[600px] lg:max-w-[420px]", styles.videoFrame)}>
              <video
                ref={videoRef}
                src={shouldAttachMedia ? item.videoUrl : undefined}
                poster={item.posterUrl}
                loop
                muted
                playsInline
                preload={shouldAttachMedia ? "metadata" : "none"}
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </m.div>
        </div>

        {/* 3. Right Section: Large Title (with shift animation) */}
        <div className="lg:col-span-5 flex items-center justify-start relative min-h-[220px] lg:min-h-[240px]">
          <div className="w-full padding-inline-lg overflow-visible">
            <m.h3
              animate={{ x: isHovered ? 20 : 0 }}
              transition={{ type: "spring", stiffness: springStiffness, damping: springDamping, duration: motionBase }}
              className={cn("font-feature", styles.platformTitle, "leading-[1.2] whitespace-nowrap will-change-transform")}
            >
              {platformTitles[item.titleKey]()}
            </m.h3>
          </div>

          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
            transition={{ duration: motionBase }}
            className={cn(
              "absolute -left-8 sm:-left-12 lg:-left-14 top-1/2 -translate-y-1/2 will-change-transform text-soft",
              styles.arrowIcon
            )}
          >
             <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </m.div>
        </div>

      </div>
    </Link>
  );
}
