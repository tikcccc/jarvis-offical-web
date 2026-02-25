"use client";

import { LegalPageTemplate } from "@/components/legal/legal-page-template";
import { getPrivacyPolicyData } from "@/data/legal/privacy-policy";
import { languageTag } from "@/paraglide/runtime";

export default function PrivacyClient() {
  const locale = languageTag() as "en" | "zh";
  const data = getPrivacyPolicyData(locale);

  return <LegalPageTemplate data={data} />;
}
