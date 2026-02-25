import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LocalizedLink } from "@/components/ui/localized-link";

interface CTASectionProps {
  title: ReactNode;
  subtitle?: ReactNode;
  buttonLabel: ReactNode;
  href: string;
  className?: string;
}

export function CTASection({
  title,
  subtitle,
  buttonLabel,
  href,
  className,
}: CTASectionProps) {
  return (
    <div
      className={cn(
        "min-h-[50vh] flex flex-col items-center justify-center text-center bg-gradient-to-b from-neutral-50 to-neutral-100 border-t border-neutral-200 relative overflow-hidden px-6 py-20",
        className
      )}
    >
      <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-30 mix-blend-multiply pointer-events-none filter grayscale" />

      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-neutral-400 rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-neutral-400 rounded-full" />
      </div>

      <div className="max-w-3xl z-10 space-y-6">
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight">
          {title}
        </h3>

        {subtitle && (
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
        </p>
      )}

      <div className="pt-4">
        <LocalizedLink
          href={href}
          prefetchMode="hover"
          className="group relative px-8 py-4 bg-blue-600 text-white font-medium text-sm tracking-wide uppercase overflow-hidden hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl inline-block"
        >
          <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
            {buttonLabel}
          </span>
          <div className="absolute inset-0 bg-neutral-900 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
        </LocalizedLink>
      </div>
    </div>
  </div>
);
}
