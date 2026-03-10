import type { Metadata } from "next";
import { languageTag } from "@/paraglide/runtime";
import { generateHreflangAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/env";
import * as messages from "@/paraglide/messages";
import PrivacyCookiePolicyClient from "./privacy-cookie-policy-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  const title = `${messages.privacy_cookie_title(
    {},
    { languageTag: locale }
  )} | isBIM`;
  const description = messages.privacy_cookie_meta_description(
    {},
    { languageTag: locale }
  );

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
