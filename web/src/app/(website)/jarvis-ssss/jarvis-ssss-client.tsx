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
  ShieldCheckIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from "@/components/product-template";

/**
 * JARVIS SSSS Client Component
 *
 * Executes all m.*() translations client-side to stay in sync with locale changes.
 */
export default function JarvisSsssClient() {
  const featureVideos = {
    compliance: JARVIS_FEATURE_VIDEOS.ssss.feature1,
    modules: JARVIS_FEATURE_VIDEOS.ssss.feature2,
    dashboard: JARVIS_FEATURE_VIDEOS.ssss.feature3,
  };

  // Metadata with icons - subtitles from feature detail titles
  const metadata: MetadataItem[] = [
    {
      title: m.jarvis_ssss_hero_meta1(), // "DEVB 10-Module"
      subtitle: "DEVB Compliance",       // From feature1_detail1
      icon: <ShieldCheckIcon />,
    },
    {
      title: m.jarvis_ssss_hero_meta2(), // "Instant Safety Alerts"
      subtitle: "Proactive Safety",      // From feature1_detail3
      icon: <AlertTriangleIcon />,
    },
    {
      title: m.jarvis_ssss_hero_meta3(), // "Zero-Accident Goal"
      subtitle: "Zero-Accident Future",  // From feature2_detail3
      icon: <CheckCircleIcon />,
    },
  ];

  return (
    <ProductPageLayout
      brandName="JARVIS"
      productName="SSSS"
      productSubtitle={m.jarvis_ssss_narrative_stage2()} // "Proactive Risk Orchestration"
      videoSrc={JARVIS_VIDEOS.ssss}
      posterSrc={JARVIS_POSTERS.ssss}
      metadata={metadata}
      narrativeStage1={m.jarvis_ssss_narrative_stage1()}
      narrativeStage2={m.jarvis_ssss_narrative_stage2()}
      narrativeDesc={m.jarvis_ssss_narrative_desc()}
      narrativeHighlight={m.jarvis_ssss_narrative_highlight()}
      scrollPrompt={m.jarvis_ssss_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_ssss_feature1_title_line1(),
            m.jarvis_ssss_feature1_title_line2(),
          ],
          description: m.jarvis_ssss_feature1_desc(),
          mediaSrc: featureVideos.compliance,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.ssss,
          videoLabel: m.jarvis_ssss_toggle_video(),
          detailsLabel: m.jarvis_ssss_toggle_details(),
          details: [
            {
              title: m.jarvis_ssss_feature1_detail1_title(),
              description: m.jarvis_ssss_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_ssss_feature1_detail2_title(),
              description: m.jarvis_ssss_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_ssss_feature1_detail3_title(),
              description: m.jarvis_ssss_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_ssss_feature2_title_line1(),
            m.jarvis_ssss_feature2_title_line2(),
          ],
          description: m.jarvis_ssss_feature2_desc(),
          mediaSrc: featureVideos.modules,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.ssss,
          videoLabel: m.jarvis_ssss_toggle_video(),
          detailsLabel: m.jarvis_ssss_toggle_details(),
          details: [
            {
              title: m.jarvis_ssss_feature2_detail1_title(),
              description: m.jarvis_ssss_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_ssss_feature2_detail2_title(),
              description: m.jarvis_ssss_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_ssss_feature2_detail3_title(),
              description: m.jarvis_ssss_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_ssss_feature3_title_line1(),
            m.jarvis_ssss_feature3_title_line2(),
          ],
          description: m.jarvis_ssss_feature3_desc(),
          mediaSrc: featureVideos.dashboard,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.ssss,
          videoLabel: m.jarvis_ssss_toggle_video(),
          detailsLabel: m.jarvis_ssss_toggle_details(),
          details: [
            {
              title: m.jarvis_ssss_feature3_detail1_title(),
              description: m.jarvis_ssss_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_ssss_feature3_detail2_title(),
              description: m.jarvis_ssss_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_ssss_feature3_detail3_title(),
              description: m.jarvis_ssss_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
