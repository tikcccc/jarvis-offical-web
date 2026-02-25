"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as m from "@/paraglide/messages";
import { cn } from "@/lib/utils";
import { useTransitionComplete } from "@/components/layout/page-transition";
import styles from "./section3-placeholder.module.css";

gsap.registerPlugin(ScrollTrigger);

export function Section3Placeholder() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const isTransitionComplete = useTransitionComplete();

  useLayoutEffect(() => {
    if (!isTransitionComplete) return;

    const ctx = gsap.context(() => {
      if (textRef.current && triggerRef.current) {
        // Create the "sparse to dense" animation
        gsap.fromTo(
          textRef.current,
          {
            // FROM: Sparse state
            lineHeight: "1.5",
            opacity: 0.5,
            y: 60,
          },
          {
            // TO: Dense state
            lineHeight: "1.1",
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: triggerRef.current,
              start: "top 75%",
              end: "center center",
              scrub: 1,
              markers: false,
              invalidateOnRefresh: true,
            },
          }
        );

        // Recompute trigger positions now that transition is done
        ScrollTrigger.refresh();
      }
    }, triggerRef);

    // Cleanup using context revert
    return () => ctx.revert();
  }, [isTransitionComplete]);

  return (
    <section
      className={cn("relative z-10 section-padding", styles.section)}
    >
      {/* Trigger zone with auto height */}
      <div
        ref={triggerRef}
        className="flex items-center justify-center relative min-h-[40vh]"
      >
        {/* Text content that animates */}
        <h1
          ref={textRef}
          className={cn("container-content text-center font-narrative", styles.title, styles.textInitial)}
        >
          {m.section3_narrative_prefix()}
          <span className={styles.soft}>{m.section3_narrative_faster()}</span>
          <span className={styles.soft}>{m.section3_narrative_comma1()}</span>
          <span className={styles.soft}>{m.section3_narrative_cheaper()}</span>
          <span className={styles.soft}>{m.section3_narrative_comma2()}</span>
          <span className={styles.soft}>{m.section3_narrative_safer()}</span>
          <span className={styles.soft}>{m.section3_narrative_and()}</span>
          <span className={styles.soft}>{m.section3_narrative_greener()}</span>
          <span className={styles.soft}>{m.section3_narrative_suffix()}</span>
        </h1>
      </div>
    </section>
  );
}
