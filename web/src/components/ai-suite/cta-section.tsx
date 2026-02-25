"use client";

import { LocalizedLink } from "@/components/ui/localized-link";
import { ROUTES } from "@/lib/constants";
import * as m from "@/paraglide/messages";
import styles from "./cta-section.module.css";

export function CtaSection() {
  return (
    <section className={styles.section}>
      {/* Grid Background */}
      <div className={styles.gridBg} />

      {/* Top Gradient Line */}
      <div className={styles.topLine} />

      <div className={styles.container}>
        <span className={styles.status}>{m.jarvis_suite_cta_status_ready()}</span>

        <h2 className={styles.heading}>
          {m.jarvis_suite_cta_heading_line1()}
          <br />
          <span className={styles.headingItalic}>
            {m.jarvis_suite_cta_heading_italic()}
          </span>
        </h2>

        <div className={styles.buttonWrapper}>
          <LocalizedLink
            href={ROUTES.CONTACT}
            prefetchMode="hover"
            className={styles.ctaButton}
          >
            <div className={styles.buttonGradient} />
            <span className={styles.buttonText}>
              {m.jarvis_suite_cta_button_request_demo()}
              <span className={styles.pulsingDot} />
            </span>
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
