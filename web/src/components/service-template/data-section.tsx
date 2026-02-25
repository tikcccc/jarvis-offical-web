'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { TypewriterText } from '@/components/animations';
import { useInView } from '@/hooks';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';
import shared from './service-shared.module.css';
import styles from './data-section.module.css';

// Custom hook for number counting animation
function useCounter(end: number, duration = 2000, shouldAnimate = true, decimals = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(end);
      return;
    }

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease-out-quad for smoother, faster finish (less sluggish at the end)
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      const currentValue = easeProgress * end;

      setCount(decimals > 0 ? parseFloat(currentValue.toFixed(decimals)) : Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, shouldAnimate, decimals]);

  return count;
}

// Helper to parse numeric values from stat strings
function parseStatValue(val: string): { number: number; prefix: string; suffix: string; isRange: boolean } {
  // Handle ranges like "70-80%"
  const rangeMatch = val.match(/^(\D*)(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)(\D*)$/);
  if (rangeMatch) {
    const num1 = parseFloat(rangeMatch[2]);
    const num2 = parseFloat(rangeMatch[3]);
    return {
      number: (num1 + num2) / 2,
      prefix: rangeMatch[1],
      suffix: rangeMatch[4],
      isRange: true,
    };
  }

  // Handle regular numbers like "2,600+", "75%", "-45%"
  const match = val.match(/^(\D*)(\d+(?:[,\.]\d+)*)(\D*)$/);
  if (match) {
    const cleanNum = match[2].replace(/,/g, '');
    return {
      number: parseFloat(cleanNum),
      prefix: match[1],
      suffix: match[3],
      isRange: false,
    };
  }

  // Fallback for non-numeric values
  return { number: 0, prefix: '', suffix: val, isRange: false };
}

// Format number back to display string
function formatStatValue(
  count: number,
  prefix: string,
  suffix: string,
  isRange: boolean,
  originalValue: string
): string {
  // For ranges, show as single value during animation
  if (isRange) {
    return `${prefix}${Math.round(count)}${suffix}`;
  }

  // Preserve comma formatting for large numbers
  if (originalValue.includes(',')) {
    return `${prefix}${count.toLocaleString('en-US')}${suffix}`;
  }

  return `${prefix}${count}${suffix}`;
}

interface DataSectionProps {
  stats: ServiceContent['stats'];
  introText: string;
  sectionTitleClass: string;
  colors: {
    textStrong: string;
    textBase: string;
    textSub: string;
    textSoft: string;
  };
}

// Component for comparison items - NO animation (only main stat animates)
interface ComparisonItemProps {
  item: { label: string; before: string; after: string };
  colors: {
    textSub: string;
    textSoft: string;
    textStrong: string;
  };
}

function ComparisonItem({ item, colors }: ComparisonItemProps) {
  // Comparison items do NOT animate - keep static
  return (
    <div className="flex flex-col gap-7 pb-10 border-b border-[var(--border-subtle)] max-w-full justify-center">
      <span className={`font-service-data-kicker ${colors.textSub}`}>{item.label}</span>
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-1">
          <span className={`font-service-data-meta ${colors.textSub}`}>Before</span>
          <span className={`font-service-data-value-emphasis whitespace-nowrap ${colors.textSoft}`}>
            {item.before}
          </span>
        </div>
        <span className={`font-service-data-accent ${colors.textSub} flex items-center`}>→</span>
        <div className="flex flex-col gap-1">
          <span className={`font-service-data-meta ${colors.textSub}`}>After</span>
          <span className={`font-service-data-value-strong whitespace-nowrap ${colors.textStrong}`}>
            {item.after}
          </span>
        </div>
      </div>
    </div>
  );
}

// Component for grid stat items - NO animation (only main stat animates)
interface GridStatProps {
  stat: { val: string; label: string };
  index: number;
  colors: {
    textStrong: string;
    textSub: string;
  };
}

function GridStat({ stat, index, colors }: GridStatProps) {
  return (
    <div
      className={`flex flex-col justify-end border-l pl-6 ${
        index % 2 === 0 ? 'border-[var(--border-strong)]' : 'border-[var(--border-subtle)]'
      }`}
    >
      <span className={`font-service-data-value mb-2 ${colors.textStrong}`}>{stat.val}</span>
      <span className={`font-service-data-label ${colors.textSub}`}>{stat.label}</span>
    </div>
  );
}

export const DataSection: React.FC<DataSectionProps> = ({ stats, introText, sectionTitleClass, colors }) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = !!prefersReducedMotion;
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
    initialInView: shouldReduceMotion,
  });
  const [startTypewriter, setStartTypewriter] = useState(shouldReduceMotion);

  useEffect(() => {
    if (inView) {
      setStartTypewriter(true);
    }
  }, [inView]);

  // Parse main stat value for animation
  const mainStatParsed = parseStatValue(stats.main.val);
  const mainStatCount = useCounter(
    mainStatParsed.number,
    2000,
    inView && !shouldReduceMotion,
    0
  );
  const mainStatDisplay = shouldReduceMotion || !inView
    ? stats.main.val
    : formatStatValue(
        mainStatCount,
        mainStatParsed.prefix,
        mainStatParsed.suffix,
        mainStatParsed.isRange,
        stats.main.val
      );

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DESIGN_TOKENS.animation.duration.slow,
        ease: DESIGN_TOKENS.animation.easing.easeOut,
      },
    },
  };

  return (
    <section className={`${shared.sectionBase} ${shared.sectionBaseLight} service-section-xl`}>
      <div className="service-shell">
        <div className={`${styles.dataGrid} gap-20`}>
          <m.div
            ref={ref}
            className="relative"
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
            variants={cardVariants}
          >
            <h3 className={`${sectionTitleClass} mb-12`}>{stats.label}</h3>

            <p className={`font-service-data-intro ${colors.textBase} mt-4`}>
              {introText}
            </p>
            
            <div className={`${styles.dataCard} mt-12 text-[var(--text-strong)]`}>
              <span className={`block font-service-data-label mb-4 ${colors.textSub}`}>
                {startTypewriter && !shouldReduceMotion ? (
                  <TypewriterText
                    text={stats.main.label}
                    className={`${colors.textSub}`}
                    delay={0}
                    cursorVisible={false}
                  />
                ) : (
                  <span aria-hidden>{stats.main.label}</span>
                )}
              </span>
              <span className="font-service-data-figure">
                {mainStatDisplay}
              </span>
            </div>
          </m.div>

          {stats.comparison?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-12 mt-14 lg:mt-2 w-full max-w-6xl">
              {stats.comparison.map((item, idx) => (
                <ComparisonItem
                  key={`${item.label}-${idx}`}
                  item={item}
                  colors={colors}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-12 gap-y-16 mt-8 lg:mt-0">
              {stats.grid.map((stat, idx) => (
                <GridStat
                  key={idx}
                  stat={stat}
                  index={idx}
                  colors={colors}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
