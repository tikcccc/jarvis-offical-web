"use client";

import dynamic from "next/dynamic";

export const InteractiveCarouselLazy = dynamic(
  () =>
    import("./interactive-carousel").then(
      (mod) => mod.InteractiveCarousel
    ),
  {
    ssr: false,
    loading: () => null,
  }
);
