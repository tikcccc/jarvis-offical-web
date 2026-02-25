'use client';

import {
  JARVIS_VIDEOS,
  JARVIS_POSTERS,
  JARVIS_FEATURE_VIDEOS,
} from '@/lib/media-config';
import { AgentPageLayout } from '@/components/agent/agent-page-layout';
import * as m from '@/paraglide/messages';
import {
  type MetadataItem,
  CheckCircleIcon,
  CpuIcon,
  ShieldCheckIcon,
} from '@/components/product-template';

export default function AgentClient() {
  const featureVideos = JARVIS_FEATURE_VIDEOS.agent;

  // Metadata with icons - subtitles from feature details
  const metadata: MetadataItem[] = [
    {
      title: m.jarvis_agent_hero_meta1(),
      subtitle: m.jarvis_agent_feature1_detail3_title(), // From feature1 detail3
      icon: <CheckCircleIcon />,
    },
    {
      title: m.jarvis_agent_hero_meta2(),
      subtitle: m.jarvis_agent_feature1_detail1_title(), // From feature1 detail1
      icon: <CpuIcon />,
    },
    {
      title: m.jarvis_agent_hero_meta3(),
      subtitle: m.jarvis_agent_feature2_detail3_title(), // From feature2 detail3
      icon: <ShieldCheckIcon />,
    },
  ];

  return (
    <AgentPageLayout
      brandName="JARVIS"
      productName="AGENT"
      productSubtitle={m.jarvis_agent_narrative_stage2()} // From narrativeStage2
      videoSrc={JARVIS_VIDEOS.agent}
      posterSrc={JARVIS_POSTERS.agent}
      metadata={metadata}
      narrativeStage1={m.jarvis_agent_narrative_stage1()}
      narrativeStage2={m.jarvis_agent_narrative_stage2()}
      narrativeDesc={m.jarvis_agent_narrative_desc()}
      narrativeHighlight={m.jarvis_agent_narrative_highlight()}
      scrollPrompt={m.jarvis_agent_scroll_prompt()}
      features={[
        {
          index: '0.1',
          title: [m.jarvis_agent_feature1_title_line1()],
          description: m.jarvis_agent_feature1_desc(),
          mediaSrc: featureVideos.feature1,
          mediaType: 'video',
          mediaPoster: JARVIS_POSTERS.agent,
          videoLabel: m.jarvis_agent_toggle_video(),
          detailsLabel: m.jarvis_agent_toggle_details(),
          details: [
            {
              title: m.jarvis_agent_feature1_detail1_title(),
              description: m.jarvis_agent_feature1_detail1_desc(),
            },
            {
              title: m.jarvis_agent_feature1_detail2_title(),
              description: m.jarvis_agent_feature1_detail2_desc(),
            },
            {
              title: m.jarvis_agent_feature1_detail3_title(),
              description: m.jarvis_agent_feature1_detail3_desc(),
            },
          ],
        },
        {
          index: '0.2',
          title: [m.jarvis_agent_feature2_title_line1()],
          description: m.jarvis_agent_feature2_desc(),
          mediaSrc: featureVideos.feature2,
          mediaType: 'video',
          mediaPoster: JARVIS_POSTERS.agent,
          videoLabel: m.jarvis_agent_toggle_video(),
          detailsLabel: m.jarvis_agent_toggle_details(),
          details: [
            {
              title: m.jarvis_agent_feature2_detail1_title(),
              description: m.jarvis_agent_feature2_detail1_desc(),
            },
            {
              title: m.jarvis_agent_feature2_detail2_title(),
              description: m.jarvis_agent_feature2_detail2_desc(),
            },
            {
              title: m.jarvis_agent_feature2_detail3_title(),
              description: m.jarvis_agent_feature2_detail3_desc(),
            },
          ],
        },
        {
          index: '0.3',
          title: [m.jarvis_agent_feature3_title_line1()],
          description: m.jarvis_agent_feature3_desc(),
          mediaSrc: featureVideos.feature3,
          mediaType: 'video',
          mediaPoster: JARVIS_POSTERS.agent,
          videoLabel: m.jarvis_agent_toggle_video(),
          detailsLabel: m.jarvis_agent_toggle_details(),
          details: [
            {
              title: m.jarvis_agent_feature3_detail1_title(),
              description: m.jarvis_agent_feature3_detail1_desc(),
            },
            {
              title: m.jarvis_agent_feature3_detail2_title(),
              description: m.jarvis_agent_feature3_detail2_desc(),
            },
            {
              title: m.jarvis_agent_feature3_detail3_title(),
              description: m.jarvis_agent_feature3_detail3_desc(),
            },
          ],
        },
      ]}
    />
  );
}
