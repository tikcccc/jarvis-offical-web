'use client';

import { ChevronRight } from 'lucide-react';
import * as m from '@/paraglide/messages';
import styles from './evolution-summary.module.css';

export function EvolutionSummary() {
  const steps = [
    {
      id: '01',
      title: m.jarvis_agent_evolution_step1_title(),
      desc: m.jarvis_agent_evolution_step1_desc(),
      accent: 'indigo',
    },
    {
      id: '02',
      title: m.jarvis_agent_evolution_step2_title(),
      desc: m.jarvis_agent_evolution_step2_desc(),
      accent: 'cyan',
    },
    {
      id: '03',
      title: m.jarvis_agent_evolution_step3_title(),
      desc: m.jarvis_agent_evolution_step3_desc(),
      accent: 'gradient',
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <h2 className={styles.title}>{m.jarvis_agent_evolution_title()}</h2>
          <p className={styles.lead}>{m.jarvis_agent_evolution_lead()}</p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.trackHorizontal} aria-hidden />
          <div className={styles.trackVertical} aria-hidden />

          <div className={styles.grid}>
            {steps.map((step) => (
              <div key={step.id} className={styles.step}>
                <div className={`${styles.node} ${styles[`node-${step.accent}`]}`}>{step.id}</div>
                <div className={styles.card}>
                  <div className={styles.cardInner}>
                    <h3 className={styles.cardTitle}>{step.title}</h3>
                    <p className={styles.cardDesc}>{step.desc}</p>
                  </div>
                  <div className={styles.arrow}>
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.result}>
          <div className={styles.resultText}>{m.jarvis_agent_evolution_result_label()}</div>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <div className={styles.metricValue}>
                <span className={styles.metricNumber}>80</span>
                <span className={styles.metricSuffix}>%</span>
              </div>
              <div className={styles.metricLabel}>{m.jarvis_agent_evolution_metric1_label()}</div>
            </div>

            <div className={styles.divider} />

            <div className={styles.metric}>
              <div className={styles.metricValue}>
                <span className={styles.metricNumber}>3</span>
                <span className={styles.metricSuffix}>x</span>
              </div>
              <div className={styles.metricLabel}>{m.jarvis_agent_evolution_metric2_label()}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.sectionDivider} aria-hidden />
    </section>
  );
}
