import type { Metadata } from "next";
import { languageTag } from "@/paraglide/runtime";
import { generateHreflangAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/env";
import PrivacyClient from "./privacy-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  const title =
    locale === "en"
      ? "Privacy Policy | isBIM"
      : "隐私政策 | isBIM";
  const description =
    locale === "en"
      ? "Learn how isBIM Limited respects your privacy rights and protects information collected through our corporate website, JARVIS AI Suite, and mobile applications."
      : "了解 isBIM Limited 如何尊重您的隐私权并保护通过我们的企业网站、JARVIS AI 套件和移动应用收集的信息。";

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/privacy`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: generateHreflangAlternates("/privacy"),
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
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyClient />;
}
