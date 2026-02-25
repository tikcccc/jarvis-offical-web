"use client";

/**
 * ServiceCard Component
 *
 * Individual service card with:
 * - Background image (grayscale → color on hover)
 * - Corner brackets animation
 * - Icon, title, descriptions
 * - Expandable detail section with CTA
 */

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SpotlightCard } from "./spotlight-card";
import { CornerBrackets } from "./corner-brackets";
import type { ServiceData } from "@/data/services";
import { LocalizedLink } from "@/components/ui/localized-link";
import * as messages from "@/paraglide/messages";

const translate = (key: keyof typeof messages): string => {
  const messageFn = messages[key];
  return typeof messageFn === "function" ? (messageFn as () => string)() : key;
};

interface ServiceCardProps {
  item: ServiceData;
  index: number;
}

export function ServiceCard({ item, index }: ServiceCardProps) {
  const Icon = item.icon;
  const displayIndex = (index + 1).toString().padStart(2, "0");
  const typeLabel = translate(item.typeKey);
  const title = translate(item.titleKey);
  const headerDescription = translate(item.headerDescriptionKey);
  const description = translate(item.descriptionKey);
  const ctaText = translate(item.ctaTextKey);

  return (
    <SpotlightCard className={`${item.gridArea} ${item.height}`}>
      {/* Background Image */}
      <Image
        src={item.image}
        alt={title}
        fill
        className="absolute inset-0 object-cover transition-transform duration-1000 ease-out group-hover:scale-105 grayscale brightness-[0.4] group-hover:brightness-[0.6] group-hover:grayscale-0"
      />

      {/* Gradient Overlay - optimized opacity transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 will-change-opacity transition-opacity duration-500" />

      {/* Corner Brackets */}
      <CornerBrackets />

      {/* Header Section - combined transitions */}
      <div className="absolute top-0 left-0 p-6 z-20 flex items-center gap-3 w-full justify-between">
        <div className="flex items-center gap-3">
          <span className="hud-flicker font-mono text-sm text-[var(--services-text)]/40 tracking-widest transition-colors duration-300 group-hover:text-[var(--services-text)]">
            {displayIndex} /
          </span>
          <span className="hud-flicker text-[10px] font-mono uppercase tracking-widest text-[var(--services-accent-strong)]/90 bg-[var(--services-badge-bg)] px-2 py-1 backdrop-blur-md rounded border border-[var(--services-badge-border)] transition-[color,border-color] duration-300 group-hover:text-[var(--services-muted-strong)] group-hover:border-[var(--services-accent-strong)]/40">
            {typeLabel}
          </span>
        </div>
        <div className="h-1 w-1 rounded-full bg-[var(--services-accent)] animate-pulse" />
      </div>

      {/* Content Section */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col items-start">
        {/* Icon + Title - GPU accelerated transform */}
        <div className="flex items-center gap-4 mb-2 will-change-transform transition-transform duration-500 group-hover:-translate-y-2">
          <div className="p-2 border border-[var(--services-border)] rounded-lg backdrop-blur-md bg-white/5 text-[var(--services-accent-strong)]">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--services-text)] tracking-tight leading-none transition-colors duration-300 group-hover:text-[var(--services-muted-strong)]">
            {title}
          </h3>
        </div>

        {/* Header Description */}
        <p className="text-sm md:text-base text-[var(--services-muted)] font-light max-w-lg mb-2 transition-colors duration-300 group-hover:text-[var(--services-muted-strong)] line-clamp-2 group-hover:line-clamp-none">
          {headerDescription}
        </p>

        {/* Expandable Detail Section */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="overflow-hidden">
            <div className="pt-4 border-l border-[var(--services-accent-muted)] pl-4 mt-2">
              <p className="text-[var(--services-muted)] text-sm leading-relaxed mb-4 max-w-prose">
                {description}
              </p>
              <LocalizedLink
                href={item.href}
                className="group/btn inline-flex items-center text-xs font-bold text-[var(--services-text)] uppercase tracking-widest transition-colors duration-300 hover:text-[var(--services-accent-strong)]"
              >
                <span className="border-b border-transparent transition-colors duration-300 group-hover/btn:border-[var(--services-accent-strong)] pb-0.5">
                  {ctaText}
                </span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </LocalizedLink>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
