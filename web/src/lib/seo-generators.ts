/**
 * SEO Metadata Generators
 *
 * Intelligent SEO metadata generation with hierarchical keyword system
 * for isBIM official website.
 *
 * Core Strategy:
 * - Reinforce dual identity: AI Technology Company + Construction Technology Company
 * - Emphasize geographic location: Hong Kong / 香港
 * - Always include brand: isBIM
 * - Optimize for Google and Bing
 */

import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/constants";
import { COMMON_IMAGES } from "@/lib/media-config";

/**
 * Hierarchical Keyword System
 *
 * Level 1: Brand Identity (ALWAYS INCLUDE)
 * Level 2: Core Industries - Dual Identity (CRITICAL)
 * Level 3: Technology Categories
 * Level 4: Product/Service Specific
 * Level 5: Geographic/Market (ALWAYS INCLUDE Hong Kong)
 */
export const SEO_KEYWORDS = {
  // Level 1: Brand (REQUIRED - 必须包含)
  brand: ["isBIM", "isBIM Limited", "JARVIS", "JARVIS AI Suite"],

  // Level 2: Core Identity (CRITICAL - 双重身份)
  identity: [
    "AI technology company",
    "artificial intelligence company",
    "construction technology company",
    "construction AI platform",
    "building technology company",
    "ConTech company",
    "AI construction technology",
    "construction tech innovation",
  ],

  // Level 5: Geographic (REQUIRED - 必须包含)
  geographic: [
    "Hong Kong",
    "Hong Kong AI company",
    "Hong Kong construction technology",
    "Hong Kong ConTech",
    "Asia Pacific",
    "Belt and Road",
  ],

  // Geographic - Chinese (REQUIRED for Chinese pages)
  geographicZh: [
    "香港",
    "香港科技公司",
    "香港AI公司",
    "香港建筑科技",
    "香港AI科技",
  ],

  // Level 3: AI Technology
  aiTech: [
    "generative AI",
    "machine learning construction",
    "AI automation",
    "predictive analytics",
    "computer vision AI",
    "NLP construction",
    "artificial intelligence software",
  ],

  // Level 3: Construction Technology
  constructionTech: [
    "BIM technology",
    "digital twin",
    "construction automation",
    "smart construction",
    "modular construction",
    "construction management software",
    "building information modeling",
    "construction digital transformation",
  ],

  // Industry
  industry: [
    "construction industry",
    "infrastructure development",
    "building sector",
    "civil engineering",
    "project management",
    "construction innovation",
  ],

  // Level 4: Product-Specific Keywords
  products: {
    agent: [
      "AI invoice scanning",
      "tender parsing AI",
      "document automation",
      "construction admin automation",
      "email AI agent",
    ],
    pay: [
      "payment certification",
      "SOPL compliance",
      "construction payment",
      "cash flow management",
      "60-day payment certification",
      "digital twin payment",
    ],
    air: [
      "generative design AI",
      "architectural AI",
      "urban planning AI",
      "design automation",
      "AI architecture software",
    ],
    eagleEye: [
      "site monitoring",
      "IoT construction",
      "remote site inspection",
      "360 degree capture",
      "digital twin monitoring",
    ],
    ssss: [
      "site safety AI",
      "construction safety system",
      "accident prevention",
      "safety monitoring",
      "AI safety management",
    ],
    dwss: [
      "digital supervision",
      "compliance management",
      "workflow automation",
      "construction approval system",
    ],
    cdcp: [
      "data collaboration",
      "BIM coordination",
      "version control",
      "Common Data Collaboration Platform",
      "CDE platform",
    ],
    assets: [
      "facility management",
      "predictive maintenance",
      "ESG tracking",
      "building lifecycle management",
      "AI facility operations",
    ],
  },

  // Level 4: Service-Specific Keywords
  services: {
    jpm: [
      "project management",
      "construction delivery",
      "megaproject execution",
      "Belt and Road projects",
      "Hong Kong project management",
    ],
    bim: [
      "BIM consulting",
      "BIM implementation",
      "4D 5D simulation",
      "ISO 19650 compliance",
      "BIM services Hong Kong",
    ],
    finance: [
      "project finance",
      "infrastructure investment",
      "construction funding",
      "digital twin financing",
      "multilateral bank funding",
    ],
    venture: [
      "venture capital",
      "ConTech investment",
      "startup funding",
      "construction tech VC",
      "infrastructure innovation fund",
    ],
  },
} as const;

