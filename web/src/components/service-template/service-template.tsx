'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { FooterConfig } from '@/components/layout/footer-config';
import {
  getLocalizedServiceContent,
  getLocalizedServiceMeta,
  ServiceTab,
} from '@/data/services';
import { HeroSection } from './hero-section';
import { MethodologySection } from './methodology-section';
import { EngineSection } from './engine-section';
import { DataSection } from './data-section';
import { GallerySection } from './gallery-section';
import { CtaSection } from './cta-section';
import { TimelineSection } from './timeline-section';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import * as messages from '@/paraglide/messages';
import { ROUTES } from '@/lib/constants';
import { SmartImage } from '@/components/ui/smart-image';

type ImageVariant = {
  src: string;
  fallback?: string;
  sources?: { src: string; type?: string; media?: string }[];
};

// Token-aligned color class shortcuts
const COLORS = {
  textStrong: 'text-[var(--text-strong)]',
  textBase: 'text-[var(--text-base)]',
  textMuted: 'text-[var(--text-muted)]',
  textSub: 'text-[var(--text-sub)]',
  textSoft: 'text-[var(--text-soft)]',
  textVSoft: 'text-[var(--text-vsoft)]',
  textInvStrong: 'text-[var(--text-inverse-strong)]',
  textInvBase: 'text-[var(--text-inverse-base)]',
  textInvMuted: 'text-[var(--text-inverse-muted)]',
  textInvSub: 'text-[var(--text-inverse-sub)]',
  textInvVSoft: 'text-[var(--text-inverse-vsoft)]',
  bgLight: 'bg-[var(--surface-base)]',
  bgGray: 'bg-[var(--surface-subtle)]',
  bgDark: 'bg-[var(--surface-dark)]',
};

const SECTION_TITLE_BASE = 'font-service-section-title pb-4 inline-block';
const SECTION_TITLE_PLAIN = `${COLORS.textSub} ${SECTION_TITLE_BASE}`;
const SECTION_TITLE_STYLE = `${COLORS.textInvSub} ${SECTION_TITLE_BASE}`;

