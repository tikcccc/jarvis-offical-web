'use client';

import { useState } from 'react';
import { Link } from '@/lib/i18n';
import { ROUTES } from '@/lib/constants';
import styles from './generate-section.module.css';

interface GenerateItem {
  id: number;
  title: string;
  description: string;
  accentColor: 'purple' | 'cyan';
  href: string;
}

const ITEMS: GenerateItem[] = [
  {
    id: 0,
    title: 'JARVIS Agent',
    description:
      'Automates repetitive tasks such as invoice scanning with 99.8% accuracy. Features tender parsing and auto-scoring.',
    accentColor: 'purple',
    href: ROUTES.JARVIS.AGENT,
  },
  {
    id: 1,
    title: 'JARVIS Pay',
    description:
      'Digitizes Bills of Quantities and links payment milestones to 360° digital twins, enabling 60-day certification.',
    accentColor: 'cyan',
    href: ROUTES.JARVIS.PAY,
  },
  {
    id: 2,
    title: 'JARVIS Air',
    description:
      'Generates 3D models directly from 2D drawings, streamlining workflows for architects and engineers.',
    accentColor: 'purple',
    href: ROUTES.JARVIS.AIR,
  },
];

export function GenerateSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <span className={styles.label}>Generative & Strategic Intelligence</span>
            <h2 className={styles.heading}>
              Generate. <span className={styles.headingMuted}>Automate.</span>{' '}
              <span className="gradient-text">Capitalize.</span>
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {/* Product List Column */}
          <div className={styles.productColumn}>
            {ITEMS.map((item, idx) => (
              <Link
                key={item.id}
                className={`${styles.productItem} ${activeIndex === idx ? styles.productItemActive : ''} ${
                  item.accentColor === 'purple' ? styles.productItemPurple : styles.productItemCyan
                }`}
                href={item.href}
                prefetch
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

          {/* Right: Visual Placeholder */}
          <div className={styles.visualColumn}>
            <div className={styles.screenContainer}>
              <div className={styles.visualPlaceholder}>
                <div className={styles.placeholderText}>
                  {ITEMS[activeIndex].title}
                  <br />
                  <span>Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
