/**
 * Services Data
 *
 * 用途：
 * - 存儲isBIM提供的額外服務的靜態數據
 * - Services & Products頁面展示所有服務和AI產品
 *
 * 包含的服務：
 * 1. JARVIS AI Suite - AI平台
 * 2. JARVIS Project Management (JPM) - 項目管理服務
 * 3. BIM Consultancy - BIM咨詢服務
 * 4. Project Finance - 項目融資服務
 * 5. Venture Investments - 風險投資服務
 */

import {
  Brain,
  Kanban,
  Box,
  Banknote,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import * as messages from "@/paraglide/messages";

type MessageKey = keyof typeof messages;

const translateMessage = (key?: MessageKey): string => {
  if (!key) return "";
  const messageFn = messages[key];
  return typeof messageFn === "function" ? (messageFn as () => string)() : key;
};

export interface ServiceData {
  id: string;
  href: string;
  image: string;
  typeKey: MessageKey;
  titleKey: MessageKey;
  headerDescriptionKey: MessageKey;
  descriptionKey: MessageKey;
  ctaTextKey: MessageKey;
  icon: LucideIcon;
  gridArea: string;
  height: string;
}

export const servicesData: ServiceData[] = [
  {
    id: "jarvis-suite",
    href: ROUTES.JARVIS.SUITE,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    typeKey: "services_card_jarvis_suite_type",
    titleKey: "services_card_jarvis_suite_title",
    headerDescriptionKey: "services_card_jarvis_suite_header",
    descriptionKey: "services_card_jarvis_suite_description",
    ctaTextKey: "services_card_jarvis_suite_cta",
    icon: Brain,
    gridArea: "md:col-span-12 lg:col-span-8",
    height: "h-120 md:h-[32rem]",
  },
  {
    id: "jarvis-pm",
    href: ROUTES.JARVIS.JPM,
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
    typeKey: "services_card_jarvis_pm_type",
    titleKey: "services_card_jarvis_pm_title",
    headerDescriptionKey: "services_card_jarvis_pm_header",
    descriptionKey: "services_card_jarvis_pm_description",
    ctaTextKey: "services_card_jarvis_pm_cta",
    icon: Kanban,
    gridArea: "md:col-span-6 lg:col-span-4",
    height: "h-120 md:h-[32rem]",
  },
  {
    id: "bim-consultancy",
    href: ROUTES.BIM_CONSULTANCY,
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop",
    typeKey: "services_card_bim_type",
    titleKey: "services_card_bim_title",
    headerDescriptionKey: "services_card_bim_header",
    descriptionKey: "services_card_bim_description",
    ctaTextKey: "services_card_bim_cta",
    icon: Box,
    gridArea: "md:col-span-6 lg:col-span-4",
    height: "h-110",
  },
  {
    id: "project-finance",
    href: ROUTES.PROJECT_FINANCE,
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
    typeKey: "services_card_finance_type",
    titleKey: "services_card_finance_title",
    headerDescriptionKey: "services_card_finance_header",
    descriptionKey: "services_card_finance_description",
    ctaTextKey: "services_card_finance_cta",
    icon: Banknote,
    gridArea: "md:col-span-6 lg:col-span-4",
    height: "h-110",
  },
  {
    id: "venture-investments",
    href: ROUTES.VENTURE_INVESTMENTS,
    image:
      "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=1000&auto=format&fit=crop",
    typeKey: "services_card_venture_type",
    titleKey: "services_card_venture_title",
    headerDescriptionKey: "services_card_venture_header",
    descriptionKey: "services_card_venture_description",
    ctaTextKey: "services_card_venture_cta",
    icon: Rocket,
    gridArea: "md:col-span-12 lg:col-span-4",
    height: "h-110",
  },
];

export type ServiceTab = "JPM" | "BIM" | "VENTURES" | "FINANCE";

export type ServiceSeoKey = "jpm" | "bim" | "venture" | "finance";

export interface ServiceContent {
  statsIntro: string;
  hero: {
    title: string;
    subTitle: string;
    desc: string;
    tag: string;
    img: string;
  };
  narrative: {
    label: string;
    lead: string;
    sub: string;
    p1: string;
    p2: string;
  };
  timeline?: {
    heading: string;
    items: { year: string; title: string; desc: string; isNow?: boolean }[];
  };
  engine: { id: string; title: string; desc: string }[];
  stats: {
    intro: string;
    label: string;
    main: { val: string; label: string };
    grid: { val: string; label: string }[];
    comparison?: { before: string; after: string; label: string }[];
  };
  gallery: {
    title: string;
    meta: string;
    items: { id: string; loc: string; title: string; desc: string; metric: string; img: string; href?: string }[];
  };
}

interface ServiceContentDefinition {
  statsIntro: MessageKey;
  hero: {
    title: MessageKey;
    subTitle: MessageKey;
    desc: MessageKey;
    tag: MessageKey;
    img: string;
  };
  narrative: {
    label: MessageKey;
    lead: MessageKey;
    sub: MessageKey;
    p1: MessageKey;
    p2: MessageKey;
  };
  timeline?: {
    heading: MessageKey;
    items: { year: MessageKey; title: MessageKey; desc: MessageKey; isNow?: boolean }[];
  };
  engine: { id: string; title: MessageKey; desc: MessageKey }[];
  stats: {
    intro?: MessageKey;
    label: MessageKey;
    main: { val: string; label: MessageKey };
    grid: { val: string; label: MessageKey }[];
    comparison?: { before: string; after: string; label: MessageKey }[];
  };
  gallery: {
    title: MessageKey;
    meta: MessageKey;
    items: { id: string; loc: string; title: MessageKey; desc: MessageKey; metric: MessageKey; img: string; href?: string }[];
  };
}

type ServiceMetaDefinition = {
  seoKey: ServiceSeoKey;
  titleKey: MessageKey;
  descriptionKey: MessageKey;
};

export type ServiceMetaEntry = {
  seoKey: ServiceSeoKey;
  title: string;
  description: string;
};

export const SERVICE_CONTENT: Record<ServiceTab, ServiceContentDefinition> = {
  JPM: {
    statsIntro: "service_jpm_stats_intro",
    hero: {
      title: "service_jpm_hero_title",
      subTitle: "service_jpm_hero_subtitle",
      desc: "service_jpm_hero_desc",
      tag: "service_jpm_hero_tag",
      img: "/images/services/jpm/hero.png",
    },
    narrative: {
      label: "service_jpm_narrative_label",
      lead: "service_jpm_narrative_lead",
      sub: "service_jpm_narrative_sub",
      p1: "service_jpm_narrative_p1",
      p2: "service_jpm_narrative_p2",
    },
    engine: [
      { id: "01", title: "service_jpm_engine_1_title", desc: "service_jpm_engine_1_desc" },
      { id: "02", title: "service_jpm_engine_2_title", desc: "service_jpm_engine_2_desc" },
      { id: "03", title: "service_jpm_engine_3_title", desc: "service_jpm_engine_3_desc" },
      { id: "04", title: "service_jpm_engine_4_title", desc: "service_jpm_engine_4_desc" },
    ],
    stats: {
      intro: "service_jpm_stats_intro",
      label: "service_jpm_stats_label",
      main: { val: "70-80%", label: "service_jpm_stats_main_label" },
      grid: [
        { val: "-45%", label: "service_jpm_stats_grid_1_label" },
        { val: "5%", label: "service_jpm_stats_grid_2_label" },
        { val: "19%", label: "service_jpm_stats_grid_3_label" },
        { val: "24m", label: "service_jpm_stats_grid_4_label" },
      ],
      comparison: [
        { before: "68%", after: "19%", label: "service_jpm_comparison_overruns" },
        { before: "18%", after: "5%", label: "service_jpm_comparison_defects" },
        { before: "36m", after: "24m", label: "service_jpm_comparison_cash" },
        { before: "100%", after: "55-70%", label: "service_jpm_comparison_delivery" },
      ],
    },
    gallery: {
      title: "service_jpm_gallery_title",
      meta: "service_jpm_gallery_meta",
      items: [
        {
          id: "01",
          loc: "CAMEROON",
          title: "service_jpm_gallery_item_1_title",
          desc: "service_jpm_gallery_item_1_desc",
          metric: "service_jpm_gallery_item_1_metric",
          img: "/images/services/jpm/gallery-1.png",
        },
        {
          id: "02",
          loc: "NIGERIA",
          title: "service_jpm_gallery_item_2_title",
          desc: "service_jpm_gallery_item_2_desc",
          metric: "service_jpm_gallery_item_2_metric",
          img: "/images/services/jpm/gallery-2.jpg",
        },
      ],
    },
  },
  BIM: {
    statsIntro: "service_bim_stats_intro",
    hero: {
      title: "service_bim_hero_title",
      subTitle: "service_bim_hero_subtitle",
      desc: "service_bim_hero_desc",
      tag: "service_bim_hero_tag",
      img: "/images/services/bim/hero.png",
    },
    narrative: {
      label: "service_bim_narrative_label",
      lead: "service_bim_narrative_lead",
      sub: "service_bim_narrative_sub",
      p1: "service_bim_narrative_p1",
      p2: "service_bim_narrative_p2",
    },
    timeline: {
      heading: "service_bim_timeline_heading",
      items: [
        { year: "service_bim_timeline_item_1_year", title: "service_bim_timeline_item_1_title", desc: "service_bim_timeline_item_1_desc" },
        { year: "service_bim_timeline_item_2_year", title: "service_bim_timeline_item_2_title", desc: "service_bim_timeline_item_2_desc" },
        { year: "service_bim_timeline_item_3_year", title: "service_bim_timeline_item_3_title", desc: "service_bim_timeline_item_3_desc" },
        { year: "service_bim_timeline_item_4_year", title: "service_bim_timeline_item_4_title", desc: "service_bim_timeline_item_4_desc", isNow: true },
      ],
    },
    engine: [
      { id: "01", title: "service_bim_engine_1_title", desc: "service_bim_engine_1_desc" },
      { id: "02", title: "service_bim_engine_2_title", desc: "service_bim_engine_2_desc" },
      { id: "03", title: "service_bim_engine_3_title", desc: "service_bim_engine_3_desc" },
      { id: "04", title: "service_bim_engine_4_title", desc: "service_bim_engine_4_desc" },
    ],
    stats: {
      intro: "service_bim_stats_intro",
      label: "service_bim_stats_label",
      main: { val: "75%", label: "service_bim_stats_main_label" },
      grid: [
        { val: "HK$30M+", label: "service_bim_stats_grid_1_label" },
        { val: "72%", label: "service_bim_stats_grid_2_label" },
        { val: "30-45%", label: "service_bim_stats_grid_3_label" },
        { val: "2,600+", label: "service_bim_stats_grid_4_label" },
      ],
    },
    gallery: {
      title: "service_bim_gallery_title",
      meta: "service_bim_gallery_meta",
      items: [
        {
          id: "01",
          loc: "HONG KONG",
          title: "service_bim_gallery_item_1_title",
          desc: "service_bim_gallery_item_1_desc",
          metric: "service_bim_gallery_item_1_metric",
          img: "/images/services/bim/gallery-1.png",
        },
        {
          id: "02",
          loc: "INFRASTRUCTURE",
          title: "service_bim_gallery_item_2_title",
          desc: "service_bim_gallery_item_2_desc",
          metric: "service_bim_gallery_item_2_metric",
          img: "/images/services/bim/gallery-2.png",
        },
      ],
    },
  },
  VENTURES: {
    statsIntro: "service_venture_stats_intro",
    hero: {
      title: "service_venture_hero_title",
      subTitle: "service_venture_hero_subtitle",
      desc: "service_venture_hero_desc",
      tag: "service_venture_hero_tag",
      img: "/images/services/ventures/hero.jpeg",
    },
    narrative: {
      label: "service_venture_narrative_label",
      lead: "service_venture_narrative_lead",
      sub: "service_venture_narrative_sub",
      p1: "service_venture_narrative_p1",
      p2: "service_venture_narrative_p2",
    },
    engine: [
      { id: "01", title: "service_venture_engine_1_title", desc: "service_venture_engine_1_desc" },
      { id: "02", title: "service_venture_engine_2_title", desc: "service_venture_engine_2_desc" },
      { id: "03", title: "service_venture_engine_3_title", desc: "service_venture_engine_3_desc" },
      { id: "04", title: "service_venture_engine_4_title", desc: "service_venture_engine_4_desc" },
    ],
    stats: {
      intro: "service_venture_stats_intro",
      label: "service_venture_stats_label",
      main: { val: "2,600+", label: "service_venture_stats_main_label" },
      grid: [
        { val: "1.2B", label: "service_venture_stats_grid_1_label" },
        { val: "8,000+", label: "service_venture_stats_grid_2_label" },
        { val: "20 Yrs", label: "service_venture_stats_grid_3_label" },
        { val: "Global", label: "service_venture_stats_grid_4_label" },
      ],
    },
    gallery: {
      title: "service_venture_gallery_title",
      meta: "service_venture_gallery_meta",
      items: [
        {
          id: "01",
          loc: "IT CONSULTING",
          title: "service_venture_gallery_item_1_title",
          desc: "service_venture_gallery_item_1_desc",
          metric: "service_venture_gallery_item_1_metric",
          img: "/images/services/ventures/gallery-1.jpg",
          href: "https://www.accentrix.com/",
        },
        {
          id: "02",
          loc: "DATA SAAS",
          title: "service_venture_gallery_item_2_title",
          desc: "service_venture_gallery_item_2_desc",
          metric: "service_venture_gallery_item_2_metric",
          img: "/images/services/ventures/gallery-2.jpg",
          href: "https://www.jarvisdt.com/",
        },
        {
          id: "03",
          loc: "BIM INFRASTRUCTURE",
          title: "service_venture_gallery_item_3_title",
          desc: "service_venture_gallery_item_3_desc",
          metric: "service_venture_gallery_item_3_metric",
          img: "/images/services/ventures/gallery-3.jpg",
          href: "http://www.bimstack.net/#/",
        },
      ],
    },
  },
  FINANCE: {
    statsIntro: "service_finance_stats_intro",
    hero: {
      title: "service_finance_hero_title",
      subTitle: "service_finance_hero_subtitle",
      desc: "service_finance_hero_desc",
      tag: "service_finance_hero_tag",
      img: "/images/services/finance/hero.jpg",
    },
    narrative: {
      label: "service_finance_narrative_label",
      lead: "service_finance_narrative_lead",
      sub: "service_finance_narrative_sub",
      p1: "service_finance_narrative_p1",
      p2: "service_finance_narrative_p2",
    },
    engine: [
      { id: "01", title: "service_finance_engine_1_title", desc: "service_finance_engine_1_desc" },
      { id: "02", title: "service_finance_engine_2_title", desc: "service_finance_engine_2_desc" },
      { id: "03", title: "service_finance_engine_3_title", desc: "service_finance_engine_3_desc" },
      { id: "04", title: "service_finance_engine_4_title", desc: "service_finance_engine_4_desc" },
    ],
    stats: {
      intro: "service_finance_stats_intro",
      label: "service_finance_stats_label",
      main: { val: "10+ Years", label: "service_finance_stats_main_label" },
      grid: [
        { val: "Live", label: "service_finance_stats_grid_1_label" },
        { val: "Audited", label: "service_finance_stats_grid_2_label" },
        { val: "Bankable", label: "service_finance_stats_grid_3_label" },
        { val: "In-Kind", label: "service_finance_stats_grid_4_label" },
      ],
    },
    gallery: {
      title: "service_finance_gallery_title",
      meta: "service_finance_gallery_meta",
      items: [
        {
          id: "01",
          loc: "DIGITAL INFRA",
          title: "service_finance_gallery_item_2_title",
          desc: "service_finance_gallery_item_2_desc",
          metric: "service_finance_gallery_item_2_metric",
          img: "/images/services/finance/gallery-1.jpg",
        },
        {
          id: "02",
          loc: "URBAN INFRA",
          title: "service_finance_gallery_item_3_title",
          desc: "service_finance_gallery_item_3_desc",
          metric: "service_finance_gallery_item_3_metric",
          img: "/images/services/finance/gallery-2.jpg",
        },
        {
          id: "03",
          loc: "GREEN ENERGY",
          title: "service_finance_gallery_item_1_title",
          desc: "service_finance_gallery_item_1_desc",
          metric: "service_finance_gallery_item_1_metric",
          img: "/images/services/finance/gallery-3.avif",
        },
      ],
    },
  },
};


export const SERVICE_META: Record<ServiceTab, ServiceMetaDefinition> = {
  JPM: {
    seoKey: "jpm",
    titleKey: "service_jpm_meta_title",
    descriptionKey: "service_jpm_meta_description",
  },
  BIM: {
    seoKey: "bim",
    titleKey: "service_bim_meta_title",
    descriptionKey: "service_bim_meta_description",
  },
  VENTURES: {
    seoKey: "venture",
    titleKey: "service_venture_meta_title",
    descriptionKey: "service_venture_meta_description",
  },
  FINANCE: {
    seoKey: "finance",
    titleKey: "service_finance_meta_title",
    descriptionKey: "service_finance_meta_description",
  },
};

export function getLocalizedServiceContent(tab: ServiceTab): ServiceContent {
  const base = SERVICE_CONTENT[tab];

  return {
    statsIntro: translateMessage(base.statsIntro),
    hero: {
      title: translateMessage(base.hero.title),
      subTitle: translateMessage(base.hero.subTitle),
      desc: translateMessage(base.hero.desc),
      tag: translateMessage(base.hero.tag),
      img: base.hero.img,
    },
    narrative: {
      label: translateMessage(base.narrative.label),
      lead: translateMessage(base.narrative.lead),
      sub: translateMessage(base.narrative.sub),
      p1: translateMessage(base.narrative.p1),
      p2: translateMessage(base.narrative.p2),
    },
    timeline: base.timeline
      ? {
          heading: translateMessage(base.timeline.heading),
          items: base.timeline.items.map((item) => ({
            year: translateMessage(item.year),
            title: translateMessage(item.title),
            desc: translateMessage(item.desc),
            isNow: item.isNow,
          })),
        }
      : undefined,
    engine: base.engine.map((item) => ({
      id: item.id,
      title: translateMessage(item.title),
      desc: translateMessage(item.desc),
    })),
    stats: {
      intro: translateMessage(base.stats.intro ?? base.statsIntro),
      label: translateMessage(base.stats.label),
      main: {
        val: base.stats.main.val,
        label: translateMessage(base.stats.main.label),
      },
      grid: base.stats.grid.map((item) => ({
        val: item.val,
        label: translateMessage(item.label),
      })),
      comparison: base.stats.comparison?.map((item) => ({
        before: item.before,
        after: item.after,
        label: translateMessage(item.label),
      })),
    },
    gallery: {
      title: translateMessage(base.gallery.title),
      meta: translateMessage(base.gallery.meta),
      items: base.gallery.items.map((item) => ({
        ...item,
        title: translateMessage(item.title),
        desc: translateMessage(item.desc),
        metric: translateMessage(item.metric),
      })),
    },
  };
}

export function getLocalizedServiceMeta(tab: ServiceTab): ServiceMetaEntry {
  const meta = SERVICE_META[tab];

  return {
    seoKey: meta.seoKey,
    title: translateMessage(meta.titleKey),
    description: translateMessage(meta.descriptionKey),
  };
}
