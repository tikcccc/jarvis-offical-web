'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { TypewriterText } from '@/components/animations';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { useInView } from '@/hooks';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';
import shared from './service-shared.module.css';
import styles from './engine-section.module.css';

interface EngineSectionProps {
  items: ServiceContent['engine'];
  heading: string;
  sectionTitleClass: string;
  colors: {
    textStrong: string;
    textBase: string;
    textMuted: string;
    textSub: string;
  };
}

export const EngineSection: React.FC<EngineSectionProps> = ({
  items,
  heading,
  sectionTitleClass,
  colors,
}) => {
  const renderWithBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-service-card-body-strong">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: DESIGN_TOKENS.animation.stagger.relaxed,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
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
    <section className={`${shared.sectionBase} ${shared.sectionBaseSubtle}`}>
      <div className={`service-shell ${shared.padLg}`}>
        {shouldReduceMotion ? (
          <h3 className={`${sectionTitleClass} mb-10 md:mb-14`}>{heading}</h3>
        ) : (
          <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow}>
            <h3 className={`${sectionTitleClass} mb-10 md:mb-14`}>{heading}</h3>
          </ScrollReveal>
        )}
        
        <m.div
          ref={ref}
          className={styles.engineList}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {items.map((item, idx) => (
            <m.div
              key={idx}
              variants={itemVariants}
              className={`group ${styles.engineItem} md:flex-row md:items-center py-10 md:py-12 transition-colors duration-300 hover:bg-[var(--surface-base)]`}>
              <span className={`font-service-index mr-8 md:mr-12 md:self-start ${colors.textSub} group-hover:${colors.textStrong} transition-colors min-w-[3ch]`}>
                {startTypewriter && !shouldReduceMotion ? (
                  <TypewriterText
                    text={item.id}
                    className={`inline-block ${colors.textSub}`}
                    delay={idx * DESIGN_TOKENS.animation.stagger.relaxed}
                    cursorVisible={false}
                  />
                ) : (
                  <span aria-hidden>{item.id}</span>
                )}
              </span>
              <h4
                className={`font-service-card-title w-full md:w-1/3 mb-4 md:mb-0 ${colors.textStrong}`}
              >
                {item.title}
              </h4>
              <p
                className={`font-service-card-body w-full md:w-1/2 ${colors.textMuted} group-hover:${colors.textBase} transition-colors`}
              >
                {renderWithBold(item.desc)}
              </p>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
};
