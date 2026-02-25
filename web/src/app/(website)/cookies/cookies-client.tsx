"use client";

import { LegalPageTemplate } from "@/components/legal/legal-page-template";
import { getCookiesPolicyData } from "@/data/legal/cookies-policy";
import { languageTag } from "@/paraglide/runtime";

export default function CookiesClient() {
  const locale = languageTag() as "en" | "zh";
  const data = getCookiesPolicyData(locale);

  return <LegalPageTemplate data={data} />;
}
