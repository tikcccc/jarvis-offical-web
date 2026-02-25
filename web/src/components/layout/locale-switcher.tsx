"use client";

import { useLocale, useLocaleContext } from "@/lib/i18n/index";
import { usePathname } from "@/lib/i18n";
import { strategy } from "@/lib/i18n";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { setLanguageTag, type AvailableLanguageTag, availableLanguageTags } from "@/paraglide/runtime";
import { m } from "@/components/motion/lazy-motion";

/**
 * LocaleSwitcher Component
 *
 * Toggle switch design for EN/ZH language switching
 * - Clear visual metaphor for binary state selection
 * - Larger touch targets for better mobile UX
 * - Enhanced hover effects for desktop interaction
 * Uses LocaleContext to get current locale (Level 3 implementation)
 */

const localeLabels: Record<AvailableLanguageTag, string> = {
  en: "EN",
  zh: "中文",
};

function stripLocalePrefix(pathname: string): `/${string}` {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const [maybeLocale, ...rest] = segments;
  if (availableLanguageTags.includes(maybeLocale as AvailableLanguageTag)) {
    const pathWithoutLocale = `/${rest.join("/")}`;
    return pathWithoutLocale as `/${string}`;
  }
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalizedPath as `/${string}`;
}

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname(); // canonical path (no locale prefix)
  const searchParams = useSearchParams();
  const currentLocale = useLocale(); // Use Context instead of languageTag()
  const { setLocale } = useLocaleContext();
  const localeUpdateTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (localeUpdateTimer.current) {
        clearTimeout(localeUpdateTimer.current);
        localeUpdateTimer.current = null;
      }
    };
  }, []);

  const switchLocale = (newLocale: AvailableLanguageTag) => {
    if (newLocale === currentLocale) return;

    const canonicalPath = stripLocalePrefix(pathname);
    const query = searchParams?.toString();
    // Use Paraglide strategy to build localized path (handles translated pathnames/prefix)
    const localizedPath =
      strategy.getLocalisedUrl(canonicalPath, newLocale, true).pathname + (query ? `?${query}` : "");

    // Slight delay so transition overlay can start; avoids long lag
    if (localeUpdateTimer.current) {
      clearTimeout(localeUpdateTimer.current);
    }
    localeUpdateTimer.current = window.setTimeout(() => {
      setLanguageTag(() => newLocale);
      setLocale(newLocale);
    }, 650);

    // Persist preference for server / middleware
    document.cookie = `NEXT_LOCALE=${newLocale}; Path=/; Max-Age=31557600; SameSite=Lax`;

    // Replace without adding history and keep scroll position (PageTransition handles scroll)
    router.replace(localizedPath, { scroll: false });
  };

  return (
    <div className="relative inline-flex items-center w-[100px] h-10 bg-white/5 border border-white/10 rounded-lg p-1 backdrop-blur-sm">
      {/* Sliding background indicator - occupies 50% of container width */}
      <m.div
        className="absolute left-1 top-1 bottom-1 bg-white/20 rounded-md shadow-sm"
        style={{ width: "calc(50% - 4px)" }}
        initial={false}
        animate={{
          x: currentLocale === "en" ? 0 : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
        }}
      />

      {/* EN Button */}
      <m.button
        onClick={() => switchLocale("en")}
        whileHover={{}}
        whileTap={{ scale: 0.95 }}
        className={`
          relative z-10 w-1/2 h-full flex items-center justify-center
          text-xs font-medium rounded-md
          transition-all duration-300
          ${
            currentLocale === "en"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white"
          }
        `}
        aria-label="Switch to English"
        aria-pressed={currentLocale === "en"}
      >
        {localeLabels.en}
      </m.button>

      {/* ZH Button */}
      <m.button
        onClick={() => switchLocale("zh")}
        whileHover={{}}
        whileTap={{ scale: 0.95 }}
        className={`
          relative z-10 w-1/2 h-full flex items-center justify-center
          text-xs font-medium rounded-md
          transition-all duration-300
          ${
            currentLocale === "zh"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white"
          }
        `}
        aria-label="切換至中文"
        aria-pressed={currentLocale === "zh"}
      >
        {localeLabels.zh}
      </m.button>
    </div>
  );
}
