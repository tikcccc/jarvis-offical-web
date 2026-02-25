import { Metadata } from "next";
import { languageTag } from "@/paraglide/runtime";
import { generateServicePageSEO } from "@/lib/seo-generators";
import { ServiceTemplateClient, getLocalizedServiceMeta } from "@/components/service-template";

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  const meta = getLocalizedServiceMeta("FINANCE");
  return generateServicePageSEO(meta.seoKey, meta.title, meta.description, locale);
}

export default function ProjectFinancePage() {
  return <ServiceTemplateClient initialService="FINANCE" />;
}
