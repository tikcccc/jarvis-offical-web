'use client';

import { useEffect, useState } from 'react';
import { TypewriterText } from '@/components/animations/typewriter';
import styles from './hero-section.module.css';

const TYPEWRITER_TEXT = 'Automate invoices, tenders, and forms.';
const COUNTER_TARGET = 99.8;
const COUNTER_DURATION = 1400; // ms

export function HeroSection() {
  const [counter, setCounter] = useState(0);

  // Counter animation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / COUNTER_DURATION, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = eased * COUNTER_TARGET;

      setCounter(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Layer 0: Dynamic Gradient Blobs */}
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      {/* Kinetic Typography Background */}
      <div className={styles.kineticBg}>
        <div className={styles.marqueeRow1}>
          <div className={styles.marqueeContent}>
            <span className={styles.marqueeText}>
              JARVIS AI SUITE &nbsp; JARVIS AI SUITE &nbsp; JARVIS AI SUITE &nbsp; JARVIS AI SUITE
            </span>
            <span className={styles.marqueeText}>
              JARVIS AI SUITE &nbsp; JARVIS AI SUITE &nbsp; JARVIS AI SUITE &nbsp; JARVIS AI SUITE
            </span>
          </div>
        </div>

        <div className={styles.marqueeRow2}>
          <div className={styles.marqueeContentReverse}>
            <span className={styles.marqueeTextOutline}>
              INTELLIGENT BLUEPRINT &nbsp; INTELLIGENT BLUEPRINT &nbsp; INTELLIGENT BLUEPRINT
            </span>
            <span className={styles.marqueeTextOutline}>
              INTELLIGENT BLUEPRINT &nbsp; INTELLIGENT BLUEPRINT &nbsp; INTELLIGENT BLUEPRINT
            </span>
          </div>
        </div>

        <div className={styles.marqueeRow3}>
          <div className={styles.marqueeContent}>
            <span className={styles.marqueeText}>
              JARVIS AI SUITE &nbsp; JARVIS AI SUITE &nbsp; JARVIS AI SUITE &nbsp; JARVIS AI SUITE
            </span>
            <span className={styles.marqueeText}>
              JARVIS AI SUITE &nbsp; JARVIS AI SUITE &nbsp; JARVIS AI SUITE &nbsp; JARVIS AI SUITE
            </span>
          </div>
        </div>
      </div>

      {/* Decoration Lines */}
      <div className={styles.decorLineRight} />
      <div className={styles.decorLineBottom} />

      {/* Main Content */}
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            JARVIS<br />
            <span className="gradient-text">AI Suite</span>
          </h1>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Typewriter */}
          <div className={styles.typewriterPanel}>
            <div className={styles.inputLabel}>
              <span className={styles.pulsingDot} />
              <span className={styles.labelText}>Input Stream</span>
            </div>
            <div className={styles.typewriterOutput}>
              <p className={styles.typewriterText}>
                &gt;{' '}
                <TypewriterText
                  text={TYPEWRITER_TEXT}
                  speed={35}
                  cursorVisible
                  cursorChar="|"
                  cursorColor="var(--jarvis-accent-primary)"
                />
              </p>
            </div>
          </div>

          {/* Right Column: Counter */}
          <div className={styles.counterPanel}>
            <div className={styles.counterDisplay}>
              <div className={styles.counterNumber}>
                {counter.toFixed(1)}
              </div>
              <div className={styles.counterPercent}>
                <span>%</span>
              </div>
            </div>

            <div className={styles.counterMeta}>
              <div className={styles.counterLabel}>
                <div className={styles.labelLine} />
                OCR Accuracy
              </div>

              <div className={styles.progressLabels}>
                <span>Processing</span>
                <span>Done</span>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(counter / COUNTER_TARGET) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
