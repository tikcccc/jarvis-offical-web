"use client";

import { LegalPageTemplate } from "@/components/legal/legal-page-template";
import { getTermsOfServiceData } from "@/data/legal/terms-of-service";
import { languageTag } from "@/paraglide/runtime";

export default function TermsClient() {
  const locale = languageTag() as "en" | "zh";
  const data = getTermsOfServiceData(locale);

  return <LegalPageTemplate data={data} />;
}
