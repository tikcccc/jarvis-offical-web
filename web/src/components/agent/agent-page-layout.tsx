"use client";

import { HeroBackground } from "@/components/product-template/hero-background";
import { HeroForeground } from "@/components/product-template/hero-foreground";
import { NarrativeTrack } from "@/components/product-template/narrative-track";
import { FeatureSection } from "@/components/product-template/feature-section";
import { ProductFeature, ProductPageLayoutProps } from "@/components/product-template/product-page-layout";
import { CtaSection as JarvisCtaSection } from "@/components/ai-suite/cta-section";
import { KnowledgeDeepDive } from "./knowledge-deep-dive";

type AgentPageLayoutProps = ProductPageLayoutProps & {
  features: ProductFeature[];
};

export function AgentPageLayout({
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
}: AgentPageLayoutProps) {
  return (
    <div
      className="product-page relative"
      style={{ backgroundColor: "var(--product-surface-light)" }}
    >
      <HeroBackground
        videoSrc={videoSrc}
        posterSrc={posterSrc}
        productName={productName}
      />

      <HeroForeground
        brandName={brandName}
        productName={productName}
        productSubtitle={productSubtitle}
        metadata={metadata}
        showLeftLine={showLeftLine}
        showBottomBorder={showBottomBorder}
      />

      <div className="relative h-screen z-5" aria-hidden="true" />

      <NarrativeTrack
        stage1Text={narrativeStage1}
        stage2Text={narrativeStage2}
        stage2Gradient
        description={narrativeDesc}
        descriptionHighlight={narrativeHighlight}
        scrollPromptText={scrollPrompt}
      />

      <div
        className="relative z-10 h-6 -mt-6"
        style={{ backgroundColor: "var(--product-surface-light)" }}
        aria-hidden="true"
      />

      <main
        className="relative z-10"
        style={{ backgroundColor: "var(--product-surface-light)" }}
      >
        <KnowledgeDeepDive />

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

      <div className="relative z-10 jarvis-page">
        <JarvisCtaSection />
      </div>
    </div>
  );
}
