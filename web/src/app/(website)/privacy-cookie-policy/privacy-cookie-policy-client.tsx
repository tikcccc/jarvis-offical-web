"use client";

import { LegalPageTemplate } from "@/components/legal/legal-page-template";
import { getPrivacyCookiePolicyData } from "@/data/legal/privacy-cookie-policy";
import { languageTag } from "@/paraglide/runtime";

export default function PrivacyCookiePolicyClient() {
  const locale = languageTag() as "en" | "zh";
  const data = getPrivacyCookiePolicyData(locale);

  return <LegalPageTemplate data={data} />;
}
