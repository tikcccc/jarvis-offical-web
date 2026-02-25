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
  ScanIcon,
  AlertTriangleIcon,
  EyeIcon,
} from "@/components/product-template";

/**
 * JARVIS Eagle Eye Client Component
 *
 * Client-side wrapper that executes all m.*() translations in the browser.
 * This keeps translations responsive to locale changes without server re-render.
 */
export default function JarvisEagleEyeClient() {
  const featureVideos = {
    capture: JARVIS_FEATURE_VIDEOS.eagleEye.feature1,
    detection: JARVIS_FEATURE_VIDEOS.eagleEye.feature2,
    collaboration: JARVIS_FEATURE_VIDEOS.eagleEye.feature3,
  };

  // Metadata with icons - subtitles from feature detail titles
  const metadata: MetadataItem[] = [
    {
      title: m.jarvis_eagle_eye_hero_meta1(), // "360° Capture"
      subtitle: "Auto-Mapping",               // From feature1_detail2
      icon: <ScanIcon />,
    },
    {
      title: m.jarvis_eagle_eye_hero_meta2(), // "AI Anomaly Alerts"
      subtitle: "Instant Detection",          // From feature2_detail1
      icon: <AlertTriangleIcon />,
    },
    {
      title: m.jarvis_eagle_eye_hero_meta3(), // "Remote Monitoring"
      subtitle: "Remote Tracking",            // From feature1_detail3
      icon: <EyeIcon />,
    },
  ];

  return (
    <ProductPageLayout
      brandName="JARVIS"
      productName="EAGLE EYE"
      productSubtitle={m.jarvis_eagle_eye_narrative_stage2()} // "Absolute Digital Visibility"
      videoSrc={JARVIS_VIDEOS.eagleEye}
      posterSrc={JARVIS_POSTERS.eagleEye}
      metadata={metadata}
      narrativeStage1={m.jarvis_eagle_eye_narrative_stage1()}
      narrativeStage2={m.jarvis_eagle_eye_narrative_stage2()}
      narrativeDesc={m.jarvis_eagle_eye_narrative_desc()}
      narrativeHighlight={m.jarvis_eagle_eye_narrative_highlight()}
      scrollPrompt={m.jarvis_eagle_eye_scroll_prompt()}
      features={[
        {
          index: "0.1",
          title: [
            m.jarvis_eagle_eye_feature1_title_line1(),
            m.jarvis_eagle_eye_feature1_title_line2(),
          ],
          description: m.jarvis_eagle_eye_feature1_desc(),
          mediaSrc: featureVideos.capture,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.eagleEye,
          videoLabel: m.jarvis_eagle_eye_toggle_video(),
          detailsLabel: m.jarvis_eagle_eye_toggle_details(),
          details: [
            {
              title: m.jarvis_eagle_eye_feature1_detail1_title(),
              description: m.jarvis_eagle_eye_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_eagle_eye_feature1_detail2_title(),
              description: m.jarvis_eagle_eye_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_eagle_eye_feature1_detail3_title(),
              description: m.jarvis_eagle_eye_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: "0.2",
          title: [
            m.jarvis_eagle_eye_feature2_title_line1(),
            m.jarvis_eagle_eye_feature2_title_line2(),
          ],
          description: m.jarvis_eagle_eye_feature2_desc(),
          mediaSrc: featureVideos.detection,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.eagleEye,
          videoLabel: m.jarvis_eagle_eye_toggle_video(),
          detailsLabel: m.jarvis_eagle_eye_toggle_details(),
          details: [
            {
              title: m.jarvis_eagle_eye_feature2_detail1_title(),
              description: m.jarvis_eagle_eye_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_eagle_eye_feature2_detail2_title(),
              description: m.jarvis_eagle_eye_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_eagle_eye_feature2_detail3_title(),
              description: m.jarvis_eagle_eye_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: "0.3",
          title: [
            m.jarvis_eagle_eye_feature3_title_line1(),
            m.jarvis_eagle_eye_feature3_title_line2(),
          ],
          description: m.jarvis_eagle_eye_feature3_desc(),
          mediaSrc: featureVideos.collaboration,
          mediaType: "video",
          mediaPoster: JARVIS_POSTERS.eagleEye,
          videoLabel: m.jarvis_eagle_eye_toggle_video(),
          detailsLabel: m.jarvis_eagle_eye_toggle_details(),
          details: [
            {
              title: m.jarvis_eagle_eye_feature3_detail1_title(),
              description: m.jarvis_eagle_eye_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_eagle_eye_feature3_detail2_title(),
              description: m.jarvis_eagle_eye_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_eagle_eye_feature3_detail3_title(),
              description: m.jarvis_eagle_eye_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
