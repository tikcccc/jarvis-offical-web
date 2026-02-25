/**
 * Media Configuration
 *
 * Centralized media asset management for videos and images.
 * Supports switching between local assets (development/testing) and
 * remote CDN URLs (production) via environment variable.
 *
 * Usage:
 * ```tsx
 * import { getVideoUrl, getImageUrl } from "@/lib/media-config";
 *
 * <video src={getVideoUrl("banner.mp4")} />
 * <img src={getImageUrl("logo.png")} />
 * ```
 *
 * Environment Setup:
 * ```env
 * # .env.local (development - use local assets)
 * NEXT_PUBLIC_MEDIA_URL=
 *
 * # .env.production (production - use CDN)
 * NEXT_PUBLIC_MEDIA_URL=https://cdn.example.com
 *
 * # Optional: override only videos (keeps icons/fonts local)
 * NEXT_PUBLIC_VIDEO_CDN_URL=https://posix-jarvis-cn.obs.cn-south-1.myhuaweicloud.com/share/resource/video
 * ```
 */

import { env } from "@/lib/env";

/**
 * Normalize a base URL by trimming any trailing slash.
 */
function normalizeBaseUrl(value?: string) {
  return (value || "").replace(/\/$/, "");
}

/**
 * Media Base URL
 * Set via NEXT_PUBLIC_MEDIA_URL environment variable.
 * If not set, uses local public directory.
 */
export const MEDIA_BASE_URL = normalizeBaseUrl(env.NEXT_PUBLIC_MEDIA_URL);

/**
 * Video CDN Base URL
 * Optional override for video assets only (keeps icons/fonts local).
 */
const VIDEO_CDN_BASE_URL = normalizeBaseUrl(env.NEXT_PUBLIC_VIDEO_CDN_URL);

/**
 * Resolve the base path for video assets.
 * - If NEXT_PUBLIC_VIDEO_CDN_URL is set, prefer it.
 * - Else, fall back to NEXT_PUBLIC_MEDIA_URL.
 * - If neither is set, use local `/videos`.
 */
function getVideoBase(): string {
  const base = VIDEO_CDN_BASE_URL || MEDIA_BASE_URL;
  if (!base) return "/videos";

  // If user provided a path already ending with /video or /videos, keep it.
  if (/\/video(s)?$/.test(base)) {
    return base;
  }

  // Otherwise, append /video to align with CDN folder structure.
  return `${base}/video`;
}

const VIDEO_BASE_URL = getVideoBase();

/**
 * Feature Video CDN Base URL
 * Optional override specifically for feature-section videos.
 */
const FEATURE_VIDEO_CDN_BASE_URL = normalizeBaseUrl(
  env.NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL
);

/**
 * Dedicated CDN override for the JARVIS Assets hero video.
 * Falls back to local asset when no remote video base is configured.
 */
const ASSETS_BANNER_CDN_URL =
  "https://posix-jarvis-hk.obs.ap-southeast-1.myhuaweicloud.com/jarvis/share/isbim-website-assets/assets/assets-banner.mp4";

/**
 * Media URL Mode
 * Determines if using local or remote media sources.
 */
export const MEDIA_MODE = MEDIA_BASE_URL ? "remote" : "local";

/**
 * Media Configuration Object
 * Structured media URLs for different asset types.
 */
export const MEDIA_CONFIG = {
  /** Videos directory */
  videos: {
    local: "/videos",
    remote: VIDEO_BASE_URL,
  },
  /** Images directory */
  images: {
    local: "/images",
    remote: MEDIA_BASE_URL ? `${MEDIA_BASE_URL}/images` : "/images",
  },
  /** Icons directory */
  icons: {
    local: "/icons",
    remote: MEDIA_BASE_URL ? `${MEDIA_BASE_URL}/icons` : "/icons",
  },
  /** Fonts directory */
  fonts: {
    local: "/fonts",
    remote: MEDIA_BASE_URL ? `${MEDIA_BASE_URL}/fonts` : "/fonts",
  },
} as const;

/**
 * Get Video URL
 * Returns the full URL for a video asset.
 *
 * @param filename - Video filename (e.g., "banner.mp4")
 * @returns Full URL to video asset
 *
 * @example
 * ```tsx
 * const videoUrl = getVideoUrl("Agent.mp4");
 * // Local: "/videos/Agent.mp4"
 * // Remote: "https://cdn.example.com/videos/Agent.mp4"
 * ```
 */
export function getVideoUrl(filename: string): string {
  const base = VIDEO_BASE_URL || MEDIA_CONFIG.videos.local;
  return encodeURI(`${base}/${filename}`);
}

/**
 * Get Feature Video URL
 * Builds URL for feature-section videos (product-scoped folders).
 *
 * @param product - Product folder name (e.g., "agent", "4s")
 * @param filename - Video filename within the product folder
 */
