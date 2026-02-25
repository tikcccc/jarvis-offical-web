"use client";

import { FooterBase } from "./footer-base";
import { useFooterStore } from "@/stores/footer-store";

export function FooterRenderer() {
  const { variant, enabled } = useFooterStore();

  if (!enabled) return null;
  return <FooterBase variant={variant} />;
}
