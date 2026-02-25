/**
 * JARVIS Products Data
 *
 * 用途：
 * - 存儲所有JARVIS AI Suite產品的靜態數據
 * - 包含8個JARVIS產品的基本信息
 * - 用於產品卡片、產品列表、導航等組件
 *
 * 數據結構：
 * - id: 產品唯一標識符
 * - title: 產品名稱（支持i18n key）
 * - description: 產品簡介
 * - href: 產品詳情頁路徑
 * - icon: 產品圖標（可選）
 * - category: 產品分類
 *
 * 包含的產品：
 * 1. JARVIS Agent - AI助手代理
 * 2. JARVIS Pay - 支付認證系統
 * 3. JARVIS Air - 生成式設計
 * 4. JARVIS Eagle Eye - 數字孿生監控
 * 5. JARVIS SSSS - 智能工地安全系統
 * 6. JARVIS DWSS - 數字工程監督系統
 * 7. JARVIS CDCP - 通用數據協作平台
 * 8. JARVIS Assets - 智能設施管理
 *
 * 使用場景：
 * - Home頁面的"Our AI Platforms"產品網格
 * - Services頁面的產品展示
 * - 導航下拉菜單的JARVIS產品列表
 */

import { Product } from "@/lib/types";
import { JARVIS_POSTERS, JARVIS_VIDEOS } from "@/lib/media-config";

/**
 * Extended Product Interface for Carousel
 * Used for interactive carousel display with detailed metadata
 */
export interface CarouselProduct {
  id: number;
  category: string;
  tabTitle: string;
  title: string;
  bigText: string;
  meta: string[];
  description: string;
  imageUrl: string;
  posterUrl?: string;
  href?: string;
}

/**
 * JARVIS Products - Full carousel data
 * Now using centralized media configuration for flexible asset management.
 * Videos can be easily switched between local and remote CDN by setting NEXT_PUBLIC_MEDIA_URL.
 */
export const carouselProducts: CarouselProduct[] = [
  {
    id: 1,
    category: "JARVIS AGENT",
    tabTitle: "JARVIS Agent",
    title: "Domain-specific AI for Construction Stakeholders",
    bigText: "Agent",
    meta: ["AI Assistant", "Invoice Scanning", "Tender Parsing"],
    description: "Automates invoice scanning, tender parsing & scoring, and form-filling via email agent.",
    imageUrl: JARVIS_VIDEOS.agent, // Uses media-config
    posterUrl: JARVIS_POSTERS.agent,
    href: "/jarvis-agent",
  },
  {
    id: 2,
    category: "JARVIS PAY",
    tabTitle: "JARVIS Pay",
    title: "Digital Twin for Payment Certification",
    bigText: "Pay",
    meta: ["SOPL Compliant", "Working Capital", "Investor Visibility"],
    description: "60-day SOPL-compliant certification enabling better working-capital rates.",
    imageUrl: JARVIS_VIDEOS.pay, // Uses media-config
    posterUrl: JARVIS_POSTERS.pay,
    href: "/jarvis-pay",
  },
  {
    id: 3,
    category: "JARVIS AIR",
    tabTitle: "JARVIS Air",
    title: "Generative Design with 500K+ Templates",
    bigText: "Air",
    meta: ["Stable Diffusion", "Video Walkthroughs", "Prototyping"],
    description: "Instant visuals, video walkthroughs, and scenario prototyping powered by AI.",
    imageUrl: JARVIS_VIDEOS.air, // Uses media-config
    posterUrl: JARVIS_POSTERS.air,
    href: "/jarvis-air",
  },
  {
    id: 4,
    category: "JARVIS Eagle Eye",
    tabTitle: "Eagle Eye",
    title: "Real-time Digital Twin with IoT Integration",
    bigText: "Eagle Eye",
    meta: ["IoT Sensors", "360° Capture", "Anomaly Detection"],
    description: "Remote monitoring, anomaly detection, and compliance assurance in real-time.",
    imageUrl: JARVIS_VIDEOS.eagleEye, // Uses media-config
    posterUrl: JARVIS_POSTERS.eagleEye,
    href: "/jarvis-eagle-eye",
  },
  {
    id: 5,
    category: "JARVIS SSSS",
    tabTitle: "JARVIS SSSS",
    title: "Smart Site Safety System",
    bigText: "4S",
    meta: ["Wearables", "AI Cameras", "Instant Alerts"],
    description: "Reduces incidents through proactive risk orchestration and real-time monitoring.",
    imageUrl: JARVIS_VIDEOS.ssss, // Uses media-config
    posterUrl: JARVIS_POSTERS.ssss,
    href: "/jarvis-ssss",
  },
  {
    id: 6,
    category: "JARVIS DWSS",
    tabTitle: "JARVIS DWSS",
    title: "Digital Works Supervision System",
    bigText: "DWSS",
    meta: ["Secure Submission", "Automated Checks", "Audit Trails"],
    description: "Digital Works Supervision portal with secure submission and automated checks for faster approvals.",
    imageUrl: JARVIS_VIDEOS.dwss, // Uses media-config
    posterUrl: JARVIS_POSTERS.dwss,
    href: "/jarvis-dwss",
  },
  {
    id: 7,
    category: "JARVIS CDCP",
    tabTitle: "JARVIS CDCP",
    title: "Common Data Collaboration Platform",
    bigText: "CDCP",
    meta: ["Interoperable BIM", "Version Control", "Conflict Resolution"],
    description: "Interoperable BIM hub for version control and conflict resolution.",
    imageUrl: JARVIS_VIDEOS.cdcp, // Uses media-config
    posterUrl: JARVIS_POSTERS.cdcp,
    href: "/jarvis-cdcp",
  },
  {
    id: 8,
    category: "JARVIS ASSETS",
    tabTitle: "JARVIS Assets",
    title: "Digital Twin + AI Facility Management",
    bigText: "Assets",
    meta: ["Predictive Maintenance", "ESG Tracking", "Lifecycle Optimization"],
    description: "AI-powered facility management for predictive maintenance and sustainability.",
    imageUrl: JARVIS_VIDEOS.assets, // Uses media-config
    posterUrl: JARVIS_POSTERS.assets,
    href: "/jarvis-assets",
  },
];

/**
 * Simplified Product List (for basic displays)
 * Maps carousel products to standard Product interface
 */
export const jarvisProducts: Product[] = carouselProducts.map((product) => ({
  id: product.category.toLowerCase().replace(/\s+/g, "-"),
  title: product.title,
  description: product.description,
  href: product.href || `/${product.category.toLowerCase().replace(/\s+/g, "-")}`,
  category: "jarvis" as const,
}));
