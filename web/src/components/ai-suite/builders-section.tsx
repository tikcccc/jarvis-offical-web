'use client';

import * as m from '@/paraglide/messages';
import styles from './builders-section.module.css';

export function BuildersSection() {
  const featureItems = [
    {
      id: 'lifecycle',
      title: m.jarvis_suite_builders_feature1_title(),
      description: m.jarvis_suite_builders_feature1_desc(),
    },
    {
      id: 'teams',
      title: m.jarvis_suite_builders_feature2_title(),
      description: m.jarvis_suite_builders_feature2_desc(),
    },
    {
      id: 'enterprise',
      title: m.jarvis_suite_builders_feature3_title(),
      description: m.jarvis_suite_builders_feature3_desc(),
    },
  ];

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
                {m.jarvis_suite_builders_chip_isbim_dataset()}
              </div>
              <div className={styles.chip}>
                <span className={styles.chipDotCyan} />
                {m.jarvis_suite_builders_chip_alibaba_models()}
              </div>
            </div>

            {/* Main Heading */}
            <h2 className={styles.heading}>
              {m.jarvis_suite_interlude_title_part1()}
              <br />
              {m.jarvis_suite_interlude_title_part2()}
            </h2>

            {/* Description */}
            <p className={styles.description}>
              {m.jarvis_suite_builders_description_prefix()}
              <span className={styles.highlight}>
                {m.jarvis_suite_builders_description_highlight()}
              </span>
              {m.jarvis_suite_builders_description_suffix()}
            </p>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <div className={styles.bodyText}>
              <p className={styles.bodyLead}>
                {m.jarvis_suite_builders_body_lead()}
              </p>
              <p className={styles.bodyParagraph}>
                {m.jarvis_suite_builders_body_paragraph()}
              </p>
            </div>

            <div className={styles.featureList}>
              {featureItems.map((item) => (
                <div key={item.id} className={styles.featureCard}>
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
