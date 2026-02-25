'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { TypewriterText } from '@/components/animations';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';
import styles from './hero-section.module.css';

interface HeroSectionProps {
  hero: ServiceContent['hero'];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  const shouldReduceMotion = useReducedMotion();
  const descText = hero.desc.includes('\n') ? hero.desc : hero.desc.replace(' — ', '\n— ');
  const tagLine = shouldReduceMotion ? (
    <span className={`font-service-hero-tag ${styles.heroTag}`}>
      {hero.tag}
    </span>
  ) : (
    <TypewriterText
      text={hero.tag}
      className={`font-service-hero-tag ${styles.heroTag}`}
      cursorVisible={false}
    />
  );

  return (
    <header className={styles.hero}>
      <div className={`${styles.heroInner} text-white`}>
        <div className={`${styles.heroGrid} items-end`}>
          
          {/* Main Title Area */}
          <div className="col-span-12 lg:col-span-8">
            <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow}>
              <div className={styles.heroDivider}></div>
            </ScrollReveal>
            
            <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow}>
              <h1 className={`${styles.heroTitle} font-service-hero-mega mb-4`}>
                {hero.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal animation="slide-up" duration={DESIGN_TOKENS.animation.duration.slow} delay={0.12}>
              <h2 className={`${styles.heroSubtitle} font-service-hero-sub`}>
                {hero.subTitle}
              </h2>
            </ScrollReveal>
          </div>

          {/* Description & Meta Area */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-end">
            <ScrollReveal animation="fade" duration={DESIGN_TOKENS.animation.duration.normal} delay={0.1}>
              <div className={styles.heroDescWrap}>
                <p className={`${styles.heroDesc} font-service-hero-subtitle whitespace-pre-line`}>
                  {descText}
                </p>
                {tagLine}
              </div>
            </ScrollReveal>

            {shouldReduceMotion ? (
              <ChevronDown className="w-6 h-6 text-white/50" />
            ) : (
              <ScrollReveal animation="fade" duration={DESIGN_TOKENS.animation.duration.normal} delay={0.3}>
                <div className="animate-bounce">
                  <ChevronDown className="w-6 h-6 text-white/50" />
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
