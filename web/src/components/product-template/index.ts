/**
 * Product Template Components
 *
 * Reusable components for JARVIS product showcase pages.
 * Based on product-template.html Palantir-inspired design.
 *
 * Usage:
 * ```tsx
 * import {
 *   HeroSection,
 *   NarrativeTrack,
 *   FeatureSection,
 * } from "@/components/product-template";
 *
 * export default function ProductPage() {
 *   return (
 *     <div className="relative bg-product-light">
 *       <HeroSection
 *         productName="JARVIS Pay"
 *         videoSrc="/videos/pay.mp4"
 *         metadata={["Feature 1", "Feature 2"]}
 *       />
 *       <NarrativeTrack
 *         stage1Text="Beyond traditional"
 *         stage2Text="Smart Solutions"
 *         description="Transform your workflow"
 *       />
 *       <main className="relative z-10 bg-product-light">
 *         <FeatureSection
 *           index="0.1"
 *           totalFeatures={3}
 *           title={["Automated", "Processing"]}
 *           description="AI-driven workflows"
 *           mediaSrc="/videos/feature1.mp4"
 *         />
 *       </main>
 *     </div>
 *   );
 * }
 * ```
 */

export { HeroSection } from "./hero-section";
export { HeroBackground } from "./hero-background";
export { HeroForeground } from "./hero-foreground";
export type { MetadataItem } from "./hero-foreground";
export { NarrativeTrack } from "./narrative-track";
export { FeatureSection } from "./feature-section";
export { ProductCTASection } from "./cta-section";
export { ProductPageLayout } from "./product-page-layout";
export type { ProductFeature, ProductPageLayoutProps } from "./product-page-layout";

// Meta Icons - shared icon components for MetadataItem
export {
  // Compliance & Security
  ShieldCheckIcon,
  LockIcon,
  FingerprintIcon,
  // Finance & Capital
  BanknoteIcon,
  WalletIcon,
  TrendingUpIcon,
  // Visibility & Analytics
  EyeIcon,
  BarChartIcon,
  ActivityIcon,
  // Speed & Performance
  ZapIcon,
  ClockIcon,
  TimerIcon,
  // Global & Network
  GlobeIcon,
  NetworkIcon,
  ShareIcon,
  // Construction & Building
  BuildingIcon,
  HardHatIcon,
  LayersIcon,
  // Data & Technology
  DatabaseIcon,
  CloudIcon,
  CpuIcon,
  ScanIcon,
  // Quality & Verification
  CheckCircleIcon,
  ClipboardCheckIcon,
  FileCheckIcon,
  // Environment & Safety
  WindIcon,
  ThermometerIcon,
  DropletsIcon,
  AlertTriangleIcon,
  // User & Team
  UsersIcon,
  UserCheckIcon,
  // Navigation & Location
  MapPinIcon,
  CompassIcon,
} from "./icons/meta-icons";
