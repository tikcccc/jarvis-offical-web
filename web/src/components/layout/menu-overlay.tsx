"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowRight, CornerDownRight, ChevronDown } from "lucide-react";
import { Link } from "@/lib/i18n";
import Image from "next/image";
import { useMenuStore } from "@/stores/menu-store";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { useBodyScrollLock, useLenis, useIsMobile } from "@/hooks";
import { ROUTES } from "@/lib/constants";
import * as messages from "@/paraglide/messages";
import { m } from "@/components/motion/lazy-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { urlFor } from "@/sanity/lib";
import type { Image as SanityImage } from "sanity";
import styles from "./menu-overlay.module.css";
import { useLocale } from "@/lib/i18n/locale-context";

// --- Type definitions for menu data ---
interface MenuChild {
  title: string;
  href: string;
  action?: string;
  isHighlight?: boolean;
}

interface MenuLink {
  title: string;
  href: string;
  type: "link";
  disabled?: boolean;
}

interface MenuGroup {
  title: string;
  type: "group";
  children: MenuChild[];
  href?: string;
  disabled?: boolean;
}

type MenuItem = MenuLink | MenuGroup;

interface JarvisProduct {
  name: string;
  desc: string;
  href: string;
}

export interface MenuNewsPreview {
  _id: string;
  title: string;
  slug?: { current?: string };
  publishedAt?: string;
  excerpt?: string;
  featured?: boolean;
  mainImage?: {
    asset?: SanityImage;
    alt?: string;
  };
  category?: {
    _id?: string;
    title?: string;
    color?: string;
  };
  readTime?: number;
}

// --- Helper function to get menu data with i18n ---
const getMenuData = () => ({
  structure: [
    { title: messages.menu_nav_about(), href: ROUTES.ABOUT, type: "link" as const },
    {
      title: messages.menu_nav_services(),
      type: "group" as const,
      href: ROUTES.SERVICES_PRODUCTS,
      disabled: true,
      children: [
        {
          title: messages.menu_nav_jarvis_suite(),
          action: "jarvis_suite",
          isHighlight: true,
          href: ROUTES.JARVIS.SUITE,
        },
        { title: messages.menu_nav_jpm(), href: ROUTES.JARVIS.JPM },
        { title: messages.menu_nav_bim(), href: ROUTES.BIM_CONSULTANCY },
        { title: messages.menu_nav_finance(), href: ROUTES.PROJECT_FINANCE },
        { title: messages.menu_nav_venture(), href: ROUTES.VENTURE_INVESTMENTS },
      ],
    },
    { title: messages.menu_nav_newsroom(), href: ROUTES.NEWSROOM, type: "link" as const },
    { title: messages.menu_nav_case_studies(), href: ROUTES.CASE_STUDIES, type: "link" as const },
    { title: messages.menu_nav_careers(), href: ROUTES.CAREERS, type: "link" as const },
    { title: messages.menu_nav_contact(), href: ROUTES.CONTACT, type: "link" as const },
  ] as MenuItem[],
  jarvisProducts: [
    {
      name: messages.menu_product_agent_name(),
      desc: messages.menu_product_agent_desc(),
      href: ROUTES.JARVIS.AGENT,
    },
    {
      name: messages.menu_product_pay_name(),
      desc: messages.menu_product_pay_desc(),
      href: ROUTES.JARVIS.PAY,
    },
    {
      name: messages.menu_product_air_name(),
      desc: messages.menu_product_air_desc(),
      href: ROUTES.JARVIS.AIR,
    },
    {
      name: messages.menu_product_eagleeye_name(),
      desc: messages.menu_product_eagleeye_desc(),
      href: ROUTES.JARVIS.EAGLE_EYE,
    },
    {
      name: messages.menu_product_ssss_name(),
      desc: messages.menu_product_ssss_desc(),
      href: ROUTES.JARVIS.SSSS,
    },
    {
      name: messages.menu_product_dwss_name(),
      desc: messages.menu_product_dwss_desc(),
      href: ROUTES.JARVIS.DWSS,
    },
    {
      name: messages.menu_product_cdcp_name(),
      desc: messages.menu_product_cdcp_desc(),
      href: ROUTES.JARVIS.CDCP,
    },
    {
      name: messages.menu_product_assets_name(),
      desc: messages.menu_product_assets_desc(),
      href: ROUTES.JARVIS.ASSETS,
    },
  ] as JarvisProduct[],
  // Stats data from copywriting
  stats: [
    { value: "2,600+", label: "LIVE_PROJECTS", desc: messages.menu_stat_live_projects() },
    { value: "1.2B", label: "TOTAL_SQFT", desc: messages.menu_stat_sqft() },
    { value: "100%", label: "DEFECT_ELIMINATION", desc: messages.menu_stat_defect() },
    { value: "45%", label: "FASTER_DELIVERY", desc: messages.menu_stat_delivery() },
  ],
  // Impact metrics
  impact: [
    { value: "25-35%", label: messages.menu_impact_emissions() },
    { value: "35-45%", label: messages.menu_impact_waste() },
    { value: "60 Days", label: messages.menu_impact_payment() },
    { value: "99.8%", label: messages.menu_impact_accuracy() },
  ],
});

