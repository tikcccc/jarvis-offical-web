"use client";

import { create } from "zustand";

export type FooterVariant = "default" | "charcoal";

interface FooterState {
  variant: FooterVariant;
  enabled: boolean;
  setVariant: (variant: FooterVariant) => void;
  setEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const defaultState = {
  variant: "default" as FooterVariant,
  enabled: true,
};

export const useFooterStore = create<FooterState>((set) => ({
  ...defaultState,
  setVariant: (variant) => set({ variant }),
  setEnabled: (enabled) => set({ enabled }),
  reset: () => set({ ...defaultState }),
}));
