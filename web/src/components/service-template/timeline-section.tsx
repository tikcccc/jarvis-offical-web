'use client';

import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { useInView } from '@/hooks';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import styles from './timeline-section.module.css';

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  isNow?: boolean;
}

interface TimelineSectionProps {
  heading: string;
  items: TimelineItem[];
  sectionTitleClass: string;
  inline?: boolean;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  heading,
  items,
  sectionTitleClass,
  inline = false,
}) => {
  const shouldReduceMotion = !!useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
    initialInView: shouldReduceMotion,
  });

  const itemVariants = {
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

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: DESIGN_TOKENS.animation.easing.easeOut,
      },
    },
  };

  const timelineContent = (
    <>
      <h3 className={`${sectionTitleClass} ${styles.heading}`}>{heading}</h3>

      <div className={styles.timelineWrapper}>
        {/* Desktop animated progress line */}
        <div className={styles.desktopLine} aria-hidden>
          {/* Base line (subtle) */}
          <div className={styles.lineBase} />

          {/* Animated progress line (strong) */}
          {!shouldReduceMotion && (
            <m.div
              className={styles.lineActive}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                duration: 2.5,
                ease: DESIGN_TOKENS.animation.easing.easeInOut,
              }}
            />
          )}
        </div>

        <div
          ref={ref}
          className={styles.timelineGrid}
        >
          {items.map((item, idx) => (
            <m.div
              key={`${item.year}-${idx}`}
              className={styles.timelineItem}
              initial={shouldReduceMotion ? 'visible' : 'hidden'}
              animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
              variants={itemVariants}
              transition={{ delay: shouldReduceMotion ? 0 : idx * 0.05 }}
            >
              {/* Mobile vertical line */}
              {idx < items.length - 1 ? (
                <div
                  className={styles.mobileConnector}
                  aria-hidden
                />
              ) : null}

              {/* Dot with animation and pulse effect */}
              <m.span
                className={`${styles.dot} ${item.isNow ? styles.dotNow : ''}`}
                aria-hidden
                initial={shouldReduceMotion ? 'visible' : 'hidden'}
                animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
                variants={dotVariants}
                transition={{
                  delay: shouldReduceMotion ? 0 : (idx / items.length) * 2.5,
                }}
              />

              {/* Year badge */}
              <div className={styles.yearRow}>
                <span
                  className={`font-service-timeline-label ${styles.yearLabel} ${item.isNow ? styles.nowAccent : ''}`}
                >
                  {item.year}
                </span>
                {item.isNow && (
                  <span className={`${styles.currentPill} font-service-timeline-pill`}>
                    Current
                  </span>
                )}
              </div>

              {/* Title */}
              <h4
                className={`font-service-timeline-title ${styles.title} ${item.isNow ? styles.nowAccent : ''}`}
              >
                {item.title}
              </h4>

              {/* Description */}
              <p className={`font-service-timeline-body ${styles.desc}`}>
                {item.desc}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </>
  );

  if (inline) {
    return <div className={styles.inlineWrapper}>{timelineContent}</div>;
  }

  return (
    <section
      className={styles.section}
    >
      <div className="service-shell">{timelineContent}</div>
    </section>
  );
};
