"use client";

import { Link } from "@/lib/i18n";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { m } from "@/components/motion/lazy-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/constants";
import * as messages from "@/paraglide/messages";

const NewsletterForm = dynamic(
  () => import("./newsletter-form").then((mod) => mod.NewsletterForm),
  {
    ssr: false,
    loading: () => <NewsletterFallback />,
  }
);

function NewsletterFallback() {
  return (
    <div className="flex flex-col space-y-2.5 pt-0.5">
      <div className="flex space-x-2">
        <div className="h-10 flex-1 rounded-md bg-gray-800 animate-pulse" />
        <div className="h-10 w-10 rounded-md bg-gray-800 animate-pulse" />
      </div>
      <div className="h-3 w-24 rounded-md bg-gray-800 animate-pulse" />
    </div>
  );
}

export function FooterDark() {
  const productLinks = [
    { name: "JARVIS Agent", href: ROUTES.JARVIS.AGENT },
    { name: "JARVIS Pay", href: ROUTES.JARVIS.PAY },
    { name: "JARVIS Air", href: ROUTES.JARVIS.AIR },
    { name: "JARVIS Eagle Eye", href: ROUTES.JARVIS.EAGLE_EYE },
    { name: "JARVIS SSSS", href: ROUTES.JARVIS.SSSS },
    { name: "JARVIS DWSS", href: ROUTES.JARVIS.DWSS },
    { name: "JARVIS CDCP", href: ROUTES.JARVIS.CDCP },
    { name: "JARVIS Assets", href: ROUTES.JARVIS.ASSETS },
  ];

  const companyLinks = [
    { name: "JARVIS Project Management (JPM)", href: ROUTES.JARVIS.JPM },
    { name: "BIM Consultancy", href: ROUTES.BIM_CONSULTANCY },
    { name: "Project Finance", href: ROUTES.PROJECT_FINANCE },
    { name: "Venture Investments", href: ROUTES.VENTURE_INVESTMENTS },
    { name: "About Us", href: ROUTES.ABOUT },
    { name: "Newsroom", href: ROUTES.NEWSROOM },
    { name: "Case Studies", href: ROUTES.CASE_STUDIES },
    { name: "Careers", href: ROUTES.CAREERS },
    { name: "Contact Us", href: ROUTES.CONTACT },
  ];

  const socialIcons = [
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: Twitter, label: "Twitter/X", href: "https://twitter.com" },
    { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
    { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  ];

  return (
    <footer className="footer-dark w-full bg-black text-white border-t border-white/10 layout-footer-text">
      <div className="container mx-auto px-6 py-14 lg:py-20">
        {/* Grid layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {/* Column 1: Brand & Vision */}
          <div className="flex flex-col space-y-5">
            <Link href={ROUTES.HOME} prefetch className="inline-flex items-center hover:opacity-80 transition-opacity w-fit">
              <Image
                src="/icons/isbim_white.svg"
                alt="isBIM Logo"
                width={100}
                height={28}
                className="h-auto max-h-8 w-auto max-w-[110px] sm:max-w-[130px]"
                priority
              />
            </Link>

            <p className="text-[15px] text-gray-400 leading-[1.7] max-w-[280px]">
              {messages.footer_tagline()}
              <br className="block mt-1.5" />
              <span className="text-gray-500">
                {messages.footer_tagline2()}
              </span>
            </p>

            {/* Social Icons */}
            <div className="flex space-x-1.5 pt-1">
              {socialIcons.map(({ icon: Icon, label, href }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  asChild
                >
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Column 2: Solutions (JARVIS Products) */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
              {messages.footer_platforms()}
            </h3>
            <ul className="space-y-2.5 text-[15px] text-gray-400">
              {productLinks.map((link) => (
                <m.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={link.href}
                    prefetch
                    className="hover:text-white transition-colors block py-0.5 leading-tight"
                  >
                    {link.name}
                  </Link>
                </m.li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
              {messages.footer_company()}
            </h3>
            <ul className="space-y-2.5 text-[15px] text-gray-400">
              {companyLinks.map((link) => (
                <m.li
                  key={link.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={link.href}
                    prefetch
                    className="hover:text-white transition-colors block py-0.5 leading-tight"
                  >
                    {link.name}
                  </Link>
                </m.li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
              {messages.footer_stay_connected()}
            </h3>
            <p className="text-[15px] text-gray-400 leading-[1.65]">
              {messages.footer_newsletter_desc()}
            </p>

            <div className="min-h-[72px]">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        {/* Bottom Bar - Copyright & Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[13px] text-gray-500 space-y-3 md:space-y-0">
          <p>{messages.footer_copyright()}</p>
          <div className="flex space-x-7">
            <Link
              href="/privacy-cookie-policy"
              prefetch
              className="hover:text-white transition-colors"
            >
              Privacy & Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
