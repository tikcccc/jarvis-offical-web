import type { Metadata } from "next";
import { languageTag } from "@/paraglide/runtime";
import { generateHreflangAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/env";
import PrivacyCookiePolicyClient from "./privacy-cookie-policy-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  const title =
    locale === "en"
      ? "Privacy & Cookie Policy| isBIM"
      : "Privacy & Cookie Policy| isBIM";
  const description =
    locale === "en"
      ? "Read the combined privacy, cookie, and usage terms for isbim Limited's website."
      : "Read the combined privacy, cookie, and usage terms for isbim Limited's website.";

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/privacy-cookie-policy`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: generateHreflangAlternates("/privacy-cookie-policy"),
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

export default function PrivacyCookiePolicyPage() {
  return <PrivacyCookiePolicyClient />;
}
