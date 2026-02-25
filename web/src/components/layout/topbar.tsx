"use client";

import * as messages from "@/paraglide/messages";
import { Search, Menu, X } from "lucide-react";
import { m } from "@/components/motion/lazy-motion";
import { Link } from "@/lib/i18n";
import Image from "next/image";
import { LocaleSwitcher } from "./locale-switcher";
import { MenuOverlay, type MenuNewsPreview } from "./menu-overlay";
import { useMenuStore } from "@/stores/menu-store";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { ROUTES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";

/**
 * Topbar Component
 *
 * A glassmorphism navigation bar with floating effect
 * - Fixed at the top with margin for floating effect
 * - Transparent background with backdrop blur
 * - Logo on the left
 * - Get Started button, LocaleSwitcher, Search, and Menu on the right
 * - When menu is open: becomes solid black and sits at top of menu overlay
 */

export function Topbar({ newsPreview = [] }: { newsPreview?: MenuNewsPreview[] }) {
  const { isOpen, openMenu, closeMenu } = useMenuStore();
  const radius10 = { borderRadius: "10px" };
  // Subscribe to locale changes so translations re-render
  useLocale();

  return (
    <>
      <m.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed z-50 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4 transition-all duration-300
          ${
            isOpen
              ? "top-0 left-0 right-0 bg-[#050505] border-b border-white/10"
              : "top-4 sm:top-5 lg:top-6 left-4 sm:left-5 lg:left-6 right-4 sm:right-5 lg:right-6 bg-zinc-900/30 backdrop-blur-lg border border-white/10"
          }`}
        style={radius10}
      >
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          prefetch
          className="group relative flex items-center hover:opacity-80 transition-opacity focus-visible:outline-none"
          onClick={isOpen ? closeMenu : undefined}
        >
          <div className="relative h-5 sm:h-6 w-[80px] sm:w-[96px]">
            <Image
              src="/icons/isbim_white.svg"
              alt="isBIM Logo"
              width={96}
              height={24}
              className="h-full w-full"
              priority
            />
            <span aria-hidden className="logo-mask-shine" />
          </div>
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Get Started button - hidden on mobile */}
          <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
            <Link
              href={ROUTES.CONTACT}
              prefetch
              className={`h-10 px-4 inline-flex items-center justify-center text-sm font-medium transition-colors
                ${
                  isOpen
                    ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              style={radius10}
              onClick={isOpen ? closeMenu : undefined}
            >
              {messages.topbar_get_started()}
            </Link>
          </m.div>

          {/* Locale Switcher - hidden when menu is open */}
          {!isOpen && <LocaleSwitcher />}

          {/* Search button */}
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-lg
                     hover:bg-white/10 transition-colors text-white"
            style={radius10}
            aria-label="Search"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </m.button>

          {/* Menu / Close button */}
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isOpen ? closeMenu : openMenu}
            className={`flex items-center justify-center transition-colors text-white group cursor-pointer
              ${
                isOpen
                  ? "h-10 px-4 gap-3 border border-white/20 hover:bg-white/10"
                  : "w-10 h-10 border border-white/20 hover:bg-white/10"
              }`}
            style={radius10}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            {isOpen ? (
              <>
                <TypewriterText
                  text="CLOSE"
                  className="text-[10px] layout-nav-label text-neutral-300 group-hover:text-white tracking-widest hidden md:block"
                />
                <X className="w-5 h-5" />
              </>
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </m.button>
        </div>
      </m.nav>

      {/* Menu Overlay */}
      <MenuOverlay newsPreview={newsPreview} />

      <style jsx global>{`
        .logo-mask-shine {
          position: absolute;
          inset: 0;
          opacity: 0;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 18%,
            rgba(186, 219, 255, 0.75) 48%,
            rgba(255, 255, 255, 0) 78%
          );
          background-size: 220% 100%;
          background-position: -130% 50%;
          mask-image: url("/icons/isbim_white.svg");
          -webkit-mask-image: url("/icons/isbim_white.svg");
          mask-repeat: no-repeat;
          -webkit-mask-repeat: no-repeat;
          mask-size: contain;
          -webkit-mask-size: contain;
          mask-position: center;
          -webkit-mask-position: center;
          transition: opacity 180ms ease-out, background-position 750ms ease-out;
          pointer-events: none;
        }

        .group:hover .logo-mask-shine,
        .group:focus-visible .logo-mask-shine {
          opacity: 1;
          background-position: 130% 50%;
        }
      `}</style>
    </>
  );
}
