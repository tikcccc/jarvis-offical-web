"use client";

import { create } from "zustand";

interface MenuState {
  isOpen: boolean;
  activePreview: string;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  setActivePreview: (preview: string) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  activePreview: "default",
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false, activePreview: "default" }),
  setActivePreview: (preview) => set({ activePreview: preview }),
}));
