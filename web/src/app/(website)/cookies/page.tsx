import { Metadata } from "next";
import { generateHreflangAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/env";
import { languageTag } from "@/paraglide/runtime";
import CookiesClient from "./cookies-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  const title = locale === "en"
    ? "Cookie Policy | isBIM"
    : "Cookie 声明 | isBIM";

  const description = locale === "en"
    ? "Learn how isBIM uses cookies and similar technologies to provide secure and efficient services while maintaining a minimal data footprint."
    : "了解 isBIM 如何使用 Cookie 和类似技术提供安全高效的服务,同时保持最小化的数据足迹。";

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/cookies`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: generateHreflangAlternates("/cookies"),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "isBIM",
      locale: locale === "en" ? "en_US" : "zh_HK",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CookiesPage() {
  return <CookiesClient />;
}
