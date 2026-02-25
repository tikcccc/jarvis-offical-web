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
  DatabaseIcon,
  LayersIcon,
  CloudIcon,
} from "@/components/product-template";

/**
 * JARVIS CDCP Client Component
 *
 * Executes all m.*() translations client-side to stay responsive to locale changes.
 */
export default function JarvisCdcpClient() {
  const featureVideos = {
    singleSource: JARVIS_FEATURE_VIDEOS.cdcp.feature1,
    bim: JARVIS_FEATURE_VIDEOS.cdcp.feature2,
    availability: JARVIS_FEATURE_VIDEOS.cdcp.feature3,
  };

  // Metadata with icons - subtitles from feature detail titles
  const metadata: MetadataItem[] = [
    {
      title: m.jarvis_cdcp_hero_meta1(), // "Single Source of Truth"
      subtitle: "Single Source",         // From feature1_detail1
      icon: <DatabaseIcon />,
    },
    {
      title: m.jarvis_cdcp_hero_meta2(), // "BIM-Native Access"
      subtitle: "In-Browser BIM",        // From feature2_detail1
      icon: <LayersIcon />,
    },
    {
      title: m.jarvis_cdcp_hero_meta3(), // "99.99% Uptime"
      subtitle: "High Availability",     // From feature3_detail3
      icon: <CloudIcon />,
    },
  ];

  return (
    <ProductPageLayout
      brandName="JARVIS"
      productName="CDCP"
      productSubtitle={m.jarvis_cdcp_narrative_stage2()} // "The Single Source of Truth"
      videoSrc={JARVIS_VIDEOS.cdcp}
      posterSrc={JARVIS_POSTERS.cdcp}
      metadata={metadata}
      narrativeStage1={m.jarvis_cdcp_narrative_stage1()}
      narrativeStage2={m.jarvis_cdcp_narrative_stage2()}
      narrativeDesc={m.jarvis_cdcp_narrative_desc()}
      narrativeHighlight={m.jarvis_cdcp_narrative_highlight()}
      scrollPrompt={m.jarvis_cdcp_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_cdcp_feature1_title_line1(),
            m.jarvis_cdcp_feature1_title_line2(),
          ],
          description: m.jarvis_cdcp_feature1_desc(),
          mediaSrc: featureVideos.singleSource,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.cdcp,
          videoLabel: m.jarvis_cdcp_toggle_video(),
          detailsLabel: m.jarvis_cdcp_toggle_details(),
          details: [
            {
              title: m.jarvis_cdcp_feature1_detail1_title(),
              description: m.jarvis_cdcp_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_cdcp_feature1_detail2_title(),
              description: m.jarvis_cdcp_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_cdcp_feature1_detail3_title(),
              description: m.jarvis_cdcp_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_cdcp_feature2_title_line1(),
            m.jarvis_cdcp_feature2_title_line2(),
          ],
          description: m.jarvis_cdcp_feature2_desc(),
          mediaSrc: featureVideos.bim,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.cdcp,
          videoLabel: m.jarvis_cdcp_toggle_video(),
          detailsLabel: m.jarvis_cdcp_toggle_details(),
          details: [
            {
              title: m.jarvis_cdcp_feature2_detail1_title(),
              description: m.jarvis_cdcp_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_cdcp_feature2_detail2_title(),
              description: m.jarvis_cdcp_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_cdcp_feature2_detail3_title(),
              description: m.jarvis_cdcp_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_cdcp_feature3_title_line1(),
            m.jarvis_cdcp_feature3_title_line2(),
          ],
          description: m.jarvis_cdcp_feature3_desc(),
          mediaSrc: featureVideos.availability,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.cdcp,
          videoLabel: m.jarvis_cdcp_toggle_video(),
          detailsLabel: m.jarvis_cdcp_toggle_details(),
          details: [
            {
              title: m.jarvis_cdcp_feature3_detail1_title(),
              description: m.jarvis_cdcp_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_cdcp_feature3_detail2_title(),
              description: m.jarvis_cdcp_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_cdcp_feature3_detail3_title(),
              description: m.jarvis_cdcp_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
