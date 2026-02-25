'use client';

import styles from './builders-section.module.css';

const FEATURE_ITEMS = [
  {
    title: 'Full project lifecycle',
    description: 'From finance and design to tendering, site execution, inspection, payment, and FM.',
  },
  {
    title: 'Built for real teams',
    description: 'Owners, consultants, contractors, and quantity surveyors share one assistant and one truth.',
  },
  {
    title: 'Enterprise-ready',
    description: 'Alibaba frontier models + isBIM dataset; security, auditability, and governance baked in.',
  },
];

export function BuildersSection() {
  return (
    <section className={styles.section}>
      {/* Decoration Lines */}
      <div className={styles.decorLineRight} />
      <div className={styles.decorLineCenter} />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Chips */}
            <div className={styles.chips}>
              <div className={styles.chip}>
                <span className={styles.chipDotPurple} />
                isBIM DATASET
              </div>
              <div className={styles.chip}>
                <span className={styles.chipDotCyan} />
                ALIBABA MODELS
              </div>
            </div>

            {/* Main Heading */}
            <h2 className={styles.heading}>
              Designed <br />
              for Builders
            </h2>

            {/* Description */}
            <p className={styles.description}>
              Decades of engineering expertise, distilled into an{' '}
              <span className={styles.highlight}>agentic assistant</span>.
            </p>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <div className={styles.bodyText}>
              <p className={styles.bodyLead}>
                Powered by isBIM’s proprietary dataset and Alibaba’s frontier models.
              </p>
              <p className={styles.bodyParagraph}>
                Accelerating operations with one assistant across planning, delivery, and facility ops.
              </p>
            </div>

            <div className={styles.featureList}>
              {FEATURE_ITEMS.map((item) => (
                <div key={item.title} className={styles.featureCard}>
                  <div className={styles.featureTitle}>{item.title}</div>
                  <div className={styles.featureDesc}>{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
