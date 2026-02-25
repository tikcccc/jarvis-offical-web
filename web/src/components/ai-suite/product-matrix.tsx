"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import * as m from "@/paraglide/messages";
import { JARVIS_POSTERS, JARVIS_VIDEOS } from "@/lib/media-config";
import { ROUTES } from "@/lib/constants";
import { LocalizedLink } from "@/components/ui/localized-link";
import styles from "./product-matrix.module.css";

type Product = {
  id: string;
  shortName: string;
  desc: string;
  category: string;
  video: string;
  poster?: string;
  href: string;
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35, rootMargin: "80px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hovered) {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          /* ignore autoplay errors */
        });
      }
    } else {
      video.pause();
    }
  }, [hovered]);

  return (
    <LocalizedLink
      ref={cardRef}
      href={product.href}
      prefetchMode="hover"
      className={styles.card}
      style={{
        transition: "opacity 260ms ease, transform 260ms ease",
        transitionDelay: visible ? `${(index % 4) * 80}ms` : "0ms",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(12px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.videoLayer}>
        <video
          ref={videoRef}
          src={product.video}
          poster={product.poster}
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className={styles.videoOverlay} />
        <div className={styles.scanOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <div className={styles.metaBlock}>
            <span className={styles.metaId}>
              <span className={styles.metaDot} />
              {product.id}
            </span>
            <span className={styles.metaCategory}>{product.category}</span>
          </div>
          <ArrowUpRight className={styles.arrow} />
        </div>

        <div>
          <h3 className={styles.name}>{product.shortName}</h3>
          <p className={styles.desc}>{product.desc}</p>
          <div className={styles.footer}>
            <span className={styles.footerLabel}>{m.jarvis_suite_matrix_access_module()}</span>
            <span className={styles.statusBars} aria-hidden>
              <span className={styles.statusBar} />
              <span className={styles.statusBar} />
              <span className={styles.statusBar} />
            </span>
          </div>
        </div>
      </div>
    </LocalizedLink>
  );
}

export function ProductMatrix() {
  const products: Product[] = [
    {
      id: "01",
      shortName: m.jarvis_suite_matrix_agent_shortname(),
      desc: m.jarvis_suite_matrix_agent_desc(),
      category: m.jarvis_suite_matrix_agent_category(),
      video: JARVIS_VIDEOS.agent,
      poster: JARVIS_POSTERS.agent,
      href: ROUTES.JARVIS.AGENT,
    },
    {
      id: "02",
      shortName: m.jarvis_suite_matrix_pay_shortname(),
      desc: m.jarvis_suite_matrix_pay_desc(),
      category: m.jarvis_suite_matrix_pay_category(),
      video: JARVIS_VIDEOS.pay,
      poster: JARVIS_POSTERS.pay,
      href: ROUTES.JARVIS.PAY,
    },
    {
      id: "03",
      shortName: m.jarvis_suite_matrix_air_shortname(),
      desc: m.jarvis_suite_matrix_air_desc(),
      category: m.jarvis_suite_matrix_air_category(),
      video: JARVIS_VIDEOS.air,
      poster: JARVIS_POSTERS.air,
      href: ROUTES.JARVIS.AIR,
    },
    {
      id: "04",
      shortName: m.jarvis_suite_matrix_eagle_eye_shortname(),
      desc: m.jarvis_suite_matrix_eagle_eye_desc(),
      category: m.jarvis_suite_matrix_eagle_eye_category(),
      video: JARVIS_VIDEOS.eagleEye,
      poster: JARVIS_POSTERS.eagleEye,
      href: ROUTES.JARVIS.EAGLE_EYE,
    },
    {
      id: "05",
      shortName: m.jarvis_suite_matrix_ssss_shortname(),
      desc: m.jarvis_suite_matrix_ssss_desc(),
      category: m.jarvis_suite_matrix_ssss_category(),
      video: JARVIS_VIDEOS.ssss,
      poster: JARVIS_POSTERS.ssss,
      href: ROUTES.JARVIS.SSSS,
    },
    {
      id: "06",
      shortName: m.jarvis_suite_matrix_dwss_shortname(),
      desc: m.jarvis_suite_matrix_dwss_desc(),
      category: m.jarvis_suite_matrix_dwss_category(),
      video: JARVIS_VIDEOS.dwss,
      poster: JARVIS_POSTERS.dwss,
      href: ROUTES.JARVIS.DWSS,
    },
    {
      id: "07",
      shortName: m.jarvis_suite_matrix_cdcp_shortname(),
      desc: m.jarvis_suite_matrix_cdcp_desc(),
      category: m.jarvis_suite_matrix_cdcp_category(),
      video: JARVIS_VIDEOS.cdcp,
      poster: JARVIS_POSTERS.cdcp,
      href: ROUTES.JARVIS.CDCP,
    },
    {
      id: "08",
      shortName: m.jarvis_suite_matrix_assets_shortname(),
      desc: m.jarvis_suite_matrix_assets_desc(),
      category: m.jarvis_suite_matrix_assets_category(),
      video: JARVIS_VIDEOS.assets,
      poster: JARVIS_POSTERS.assets,
      href: ROUTES.JARVIS.ASSETS,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{m.jarvis_suite_matrix_title()}</h2>
        </div>
        <div className={styles.grid}>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