const IMAGE_VARIANTS: Record<string, ImageVariant> = {
  // Hero backgrounds
  "/images/services/jpm/hero.png": {
    src: "/images/services/jpm/hero.avif",
    sources: [{ src: "/images/services/jpm/hero.webp", type: "image/webp" }],
    fallback: "/images/services/jpm/hero.png",
  },
  "/images/services/bim/hero.png": {
    src: "/images/services/bim/hero.avif",
    sources: [{ src: "/images/services/bim/hero.webp", type: "image/webp" }],
    fallback: "/images/services/bim/hero.png",
  },
  "/images/services/ventures/hero.jpeg": {
    src: "/images/services/ventures/hero.avif",
    sources: [{ src: "/images/services/ventures/hero.webp", type: "image/webp" }],
    fallback: "/images/services/ventures/hero.jpeg",
  },
  "/images/services/finance/hero.jpg": {
    src: "/images/services/finance/hero.avif",
    sources: [{ src: "/images/services/finance/hero.webp", type: "image/webp" }],
    fallback: "/images/services/finance/hero.jpg",
  },
  // JPM gallery
  "/images/services/jpm/gallery-1.png": {
    src: "/images/services/jpm/gallery-1.avif",
    sources: [{ src: "/images/services/jpm/gallery-1.webp", type: "image/webp" }],
    fallback: "/images/services/jpm/gallery-1.png",
  },
  "/images/services/jpm/gallery-2.jpg": {
    src: "/images/services/jpm/gallery-2.avif",
    sources: [{ src: "/images/services/jpm/gallery-2.webp", type: "image/webp" }],
    fallback: "/images/services/jpm/gallery-2.jpg",
  },
  // BIM gallery
  "/images/services/bim/gallery-1.png": {
    src: "/images/services/bim/gallery-1.avif",
    sources: [{ src: "/images/services/bim/gallery-1.webp", type: "image/webp" }],
    fallback: "/images/services/bim/gallery-1.png",
  },
  "/images/services/bim/gallery-2.png": {
    src: "/images/services/bim/gallery-2.avif",
    sources: [{ src: "/images/services/bim/gallery-2.webp", type: "image/webp" }],
    fallback: "/images/services/bim/gallery-2.png",
  },
  // Venture gallery
  "/images/services/ventures/gallery-1.jpg": {
    src: "/images/services/ventures/gallery-1.avif",
    sources: [{ src: "/images/services/ventures/gallery-1.webp", type: "image/webp" }],
    fallback: "/images/services/ventures/gallery-1.jpg",
  },
  "/images/services/ventures/gallery-2.jpg": {
    src: "/images/services/ventures/gallery-2.avif",
    sources: [{ src: "/images/services/ventures/gallery-2.webp", type: "image/webp" }],
    fallback: "/images/services/ventures/gallery-2.jpg",
  },
  "/images/services/ventures/gallery-3.jpg": {
    src: "/images/services/ventures/gallery-3.avif",
    sources: [{ src: "/images/services/ventures/gallery-3.webp", type: "image/webp" }],
    fallback: "/images/services/ventures/gallery-3.jpg",
  },
  // Finance gallery
  "/images/services/finance/gallery-1.jpg": {
    src: "/images/services/finance/gallery-1.avif",
    sources: [{ src: "/images/services/finance/gallery-1.webp", type: "image/webp" }],
    fallback: "/images/services/finance/gallery-1.jpg",
  },
  "/images/services/finance/gallery-2.jpg": {
    src: "/images/services/finance/gallery-2.avif",
    sources: [{ src: "/images/services/finance/gallery-2.webp", type: "image/webp" }],
    fallback: "/images/services/finance/gallery-2.jpg",
  },
  "/images/services/finance/gallery-3.avif": {
    src: "/images/services/finance/gallery-3.avif",
    sources: [{ src: "/images/services/finance/gallery-3.webp", type: "image/webp" }],
    fallback: "/images/services/finance/gallery-3-source.avif",
  },
};

interface ServiceTemplateProps {
  initialService: ServiceTab;
}

