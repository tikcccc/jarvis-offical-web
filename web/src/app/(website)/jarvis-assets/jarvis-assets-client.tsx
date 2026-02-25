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
  EyeIcon,
  ActivityIcon,
  TrendingUpIcon,
} from "@/components/product-template";

/**
 * JARVIS Assets Client Component
 *
 * Executes all m.*() translations client-side to stay responsive to locale changes.
 */
export default function JarvisAssetsClient() {
  const featureVideos = {
    portfolio: JARVIS_FEATURE_VIDEOS.assets.feature1,
    predictive: JARVIS_FEATURE_VIDEOS.assets.feature2,
    esg: JARVIS_FEATURE_VIDEOS.assets.feature3,
  };

  // Metadata with icons - subtitles from feature detail titles
  const metadata: MetadataItem[] = [
    {
      title: m.jarvis_assets_hero_meta1(), // "Portfolio Visibility"
      subtitle: "Unified Estate",          // From feature1_detail1
      icon: <EyeIcon />,
    },
    {
      title: m.jarvis_assets_hero_meta2(), // "Predictive Ops"
      subtitle: "Predictive Maintenance",  // From feature2_detail2
      icon: <ActivityIcon />,
    },
    {
      title: m.jarvis_assets_hero_meta3(), // "ESG Finance"
      subtitle: "Capital Advantage",       // From feature3_detail3
      icon: <TrendingUpIcon />,
    },
  ];

  return (
    <ProductPageLayout
      brandName="JARVIS"
      productName="ASSETS"
      productSubtitle={m.jarvis_assets_narrative_stage2()} // "Predictive Estate Intelligence"
      videoSrc={JARVIS_VIDEOS.assets}
      posterSrc={JARVIS_POSTERS.assets}
      metadata={metadata}
      narrativeStage1={m.jarvis_assets_narrative_stage1()}
      narrativeStage2={m.jarvis_assets_narrative_stage2()}
      narrativeDesc={m.jarvis_assets_narrative_desc()}
      narrativeHighlight={m.jarvis_assets_narrative_highlight()}
      scrollPrompt={m.jarvis_assets_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_assets_feature1_title_line1(),
            m.jarvis_assets_feature1_title_line2(),
          ],
          description: m.jarvis_assets_feature1_desc(),
          mediaSrc: featureVideos.portfolio,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.assets,
          videoLabel: m.jarvis_assets_toggle_video(),
          detailsLabel: m.jarvis_assets_toggle_details(),
          details: [
            {
              title: m.jarvis_assets_feature1_detail1_title(),
              description: m.jarvis_assets_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_assets_feature1_detail2_title(),
              description: m.jarvis_assets_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_assets_feature1_detail3_title(),
              description: m.jarvis_assets_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_assets_feature2_title_line1(),
            m.jarvis_assets_feature2_title_line2(),
          ],
          description: m.jarvis_assets_feature2_desc(),
          mediaSrc: featureVideos.predictive,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.assets,
          videoLabel: m.jarvis_assets_toggle_video(),
          detailsLabel: m.jarvis_assets_toggle_details(),
          details: [
            {
              title: m.jarvis_assets_feature2_detail1_title(),
              description: m.jarvis_assets_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_assets_feature2_detail2_title(),
              description: m.jarvis_assets_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_assets_feature2_detail3_title(),
              description: m.jarvis_assets_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_assets_feature3_title_line1(),
            m.jarvis_assets_feature3_title_line2(),
          ],
          description: m.jarvis_assets_feature3_desc(),
          mediaSrc: featureVideos.esg,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.assets,
          videoLabel: m.jarvis_assets_toggle_video(),
          detailsLabel: m.jarvis_assets_toggle_details(),
          details: [
            {
              title: m.jarvis_assets_feature3_detail1_title(),
              description: m.jarvis_assets_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_assets_feature3_detail2_title(),
              description: m.jarvis_assets_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_assets_feature3_detail3_title(),
              description: m.jarvis_assets_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
