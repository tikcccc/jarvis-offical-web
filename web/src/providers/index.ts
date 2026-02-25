/**
 * Providers Index
 * Centralized exports for all application providers.
 *
 * Usage:
 * ```tsx
 * import { AppProviders, QueryProvider, SmoothScrollProvider } from "@/providers";
 * ```
 */

export { AppProviders } from "./app-providers";
export type { default as AppProvidersDefault } from "./app-providers";

export { QueryProvider } from "./query-provider";

export { SmoothScrollProvider, useLenis } from "@/components/smooth-scroll-provider";
