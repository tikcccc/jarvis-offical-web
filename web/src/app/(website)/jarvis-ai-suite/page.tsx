import { HeroSection } from "@/components/ai-suite/hero-section";
import { BuildersSection } from "@/components/ai-suite/builders-section";
import { CtaSection } from "@/components/ai-suite/cta-section";
import { ProductMatrix } from "@/components/ai-suite/product-matrix";
import type { Metadata } from "next";
import { languageTag } from "@/paraglide/runtime";
import { generatePageMetadata } from "@/lib/seo";

/**
 * JARVIS AI Suite Page
 * Renders the AI Suite sections (copied from the previous version for iteration).
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  const title = locale === "zh"
    ? "JARVIS AI 套件 | isBIM"
    : "JARVIS AI Suite | isBIM";
  const description = locale === "zh"
    ? "JARVIS AI 套件頁面仍在重構中，敬請期待。"
    : "The JARVIS AI Suite page is currently being refined. Stay tuned.";

  return generatePageMetadata({
    title,
    description,
    path: "/jarvis-ai-suite",
    locale,
    image: "/images/og/jarvis-ai-suite.jpg",
    noIndex: true,
  });
}

export default function JarvisAiSuitePage() {
  return (
    <div className="jarvis-page product-page">
      <HeroSection />
      <BuildersSection />
      <ProductMatrix />
      <CtaSection />
    </div>
  );
}
