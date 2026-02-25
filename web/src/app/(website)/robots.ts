/**
 * Robots.txt Generator
 *
 * Purpose:
 * - Tell search engines which pages to crawl
 * - Provide sitemap location
 * - Block crawling of admin/internal routes
 * - Support Chinese search engines (Baidu, Sogou, 360Search)
 *
 * Access: /robots.txt
 */

import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const baseDisallow = ["/studio/", "/studio", "/api/", "/admin/"];

  return {
    rules: [
      // General crawlers (Google, Bing, etc.)
      {
        userAgent: "*",
        allow: "/",
        disallow: baseDisallow,
      },
      // Baidu (百度) - Chinese market leader
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: baseDisallow,
      },
      // Sogou (搜狗) - Chinese search engine
      {
        userAgent: "Sogou web spider",
        allow: "/",
        disallow: baseDisallow,
      },
      // 360Search (360搜索) - Chinese search engine
      {
        userAgent: "360Spider",
        allow: "/",
        disallow: baseDisallow,
      },
      // OpenAI crawler - Optional: block AI training
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      // Google Extended (for AI training)
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
