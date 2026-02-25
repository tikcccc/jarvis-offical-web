import { headers } from "next/headers";
import type { Metadata } from "next";
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
import { FooterConfig } from "@/components/layout/footer-config";
import { FooterRenderer } from "@/components/layout/footer-renderer";
import { NotFoundContent } from "./not-found-content";

export const metadata: Metadata = {
  title: "404 - Page Not Found | isBIM",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default async function NotFound() {
  // Get locale from headers (same pattern as website layout)
  const headersList = await headers();
  const headerLocale = headersList.get("x-language-tag");
  const locale = (isAvailableLanguageTag(headerLocale) ? headerLocale : sourceLanguageTag) as AvailableLanguageTag;

  // Sync paraglide locale for downstream translations
  setLanguageTag(() => locale);

  return (
    <LanguageProvider>
      <LocaleProvider locale={locale}>
        <AppProviders>
          <div className="min-h-screen text-white footer-alliance-font" style={{ background: 'var(--surface-dark)' }}>
            <FooterConfig variant="charcoal" />
            <Topbar />
            <NotFoundContent />
            <FooterRenderer />
          </div>
        </AppProviders>
      </LocaleProvider>
    </LanguageProvider>
  );
}