export function getFeatureVideoUrl(
  product: string,
  filename: string
): string {
  if (FEATURE_VIDEO_CDN_BASE_URL) {
    return encodeURI(`${FEATURE_VIDEO_CDN_BASE_URL}/${product}/${filename}`);
  }

  const base = VIDEO_BASE_URL || MEDIA_CONFIG.videos.local;
  return encodeURI(`${base}/${product}/${filename}`);
}

/**
 * Get Image URL
 * Returns the full URL for an image asset.
 *
 * @param filename - Image filename (e.g., "logo.png")
 * @param subfolder - Optional subfolder (e.g., "products", "projects")
 * @returns Full URL to image asset
 *
 * @example
 * ```tsx
 * const imageUrl = getImageUrl("hero.jpg");
 * const productImage = getImageUrl("agent-preview.png", "products");
 * ```
 */
export function getImageUrl(filename: string, subfolder?: string): string {
  const base =
    MEDIA_MODE === "remote"
      ? MEDIA_CONFIG.images.remote
      : MEDIA_CONFIG.images.local;

  if (subfolder) {
    return `${base}/${subfolder}/${filename}`;
  }
  return `${base}/${filename}`;
}

/**
 * Get Icon URL
 * Returns the full URL for an icon asset.
 *
 * @param filename - Icon filename (e.g., "isbim_white.svg")
 * @returns Full URL to icon asset
 */
export function getIconUrl(filename: string): string {
  if (MEDIA_MODE === "remote") {
    return `${MEDIA_CONFIG.icons.remote}/${filename}`;
  }
  return `${MEDIA_CONFIG.icons.local}/${filename}`;
}

/**
 * Get Font URL
 * Returns the full URL for a font asset.
 *
 * @param filename - Font filename (e.g., "AllianceNo1-Regular.woff2")
 * @param subfolder - Optional subfolder (e.g., "Alliance")
 * @returns Full URL to font asset
 */
export function getFontUrl(filename: string, subfolder?: string): string {
  const base =
    MEDIA_MODE === "remote"
      ? MEDIA_CONFIG.fonts.remote
      : MEDIA_CONFIG.fonts.local;

  if (subfolder) {
    return `${base}/${subfolder}/${filename}`;
  }
  return `${base}/${filename}`;
}

/**
 * Media Asset Configuration Object
 * For complex assets with multiple sources and fallbacks.
 */
export interface MediaAsset {
  /** Local asset path (development) */
  local: string;
  /** Remote asset URL (production) */
  remote: string;
  /** Fallback image (for videos or failed loads) */
  fallback?: string;
  /** Alt text for images */
  alt?: string;
}

/**
 * Get Media Asset URL
 * Returns the appropriate URL based on current media mode.
 *
 * @param asset - MediaAsset configuration object
 * @returns URL string based on current mode
 *
 * @example
 * ```tsx
 * const asset: MediaAsset = {
 *   local: "/videos/Agent.mp4",
 *   remote: "https://cdn.example.com/videos/Agent.mp4",
 *   fallback: "/images/agent-poster.jpg"
 * };
 *
 * const url = getMediaAssetUrl(asset);
 * ```
 */
export function getMediaAssetUrl(asset: MediaAsset): string {
  return MEDIA_MODE === "remote" ? asset.remote : asset.local;
}

/**
 * Create Media Asset Object
 * Helper to create MediaAsset configuration with fallback.
 *
 * @param localPath - Local asset path
 * @param remotePath - Remote asset URL
 * @param fallbackPath - Optional fallback path
 * @returns MediaAsset object
 *
 * @example
 * ```tsx
 * const videoAsset = createMediaAsset(
 *   "/videos/banner.mp4",
 *   "https://cdn.example.com/videos/banner.mp4",
 *   "/images/banner-poster.jpg"
 * );
 * ```
 */
export function createMediaAsset(
  localPath: string,
  remotePath: string,
  fallbackPath?: string
): MediaAsset {
  return {
    local: localPath,
    remote: remotePath,
    fallback: fallbackPath,
  };
}

/**
 * JARVIS Product Videos
 * Pre-configured video URLs for JARVIS products.
 */
export const JARVIS_VIDEOS = {
  agent: getVideoUrl("Agent.mp4"),
  pay: "https://posix-jarvis-hk.obs.ap-southeast-1.myhuaweicloud.com/jarvis/eagle-eye/public/2011383915025141760.mp4",
  air: getVideoUrl("Air.mp4"),
  eagleEye: getVideoUrl("Eagle Eye.mp4"),
  ssss: getVideoUrl("4S.mp4"),
  dwss: getVideoUrl("dwss.mp4"),
  cdcp: getVideoUrl("CDCP.mp4"),
  assets: VIDEO_CDN_BASE_URL ? ASSETS_BANNER_CDN_URL : getVideoUrl("Assets.mp4"),
  banner: getVideoUrl("banner.mp4"),
} as const;

