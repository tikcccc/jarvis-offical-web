import { headers } from "next/headers";
import { LanguageProvider } from "@inlang/paraglide-next";
import {
  sourceLanguageTag,
  setLanguageTag,
  isAvailableLanguageTag,
  type AvailableLanguageTag,
} from "@/paraglide/runtime";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { AppProviders } from "@/providers/app-providers";
import { Topbar } from "@/components/layout/topbar";
import { FooterRenderer } from "@/components/layout/footer-renderer";
import { Toaster } from "@/components/ui/sonner";
import type { MenuPreviewItem } from "@/components/layout/menu-overlay";
import { getMenuCaseStudies, getMenuNews } from "@/strapi/lib";

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;

  // Sync paraglide locale for downstream translations.
  setLanguageTag(() => locale);

  const [menuNews, menuCaseStudies] = await Promise.all([
    getMenuNews().catch(() => [] as MenuPreviewItem[]),
    getMenuCaseStudies().catch(() => [] as MenuPreviewItem[]),
  ]);

  return (
    <LanguageProvider>
      <LocaleProvider locale={locale}>
        <AppProviders>
          <div className="min-h-screen text-zinc-900 footer-alliance-font">
            <Topbar
              newsPreview={menuNews}
              caseStudyPreview={menuCaseStudies}
            />
            {children}
            <FooterRenderer />
          </div>
          <Toaster />
        </AppProviders>
      </LocaleProvider>
    </LanguageProvider>
  );
}
