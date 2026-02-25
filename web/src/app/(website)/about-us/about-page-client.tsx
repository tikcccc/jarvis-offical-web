'use client';

import React, { useEffect, useRef } from 'react';
import { CTASection } from '@/components/layout/cta-section';
import { cn } from '@/lib/utils';
import { useMenuStore } from '@/stores/menu-store';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as m from '@/paraglide/messages';
import { useSmoothScrollTo } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import { TypewriterWidth } from '@/components/animations';
import { LocalizedLink } from '@/components/ui/localized-link';
import { PageHeader } from '@/components/ui/page-header';
import { SmartImage } from '@/components/ui/smart-image';

/**
 * About Us Page
 *
 * A Palantir-style narrative page featuring:
 * - Cinematic blur reveal animations
 * - GSAP ScrollTrigger interactions
 * - Global Lenis smooth scrolling (from layout)
 * - Sticky navigation with glitch effects
 * - Typewriter title animations
 *
 * Route: /[locale]/about-us
 */

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- 1. Global State (Zustand Store) ---
import { create } from 'zustand';

interface NavState {
  activeSection: number;
  setActiveSection: (index: number) => void;
}

const useNavStore = create<NavState>((set) => ({
  activeSection: 0, // Start with no section active until scrolled into view
  setActiveSection: (index) => set({ activeSection: index }),
}));

// --- 2. UI Components ---

// TechDivider: Tech-style separator line
const TechDivider = ({ className }: { className?: string }) => (
  <div className={cn("w-full h-[1px] relative overflow-visible", className)}>
    <div className="absolute inset-0 about-border"></div>
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[var(--about-accent)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
  </div>
);

// Noise overlay is now provided globally via .surface-noise-overlay + .noise-grain classes
// See: src/styles/3-utilities/surfaces.css

// ArrowLink: Link with arrow and underline animation
const ArrowLink = ({ label, href }: { label: string; href: string }) => (
  <LocalizedLink href={href} prefetchMode="hover" className="group/btn inline-flex flex-col items-start gap-2 cursor-pointer mt-6">
    <div className="flex items-center gap-2 font-label-lg about-text-primary">
      {label}
      <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">-&gt;</span>
    </div>
    <div className="w-full h-[1px] about-border relative overflow-hidden">
       <div className="absolute inset-0 bg-[var(--about-accent)] transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></div>
    </div>
  </LocalizedLink>
);

// RevealTitle: Cinematic blur reveal title (optimized with ScrollTrigger)
const RevealTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const elementRef = useRef<HTMLHeadingElement>(null);

  // Split words only once during render
  const words = text.split(' ');

  const motionFast = typeof window !== 'undefined'
    ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--about-motion-fast')) || 0.75
    : 0.75;
  const easingStrong = typeof window !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--about-motion-ease-strong').trim() || "power2.out"
    : "power2.out";

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Use gsap.context for proper cleanup in React (Best Practice)
    const ctx = gsap.context(() => {
      const wordElements = el.querySelectorAll('.word');
      
      // Set initial state immediately
      gsap.set(wordElements, { x: 18, opacity: 0 });

      // Animate directly with ScrollTrigger - NO React state updates involved
      gsap.to(wordElements, {
        x: 0,
        opacity: 1,
        duration: motionFast,
        stagger: 0.04,
        ease: easingStrong,
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // Trigger when top of text hits 85% of viewport height
          toggleActions: "play none none reverse",
        }
      });
    }, elementRef);

    return () => ctx.revert(); // Clean up all GSAP animations when component unmounts
  }, [text, motionFast, easingStrong]);

  return (
    <h3 ref={elementRef} className={cn("cursor-default flex flex-wrap gap-x-[0.3em]", className)}>
      {words.map((word, i) => (
        <span key={i} className="word inline-block will-change-transform">
          {word}
        </span>
      ))}
    </h3>
  );
};

// FeatureRow: What We Do row layout
const FeatureRow = ({
  title,
  content,
  linkLabel,
  href,
}: {
  title: string;
  content: string;
  linkLabel: string;
  href: string;
}) => (
  <div className="about-feature-padding about-feature-row">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <div className="lg:col-span-5">
        <RevealTitle
          text={title}
          className="font-container-subtitle leading-tight transition-colors duration-500"
        />
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between h-full">
        <p className="font-body-lg about-text-secondary mb-6">
          {content}
        </p>
        <div>
           <ArrowLink label={linkLabel} href={href} />
        </div>
      </div>
    </div>
  </div>
);