const PRODUCT_ROUTES: Record<keyof typeof SEO_KEYWORDS.products, string> = {
  agent: ROUTES.JARVIS.AGENT,
  pay: ROUTES.JARVIS.PAY,
  air: ROUTES.JARVIS.AIR,
  eagleEye: ROUTES.JARVIS.EAGLE_EYE,
  ssss: ROUTES.JARVIS.SSSS,
  dwss: ROUTES.JARVIS.DWSS,
  cdcp: ROUTES.JARVIS.CDCP,
  assets: ROUTES.JARVIS.ASSETS,
};

const SERVICE_ROUTES: Record<keyof typeof SEO_KEYWORDS.services, string> = {
  jpm: ROUTES.JARVIS.JPM,
  bim: ROUTES.BIM_CONSULTANCY,
  finance: ROUTES.PROJECT_FINANCE,
  venture: ROUTES.VENTURE_INVESTMENTS,
};

const PRODUCT_OG_IMAGES: Record<keyof typeof SEO_KEYWORDS.products, string> = {
  agent: "/images/og/jarvis-agent.jpg",
  pay: "/images/og/jarvis-pay.jpg",
  air: "/images/og/jarvis-air.jpg",
  eagleEye: "/images/og/jarvis-eagle-eye.jpg",
  ssss: "/images/og/jarvis-ssss.jpg",
  dwss: "/images/og/jarvis-dwss.jpg",
  cdcp: "/images/og/jarvis-cdcp.jpg",
  assets: "/images/og/jarvis-assets.jpg",
};

/**
 * Smart Keyword Composer
 *
 * Composes keywords based on page type with guaranteed inclusion of:
 * - Brand (isBIM)
 * - Dual identity (AI + Construction tech)
 * - Geographic (Hong Kong / 香港)
 *
 * @param pageType - Type of page
 * @param specific - Page-specific keywords
 * @param locale - Language locale (en/zh)
 * @returns Array of SEO keywords (max 20)
 */
export function composeKeywords(
  pageType: "home" | "product" | "service" | "about" | "newsroom" | "caseStudies" | "careers",
  specific: readonly string[] = [],
  locale: string = "en"
): string[] {
  // ALWAYS include brand + geographic
  const base: string[] = [
    ...SEO_KEYWORDS.brand.slice(0, 2), // isBIM, isBIM Limited
    ...SEO_KEYWORDS.geographic.slice(0, 3), // Hong Kong, Hong Kong AI company, Hong Kong construction technology
  ];

  // Add Chinese geographic keywords for Chinese pages
  if (locale === "zh") {
    base.push(...SEO_KEYWORDS.geographicZh.slice(0, 3));
  }

  // ALWAYS include dual identity
  const identity = SEO_KEYWORDS.identity.slice(0, 3);

  switch (pageType) {
    case "home":
      return [
        ...base,
        ...identity,
        ...SEO_KEYWORDS.aiTech.slice(0, 2),
        ...SEO_KEYWORDS.constructionTech.slice(0, 2),
        ...SEO_KEYWORDS.industry.slice(0, 2),
      ].slice(0, 20);

    case "product":
      return [
        ...base,
        ...identity.slice(0, 2),
        ...SEO_KEYWORDS.aiTech.slice(0, 2),
        ...specific.slice(0, 4),
      ].slice(0, 18);

    case "service":
      return [
        ...base,
        ...identity.slice(0, 2),
        ...SEO_KEYWORDS.constructionTech.slice(0, 2),
        ...SEO_KEYWORDS.industry.slice(0, 1),
        ...specific.slice(0, 4),
      ].slice(0, 18);

    case "about":
      return [
        ...base,
        ...identity, // Full identity emphasis
        ...SEO_KEYWORDS.geographic.slice(3, 5), // Add more geographic
        "company profile",
        "corporate information",
      ].slice(0, 20);

    case "newsroom":
      return [
        ...base.slice(0, 3),
        ...identity.slice(0, 2),
        "news",
        "press releases",
        "company updates",
        "construction technology news",
      ].slice(0, 15);

    case "caseStudies":
      return [
        ...base.slice(0, 3),
        ...identity.slice(0, 2),
        "case studies",
        "project portfolio",
        "project outcomes",
        "construction technology case studies",
      ].slice(0, 15);

    case "careers":
      return [
        ...base.slice(0, 3),
        ...identity.slice(0, 2),
        "careers",
        "jobs",
        "employment",
        "AI jobs Hong Kong",
        "construction tech jobs",
      ].slice(0, 15);

    default:
      return [...base, ...identity].slice(0, 10);
  }
}

