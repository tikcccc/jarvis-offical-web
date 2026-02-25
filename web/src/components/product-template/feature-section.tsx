"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m } from "@/components/motion/lazy-motion";
import { TypewriterLines, TypewriterLinesReverse } from "@/components/animations/typewriter";
import { cn } from "@/lib/utils";
import styles from "./feature-section.module.css";

/**
 * Detail item for the feature's detail view
 */
interface DetailItem {
  title: string;
  description: string;
}

/**
 * FeatureSection Props
 * @param index - Feature index string (e.g., "0.1", "0.2")
 * @param totalFeatures - Total number of features for breadcrumb generation
 * @param title - Array of title lines (each line on new row)
 * @param description - Feature description text
 * @param mediaSrc - Source URL for video or image
 * @param mediaType - Type of media ("video" or "image")
 * @param mediaPoster - Optional poster image for video
 * @param isLast - Whether this is the last feature (removes border)
 * @param details - Optional array of detail items for the detail view toggle
 * @param videoLabel - Label for video toggle option
 * @param detailsLabel - Label for details toggle option
 */
interface FeatureSectionProps {
  index: string;
  totalFeatures: number;
  title: string[];
  description: string;
  mediaSrc: string;
  mediaType?: "video" | "image";
  mediaPoster?: string;
  isLast?: boolean;
  details?: DetailItem[];
  videoLabel?: string;
  detailsLabel?: string;
  imagePriority?: boolean;
}

/**
 * FeatureSection Component
 *
 * A two-column feature block with sticky left column and scrollable right column.
 * Features:
 * - 5/7 column split (left/right) on desktop
 * - Sticky left column (index + title)
 * - Reversible index animation (IntersectionObserver)
 * - Dynamic index breadcrumb generation
 * - Video or image media support
 * - Video/Details toggle for switching between media and detail list
 *
 * Based on product-template.html Section C "Feature Sections".
 */
