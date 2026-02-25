"use client";

import { useEffect } from "react";
import { FooterVariant, useFooterStore } from "@/stores/footer-store";

interface FooterConfigProps {
  variant?: FooterVariant;
  enabled?: boolean;
}

/**
 * FooterConfig
 * Client-side helper to set footer variant/visibility for a page or layout.
 * Resets to defaults on unmount.
 */
export function FooterConfig({ variant, enabled }: FooterConfigProps) {
  const setVariant = useFooterStore((s) => s.setVariant);
  const setEnabled = useFooterStore((s) => s.setEnabled);
  const reset = useFooterStore((s) => s.reset);

  useEffect(() => {
    if (variant) setVariant(variant);
    if (enabled !== undefined) setEnabled(enabled);
    return () => reset();
  }, [variant, enabled, setVariant, setEnabled, reset]);

  return null;
}