/**
 * Generate Product Page SEO Metadata
 *
 * @param productKey - Product identifier (agent, pay, air, etc.)
 * @param title - Page title (from i18n)
 * @param description - Page description (from i18n)
 * @param locale - Language locale
 * @returns Next.js Metadata object
 */
export function generateProductPageSEO(
  productKey: keyof typeof SEO_KEYWORDS.products,
  title: string,
  description: string,
  locale: string = "en"
): Metadata {
  const keywords = composeKeywords(
    "product",
    SEO_KEYWORDS.products[productKey],
    locale
  );

  const enhancedTitle = locale === "zh"
    ? `${title} | AI 建筑科技 | isBIM 香港`
    : `${title} | AI Construction Technology | isBIM Hong Kong`;

  const enhancedDescription = locale === "zh"
    ? `${description} 先进的建筑行业 AI 技术。isBIM JARVIS AI 套件的一部分，香港领先的 AI 与建筑科技公司。`
    : `${description} Advanced AI technology for construction industry. Part of JARVIS AI Suite by isBIM, Hong Kong's leading AI and construction technology company.`;

  return generatePageMetadata({
    title: enhancedTitle,
    description: enhancedDescription,
    keywords,
    locale,
    path: PRODUCT_ROUTES[productKey],
    image: PRODUCT_OG_IMAGES[productKey] || COMMON_IMAGES.ctaBackground,
  });
}

/**
 * Generate Service Page SEO Metadata
 *
 * @param serviceKey - Service identifier (jpm, bim, finance, venture)
 * @param title - Page title (from i18n)
 * @param description - Page description (from i18n)
 * @param locale - Language locale
 * @returns Next.js Metadata object
 */
export function generateServicePageSEO(
  serviceKey: keyof typeof SEO_KEYWORDS.services,
  title: string,
  description: string,
  locale: string = "en"
): Metadata {
  const keywords = composeKeywords(
    "service",
    SEO_KEYWORDS.services[serviceKey],
    locale
  );

  const enhancedTitle = locale === "zh"
    ? `${title} | 建筑解决方案 | isBIM 香港`
    : `${title} | Construction Solutions | isBIM Hong Kong`;

  const enhancedDescription = locale === "zh"
    ? `${description} 结合 AI 技术与行业专业知识的专业建筑服务。isBIM 为全球基础设施项目提供创新解决方案，总部位于香港。`
    : `${description} Professional construction services combining AI technology and industry expertise. isBIM delivers innovative solutions for global infrastructure projects from Hong Kong.`;

  return generatePageMetadata({
    title: enhancedTitle,
    description: enhancedDescription,
    keywords,
    locale,
    path: SERVICE_ROUTES[serviceKey],
    image: "/images/og/services.jpg",
  });
}

/**
 * Generate About Page SEO Metadata
 *
 * @param locale - Language locale
 * @returns Next.js Metadata object
 */
export function generateAboutPageSEO(locale: string = "en"): Metadata {
  const keywords = composeKeywords("about", [], locale);

  if (locale === "zh") {
    return generatePageMetadata({
      title: "关于 isBIM | AI 与建筑科技公司 | 香港",
      description: "isBIM 是香港领先的 AI 科技公司和建筑科技公司。我们开发 JARVIS AI 套件，为全球基础设施项目提供创新的建筑解决方案。融合人工智能技术与建筑行业专业知识。",
      keywords,
      locale,
      path: "/about-us",
    });
  }

  return generatePageMetadata({
    title: "About isBIM | AI & Construction Technology Company | Hong Kong",
    description: "isBIM is Hong Kong's leading AI technology company and construction technology company. We develop JARVIS AI Suite and deliver innovative construction solutions for global infrastructure projects. Combining artificial intelligence with construction industry expertise.",
    keywords,
    locale,
    path: "/about-us",
  });
}

/**
 * Generate Services & Products Page SEO Metadata
 *
 * @param locale - Language locale
 * @returns Next.js Metadata object
 */