export function FeatureSection({
  index,
  totalFeatures,
  title,
  description,
  mediaSrc,
  mediaType = "video",
  mediaPoster,
  isLast = false,
  details,
  videoLabel = "Video",
  detailsLabel = "Details",
  imagePriority = false,
}: FeatureSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const indexSpanRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<"video" | "details">("video");
  const [displayedView, setDisplayedView] = useState<"video" | "details">("video");
  const [isFlashing, setIsFlashing] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFlashedRef = useRef(false);
  const [titleState, setTitleState] = useState<{
    mode: "hidden" | "typewriter" | "typewriter-reverse" | "static";
    visibility: "hidden" | "visible" | "exiting";
    key: number;
  }>({
    mode: "hidden",
    visibility: "hidden",
    key: 0,
  });
  const titleStateRef = useRef(titleState);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lineActive, setLineActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastScrollY = useRef(0);
  const isInActiveZone = useRef(false); // Track if currently in active zone (>= 30%)
  const hasShownBefore = useRef(false); // Track if content has been shown before
  const ACTIVATION_THRESHOLD = 0.3; // Activation threshold at 30%
  const LINE_THRESHOLD = 0.1; // Line appears at 10%
  const titleRef = useRef(title);

  const readMotion = (name: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const motionFast = readMotion("--product-motion-fast", 0.3);
  const motionBase = readMotion("--product-motion-base", 0.5);
  const motionOverlay = readMotion("--product-motion-overlay", 0.9);

  titleStateRef.current = titleState;
  titleRef.current = title;

  // Flash helper: toggles CSS animation class without causing React re-render
  const flashIndex = useCallback((onComplete?: () => void) => {
    const span = indexSpanRef.current;
    if (!span) return;

    if (indexFlashTimerRef.current) {
      clearTimeout(indexFlashTimerRef.current);
    }

    span.classList.add("animate-rapid-pulse");
    indexFlashTimerRef.current = setTimeout(() => {
      span.classList.remove("animate-rapid-pulse");
      indexFlashTimerRef.current = null;
      onComplete?.();
    }, 250);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Track scroll direction
    const updateScrollY = () => {
      lastScrollY.current = window.scrollY;
    };
    updateScrollY();
    window.addEventListener("scroll", updateScrollY, { passive: true });

    // Observer with multiple thresholds for staged animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          const target = entry.target as HTMLElement;
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY.current;

          // STAGE 1: Line animation at 10%
          if (ratio >= LINE_THRESHOLD && entry.isIntersecting) {
            target.classList.add("line-active");
            setLineActive(true);
          } else if (ratio < LINE_THRESHOLD) {
            target.classList.remove("line-active");
            setLineActive(false);
          }

          // STAGE 2: Content activation at 30%
          // Enter active zone
          if (ratio >= ACTIVATION_THRESHOLD && entry.isIntersecting) {
            const wasInActiveZone = isInActiveZone.current;
            isInActiveZone.current = true;

            // Add feature-active class
            target.classList.add("feature-active");

            // Flash index on first entry
            if (!hasFlashedRef.current) {
              hasFlashedRef.current = true;
              flashIndex();
            }

            // Only handle entry if not already in active zone
            if (!wasInActiveZone) {
              // Cancel any pending exit animation
              if (exitTimerRef.current) {
                clearTimeout(exitTimerRef.current);
                exitTimerRef.current = null;
              }

              // Determine how to show content based on scroll direction and history
              if (isScrollingDown) {
                // Always use typewriter when scrolling down
                setTitleState({
                  mode: "typewriter",
                  visibility: "visible",
                  key: titleStateRef.current.key + 1, // Increment key for new animation
                });
                hasShownBefore.current = true;
              } else {
                // Scrolling up: show static content if shown before, otherwise typewriter
                if (hasShownBefore.current) {
                  setTitleState({
                    mode: "static",
                    visibility: "visible",
                    key: titleStateRef.current.key,
                  });
                } else {
                  setTitleState({
                    mode: "typewriter",
                    visibility: "visible",
                    key: titleStateRef.current.key + 1,
                  });
                  hasShownBefore.current = true;
                }
              }
            }
          }
          // Exit active zone (dropping below 30%)
          else if (ratio < ACTIVATION_THRESHOLD && isInActiveZone.current) {
            isInActiveZone.current = false;

            // Start reverse typewriter exit animation
            if (titleStateRef.current.visibility === "visible") {
              // Calculate reverse animation duration
              const totalChars = titleRef.current.reduce(
                (sum, line) => sum + line.length,
                0
              );
              const reverseDuration = (totalChars * 30) / 1000 + 0.05; // 30ms per char + small initial delay
              const exitDuration = reverseDuration * 1000 + 100; // Add 100ms buffer

              // Switch to reverse typewriter mode without changing key
              setTitleState((prev) => ({
                ...prev,
                mode: "typewriter-reverse",
                visibility: "exiting",
                // Don't change key to avoid remounting
              }));

              // Clear any existing timer
              if (exitTimerRef.current) {
                clearTimeout(exitTimerRef.current);
              }

              // Wait for reverse animation to complete before hiding
              exitTimerRef.current = setTimeout(() => {
                setTitleState((prev) => ({
                  ...prev,
                  mode: "hidden",
                  visibility: "hidden",
                }));
                exitTimerRef.current = null;
              }, exitDuration);
            }

            // Flash and remove feature-active when scrolling up
            if (!isScrollingDown) {
              if (hasFlashedRef.current) {
                flashIndex(() => {
                  target.classList.remove("feature-active");
                  hasFlashedRef.current = false;
                });
              } else {
                target.classList.remove("feature-active");
              }
            } else {
              // When scrolling down past the section, just remove the class
              target.classList.remove("feature-active");
              hasFlashedRef.current = false;
            }
          }
        });
      },
      {
        threshold: [LINE_THRESHOLD, ACTIVATION_THRESHOLD], // 10% for line, 30% for activation
        rootMargin: "0px",
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollY);
      // Cleanup timers on unmount
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
      if (indexFlashTimerRef.current) {
        clearTimeout(indexFlashTimerRef.current);
      }
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, [flashIndex]);

  // Handle toggle click with parallelogram transition + rapid pulse animation
  const handleToggleClick = (view: "video" | "details") => {
    if (view === activeView || isTransitioning) return;

    // Step 1: Immediately respond to UI (button state)
    setActiveView(view);
    setIsTransitioning(true);

    // Trigger button flash animation
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }
    setIsFlashing(true);
    flashTimerRef.current = setTimeout(() => {
      setIsFlashing(false);
      flashTimerRef.current = null;
    }, 250);

    // Step 2: Start mask transition

    // Step 3: Switch displayed content at T=400ms (when mask fully covers)
    setTimeout(() => {
      setDisplayedView(view);
    }, 400);

    // Step 4: End transition at T=900ms (when mask exits)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  };

  // Generate all index values and filter out current
  const allIndices = Array.from(
    { length: totalFeatures },
    (_, i) => `0.${i + 1}`
  );
  const currentIndexPosition = allIndices.indexOf(index);
  const beforeIndices = allIndices.slice(0, currentIndexPosition);
  const afterIndices = allIndices.slice(currentIndexPosition + 1);

  // Autoplay/loop video while the media viewport is in view; pause when hidden or when Details is shown.
  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    if (!video || !container) return;

    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const handleVisibility = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;

      const isVisible = entry.intersectionRatio > 0;
      if (isVisible && displayedView === "video") {
        video.play().catch(() => {
          /* ignore play errors (e.g., user gesture requirements) */
        });
      } else {
        video.pause();
        if (entry.intersectionRatio === 0) {
          video.currentTime = 0;
        }
      }
    };

    const observer = new IntersectionObserver(handleVisibility, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [displayedView]);

  // Pause video when toggling away from the video view
  useEffect(() => {
    if (displayedView !== "video" && videoRef.current) {
      videoRef.current.pause();
    }
  }, [displayedView]);

  return (
      <div
        ref={sectionRef}
        className={cn(
          "feature-block min-h-screen flex items-center",
          "container-product-shell",
          !isLast ? "border-b" : ""
        )}
        style={!isLast ? { borderColor: "var(--product-border-soft)" } : undefined}
      >
      <div className="w-full">
        <div
          className="grid grid-cols-1 lg:grid-cols-12"
          style={{ gap: "var(--product-gap)" }}
        >
          {/* Left Column: Sticky Header */}
          <div className="lg:col-span-5 xl:col-span-5 relative">
            <div
              className="sticky top-32 flex flex-col"
              style={{ gap: "var(--product-gap-sm)" }}
            >
              {/* Index Animation */}
              <div className={cn("index-anim-container flex items-center w-full select-none", "font-product-body", styles.textMuted)}>
                {/* Before indices */}
                {beforeIndices.length > 0 && (
                  <div className="flex items-center gap-2 opacity-50 mr-2">
                    {beforeIndices.map((idx, i) => (
                      <span key={idx} className={cn("flex items-center gap-2", "font-product-body")}>
                        <span>{idx}</span>
                        {i < beforeIndices.length - 1 && (
                          <span className="w-3 h-px bg-current index-connector" />
                        )}
                      </span>
                    ))}
                    <span className="w-3 h-px bg-current index-connector" />
                  </div>
                )}

                {/* Current index (highlighted with flash animation) */}
                <span
                  ref={indexSpanRef}
                  className={cn("font-medium mr-4 inline-block", styles.textStrong)}
                >
                  [{index}]
                </span>

                {/* Animated line */}
                <m.div
                  className="index-line h-px flex-grow mx-4 origin-left"
                  style={{ backgroundColor: "var(--text-base)" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: lineActive ? 1 : 0 }}
                  transition={{ duration: motionBase, ease: "easeOut" }}
                />

                {/* After indices */}
                {afterIndices.length > 0 && (
                  <div className="flex items-center gap-2 opacity-50">
                    {afterIndices.map((idx, i) => (
                      <span key={idx} className={cn("flex items-center gap-2", "font-product-body")}>
                        <span>{idx}</span>
                        {i < afterIndices.length - 1 && (
                          <span className="w-3 h-px bg-current index-connector" />
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Title with Typewriter Animation or Static Display */}
                <h3
              className={cn("font-product-title-md", "break-words w-full max-w-full lg:max-w-[40ch] xl:max-w-[44ch]")}
                  style={{ textWrap: "balance", wordBreak: "break-word" }}
                >
                {/* Forward Typewriter mode */}
                {titleState.mode === "typewriter" && titleState.visibility !== "hidden" && (
                  <m.div
                    key={`typewriter-${titleState.key}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{
                      opacity: titleState.visibility === "exiting" ? 0 : 1,
                      y: titleState.visibility === "exiting" ? -6 : 0,
                    }}
                    transition={{ duration: motionFast, ease: "easeOut" }}
                  >
                    <TypewriterLines
                      lines={title.map((line) => ({
                        text: line,
                        className: "",
                      }))}
                      speed={30}
                      initialDelay={0.2}
                      lineGap={0.05}
                    />
                  </m.div>
                )}

                {/* Reverse Typewriter mode (exit animation) */}
                {titleState.mode === "typewriter-reverse" && titleState.visibility === "exiting" && (
                  <div key={`reverse-${titleState.key}`}>
                    <TypewriterLinesReverse
                      lines={title.map((line) => ({
                        text: line,
                        className: "",
                      }))}
                      speed={30}
                      initialDelay={0}
                      lineGap={0.02}
                    />
                  </div>
                )}

                {/* Static mode */}
                {titleState.mode === "static" && titleState.visibility !== "hidden" && (
                  <m.div
                    key={`static-${titleState.key}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{
                      opacity: titleState.visibility === "exiting" ? 0 : 1,
                      y: titleState.visibility === "exiting" ? -6 : 0,
                    }}
                    transition={{ duration: motionFast, ease: "easeOut" }}
                  >
                    {title.map((line, index) => (
                      <span key={index} className="block">
                        {line}
                      </span>
                    ))}
                  </m.div>
                )}
              </h3>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col lg:self-start pt-6 md:pt-8 lg:pt-12 space-y-8 md:space-y-10">
            <p className={cn("font-product-desc font-medium", "w-full")}>
              {description}
            </p>

              {/* Toggle Pill - accessible tablist with keyboard navigation */}
              {details && details.length > 0 && (
            <div className="mb-4 md:mb-6" role="tablist" aria-label="View options">
            <div className={cn("toggle-pill inline-flex h-14 border p-1 shadow-sm overflow-hidden", styles.toggleShell)}>
                  <button
                    role="tab"
                    aria-selected={activeView === "video"}
                    aria-controls={`panel-video-${index}`}
                    id={`tab-video-${index}`}
                    tabIndex={activeView === "video" ? 0 : -1}
                    onClick={() => handleToggleClick("video")}
                    disabled={isTransitioning}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        handleToggleClick(
                          activeView === "video" ? "details" : "video"
                        );
                      }
                    }}
                    className={cn(
                      "w-32 px-6 py-2 transition-colors duration-0 disabled:cursor-not-allowed",
                      "font-product-button",
                      styles.focusRing,
                      styles.toggleBase,
                      activeView === "video"
                        ? cn(styles.toggleActive, isFlashing ? "animate-rapid-pulse" : "")
                        : styles.toggleInactive
                    )}
                  >
                    {videoLabel.toUpperCase()}
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeView === "details"}
                    aria-controls={`panel-details-${index}`}
                    id={`tab-details-${index}`}
                    tabIndex={activeView === "details" ? 0 : -1}
                    onClick={() => handleToggleClick("details")}
                    disabled={isTransitioning}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        handleToggleClick(
                          activeView === "video" ? "details" : "video"
                        );
                      }
                    }}
                    className={cn(
                      "w-32 px-6 py-2 transition-colors duration-0 disabled:cursor-not-allowed",
                      "font-product-button",
                      styles.focusRing,
                      styles.toggleBase,
                      activeView === "details"
                        ? cn(styles.toggleActive, isFlashing ? "animate-rapid-pulse" : "")
                        : styles.toggleInactive
                    )}
                  >
                    {detailsLabel.toUpperCase()}
                  </button>
                </div>
              </div>
            )}

            {/* Media Card / Details View - with tabpanel roles for accessibility */}
            <div
              className={cn(
                "w-full max-w-full overflow-hidden relative border shadow-xl",
                styles.featureCard,
                styles.featureMedia,
                displayedView === "video" ? styles.featureMediaVideo : styles.featureMediaDetails
              )}
            >
              {/* Video/Image Panel */}
              <div
                role="tabpanel"
                id={`panel-video-${index}`}
                aria-labelledby={`tab-video-${index}`}
                aria-hidden={displayedView !== "video"}
                className={cn(
                  "h-full",
                  styles.panel,
                  displayedView === "video" ? styles.panelVisible : styles.panelHidden
                )}
                ref={videoContainerRef}
              >
                {mediaType === "video" ? (
                  <video
                    ref={videoRef}
                    src={mediaSrc}
                    poster={mediaPoster}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                    aria-label={title.join(" ")}
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <Image
                    src={mediaSrc}
                    alt={title.join(" ")}
                    fill
                    priority={imagePriority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                    className="object-contain"
                    loading={imagePriority ? "eager" : "lazy"}
                  />
                )}
              </div>

              {/* Details Panel */}
              <div
                role="tabpanel"
                id={`panel-details-${index}`}
                aria-labelledby={`tab-details-${index}`}
                aria-hidden={displayedView !== "details"}
                className={cn(
                  styles.detailPanel,
                  styles.panelSurface,
                  styles.panel,
                  displayedView === "details" ? styles.panelVisible : styles.panelHidden
                )}
              >
                <div className={styles.detailList}>
                  {details?.map((item, idx) => (
                    <div
                      key={idx}
                      className={cn("border-b last:border-0", styles.detailItem)}
                      style={{
                        borderColor: "var(--product-border-subtle)",
                      }}
                    >
                      <h4 className={styles.detailTitle}>
                        {item.title}
                      </h4>
                      <p className={styles.detailDesc}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parallelogram Transition Overlay */}
                {isTransitioning && (
                <div
                  key={`${activeView}-overlay`}
                  className={cn("absolute inset-0 z-50 pointer-events-none overflow-hidden", styles.featureMask)}
                >
                  <m.div
                    key={`${activeView}-skew`}
                    className="absolute inset-y-0 left-0 w-full h-full flex items-center justify-center"
                    initial={{ x: "-200%" }}
                    animate={{
                      x: ["-200%", "0%", "0%", "200%"],
                    }}
                    transition={{
                      duration: motionOverlay,
                      times: [0, 0.4, 0.55, 1],
                      ease: ["circOut", "linear", "linear", "circIn"],
                    }}
                  >
                    <div
                      className="h-full w-[220%] flex-none shadow-2xl"
                      style={{
                        transform: "skewX(-25deg)",
                        transformOrigin: "center",
                        background: "var(--product-mask-color)",
                      }}
                    />
                  </m.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
