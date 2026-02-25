"use client";
/**
 * ProductPageLayout Component
 *
 * A composite layout component that combines all product page sections.
 * Use this to quickly create new JARVIS product pages with consistent structure.
 *
 * @example
 * ```tsx
 * // In src/app/(website)/jarvis-agent/page.tsx
 * import { ProductPageLayout } from "@/components/product-template";
 *
 * export default function JarvisAgentPage() {
 *   return (
 *     <ProductPageLayout
 *       productName="JARVIS Agent"
 *       videoSrc={JARVIS_VIDEOS.agent}
 *       posterSrc={JARVIS_POSTERS.agent}
 *       metadata={[m.meta1(), m.meta2(), m.meta3()]}
 *       narrativeStage1={m.narrative_stage1()}
 *       narrativeStage2={m.narrative_stage2()}
 *       narrativeDesc={m.narrative_desc()}
 *       features={[]}
 *     />
 *   );
 * }
 * ```
 */


import { HeroBackground } from "./hero-background";
import { HeroForeground, type MetadataItem } from "./hero-foreground";
import { NarrativeTrack } from "./narrative-track";
import { FeatureSection } from "./feature-section";
import { CtaSection as JarvisCtaSection } from "@/components/ai-suite/cta-section";

/**
 * Feature configuration for product pages
 */
export interface ProductFeature {
  /** Feature index (e.g., "0.1", "0.2") */
  index: string;
  /** Title lines for the feature */
  title: string[];
  /** Feature description */
  description: string;
  /** Media source URL */
  mediaSrc: string;
  /** Media type */
  mediaType?: "video" | "image";
  /** Video poster image */
  mediaPoster?: string;
  /** Toggle labels */
  videoLabel?: string;
  detailsLabel?: string;
  /** Detail items for the toggle view */
  details?: Array<{
    title: string;
    description: string;
  }>;
}

/**
 * ProductPageLayout Props
 */
export interface ProductPageLayoutProps {
  /** 品牌名稱 (空心描邊字) - 例如 "JARVIS" */
  brandName?: string;
  /** Product name displayed in hero (實心白字) */
  productName: string;
  /** Optional subtitle below product name */
  productSubtitle?: string;
  /** Hero video source URL */
  videoSrc: string;
  /** Hero video poster image */
  posterSrc?: string;
  /**
   * Metadata items for hero sidebar
   * - 舊版: string[] (純文字)
   * - 新版: MetadataItem[] (帶 icon 和 hover 效果)
   */
  metadata: string[] | MetadataItem[];
  /** 是否顯示左側裝飾竪線 (默認 true) */
  showLeftLine?: boolean;
  /** 是否顯示底部邊框線 (默認 true) */
  showBottomBorder?: boolean;

  /** Narrative section stage 1 text */
  narrativeStage1: string;
  /** Narrative section stage 2 text */
  narrativeStage2: string;
  /** Narrative section description */
  narrativeDesc: string;
  /** Optional highlight text in description */
  narrativeHighlight?: string;
  /** Scroll prompt text */
  scrollPrompt?: string;

  /** Product features configuration */
  features: ProductFeature[];
}

/**
 * ProductPageLayout - Unified layout for all JARVIS product pages
 */
export function ProductPageLayout({
  brandName,
  productName,
  productSubtitle,
  videoSrc,
  posterSrc,
  metadata,
  showLeftLine = true,
  showBottomBorder = true,
  narrativeStage1,
  narrativeStage2,
  narrativeDesc,
  narrativeHighlight,
  scrollPrompt,
  features,
}: ProductPageLayoutProps) {
  return (
    <div className="product-page relative">
      {/* Section A1: Hero Background (Fixed) - z-0 */}
      <HeroBackground
        videoSrc={videoSrc}
        posterSrc={posterSrc}
        productName={productName}
      />

      {/* Section A2: Hero Foreground (Moves with scroll) - z-10 */}
      <HeroForeground
        brandName={brandName}
        productName={productName}
        productSubtitle={productSubtitle}
        metadata={metadata}
        showLeftLine={showLeftLine}
        showBottomBorder={showBottomBorder}
      />

      {/* Spacer to prevent immediate overlap - matches hero height */}
      <div className="relative h-screen z-5" aria-hidden="true" />

      {/* Section B: Narrative Track (Scroll-driven Story) - z-20 */}
      <NarrativeTrack
        stage1Text={narrativeStage1}
        stage2Text={narrativeStage2}
        stage2Gradient
        description={narrativeDesc}
        descriptionHighlight={narrativeHighlight}
        scrollPromptText={scrollPrompt}
      />

      {/* Seamless handoff to features (covers hero background bleed) */}
      <div
        className="relative z-10 h-16 -mt-6"
        aria-hidden="true"
      />

      {/* Section C: Feature Sections */}
      <main className="relative z-10">
        {features.map((feature, idx) => (
          <FeatureSection
            key={feature.index}
            index={feature.index}
            totalFeatures={features.length}
            title={feature.title}
            description={feature.description}
            mediaSrc={feature.mediaSrc}
            mediaType={feature.mediaType}
            mediaPoster={feature.mediaPoster}
            videoLabel={feature.videoLabel}
            detailsLabel={feature.detailsLabel}
            details={feature.details}
            isLast={idx === features.length - 1}
          />
        ))}
      </main>

      {/* Section D: CTA (shared from JARVIS AI Suite) */}
      <div className="relative z-10 jarvis-page">
        <JarvisCtaSection />
      </div>
    </div>
  );
}
