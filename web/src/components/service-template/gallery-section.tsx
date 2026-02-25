'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { m } from '@/components/motion/lazy-motion';
import { TypewriterText } from '@/components/animations';
import { useInView } from '@/hooks';
import { DESIGN_TOKENS } from '@/lib/design-tokens';
import { ServiceContent } from '@/data/services';
import { Link } from '@/lib/i18n';
import { SmartImage } from '@/components/ui/smart-image';
import shared from './service-shared.module.css';
import styles from './gallery-section.module.css';

interface GallerySectionProps {
  gallery: ServiceContent['gallery'];
  heading: string;
  sectionTitleClass: string;
  imageVariants?: Record<
    string,
    { src: string; fallback?: string; sources?: { src: string; type?: string; media?: string }[] }
  >;
  colors: {
    textInvStrong: string;
    textInvBase: string;
    textInvMuted: string;
    textInvSub: string;
  };
  contactHref?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  gallery,
  heading,
  sectionTitleClass,
  imageVariants,
  colors,
  contactHref,
}) => {
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <section className={`${shared.sectionBase} ${shared.sectionBaseDark} service-section-xl`}>
      <div className="service-shell">
        <div className={`${styles.galleryHeader}`}>
          <div>
            <span className={`${sectionTitleClass} ${colors.textInvSub} mb-12`}>
              {heading}
            </span>
            <h2 className={`font-service-display ${colors.textInvStrong}`}>{gallery.title}</h2>
          </div>
          <div className="text-right mt-8 md:mt-0">
            <p className={`font-service-meta ${colors.textInvBase}`}>{gallery.meta}</p>
          </div>
        </div>

        <div className="space-y-32">
          {gallery.items.map((item, idx) => (
            <GalleryItem
              key={idx}
              item={item}
              index={idx}
              imageVariants={imageVariants}
              colors={colors}
              shouldReduceMotion={shouldReduceMotion}
              contactHref={contactHref}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface GalleryItemProps {
  item: GallerySectionProps['gallery']['items'][number];
  index: number;
  imageVariants?: GallerySectionProps['imageVariants'];
  colors: GallerySectionProps['colors'];
  shouldReduceMotion: boolean;
  contactHref?: string;
}

function GalleryItem({ item, index, colors, shouldReduceMotion, contactHref, imageVariants }: GalleryItemProps) {
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

  const rowVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DESIGN_TOKENS.animation.duration.slow,
        ease: DESIGN_TOKENS.animation.easing.easeOut,
        delay: shouldReduceMotion ? 0 : index * 0.08,
      },
    },
  };

  const labelText = `${item.id} — ${item.loc}`;
  const destination = item.href || contactHref;
  const Wrapper: React.ElementType = destination ? Link : 'div';
  const wrapperProps = destination
    ? {
        href: destination,
        'aria-label': `${item.title} – ${item.href ? 'external link' : 'contact us'}`,
        className: 'block',
        target: item.href ? '_blank' : undefined,
        rel: item.href ? 'noreferrer' : undefined,
      }
    : { className: 'block' };
  const variant = imageVariants?.[item.img];
  const imageSrc = variant?.src ?? item.img;
  const imageSources = variant?.sources;
  const imageFallback = variant?.fallback ?? item.img;

  return (
    <Wrapper {...wrapperProps}>
      <m.div
        ref={ref}
        className={`group ${styles.galleryGrid} md:grid-cols-12 items-center cursor-pointer`}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate={shouldReduceMotion ? 'visible' : inView ? 'visible' : 'hidden'}
        variants={rowVariants}
      >
        <div className={`md:col-span-7 overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
          <div className={`${styles.galleryMedia}`}>
            <SmartImage
              src={imageSrc}
              sources={imageSources}
              fallbackSrc={imageFallback}
              alt={item.loc}
              fill
              sizes="(min-width: 1024px) 60vw, 90vw"
              imageClassName="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>
        </div>
        <div className={`md:col-span-5 flex flex-col h-full justify-center py-4 ${index % 2 === 1 ? 'md:order-1 md:text-right' : ''}`}>
          <div>
            <span className={`font-service-label mb-6 block ${colors.textInvSub}`}>
              {startTypewriter && !shouldReduceMotion ? (
                <TypewriterText
                  text={labelText}
                  className={colors.textInvSub}
                  delay={index * DESIGN_TOKENS.animation.stagger.relaxed}
                  cursorVisible={false}
                />
              ) : (
                <span aria-hidden>{labelText}</span>
              )}
            </span>
            <h3 className={`font-service-item-title mb-6 ${colors.textInvStrong} group-hover:${colors.textInvMuted} transition-colors`}>
              {item.title}
            </h3>
            <p className={`font-service-item-body mb-8 ${colors.textInvBase} ${index % 2 === 1 ? 'ml-auto' : ''} max-w-md`}>
              {item.desc}
            </p>
          </div>
          <div className={`flex items-center border-t border-[rgba(255,255,255,0.2)] pt-6 ${index % 2 === 1 ? 'justify-end' : 'justify-between'}`}>
            <span className={`font-service-metric ${colors.textInvStrong} ${index % 2 === 1 ? 'order-2 ml-4' : ''}`}>{item.metric}</span>
            <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
          </div>
        </div>
      </m.div>
    </Wrapper>
  );
}
