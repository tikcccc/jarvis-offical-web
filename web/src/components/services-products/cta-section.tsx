"use client";

/**
 * CTA Section Component
 *
 * Final call-to-action section with:
 * - Local grid background with gradient overlay
 * - Large question heading
 * - White capsule button with hover states
 */

import { m } from "@/components/motion/lazy-motion";
import * as messages from "@/paraglide/messages";
import { ROUTES } from "@/lib/constants";
import { LocalizedLink } from "@/components/ui/localized-link";

export function CtaSection() {
  return (
    <section className="py-32 relative z-10 mt-20">
      {/* Local Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, transparent, black 20%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%)",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-0 pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-10 text-white">
            {messages.services_products_cta_title ? messages.services_products_cta_title() : "Ready to build the future?"}
          </h2>
          <LocalizedLink
            href={ROUTES.CONTACT}
            prefetchMode="hover"
            className="group relative inline-flex items-center justify-center bg-white text-black px-12 py-5 text-sm uppercase tracking-widest font-bold rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_16px_rgba(16,185,129,0.3)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="absolute inset-0 rounded-full ring-2 ring-emerald-400/0 group-hover:ring-emerald-400/70 transition-all duration-500" />
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              {messages.services_products_cta_button ? messages.services_products_cta_button() : "Transform Your Project"}
            </span>
          </LocalizedLink>
        </m.div>
      </div>
    </section>
  );
}
