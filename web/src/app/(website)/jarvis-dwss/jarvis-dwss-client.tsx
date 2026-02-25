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
  FileCheckIcon,
  ZapIcon,
} from "@/components/product-template";

/**
 * JARVIS DWSS Client Component
 *
 * Executes all m.*() translations client-side to stay responsive to locale changes.
 */
export default function JarvisDwssClient() {
  const featureVideos = {
    compliance: JARVIS_FEATURE_VIDEOS.dwss.feature1,
    automation: JARVIS_FEATURE_VIDEOS.dwss.feature2,
    deployment: JARVIS_FEATURE_VIDEOS.dwss.feature3,
  };

  // Metadata with icons - subtitles from feature detail titles
  const metadata: MetadataItem[] = [
    {
      title: m.jarvis_dwss_hero_meta1(), // "DEVB TC(W) 2/2023"
      subtitle: "DEVB Mandate",          // From feature1_detail1
      icon: <ShieldCheckIcon />,
    },
    {
      title: m.jarvis_dwss_hero_meta2(), // "Digital RISC & Diaries"
      subtitle: "Digital Transition",    // From feature1_detail2
      icon: <FileCheckIcon />,
    },
    {
      title: m.jarvis_dwss_hero_meta3(), // "70% Faster Approvals"
      subtitle: "Enhanced Efficiency",   // From feature1_detail3
      icon: <ZapIcon />,
    },
  ];

  return (
    <ProductPageLayout
      brandName="JARVIS"
      productName="DWSS"
      productSubtitle={m.jarvis_dwss_narrative_stage2()} // "The Digital Supervision Hub."
      videoSrc={JARVIS_VIDEOS.dwss}
      posterSrc={JARVIS_POSTERS.dwss}
      metadata={metadata}
      narrativeStage1={m.jarvis_dwss_narrative_stage1()}
      narrativeStage2={m.jarvis_dwss_narrative_stage2()}
      narrativeDesc={m.jarvis_dwss_narrative_desc()}
      narrativeHighlight={m.jarvis_dwss_narrative_highlight()}
      scrollPrompt={m.jarvis_dwss_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_dwss_feature1_title_line1(),
            m.jarvis_dwss_feature1_title_line2(),
          ],
          description: m.jarvis_dwss_feature1_desc(),
          mediaSrc: featureVideos.compliance,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.dwss,
          videoLabel: m.jarvis_dwss_toggle_video(),
          detailsLabel: m.jarvis_dwss_toggle_details(),
          details: [
            {
              title: m.jarvis_dwss_feature1_detail1_title(),
              description: m.jarvis_dwss_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_dwss_feature1_detail2_title(),
              description: m.jarvis_dwss_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_dwss_feature1_detail3_title(),
              description: m.jarvis_dwss_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_dwss_feature2_title_line1(),
            m.jarvis_dwss_feature2_title_line2(),
          ],
          description: m.jarvis_dwss_feature2_desc(),
          mediaSrc: featureVideos.automation,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.dwss,
          videoLabel: m.jarvis_dwss_toggle_video(),
          detailsLabel: m.jarvis_dwss_toggle_details(),
          details: [
            {
              title: m.jarvis_dwss_feature2_detail1_title(),
              description: m.jarvis_dwss_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_dwss_feature2_detail2_title(),
              description: m.jarvis_dwss_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_dwss_feature2_detail3_title(),
              description: m.jarvis_dwss_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_dwss_feature3_title_line1(),
            m.jarvis_dwss_feature3_title_line2(),
          ],
          description: m.jarvis_dwss_feature3_desc(),
          mediaSrc: featureVideos.deployment,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.dwss,
          videoLabel: m.jarvis_dwss_toggle_video(),
          detailsLabel: m.jarvis_dwss_toggle_details(),
          details: [
            {
              title: m.jarvis_dwss_feature3_detail1_title(),
              description: m.jarvis_dwss_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_dwss_feature3_detail2_title(),
              description: m.jarvis_dwss_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_dwss_feature3_detail3_title(),
              description: m.jarvis_dwss_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
