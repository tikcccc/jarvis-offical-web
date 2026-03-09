import { getStrapiUrl } from "@/lib/env";
import type { StrapiMediaAsset } from "./types";

const normalizeUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return new URL(url, getStrapiUrl()).toString();
};

export function getStrapiImageUrl(asset?: StrapiMediaAsset | null) {
  if (!asset) return null;

  return normalizeUrl(asset.url);
}

export function urlFor(asset?: StrapiMediaAsset | null) {
  return {
    width(value?: number) {
      void value;
      return this;
    },
    height(value?: number) {
      void value;
      return this;
    },
    fit(value?: string) {
      void value;
      return this;
    },
    url() {
      return getStrapiImageUrl(asset);
    },
  };
}
