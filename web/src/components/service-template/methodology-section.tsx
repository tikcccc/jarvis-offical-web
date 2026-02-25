'use client';

import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';
import { TimelineSection } from './timeline-section';
import shared from './service-shared.module.css';
import styles from './methodology-section.module.css';

interface MethodologySectionProps {
  narrative: ServiceContent['narrative'];
  sectionTitleClass: string;
  colors: {
    textStrong: string;
    textBase: string;
    textMuted: string;
    textSub: string;
  };
  timeline?: ServiceContent['timeline'];
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({
  narrative,
  sectionTitleClass,
  colors,
  timeline,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const title = (
    <h2 className={`${sectionTitleClass} mb-10 md:mb-14`}>
      {narrative.label}
    </h2>
  );

  const leadBlock = (
    <div className="space-y-4">
      <h3 className={`font-service-headline ${colors.textStrong}`}>
        {narrative.lead}
      </h3>
      <p className={`font-service-subheadline ${colors.textMuted}`}>
        {narrative.sub}
      </p>
    </div>
  );

  return (
    <section className={`${shared.sectionBase} ${shared.sectionBaseLight}`}>
      <div className={`service-shell ${shared.padLg}`}>
        {shouldReduceMotion ? (
          title
        ) : (
          <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow}>
            {title}
          </ScrollReveal>
        )}

        <div className={`${styles.methodGrid} items-center`}>
          <div className="md:col-span-6">
            {shouldReduceMotion ? (
              leadBlock
            ) : (
              <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow} delay={0.08}>
                {leadBlock}
              </ScrollReveal>
            )}
          </div>
          
          <div className="md:col-span-1 hidden md:block h-full">
            <div className={styles.methodDivider}></div>
          </div> 

          <div className="md:col-span-5 space-y-8">
            <p className={`font-service-body ${colors.textBase}`}>
              {narrative.p1}
            </p>
            <p className={`font-service-body-muted ${colors.textMuted}`}>
              {narrative.p2}
            </p>
          </div>
        </div>

        {timeline ? (
          <div className="mt-24 md:mt-28 pt-4">
            <TimelineSection
              inline
              heading={timeline.heading}
              items={timeline.items}
              sectionTitleClass={sectionTitleClass}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};
