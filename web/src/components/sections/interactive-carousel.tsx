"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { m } from "@/components/motion/lazy-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { carouselProducts, type CarouselProduct } from "@/data/products";
import * as messages from "@/paraglide/messages";
import Image from "next/image";
import { useEffect } from "react";
import { ROUTES } from "@/lib/constants";
import { LocalizedLink } from "@/components/ui/localized-link";
import styles from "./interactive-carousel.module.css";

// --- 常數定義 ---
const AUTOPLAY_DURATION = 5000; // 5 seconds per slide

/**
 * Get translated product data by product ID
 * Maps product IDs to their corresponding i18n message keys
 */
const getTranslatedProduct = (product: CarouselProduct): CarouselProduct => {
  const productKey = product.id;

  // Mapping for i18n keys based on product ID
  const i18nMap: Record<number, {
    category: () => string;
    tab: () => string;
    title: () => string;
    bigtext: () => string;
    meta: [() => string, () => string, () => string];
    description: () => string;
  }> = {
    1: {
      category: messages.product_agent_category,
      tab: messages.product_agent_tab,
      title: messages.product_agent_title,
      bigtext: messages.product_agent_bigtext,
      meta: [messages.product_agent_meta_1, messages.product_agent_meta_2, messages.product_agent_meta_3],
      description: messages.product_agent_description,
    },
    2: {
      category: messages.product_pay_category,
      tab: messages.product_pay_tab,
      title: messages.product_pay_title,
      bigtext: messages.product_pay_bigtext,
      meta: [messages.product_pay_meta_1, messages.product_pay_meta_2, messages.product_pay_meta_3],
      description: messages.product_pay_description,
    },
    3: {
      category: messages.product_air_category,
      tab: messages.product_air_tab,
      title: messages.product_air_title,
      bigtext: messages.product_air_bigtext,
      meta: [messages.product_air_meta_1, messages.product_air_meta_2, messages.product_air_meta_3],
      description: messages.product_air_description,
    },
    4: {
      category: messages.product_eagleeye_category,
      tab: messages.product_eagleeye_tab,
      title: messages.product_eagleeye_title,
      bigtext: messages.product_eagleeye_bigtext,
      meta: [messages.product_eagleeye_meta_1, messages.product_eagleeye_meta_2, messages.product_eagleeye_meta_3],
      description: messages.product_eagleeye_description,
    },
    5: {
      category: messages.product_ssss_category,
      tab: messages.product_ssss_tab,
      title: messages.product_ssss_title,
      bigtext: messages.product_ssss_bigtext,
      meta: [messages.product_ssss_meta_1, messages.product_ssss_meta_2, messages.product_ssss_meta_3],
      description: messages.product_ssss_description,
    },
    6: {
      category: messages.product_dwss_category,
      tab: messages.product_dwss_tab,
      title: messages.product_dwss_title,
      bigtext: messages.product_dwss_bigtext,
      meta: [messages.product_dwss_meta_1, messages.product_dwss_meta_2, messages.product_dwss_meta_3],
      description: messages.product_dwss_description,
    },
    7: {
      category: messages.product_cdcp_category,
      tab: messages.product_cdcp_tab,
      title: messages.product_cdcp_title,
      bigtext: messages.product_cdcp_bigtext,
      meta: [messages.product_cdcp_meta_1, messages.product_cdcp_meta_2, messages.product_cdcp_meta_3],
      description: messages.product_cdcp_description,
    },
    8: {
      category: messages.product_assets_category,
      tab: messages.product_assets_tab,
      title: messages.product_assets_title,
      bigtext: messages.product_assets_bigtext,
      meta: [messages.product_assets_meta_1, messages.product_assets_meta_2, messages.product_assets_meta_3],
      description: messages.product_assets_description,
    },
  };

  const translations = i18nMap[productKey];
  if (!translations) return product;

  return {
    ...product,
    category: translations.category(),
    tabTitle: translations.tab(),
    title: translations.title(),
    bigText: translations.bigtext(),
    meta: translations.meta.map(fn => fn()),
    description: translations.description(),
  };
};

