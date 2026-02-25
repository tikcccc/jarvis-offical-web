"use client";

import * as m from "@/paraglide/messages";
import {
  JARVIS_VIDEOS,
  JARVIS_POSTERS,
  JARVIS_FEATURE_VIDEOS,
} from "@/lib/media-config";
import {
  ProductPageLayout,
  type MetadataItem,
  // Shared icons
  ShieldCheckIcon,
  BanknoteIcon,
  EyeIcon,
} from "@/components/product-template";

/**
 * JARVIS Pay Client Component
 *
 * Client-side wrapper that executes all m.*() translations in the browser.
 * This ensures translations respond to locale changes in real-time.
 *
 * Architecture:
 * - page.tsx (Server): SEO metadata + JSON-LD only
 * - jarvis-pay-client.tsx (Client): All content and translations
 */
export default function JarvisPayClient() {
  const featureVideos = JARVIS_FEATURE_VIDEOS.pay;

  // Metadata with icons - subtitles derived from existing feature descriptions
  const metadata: MetadataItem[] = [
    {
      title: m.jarvis_pay_hero_meta1(), // "SOPL-Compliant"
      subtitle: "60-Day Mandate",       // From feature1_detail2
      icon: <ShieldCheckIcon />,
    },
    {
      title: m.jarvis_pay_hero_meta2(), // "Working Capital"
      subtitle: "Lower Rates",          // From feature3_detail3
      icon: <BanknoteIcon />,
    },
    {
      title: m.jarvis_pay_hero_meta3(), // "Investor Visibility"
      subtitle: "Real-Time",            // From feature3_detail2
      icon: <EyeIcon />,
    },
  ];

  return (
    <ProductPageLayout
      brandName="JARVIS"
      productName="PAY"
      productSubtitle={m.jarvis_pay_narrative_stage2()} // "Certify in 60 Days"
      videoSrc={JARVIS_VIDEOS.pay}
      posterSrc={JARVIS_POSTERS.pay}
      metadata={metadata}
      showLeftLine={true}
      showBottomBorder={true}
      narrativeStage1={m.jarvis_pay_narrative_stage1()}
      narrativeStage2={m.jarvis_pay_narrative_stage2()}
      narrativeDesc={m.jarvis_pay_narrative_desc()}
      scrollPrompt={m.jarvis_pay_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_pay_feature1_title_line1(),
            m.jarvis_pay_feature1_title_line2(),
          ],
          description: m.jarvis_pay_feature1_desc(),
          mediaSrc: featureVideos.feature1,
          mediaType: "video",
          videoLabel: m.jarvis_pay_toggle_video(),
          detailsLabel: m.jarvis_pay_toggle_details(),
          details: [
            {
              title: m.jarvis_pay_feature1_detail1_title(),
              description: m.jarvis_pay_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_pay_feature1_detail2_title(),
              description: m.jarvis_pay_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_pay_feature1_detail3_title(),
              description: m.jarvis_pay_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_pay_feature2_title_line1(),
            m.jarvis_pay_feature2_title_line2(),
          ],
          description: m.jarvis_pay_feature2_desc(),
          mediaSrc: featureVideos.feature2,
          mediaType: "video",
          videoLabel: m.jarvis_pay_toggle_video(),
          detailsLabel: m.jarvis_pay_toggle_details(),
          details: [
            {
              title: m.jarvis_pay_feature2_detail1_title(),
              description: m.jarvis_pay_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_pay_feature2_detail2_title(),
              description: m.jarvis_pay_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_pay_feature2_detail3_title(),
              description: m.jarvis_pay_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_pay_feature3_title_line1(),
            m.jarvis_pay_feature3_title_line2(),
          ],
          description: m.jarvis_pay_feature3_desc(),
          mediaSrc: featureVideos.feature3,
          mediaType: "video",
          videoLabel: m.jarvis_pay_toggle_video(),
          detailsLabel: m.jarvis_pay_toggle_details(),
          details: [
            {
              title: m.jarvis_pay_feature3_detail1_title(),
              description: m.jarvis_pay_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_pay_feature3_detail2_title(),
              description: m.jarvis_pay_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_pay_feature3_detail3_title(),
              description: m.jarvis_pay_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