// StickyNav: Navigation component
const StickyNav = () => {
  const activeSection = useNavStore((state) => state.activeSection);
  const isMenuOpen = useMenuStore((state) => state.isOpen);
  const scrollTo = useSmoothScrollTo();

  const handleScrollTo = (id: string) => {
    scrollTo(id, { offset: 0, duration: 1.2 });
  };

  useEffect(() => {
    const target = document.getElementById(`nav-item-${activeSection}`);
    const accentColor = "var(--about-accent)";
    const primaryColor = "var(--about-text-primary)";
    const glitchStep = typeof window !== 'undefined'
      ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--about-motion-snappy')) || 0.06
      : 0.06;
    const glitchEase = "steps(1)";

    if (target) {
      const textElements = target.querySelectorAll('span');
      gsap.killTweensOf(textElements);

      const tl = gsap.timeline();

      tl.to(textElements, {
          color: accentColor, opacity: 0, x: -3, duration: glitchStep, ease: glitchEase
        })
        .to(textElements, {
          color: primaryColor, opacity: 1, x: 3, duration: glitchStep, ease: glitchEase
        })
        .to(textElements, {
          color: accentColor, opacity: 0.2, x: 0, scale: 1.1, duration: glitchStep, ease: glitchEase
        })
        .to(textElements, {
          color: primaryColor, opacity: 1, scale: 1, duration: glitchStep, ease: glitchEase
        });
    }
  }, [activeSection]);

  // Hide navigation when menu is open or no section is active
  if (isMenuOpen || activeSection === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-10 md:left-10 md:right-auto z-[9999] flex flex-col gap-4 font-label-lg about-text-primary pointer-events-auto about-nav-index">
      {[1, 2, 3].map((num) => (
        <div
          key={num}
          id={`nav-item-${num}`}
          onClick={() => handleScrollTo(`#section-${num}`)}
          className={cn(
            "cursor-pointer transition-all duration-300 flex items-center gap-3 group",
            activeSection === num ? "opacity-100 font-bold" : "opacity-40 hover:opacity-70"
          )}
        >
          <span className="text-sm will-change-transform font-semibold">0{num}</span>
          <span className={cn(
             "overflow-hidden whitespace-nowrap will-change-transform text-sm",
             activeSection === num ? "max-w-[300px] opacity-100" : "max-w-0 opacity-0"
          )}
          style={{
            transition: activeSection === num ? 'max-width 500ms ease-in-out' : 'max-width 500ms ease-in-out, opacity 500ms ease-in-out'
          }}>
            {num === 1 ? m.about_nav_section1() : num === 2 ? m.about_nav_section2() : m.about_nav_section3()}
          </span>
          {activeSection === num && <div className="h-[1px] w-8 bg-[var(--about-accent)] animate-pulse" />}
        </div>
      ))}
    </div>
  );
};

// Section: Generic content section
interface SectionProps {
  id: number;
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  imageSrc?: string;
  children?: React.ReactNode;
}

const Section = ({ id, title, subtitle, content, imageSrc, children }: SectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const setActiveSection = useNavStore((state) => state.setActiveSection);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Navigation tracking - persistent ScrollTrigger
    const navTrigger = ScrollTrigger.create({
      trigger: el,
      start: "top 55%",
      end: "bottom 55%",
      onEnter: () => setActiveSection(id),
      onEnterBack: () => setActiveSection(id),
      onLeaveBack: () => {
        // Reset to 0 when scrolling back above section 1
        if (id === 1) setActiveSection(0);
      },
      markers: false
    });

    // Animation - one-time ScrollTrigger for other elements
    const motionSlow = typeof window !== 'undefined'
      ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--about-motion-slow')) || 0.8
      : 0.8;
    const motionStagger = typeof window !== 'undefined'
      ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--about-motion-stagger')) || 0.1
      : 0.1;
    const easingStrong = typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue('--about-motion-ease-strong').trim() || "power2.out"
      : "power2.out";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        toggleActions: "play none none none",
        once: true,
        markers: false
      }
    });

    tl.fromTo(`.section-${id}-anim`,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: motionSlow, ease: easingStrong, stagger: motionStagger },
      "+=1.0" // Delay to allow typewriter to finish
    );

    return () => {
      navTrigger.kill();
      tl.kill();
    };
  }, [id, setActiveSection]);

  return (
    <section
      id={`section-${id}`}
      ref={sectionRef}
      className="min-h-screen w-full flex flex-col justify-center relative overflow-hidden about-section-padding about-surface-base will-change-auto"
    >
      <div className="container-content z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start lg:items-center mb-12">
          <div className="lg:col-span-7">
            <span className="block font-label-lg about-text-secondary mb-6 font-semibold">
              0{id} <span className="about-text-muted">/ 03</span>
            </span>

            <TypewriterWidth
              text={title}
              className="font-container-title font-extrabold tracking-[-0.04em] leading-none text-transform: uppercase"
              duration={1.5}
              steps={40}
              cursorVisible
              hideCursorOnComplete
              cursorClassName="top-2 h-[80%] w-3 bg-[var(--about-accent)] ml-1 md:ml-2"
              scrollTrigger={{
                trigger: `#section-${id}`,
                start: "top 70%",
                toggleActions: "play none none none",
              }}
            />
          </div>

            {subtitle && (
            <div className={`section-${id}-anim opacity-0 lg:col-span-5 flex items-start`}>
               <p className="font-body-lg about-text-secondary leading-snug md:leading-normal lg:leading-snug border-l-2 about-border-accent pl-6">
                 {subtitle}
               </p>
            </div>
          )}
        </div>

        <div className={`section-${id}-anim opacity-0`}>
          <TechDivider className="mb-12" />
        </div>

        {/* Content Area */}
          <div className={`section-${id}-anim opacity-0`}>
          {children || (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-9 font-body-lg about-text-secondary space-y-8">
                {content}
              </div>
              <div className="lg:col-span-3"></div>
            </div>
          )}
        </div>

        {imageSrc && (
          <div className={`section-${id}-anim opacity-0 mt-16`}>
             <div className="relative w-full aspect-video overflow-hidden bg-[var(--about-border)]/40 about-shadow-card border about-border about-radius-lg group">
                <SmartImage
                  src={imageSrc}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1600px"
                  imageClassName="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  priority={id === 1}
                  fallbackSrc={imageSrc}
                />
             </div>
          </div>
        )}

      </div>
    </section>
  );
};