/**
 * JARVIS Feature Videos
 * Dedicated feature-section video sets per product (3 videos each).
 */
export const JARVIS_FEATURE_VIDEOS = {
  agent: {
    feature1: getFeatureVideoUrl("agent", "agent-01.mp4"),
    feature2: getFeatureVideoUrl("agent", "agent-02.mp4"),
    feature3: getFeatureVideoUrl("agent", "agent-03.mp4"),
  },
  ssss: {
    feature1: getFeatureVideoUrl("4s", "4s-01.mp4"),
    feature2: getFeatureVideoUrl("4s", "4s-02.mp4"),
    feature3: getFeatureVideoUrl("4s", "4s-03.mp4"),
  },
  assets: {
    feature1: getFeatureVideoUrl("assets", "assets-01.mp4"),
    feature2: getFeatureVideoUrl("assets", "assets-02.mp4"),
    feature3: getFeatureVideoUrl("assets", "assets-03.mp4"),
  },
  cdcp: {
    feature1: getFeatureVideoUrl("CDCP", "cdcp-01.mp4"),
    feature2: getFeatureVideoUrl("CDCP", "cdcp-02.mp4"),
    feature3: getFeatureVideoUrl("CDCP", "cdcp-03.mp4"),
  },
  dwss: {
    feature1: getFeatureVideoUrl("dwss", "dwss-01.mp4"),
    feature2: getFeatureVideoUrl("dwss", "dwss-02.mp4"),
    feature3: getFeatureVideoUrl("dwss", "dwss-03.mp4"),
  },
  eagleEye: {
    feature1: "https://posix-jarvis-hk.obs.ap-southeast-1.myhuaweicloud.com/jarvis/eagle-eye/public/2011383335854673920.mp4",
    feature2: getFeatureVideoUrl("eagle", "ee-02.mp4"),
    feature3: getFeatureVideoUrl("eagle", "ee-03.mp4"),
  },
  pay: {
    feature1: getFeatureVideoUrl("jarvis-pay", "pay-01.mp4"),
    feature2: getFeatureVideoUrl("jarvis-pay", "pay-02.mp4"),
    feature3: getFeatureVideoUrl("jarvis-pay", "pay-03.mp4"),
  },
  air: {
    feature1: getFeatureVideoUrl("air", "air-01.mp4"),
    feature2: getFeatureVideoUrl("air", "air-02.mp4"),
    feature3: getFeatureVideoUrl("air", "air-03.mp4"),
  },
} as const;

/**
 * JARVIS Video Posters (first-frame snapshots)
 * Stored under /images/post for use as preload/fallback posters.
 */
export const JARVIS_POSTERS = {
  agent: getImageUrl("agent-poster.jpg", "post"),
  pay: getImageUrl("pay-poster.jpg", "post"),
  air: getImageUrl("air-poster.jpg", "post"),
  eagleEye: getImageUrl("eagle-eye-poster.jpg", "post"),
  ssss: getImageUrl("ssss-poster.jpg", "post"),
  dwss: getImageUrl("dwss-poster.jpg", "post"),
  cdcp: getImageUrl("cdcp-poster.jpg", "post"),
  assets: getImageUrl("assets-poster.jpg", "post"),
  banner: getImageUrl("banner-poster.jpg", "post"),
} as const;

/**
 * Common Image Paths
 * Pre-configured image URLs for common assets.
 */
export const COMMON_IMAGES = {
  ctaBackground: getImageUrl("cta.png"),
  aboutHeader: getImageUrl("about-header.jpg"),
  logoBlack: getIconUrl("isbim_black.svg"),
  logoWhite: getIconUrl("isbim_white.svg"),
} as const;

/**
 * Check if Media is Remote
 * Helper to determine if using remote CDN.
 *
 * @returns true if using remote CDN, false if local
 */
export function isRemoteMedia(): boolean {
  return MEDIA_MODE === "remote";
}

/**
 * Get Media Info
 * Returns debugging information about media configuration.
 */
export function getMediaInfo() {
  return {
    mode: MEDIA_MODE,
    baseUrl: MEDIA_BASE_URL || "local",
    videoBase: VIDEO_BASE_URL,
    featureVideoBase: FEATURE_VIDEO_CDN_BASE_URL || VIDEO_BASE_URL,
    isRemote: isRemoteMedia(),
    config: MEDIA_CONFIG,
  };
}

export default {
  MEDIA_BASE_URL,
  MEDIA_MODE,
  MEDIA_CONFIG,
  getVideoUrl,
  getFeatureVideoUrl,
  getImageUrl,
  getIconUrl,
  getFontUrl,
  getMediaAssetUrl,
  createMediaAsset,
  JARVIS_VIDEOS,
  JARVIS_FEATURE_VIDEOS,
  JARVIS_POSTERS,
  COMMON_IMAGES,
  isRemoteMedia,
  getMediaInfo,
} as const;