// --- Animation Variants ---
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const panelVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
      when: "beforeChildren" as const,
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, x: 10, transition: { duration: 0.1 } },
};

/**
 * MenuOverlay Component
 *
 * A full-screen immersive navigation overlay with Palantir-style design.
 * Features:
 * - Glassmorphism design with dark theme
 * - Typewriter text animations for tech-style labels
 * - Dynamic content preview on hover
 * - Nested navigation structure
 * - Grid texture background
 * - Type-safe routing with automatic locale handling
 */
export function MenuOverlay({ newsPreview = [] }: { newsPreview?: MenuNewsPreview[] }) {
  const { isOpen, closeMenu, activePreview, setActivePreview } = useMenuStore();
  const { lenis } = useLenis();
  // Recompute menu labels when locale changes so translations stay in sync
  const locale = useLocale();
  const menuData = getMenuData();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scrollStateRef = useRef({
    target: 0,
    rafId: null as number | null,
    touchStartY: undefined as number | undefined,
  });

  // Mobile expansion state for JARVIS Suite
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Subscribe to locale changes so translations update
  const localeTag = locale;
  const newsItems = useMemo(() => (newsPreview ?? []).slice(0, 2), [newsPreview]);

  const formatDate = (date?: string) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "";
    try {
      return new Intl.DateTimeFormat(localeTag === "zh" ? "zh-CN" : "en-US", {
        month: "short",
        day: "2-digit",
      }).format(parsed);
    } catch {
      return "";
    }
  };

  // Lock body scroll when menu is open
  useBodyScrollLock(isOpen);

  // Stop Lenis and implement smooth scrolling for menu overlay
  useEffect(() => {
    if (!lenis || !isOpen) {
      if (lenis && !isOpen) {
        lenis.start();
        scrollStateRef.current.target = 0; // Reset on close
      }
      return;
    }

    lenis.stop();
    // Capture the current scroll state object so cleanup uses the same reference
    const scrollState = scrollStateRef.current;

    const overlay = overlayRef.current || (document.querySelector("[data-menu-overlay]") as HTMLElement | null);
    if (!overlay) {
      return () => {
        lenis.start();
      };
    }

    // Initialize scroll target from current position
    scrollState.target = overlay.scrollTop;

    const smoothStep = () => {
      const delta = scrollState.target - overlay.scrollTop;
      const eased = delta * 0.2;
      if (Math.abs(delta) > 0.5) {
        overlay.scrollTop += eased;
        scrollState.rafId = requestAnimationFrame(smoothStep);
      } else {
        overlay.scrollTop = scrollState.target;
        scrollState.rafId = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const maxScroll = overlay.scrollHeight - overlay.clientHeight;
      scrollState.target = Math.max(0, Math.min(scrollState.target + e.deltaY, maxScroll));

      if (scrollState.rafId === null) {
        scrollState.rafId = requestAnimationFrame(smoothStep);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      scrollState.touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (scrollState.touchStartY === undefined) return;

      e.preventDefault(); // 阻止原生滚动
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = scrollState.touchStartY - touchCurrentY;

      const maxScroll = overlay.scrollHeight - overlay.clientHeight;
      scrollState.target = Math.max(0, Math.min(scrollState.target + deltaY, maxScroll));

      scrollState.touchStartY = touchCurrentY; // 更新起点

      if (scrollState.rafId === null) {
        scrollState.rafId = requestAnimationFrame(smoothStep);
      }
    };

    const handleTouchEnd = () => {
      scrollState.touchStartY = undefined;
    };

    overlay.addEventListener("wheel", handleWheel, { passive: false });
    overlay.addEventListener("touchstart", handleTouchStart, { passive: false });
    overlay.addEventListener("touchmove", handleTouchMove, { passive: false });
    overlay.addEventListener("touchend", handleTouchEnd);

    return () => {
      overlay.removeEventListener("wheel", handleWheel);
      overlay.removeEventListener("touchstart", handleTouchStart);
      overlay.removeEventListener("touchmove", handleTouchMove);
      overlay.removeEventListener("touchend", handleTouchEnd);
      if (scrollState.rafId !== null) {
        cancelAnimationFrame(scrollState.rafId);
        scrollState.rafId = null;
      }
      lenis.start();
    };
  }, [isOpen, lenis]);



  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          data-menu-overlay
          ref={overlayRef}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed inset-0 z-40 layout-nav-link ${styles.overlay}`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarGutter: 'stable',
          }}
        >
          {/* Top Bar - Reserved space for Topbar integration */}
          <div className="h-[88px] shrink-0" />

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 max-w-screen-2xl mx-auto w-full min-h-[calc(100vh-88px)]">
            {/* LEFT COLUMN: Navigation Tree */}
            <div className="lg:col-span-5 p-10 lg:p-16 lg:pt-10 border-r border-white/10 flex flex-col pb-12">
              <div className="mb-8">
                <TypewriterText
                  text="NAVIGATION_INDEX"
                  className={`${styles.navIndexLabel} layout-nav-label`}
                  delay={0.2}
                />

                <m.nav
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-8"
                >
                  {menuData.structure.map((item, idx) => (
                    <m.div
                      key={idx}
                      variants={fadeInUp}
                      className="flex flex-col"
                    >
                      {/* Top Level Item */}
                      {item.type === "link" && !item.disabled ? (
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          prefetch
                          className={`group flex items-center gap-4 cursor-pointer ${styles.navTopItem}`}
                        >
                          <span className={`${styles.navTopItemTitle} layout-nav-heading`}>
                            {item.title}
                          </span>
                        </Link>
                      ) : item.type === "link" ? (
                        <div
                          className="flex items-center gap-4 cursor-default select-none"
                          aria-disabled="true"
                        >
                          <span className={`${styles.navTopItemTitle} layout-nav-heading`}>
                            {item.title}
                          </span>
                        </div>
                      ) : item.href && !item.disabled ? (
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          prefetch
                          className={`group flex items-center gap-4 cursor-pointer ${styles.navTopItem}`}
                        >
                          <span className={`${styles.navTopItemTitle} layout-nav-heading`}>
                            {item.title}
                          </span>
                        </Link>
                      ) : (
                        <div
                          className="flex items-center gap-4 cursor-default select-none"
                          aria-disabled="true"
                        >
                          <span
                            className={`${styles.navTopItemTitle} layout-nav-heading`}
                          >
                            {item.title}
                          </span>
                        </div>
                      )}

                      {/* Children */}
                      {item.type === "group" && item.children && (
                        <m.div
                          className="mt-6 ml-2 flex flex-col gap-4 border-l border-white/10 pl-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          {item.children.map((child, cIdx) => {
                            // Special handling for JARVIS Suite on mobile
                            if (child.action === "jarvis_suite" && child.href && isMobile) {
                              return (
                                <div key={cIdx}>
                                  {/* Mobile: Split Interaction - Text (Link) + Arrow (Button) */}
                                  <div className="flex items-center justify-between py-1">
                                    {/* Left: Clickable text - jumps to JARVIS Suite page */}
                                      <Link
                                        href={child.href}
                                        onClick={closeMenu}
                                        prefetch
                                        className={`flex-1 group/child flex items-center gap-4 cursor-pointer ${styles.navChild}`}
                                      >
                                        <CornerDownRight
                                          size={18}
                                          className="text-blue-400 group-hover/child:text-blue-500 transition-colors"
                                        />
                                        <span
                                          className={`${styles.navChildText} ${styles.navChildTextHighlight} layout-nav-link`}
                                        >
                                          {child.title}
                                        </span>
                                      </Link>

                                    {/* Right: Arrow button - toggles expansion */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedGroup(
                                          expandedGroup === 'jarvis_suite' ? null : 'jarvis_suite'
                                        );
                                      }}
                                      className="p-2 hover:bg-white/5 rounded transition-colors"
                                      aria-label="展开/收起产品列表"
                                      aria-expanded={expandedGroup === 'jarvis_suite'}
                                    >
                                      <ChevronDown
                                        size={20}
                                        className={`text-blue-400 transition-transform duration-300 ${
                                          expandedGroup === 'jarvis_suite' ? 'rotate-180' : ''
                                        }`}
                                      />
                                    </button>
                                  </div>

                                  {/* Mobile: Expanded product list */}
                                  <AnimatePresence>
                                    {expandedGroup === 'jarvis_suite' && (
                                      <m.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="ml-8 mt-4 space-y-2 overflow-hidden border-l border-white/10 pl-6"
                                      >
                                        {menuData.jarvisProducts.map((prod) => (
                                          <Link
                                            key={prod.href}
                                            href={prod.href}
                                            onClick={closeMenu}
                                            prefetch
                                            className={`group/prod flex items-center gap-3 py-2 cursor-pointer ${styles.mobileProduct}`}
                                          >
                                            <CornerDownRight
                                              size={16}
                                              className="text-neutral-600 group-hover/prod:text-blue-400 transition-colors shrink-0"
                                            />
                                            <span className={styles.mobileProductText}>
                                              {prod.name}
                                            </span>
                                          </Link>
                                        ))}
                                      </m.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            }

                            // Desktop or non-JARVIS Suite items: original behavior
                            return child.href ? (
                              <Link
                                key={cIdx}
                                href={child.href}
                                onClick={closeMenu}
                                prefetch
                                className={`group/child flex items-center gap-4 cursor-pointer py-1 ${styles.navChild}`}
                                onMouseEnter={() =>
                                  child.action === "jarvis_suite"
                                    ? setActivePreview("jarvis_suite")
                                    : setActivePreview("default")
                                }
                              >
                                <CornerDownRight
                                  size={18}
                                  className={`transition-colors ${
                                    child.action === "jarvis_suite"
                                      ? "text-blue-400 group-hover/child:text-blue-500"
                                      : "text-neutral-600 group-hover/child:text-blue-500"
                                  }`}
                                />
                                <span
                                  className={`${styles.navChildText} layout-nav-link ${
                                    child.isHighlight ? styles.navChildTextHighlight : styles.navChildTextNormal
                                  }`}
                                >
                                  {child.title}
                                </span>

                                {/* Hover Indicator (desktop only) */}
                                {child.action === "jarvis_suite" && !isMobile && (
                                  <m.div
                                    layoutId="indicator"
                                    className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover/child:opacity-100"
                                  />
                                )}
                              </Link>
                            ) : (
                              <div
                                key={cIdx}
                                className={`group/child flex items-center gap-4 cursor-pointer py-1 ${styles.navChild}`}
                                onMouseEnter={() =>
                                  child.action === "jarvis_suite"
                                    ? setActivePreview("jarvis_suite")
                                    : setActivePreview("default")
                                }
                              >
                                <CornerDownRight
                                  size={18}
                                  className="text-neutral-600 group-hover/child:text-blue-500 transition-colors"
                                />
                                <span
                                  className={`${styles.navChildText} layout-nav-link ${
                                    child.isHighlight ? styles.navChildTextHighlight : styles.navChildTextNormal
                                  }`}
                                >
                                  {child.title}
                                </span>

                                {/* Hover Indicator */}
                                {child.action === "jarvis_suite" && (
                                  <m.div
                                    layoutId="indicator"
                                    className="w-2 h-2 bg-blue-500 rounded-full opacity-100 animate-pulse"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </m.div>
                      )}
                    </m.div>
                  ))}
                </m.nav>
              </div>

              {/* Footer Links */}
              <m.div
                className="mt-12 lg:mt-16 pt-6 pb-4 border-t border-white/10"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                <div className="flex flex-col gap-3">
                  <Link
                    href="/privacy-cookie-policy"
                    onClick={closeMenu}
                    prefetch
                    className={styles.footerLink}
                  >
                    <TypewriterText
                      text="Privacy & Cookie Policy"
                      delay={1.0}
                    />
                  </Link>
                </div>
              </m.div>
            </div>

            {/* RIGHT COLUMN: Dynamic Content Area */}
            <div className="lg:col-span-7 bg-[#080808] p-10 lg:p-16 lg:pt-10 hidden lg:flex flex-col relative">
              {/* Grid Texture - soft-light with edge fade to reduce clutter */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.24) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.24) 1px, transparent 1px)
                  `,
                  backgroundSize: "80px 80px",
                  opacity: 0.08,
                  maskImage:
                    "radial-gradient(circle at 50% 45%, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 68%, rgba(255,255,255,0.7) 82%, rgba(255,255,255,0.4) 94%, rgba(255,255,255,0) 100%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at 50% 45%, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 68%, rgba(255,255,255,0.7) 82%, rgba(255,255,255,0.4) 94%, rgba(255,255,255,0) 100%)",
                }}
              />

              <AnimatePresence mode="wait">
                {activePreview === "jarvis_suite" ? (
                  <m.div
                    key="products"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="z-10 flex flex-col min-h-[720px] lg:min-h-[840px]"
                  >
                    <div className="mb-10 border-b border-white/10 pb-6 flex justify-between items-end">
                      <div>
                        <TypewriterText
                          text="PRODUCT_CATALOG"
                          className={styles.productCatalogKicker}
                        />
                        <m.h2
                          variants={fadeInUp}
                          className={styles.productCatalogTitle}
                        >
                          {messages.menu_nav_jarvis_suite()}
                        </m.h2>
                        <TypewriterText
                          text={messages.menu_suite_subtitle()}
                          className={styles.productCatalogSubtitle}
                          delay={0.2}
                        />
                      </div>
                      <div className="text-right gap-4 flex ">
                        <TypewriterText
                          text="2,600+ DEPLOYMENTS"
                          className={styles.deploymentsMeta}
                          delay={0.1}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 pr-4">
                      {menuData.jarvisProducts.map((prod, idx) => (
                        <Link
                          key={prod.href}
                          href={prod.href}
                          onClick={closeMenu}
                          prefetch
                          className={`group block cursor-pointer p-4 rounded-lg bg-white/[0.015] hover:bg-white/5 transition-all shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)] ${styles.productCard}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all" />
                              <div className="flex-1">
                                <TypewriterText
                                  text={prod.name}
                                  className={styles.productCardName}
                                  delay={0.3 + idx * 0.08}
                                />
                              </div>
                            </div>
                            <TypewriterText
                              text={`Module ${String(idx + 1).padStart(2, '0')}`}
                              className={styles.productCardModule}
                              delay={0.35 + idx * 0.08}
                            />
                          </div>
                          <div className={styles.productCardDesc}>
                            <TypewriterText
                              text={prod.desc}
                              delay={0.5 + idx * 0.08}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </m.div>
                ) : (
                  <m.div
                    key="default"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="z-10 flex flex-col min-h-[720px] lg:min-h-[840px]"
                  >
                    <div className="flex justify-between items-start mb-[2.75rem]">
                      <div>
                        <TypewriterText
                          text="LATEST_INTELLIGENCE"
                          className={styles.defaultKicker}
                        />
                        <m.h2
                          variants={fadeInUp}
                          className={styles.defaultHeadline}
                        >
                          {messages.menu_headline()}{" "}
                          <span className={styles.defaultHeadlineHighlight}>
                            {messages.menu_headline_highlight()}
                          </span>
                        </m.h2>
                      </div>
                      <m.div variants={fadeInUp}>
                        <Link
                          href={ROUTES.JARVIS.SUITE}
                          onClick={closeMenu}
                          prefetch
                          className={styles.exploreCta}
                        >
                          Explore <ArrowRight size={14} />
                        </Link>
                      </m.div>
                    </div>

                    {/* Stats Section */}
                    <m.div
                      variants={fadeInUp}
                      className="grid grid-cols-4 gap-6 py-7 border-y border-white/10 mb-7"
                    >
                      {menuData.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                        <TypewriterText
                          text={stat.label}
                          className={`${styles.statLabel} layout-nav-label`}
                          delay={0.3 + idx * 0.1}
                        />
                          <div className={styles.statValue}>
                            <TypewriterText
                              text={stat.value}
                              delay={0.4 + idx * 0.1}
                            />
                          </div>
                          <TypewriterText
                            text={stat.desc}
                            className={styles.statDesc}
                            delay={0.5 + idx * 0.1}
                          />
                        </div>
                      ))}
                    </m.div>

                    {/* Impact Metrics */}
                    <m.div
                      variants={fadeInUp}
                      className="flex justify-between items-start mb-[2.75rem] px-4"
                    >
                      {menuData.impact.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-1 h-10 bg-blue-500/50 mt-1" />
                          <div className="flex flex-col items-start">
                            <TypewriterText
                              text={item.value}
                              className={styles.impactValue}
                              delay={0.6 + idx * 0.08}
                            />
                            <TypewriterText
                              text={item.label}
                              className={styles.impactLabel}
                              delay={0.7 + idx * 0.08}
                            />
                          </div>
                        </div>
                      ))}
                    </m.div>

                    {/* News Section Header */}
                    <div className="flex justify-between items-center mb-7 pt-7 border-t border-white/10">
                      <TypewriterText
                        text="NEWSROOM_FEED"
                        className={styles.newsKicker}
                        delay={0.8}
                      />
                      <m.div variants={fadeInUp}>
                        <Link
                          href={ROUTES.NEWSROOM}
                          onClick={closeMenu}
                          prefetch
                          className={styles.newsViewAll}
                        >
                          {messages.menu_view_all()} <ArrowRight size={12} />
                        </Link>
                      </m.div>
                    </div>

                    {/* News Cards */}
                    {newsItems.length > 0 ? (
                      <div className="grid grid-cols-2 gap-6">
                        {newsItems.map((news, idx) => {
                        const href =
                          news.slug?.current && news.slug.current.length > 0
                            ? `/newsroom/${news.slug.current}`
                            : ROUTES.NEWSROOM;
                        const imageUrl = news.mainImage?.asset
                          ? urlFor(news.mainImage.asset)?.width(900).height(540).url()
                          : null;
                          const tag = news.category?.title || "NEWS";
                          const formattedDate = formatDate(news.publishedAt);
                          const meta = formattedDate ? `${tag} // ${formattedDate}` : tag;
                          const isFeatured = news.featured === true;
                        return (
                          <m.div
                            key={news._id}
                            variants={fadeInUp}
                            className={`group cursor-pointer ${styles.newsCard}`}
                          >
                            <Link href={href} onClick={closeMenu} prefetch className="block">
                              <div className="aspect-video bg-neutral-900 mb-5 overflow-hidden relative border border-white/10">
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={news.mainImage?.alt || news.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700 group-hover:opacity-90"
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-white/5" />
                                )}
                                {isFeatured && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                    <span className={styles.featuredTag}>
                                      FEATURED
                                    </span>
                                  </div>
                                )}
                              </div>
                              <TypewriterText
                                text={meta}
                                className={styles.newsMeta}
                                delay={0.5 + idx * 0.1}
                              />
                              <m.h3
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.6 + idx * 0.1, ease: "easeOut" }}
                                className={styles.newsTitle}
                              >
                                {news.title}
                              </m.h3>
                              {news.excerpt && (
                                <p className={`${styles.newsExcerpt} line-clamp-2`}>
                                  {news.excerpt}
                                </p>
                              )}
                            </Link>
                          </m.div>
                        );
                        })}
                      </div>
                    ) : (
                      <m.div
                        variants={fadeInUp}
                        className="rounded-lg border border-white/10 bg-white/[0.02] px-8 py-12 text-center"
                      >
                        <TypewriterText
                          text={messages.menu_news_empty_title()}
                          className="text-xs font-medium tracking-[0.2em] uppercase text-blue-400"
                          delay={0.95}
                        />
                        <p className="mt-3 text-sm text-neutral-400">
                          {messages.menu_news_empty_desc()}
                        </p>
                      </m.div>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </m.div>
      )}
    </AnimatePresence>
  );
}