// --- 3. Page Entry Point ---
interface AboutPageProps {
  heroImageSrc?: string;
}

export default function AboutPage({ heroImageSrc = "/images/about/hero.png" }: AboutPageProps) {
  const { closeMenu } = useMenuStore();

  useEffect(() => {
    // Close menu when navigating to this page
    closeMenu();
  }, [closeMenu]);

  useEffect(() => {
    // Refresh ScrollTrigger after initial render to ensure proper positioning
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="about-page surface-noise-overlay about-text-primary min-h-[300vh] selection:bg-[var(--about-accent)]/10 selection:text-[var(--about-accent)] antialiased">
      {/* Global noise texture overlay */}
      <div className="noise-grain" />

      <StickyNav />

      {/* Page Header */}
      <div className="pb-8 relative overflow-hidden">
        <PageHeader
          title={m.about_page_title()}
          subtitle={m.about_page_subtitle()}
          className="relative z-10"
        />
      </div>

      {/* Hero Image between Header and Section 1 */}
      <div className="pb-16 relative overflow-hidden">
        <div className="container-content relative z-10">
          <div className="relative w-full aspect-[3528/1859] overflow-hidden bg-[var(--about-border)]/40 about-shadow-card border about-border about-radius-lg group">
            <SmartImage
              src={heroImageSrc.replace(/\.(png|jpe?g|webp|avif)$/i, ".avif")}
              sources={[
                { src: heroImageSrc.replace(/\.(png|jpe?g|webp|avif)$/i, ".webp"), type: "image/webp" },
              ]}
              fallbackSrc={heroImageSrc}
              alt="isBIM Hero"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1600px"
              imageClassName="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
      </div>

      {/* 01: Why We're Here */}
      <Section
        id={1}
        title={m.about_section1_title()}
        subtitle={m.about_section1_subtitle()}
        content={
          <>
            <p>{m.about_section1_content1()}</p>
            <p>{m.about_section1_content2()}</p>
            <p>{m.about_section1_content3()}</p>
          </>
        }
      />

      {/* 02: What We Do */}
      <Section
        id={2}
        title={m.about_section2_title()}
        subtitle={m.about_section2_subtitle()}
      >
        <div className="flex flex-col">
          <FeatureRow
            title={m.about_section2_feature1_title()}
            content={m.about_section2_feature1_content()}
            linkLabel={m.about_section2_feature1_link()}
            href={ROUTES.JARVIS.SUITE}
          />
          <FeatureRow
            title={m.about_section2_feature2_title()}
            content={m.about_section2_feature2_content()}
            linkLabel={m.about_section2_feature2_link()}
            href={ROUTES.JARVIS.JPM}
          />
          <FeatureRow
            title={m.about_section2_feature3_title()}
            content={m.about_section2_feature3_content()}
            linkLabel={m.about_section2_feature3_link()}
            href={ROUTES.VENTURE_INVESTMENTS}
          />
          <FeatureRow
            title={m.about_section2_feature4_title()}
            content={m.about_section2_feature4_content()}
            linkLabel={m.about_section2_feature4_link()}
            href={ROUTES.BIM_CONSULTANCY}
          />
        </div>
      </Section>

      {/* 03: Where We Are Going */}
      <Section
        id={3}
        title={m.about_section3_title()}
        subtitle={m.about_section3_subtitle()}
        content={
          <>
            <p>{m.about_section3_content1()}</p>
            <p>{m.about_section3_content2()}</p>
            <p className="about-text-accent italic font-medium mt-4">
              {m.about_section3_content3()}
            </p>
          </>
        }
      />

      <CTASection
        title={m.about_cta_title()}
        subtitle={m.about_cta_subtitle()}
        buttonLabel={m.about_cta_button()}
        href={ROUTES.CONTACT}
      />

    </main>
  );
}
