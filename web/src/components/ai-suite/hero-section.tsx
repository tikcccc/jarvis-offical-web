'use client';

import { TypewriterText } from '@/components/animations/typewriter';
import * as m from '@/paraglide/messages';
import { SmartImage } from '@/components/ui/smart-image';
import styles from './hero-section.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background layer */}
      <div className={styles.background} aria-hidden="true">
        {/* 背景圖片 - 帶緩慢縮放動畫 */}
        <SmartImage
          src="/images/ai-suite/hero.avif"
          sources={[
            { src: "/images/ai-suite/hero.webp", type: "image/webp" },
          ]}
          fallbackSrc="/images/ai-suite/hero.jpg"
          alt="JARVIS AI Suite background"
          fill
          sizes="100vw"
          priority
          fetchPriority="high"
          preload
          wrapperClassName={styles.backgroundImage}
          imageClassName="will-change-transform"
        />
        {/* 層 1：基礎暗化漸變 */}
        <div className={styles.backgroundOverlay} />
        {/* 層 2：徑向暈影聚焦 */}
        <div className={styles.backgroundVignette} />
        {/* 層 3：光暈呼吸效果 */}
        <div className={styles.lightPulse} />
        {/* 層 4：微粒浮動效果 */}
        <div className={styles.particles} />
      </div>

      {/* Decoration Lines */}
      <div className={styles.decorLineRight} />
      <div className={styles.decorLineBottom} />

      {/* Main Content */}
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            {m.jarvis_suite_hero_title_line1()}
            <br />
            <span className={styles.gradientText}>
              {m.jarvis_suite_hero_title_line2()}
            </span>
          </h1>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Typewriter */}
          <div className={styles.typewriterPanel}>
            <div className={styles.inputLabel}>
              <span className={styles.pulsingDot} />
              <span className={styles.labelText}>
                {m.jarvis_suite_hero_input_stream()}
              </span>
            </div>
            <div className={styles.typewriterOutput}>
              <p className={styles.typewriterText}>
                &gt;{' '}
                <TypewriterText
                  text={m.jarvis_suite_hero_typewriter_text()}
                  speed={35}
                  cursorVisible
                  cursorChar="|"
                  cursorColor="#ffffff"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
