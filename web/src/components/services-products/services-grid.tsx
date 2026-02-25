"use client";

/**
 * Services Grid Component
 *
 * Bento grid layout with staggered animation
 * Maps over services data to render ServiceCard components
 */

import { m } from "@/components/motion/lazy-motion";
import { ServiceCard } from "./service-card";
import { servicesData } from "@/data/services";
import type { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function ServicesGrid() {
  return (
    <m.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="container mx-auto px-6 py-10 relative z-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {servicesData.map((service, index) => (
          <m.div
            key={service.id}
            variants={itemVariants}
            className={`${service.gridArea} h-full`}
          >
            <ServiceCard item={service} index={index} />
          </m.div>
        ))}
      </div>
    </m.section>
  );
}
