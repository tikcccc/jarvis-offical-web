import type { Metadata } from "next";
import { languageTag } from "@/paraglide/runtime";
import { generateHreflangAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/env";
import TermsClient from "./terms-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  const title =
    locale === "en"
      ? "Terms of Service | isBIM"
      : "服务条款 | isBIM";
  const description =
    locale === "en"
      ? "Read the Terms of Use that apply to the use of any service, software, website, or AI platform provided by isBIM Limited, including the JARVIS AI Suite."
      : "阅读适用于 isBIM Limited 提供的任何服务、软件、网站或 AI 平台（包括 JARVIS AI 套件）的使用条款。";

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/terms`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: generateHreflangAlternates("/terms"),
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

export default function TermsPage() {
  return <TermsClient />;
}
