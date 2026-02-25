"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion"; // eslint-disable-line no-restricted-imports

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

// Re-export the tree-shakeable motion factory for components.
export { m };