// --- 卡片動畫狀態 ---
const createCardVariants = (transitionDuration: number, hiddenDuration: number, stiffness: number, damping: number) => ({
  center: {
    x: "0%",
    scale: 1,
    zIndex: 10,
    opacity: 1,
    filter: "brightness(1)",
    transition: { duration: transitionDuration, type: "spring" as const, stiffness, damping },
  },
  left: {
    x: "-105%",
    scale: 1,
    zIndex: 5,
    opacity: 0.6,
    filter: "brightness(0.4)",
    transition: { duration: transitionDuration, type: "spring" as const, stiffness, damping },
  },
  right: {
    x: "105%",
    scale: 1,
    zIndex: 5,
    opacity: 0.6,
    filter: "brightness(0.4)",
    transition: { duration: transitionDuration, type: "spring" as const, stiffness, damping },
  },
  hidden: {
    x: "0%",
    scale: 0.8,
    zIndex: 0,
    opacity: 0,
    transition: { duration: hiddenDuration },
  },
});

export function InteractiveCarousel() {
  const [page, setPage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxLayerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const posterFallback = "/images/post/banner-poster.jpg";
  const readVar = (name: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(val) ? val : fallback;
  };
  const cardTransitionDuration = readVar("--carousel-transition", 0.6);
  const cardHiddenDuration = readVar("--carousel-hidden-duration", 0.5);
  const cardStiffness = readVar("--carousel-stiffness", 80);
  const cardDamping = readVar("--carousel-damping", 20);
  const cardVariants = useMemo(
    () => createCardVariants(cardTransitionDuration, cardHiddenDuration, cardStiffness, cardDamping),
    [cardTransitionDuration, cardHiddenDuration, cardStiffness, cardDamping]
  );

  // Get translated product data using i18n messages
  const SLIDES = useMemo(() =>
    carouselProducts.map(getTranslatedProduct),
    []
  );

  // --- 1. Parallax 優化：quickTo + IntersectionObserver ---
  useEffect(() => {
    if (!sectionRef.current || !parallaxLayerRef.current) return;

    const section = sectionRef.current;
    const layer = parallaxLayerRef.current;
    let quickToY: ((value: number) => void) | null = null;
    let lastScrollY = window.scrollY;
    let ticking = false;

    // IntersectionObserver: 只在元素進入視窗時啟動 parallax
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          // 進入視窗：初始化 quickTo
          quickToY = gsap.quickTo(layer, "y", {
            duration: 0.4,
            ease: "power2.out",
          });
        } else {
          // 離開視窗：重置位置
          gsap.set(layer, { y: 0 });
          quickToY = null;
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    const updateParallax = () => {
      if (!quickToY) {
        ticking = false;
        return;
      }

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      const velocity = delta * 0.7; // 降低敏感度
      lastScrollY = currentScrollY;

      // 使用 quickTo 直接更新，無需複雜的回彈動畫
      quickToY(-velocity * 2);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking && quickToY) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (quickToY) {
        gsap.set(layer, { y: 0 });
      }
    };
  }, []);

  // --- 2. 影片控制：暫停非活動 slide 的影片 ---
  const activeIndex = (page % SLIDES.length + SLIDES.length) % SLIDES.length;

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index === activeIndex) {
        video.play().catch(() => {
          // 自動播放失敗時靜默處理
        });
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  // --- 3. 自動播放優化：使用 setTimeout + Page Visibility API ---
  const startAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }

    autoplayTimerRef.current = setTimeout(() => {
      setPage((prev) => prev + 1);
    }, AUTOPLAY_DURATION);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  // 自動播放邏輯
  useEffect(() => {
    if (hovered || !isVisible) {
      stopAutoplay();
      return;
    }

    startAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [page, hovered, isVisible, startAutoplay, stopAutoplay]);

  // Page Visibility API: 頁籤切換時暫停
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay();
        videoRefs.current.forEach((video) => video.pause());
      } else if (!hovered && isVisible) {
        startAutoplay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hovered, isVisible, startAutoplay, stopAutoplay]);

  const nextSlide = () => setPage(page + 1);
  const prevSlide = () => setPage(page - 1);
  const jumpToSlide = (index: number) => setPage(index);

  const getVariant = (index: number) => {
    const total = SLIDES.length;
    const activeIdx = (page % total + total) % total;
    if (index === activeIdx) return "center";
    const prevIndex = (activeIdx - 1 + total) % total;
    if (index === prevIndex) return "left";
    const nextIndex = (activeIdx + 1) % total;
    if (index === nextIndex) return "right";
    return "hidden";
  };

  // --- 4. 懶載入判斷：只渲染前/當前/後三張 slide ---
  const shouldRenderSlide = useCallback(
    (index: number) => {
      const total = SLIDES.length;
      const activeIdx = (page % total + total) % total;
      const prevIndex = (activeIdx - 1 + total) % total;
      const nextIndex = (activeIdx + 1) % total;

      return index === activeIdx || index === prevIndex || index === nextIndex;
    },
    [page, SLIDES.length]
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-visible flex flex-col items-center gap-lg section-padding pb-12 md:pb-16",
        styles.carouselSection
      )}
    >
      <div
        ref={parallaxLayerRef}
        className="w-full max-w-[1800px] mx-auto px-4 md:px-8"
      >
        {/* --- 導航區域 (Tabs + See All) --- */}
        <div className="relative z-30 flex flex-col md:flex-row gap-sm items-center mb-8 md:mb-12">
          {/* Tabs 容器：Grid 佈局自動均分寬度 */}
          <div className="flex-1 grid grid-cols-4 md:grid-cols-8 gap-2">
            {SLIDES.map((slide, index) => {
              const total = SLIDES.length;
              const activeIdx = (page % total + total) % total;
              const isActive = index === activeIdx;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => jumpToSlide(index)}
                  className={cn(
                    "relative overflow-hidden h-9 md:h-10 flex items-center justify-center font-label-lg text-muted border transition-all",
                    styles.tab,
                    styles.labelTransition,
                    "w-full",
                    isActive ? styles.tabActive : ""
                  )}
                >
                  {/* 進度填充層 */}
                  {isActive && !hovered && (
                    <m.div
                      key={`progress-${page}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: AUTOPLAY_DURATION / 1000,
                        ease: "linear",
                      }}
                      className={cn("absolute inset-0 z-0", styles.progress)}
                    />
                  )}

                  {/* 文字層 */}
                  <span className="relative z-10 truncate px-2">
                    {slide.tabTitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* See All 按鈕 */}
          <div className="hidden md:block w-auto shrink-0">
            <LocalizedLink
              href={ROUTES.JARVIS.SUITE}
              prefetchMode="hover"
              className="inline-flex h-10 items-center justify-center px-6 font-label-lg text-muted border transition-colors button-strong"
            >
              SEE ALL
            </LocalizedLink>
          </div>
          <div className="md:hidden w-full">
            <LocalizedLink
              href={ROUTES.JARVIS.SUITE}
              prefetchMode="hover"
              className="w-full h-10 flex items-center justify-center font-label-lg text-muted transition-colors border button-strong"
            >
              SEE ALL
            </LocalizedLink>
          </div>
        </div>

        {/* Slider Track */}
        <div
          className="relative w-full flex items-center justify-center min-h-[80svh] max-h-[88svh] sm:min-h-[82vh] sm:max-h-[92vh] lg:min-h-[780px] lg:max-h-[960px] overflow-visible"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {SLIDES.map((slide, index) => {
            const variant = getVariant(index);
            const isCenter = variant === "center";
            const shouldRender = shouldRenderSlide(index);

            // 懶載入：非必要 slide 不渲染內容
            if (!shouldRender) {
              return (
                <m.div
                  key={slide.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="hidden"
                  className={cn(
                    "absolute w-full h-full border min-h-[80svh] max-h-[88svh] sm:min-h-[82vh] sm:max-h-[92vh] lg:min-h-[780px] lg:max-h-[960px] radius-none",
                    styles.card
                  )}
                />
              );
            }

            return (
              <m.div
                key={slide.id}
                variants={cardVariants}
                initial="hidden"
                animate={variant}
                className={cn(
                  "absolute w-full h-full border shadow-2xl overflow-hidden min-h-[80svh] max-h-[88svh] sm:min-h-[82vh] sm:max-h-[92vh] lg:min-h-[780px] lg:max-h-[960px] radius-none",
                  styles.card
                )}
              >
                {/* Background Video/Image */}
                <div className="absolute inset-0 z-0">
                  {isCenter && slide.imageUrl.endsWith(".mp4") ? (
                    <video
                      ref={(el) => {
                        if (el) {
                          videoRefs.current.set(index, el);
                        } else {
                          videoRefs.current.delete(index);
                        }
                      }}
                      src={slide.imageUrl}
                      poster={slide.posterUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                    />
                  ) : (
                    <Image
                      src={slide.posterUrl || posterFallback}
                      alt={slide.title || "JARVIS product"}
                      fill
                      loading="eager"
                      sizes="(max-width: 768px) 90vw, 85vw"
                      className="object-cover opacity-80 mix-blend-overlay"
                      quality={85}
                      priority={isCenter}
                    />
                  )}
                <div className={cn("absolute inset-0", styles.overlay)} />
              </div>

                {/* Content Overlay */}
                <div
                  className={cn(
                    "relative z-10 w-full h-full px-8 md:px-12 flex flex-col justify-between text-inverse",
                    styles.slideContent
                  )}
                >
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <span className="font-label-lg text-inverse-muted">
                        {slide.category}
                      </span>
                    </div>
                    <h2 className={cn("font-container-subtitle", styles.carouselTitle, "text-inverse mb-6")}>
                      {slide.title}
                      <ArrowUpRight className="inline-block ml-2 w-6 h-6 md:w-8 md:h-8 text-inverse-subtle" />
                    </h2>
                  </div>

                  {/* Bottom Section */}
                  <div className="relative">
                  <div className={cn("border-t pt-6 flex flex-col md:flex-row items-end justify-between gap-8", styles.borderStrong)}>
                      <h1 className={cn("font-hero-title", styles.carouselBigtext, "text-inverse select-none")}>
                        {slide.bigText}
                      </h1>

                      <div className="hidden md:block max-w-xs text-inverse-subtle mb-4 leading-relaxed">
                        <div className="flex gap-4 mb-2 font-label-sm text-inverse">
                          <span>Built on:</span>
                          <div className="flex flex-col">
                            {slide.meta.map((m) => (
                              <span key={m}>→ {m}</span>
                            ))}
                          </div>
                        </div>
                        <p className={cn("font-caption", styles.carouselBody, "text-inverse")}>{slide.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows (只在中心卡片 hover 時顯示) */}
                <div
                  className={cn(
                  "absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0 z-20 pointer-events-none transition-opacity",
                  styles.arrowFade,
                  isCenter && hovered ? "opacity-100" : "opacity-0"
                )}
              >
                <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                  className={cn(
                    "pointer-events-auto w-16 h-16 flex items-center justify-center transition-colors border-r border-y",
                    styles.arrow
                  )}
                  aria-label="Previous slide"
                >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                  className={cn(
                    "pointer-events-auto w-16 h-16 flex items-center justify-center transition-colors border-l border-y",
                    styles.arrow
                  )}
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              </m.div>
            );
          })}
        </div>
        {/* Slide Indicators (Dots) */}
        <div className={cn("flex justify-center gap-sm z-30 w-full padding-inline", styles.dotsWrapper)}>
          {SLIDES.map((slide, index) => {
            const total = SLIDES.length;
            const activeIdx = (page % total + total) % total;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => jumpToSlide(index)}
                className={cn(
                  "h-2 transition-all",
                  activeIdx === index ? "w-12" : "w-2",
                  activeIdx === index ? styles.dotActive : styles.dot,
                  styles.pillRadius
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