export function generateServicesPageSEO(locale: string = "en"): Metadata {
  // Combine product and service keywords
  const allProducts = Object.values(SEO_KEYWORDS.products).flat().slice(0, 6);
  const allServices = Object.values(SEO_KEYWORDS.services).flat().slice(0, 4);
  const specific = [...allProducts, ...allServices];

  const keywords = composeKeywords("service", specific, locale);

  if (locale === "zh") {
    return generatePageMetadata({
      title: "服务与 AI 产品 | isBIM 建筑解决方案 | 香港",
      description: "全面的建筑科技解决方案，结合 AI 产品（JARVIS 套件）和专业服务（JPM、BIM、融资、风投）。isBIM 从香港为全球提供更快速、更经济、更安全、更绿色的基础设施。AI 科技与建筑科技的完美融合。",
      keywords,
      locale,
      path: "/services-products",
      image: "/images/og/services.jpg",
    });
  }

  return generatePageMetadata({
    title: "Services & AI Products | isBIM Construction Solutions | Hong Kong",
    description: "Comprehensive construction technology solutions combining AI products (JARVIS Suite) and professional services (JPM, BIM, Finance, Ventures). isBIM delivers faster, cheaper, safer, greener infrastructure globally from Hong Kong. Perfect fusion of AI technology and construction technology.",
    keywords,
    locale,
    path: "/services-products",
    image: "/images/og/services.jpg",
  });
}

/**
 * Generate Newsroom Page SEO Metadata
 *
 * @param locale - Language locale
 * @returns Next.js Metadata object
 */
export function generateNewsroomPageSEO(locale: string = "en"): Metadata {
  const keywords = composeKeywords("newsroom", [], locale);

  if (locale === "zh") {
    return generatePageMetadata({
      title: "新闻中心 | isBIM 建筑科技新闻 | 香港",
      description: "isBIM 的最新新闻、公告和洞察。了解 JARVIS AI 套件的最新发展、项目里程碑和建筑科技创新。香港领先的 AI 与建筑科技公司动态。",
      keywords,
      locale,
      path: "/newsroom",
      image: "/images/og/newsroom.jpg",
    });
  }

  return generatePageMetadata({
    title: "Newsroom | isBIM Construction Technology News | Hong Kong",
    description: "Latest news, announcements, and insights from isBIM. Stay updated on JARVIS AI Suite developments, project milestones, and construction technology innovation. Updates from Hong Kong's leading AI and construction technology company.",
    keywords,
    locale,
    path: "/newsroom",
    image: "/images/og/newsroom.jpg",
  });
}

/**
 * Generate Case Studies Page SEO Metadata
 *
 * @param locale - Language locale
 * @returns Next.js Metadata object
 */
export function generateCaseStudiesPageSEO(locale: string = "en"): Metadata {
  const keywords = composeKeywords("caseStudies", [], locale);

  if (locale === "zh") {
    return generatePageMetadata({
      title: "案例中心 | isBIM 建筑科技案例 | 香港",
      description: "探索 isBIM 过往项目与成功实践。了解 JARVIS AI 套件如何在真实基础设施项目中提升效率、质量与交付速度。",
      keywords,
      locale,
      path: "/case-studies",
      image: "/images/og/case-studies.jpg",
    });
  }

  return generatePageMetadata({
    title: "Case Studies | isBIM Construction Technology Projects | Hong Kong",
    description: "Explore past isBIM projects and proven outcomes. See how JARVIS AI Suite improves delivery speed, quality, and execution across real infrastructure projects.",
    keywords,
    locale,
    path: "/case-studies",
    image: "/images/og/case-studies.jpg",
  });
}

/**
 * Generate Careers Page SEO Metadata
 *
 * @param locale - Language locale
 * @returns Next.js Metadata object
 */
export function generateCareersPageSEO(locale: string = "en"): Metadata {
  const keywords = composeKeywords("careers", [], locale);

  if (locale === "zh") {
    return generatePageMetadata({
      title: "职业机会 | 加入 isBIM AI 建筑团队 | 香港",
      description: "加入 isBIM，香港领先的 AI 科技公司和建筑科技公司。与 JARVIS AI 套件和创新建筑解决方案一起构建基础设施的未来。香港 AI 与建筑科技职位。",
      keywords,
      locale,
      path: "/careers",
    });
  }

  return generatePageMetadata({
    title: "Careers at isBIM | Join Our AI Construction Team | Hong Kong",
    description: "Join isBIM, Hong Kong's leading AI and construction technology company. Build the future of infrastructure with JARVIS AI Suite and innovative construction solutions. AI and construction tech careers in Hong Kong.",
    keywords,
    locale,
    path: "/careers",
  });
}
