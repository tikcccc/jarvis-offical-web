'use client';

import { useState } from 'react';
import { Link } from '@/lib/i18n';
import { ROUTES } from '@/lib/constants';
import styles from './sense-section.module.css';

interface SenseItem {
  id: number;
  title: string;
  description: string;
  displayTitle: string;
  href: string;
}

const ITEMS: SenseItem[] = [
  {
    id: 0,
    title: 'JARVIS Eagle Eye',
    displayTitle: 'LIVE_FEED // EAGLE_EYE',
    description:
      'Real-time digital twin with IoT and 360 capture for remote monitoring and anomaly detection.',
    href: ROUTES.JARVIS.EAGLE_EYE,
  },
  {
    id: 1,
    title: 'JARVIS SSSS',
    displayTitle: 'LIVE_FEED // SSSS',
    description:
      'Smart Site Safety System utilizing AI wearables to instantly alert and prevent hazards.',
    href: ROUTES.JARVIS.SSSS,
  },
  {
    id: 2,
    title: 'JARVIS DWSS',
    displayTitle: 'LIVE_FEED // DWSS',
    description:
      'Digital Works Supervision System ensuring compliance with blockchain-backed audit trails.',
    href: ROUTES.JARVIS.DWSS,
  },
  {
    id: 3,
    title: 'JARVIS CDCP',
    displayTitle: 'LIVE_FEED // CDCP',
    description:
      'Common Data Environment hub for interoperable BIM collaboration and version control.',
    href: ROUTES.JARVIS.CDCP,
  },
  {
    id: 4,
    title: 'JARVIS Assets',
    displayTitle: 'LIVE_FEED // ASSETS',
    description:
      'AI-driven predictive maintenance and ESG tracking for full lifecycle facility optimization.',
    href: ROUTES.JARVIS.ASSETS,
  },
];

export function SenseSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.section}>
      {/* Grid Background */}
      <div className={styles.gridBg} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <span className={styles.label}>Live Digital Twin & Site OS</span>
            <h2 className={styles.heading}>
              Sense. <span className={styles.headingMuted}>Secure.</span>{' '}
              <span className={styles.headingNeon}>Sustain.</span>
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {/* Left: Glass Panel Dashboard */}
          <div className={styles.dashboardColumn}>
            <div className={styles.glassPanel}>
              {/* Top Bar */}
              <div className={styles.topBar}>
                <div className={styles.topBarTitle}>{ITEMS[activeIndex].displayTitle}</div>
                <div className={styles.topBarIndicator}>
                  <div className={styles.recDot} />
                  <span className={styles.recText}>REC</span>
                </div>
              </div>

              {/* Content Area */}
              <div className={styles.contentArea}>
                <div className={styles.placeholderText}>
                  {ITEMS[activeIndex].title}
                  <br />
                  <span>Live Feed</span>
                </div>
              </div>

              {/* Grid Overlay */}
              <div className={styles.gridOverlay} />
            </div>
          </div>

          {/* Product List Column */}
          <div className={styles.productColumn}>
            {ITEMS.map((item, idx) => (
              <Link
                key={item.id}
                href={item.href}
                prefetch
                className={`${styles.productItem} ${activeIndex === idx ? styles.productItemActive : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className={styles.productItemHeader}>
                  <h3 className={styles.productItemTitle}>{item.title}</h3>
                  <svg
                    className={styles.arrow}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
                <div className={styles.productItemDesc}>{item.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