export function ServiceTemplate({ initialService }: ServiceTemplateProps) {
  const [activeTab] = useState<ServiceTab>(initialService);
  const content = getLocalizedServiceContent(activeTab);
  const meta = getLocalizedServiceMeta(activeTab);
  const prefersReducedMotion = useReducedMotion();
  const heroVariant = IMAGE_VARIANTS[content.hero.img];
  const heroSrc = heroVariant?.src ?? content.hero.img;
  const heroSources = heroVariant?.sources;
  const heroFallback = heroVariant?.fallback ?? content.hero.img;
  const engineHeading =
    activeTab === "JPM"
      ? messages.service_jpm_engine_heading?.() ?? " Hong Kong Precision x China Scale : The Four-Pillar Engine"
      : activeTab === "BIM"
        ? messages.service_bim_engine_heading?.() ?? "What We Actually Deliver"
        : activeTab === "VENTURES"
          ? messages.service_venture_engine_heading?.() ?? "Conviction-Led Investment"
          : activeTab === "FINANCE"
            ? messages.service_finance_engine_heading?.() ?? "Our Capital Network"
            : messages.service_engine_heading();
  const galleryHeading = messages.service_gallery_heading();
  const ctaTitle = messages.service_cta_title();
  const ctaBody =
    activeTab === "JPM"
      ? messages.service_cta_body_prefix_jpm()
      : activeTab === "BIM"
        ? messages.service_cta_body_bim?.() ?? "Join the network of global projects redefining infrastructure."
        : activeTab === "VENTURES"
          ? messages.service_cta_body_venture?.() ?? "Join the network of global projects redefining infrastructure."
          : activeTab === "FINANCE"
            ? messages.service_cta_body_finance?.() ?? "Join the network of global projects redefining infrastructure."
            : `${messages.service_cta_body_prefix()}${meta.title}${messages.service_cta_body_suffix()}`;
  const ctaLinkText = `${messages.service_cta_link_prefix()}${meta.title}${messages.service_cta_link_suffix()}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className={`service-page relative min-h-screen font-sans selection:bg-[var(--surface-hero)] selection:text-[var(--text-inverse-strong)] transition-colors duration-700 overflow-hidden`}>
      <FooterConfig variant="charcoal" />
      {/* Parallax background */}
      <div className="fixed inset-0 w-full h-screen z-0 overflow-hidden pointer-events-none">
        <m.div
          key={content.hero.img}
          className="absolute inset-0"
          initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.06, y: 12 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: DESIGN_TOKENS.animation.duration.page,
                  ease: DESIGN_TOKENS.animation.easing.smooth,
                }
          }
        >
          <SmartImage
            src={heroSrc}
            sources={heroSources}
            fallbackSrc={heroFallback}
            alt={`${content.hero.title} hero`}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            wrapperClassName="absolute inset-0"
            imageClassName="object-cover"
          />
        </m.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
      </div>
      {/* Cover below hero to prevent bleed while keeping fixed parallax in view */}
      <div
        aria-hidden
        className="fixed top-[100vh] left-0 right-0 bottom-0 bg-[var(--surface-base)] z-0 pointer-events-none"
      />

      {/* Scrollable content */}
      <div className="relative z-10">
        <HeroSection hero={content.hero} />

        {activeTab === "BIM" && content.timeline ? (
          <TimelineSection
            heading={content.timeline.heading}
            items={content.timeline.items}
            sectionTitleClass={SECTION_TITLE_PLAIN}
          />
        ) : null}

        <MethodologySection
          narrative={content.narrative}
          sectionTitleClass={SECTION_TITLE_PLAIN}
          colors={{
            textStrong: COLORS.textStrong,
            textBase: COLORS.textBase,
            textMuted: COLORS.textMuted,
            textSub: COLORS.textSub,
          }}
          timeline={activeTab === "BIM" ? undefined : content.timeline}
        />
        <EngineSection
          items={content.engine}
          heading={engineHeading}
          sectionTitleClass={SECTION_TITLE_PLAIN}
          colors={{
            textStrong: COLORS.textStrong,
            textBase: COLORS.textBase,
            textMuted: COLORS.textMuted,
            textSub: COLORS.textSub,
          }}
        />
        <DataSection
          stats={content.stats}
          introText={content.stats.intro}
          sectionTitleClass={SECTION_TITLE_PLAIN}
          colors={{
            textStrong: COLORS.textStrong,
            textBase: COLORS.textBase,
            textSub: COLORS.textSub,
            textSoft: COLORS.textSoft,
          }}
        />
        <GallerySection
          gallery={content.gallery}
          heading={galleryHeading}
          sectionTitleClass={SECTION_TITLE_STYLE}
          imageVariants={IMAGE_VARIANTS}
          colors={{
            textInvStrong: COLORS.textInvStrong,
            textInvBase: COLORS.textInvBase,
            textInvMuted: COLORS.textInvMuted,
            textInvSub: COLORS.textInvSub,
          }}
          contactHref={activeTab === "VENTURES" ? undefined : ROUTES.CONTACT}
        />
        <CtaSection
          activeTab={activeTab}
          title={ctaTitle}
          bodyText={ctaBody}
          linkText={ctaLinkText}
          colors={{
            textInvStrong: COLORS.textInvStrong,
            textInvBase: COLORS.textInvBase,
            textInvSub: COLORS.textInvSub,
            textInvMuted: COLORS.textInvMuted,
          }}
        />
        <FooterConfig variant="charcoal" />
      </div>
    </div>
  );
}

export default ServiceTemplate;
