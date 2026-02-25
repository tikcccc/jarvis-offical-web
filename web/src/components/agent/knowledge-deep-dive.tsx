'use client';

import { useState } from 'react';
import { Brain, Network, Shield, Database } from 'lucide-react';
import * as m from '@/paraglide/messages';
import styles from './knowledge-deep-dive.module.css';

export function KnowledgeDeepDive() {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    {
      id: 'intelligence',
      icon: Database,
      title: m.jarvis_agent_deep_dive_feature1_title(),
      subtitle: m.jarvis_agent_deep_dive_feature1_subtitle(),
      desc: m.jarvis_agent_deep_dive_feature1_desc(),
    },
    {
      id: 'culture',
      icon: Network,
      title: m.jarvis_agent_deep_dive_feature2_title(),
      subtitle: m.jarvis_agent_deep_dive_feature2_subtitle(),
      desc: m.jarvis_agent_deep_dive_feature2_desc(),
    },
    {
      id: 'guardrails',
      icon: Shield,
      title: m.jarvis_agent_deep_dive_feature3_title(),
      subtitle: m.jarvis_agent_deep_dive_feature3_subtitle(),
      desc: m.jarvis_agent_deep_dive_feature3_desc(),
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.shell} data-active={activeFeature}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className="font-product-label-regular">{m.jarvis_agent_deep_dive_label()}</span>
            <h2 className={`font-product-title-md ${styles.title}`}>
              <span>{m.jarvis_agent_deep_dive_title_part1()}</span>
              <span className={styles.titleAccent}>{m.jarvis_agent_deep_dive_title_part2()}</span>
            </h2>
          </div>

          <div className={styles.stack}>
            {features.map(({ id, icon: Icon, title, subtitle, desc }, idx) => (
              <button
                key={id}
                type="button"
                className={`${styles.card} ${activeFeature === idx ? styles.cardActive : styles.cardMuted}`}
                onMouseEnter={() => setActiveFeature(idx)}
                onFocus={() => setActiveFeature(idx)}
              >
                <div className={styles.iconWrap}>
                  <Icon className={styles.icon} />
                </div>
                <div className={styles.cardBody}>
                  <div className={`font-product-label-regular ${styles.cardMeta}`}>{subtitle}</div>
                  <h3 className={`font-product-title-sm text-[1.32rem] ${styles.cardTitle}`}>{title}</h3>
                  <p className={`font-product-body ${styles.cardDesc}`}>{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.halo} aria-hidden />
          <div className={`${styles.orbit} ${styles.orbitViolet}`}>
            <span className={`${styles.orbitDot} ${styles.orbitDotViolet}`} />
          </div>
          <div className={`${styles.orbit} ${styles.orbitCyan}`}>
            <span className={`${styles.orbitDot} ${styles.orbitDotCyan}`} />
          </div>
          <div className={`${styles.orbit} ${styles.orbitMint}`}>
            <span className={`${styles.orbitDot} ${styles.orbitDotMint}`} />
          </div>
          <span className={`${styles.spark} ${styles.sparkOne}`} aria-hidden />
          <span className={`${styles.spark} ${styles.sparkTwo}`} aria-hidden />
          <span className={`${styles.spark} ${styles.sparkThree}`} aria-hidden />
          <div className={styles.brain}>
            <Brain className={styles.brainIcon} />
          </div>
        </div>
      </div>
    </section>
  );
}
