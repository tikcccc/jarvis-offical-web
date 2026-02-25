'use client';

import styles from './cta-section.module.css';

export function CtaSection() {
  return (
    <section className={styles.section}>
      {/* Grid Background */}
      <div className={styles.gridBg} />

      {/* Top Gradient Line */}
      <div className={styles.topLine} />

      <div className={styles.container}>
        <span className={styles.status}>System Status: Ready</span>

        <h2 className={styles.heading}>
          See JARVIS <br />
          <span className={styles.headingItalic}>in action.</span>
        </h2>

        <div className={styles.buttonWrapper}>
          <button className={styles.ctaButton}>
            <div className={styles.buttonGradient} />
            <span className={styles.buttonText}>
              Request Live Demo
              <span className={styles.pulsingDot} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
