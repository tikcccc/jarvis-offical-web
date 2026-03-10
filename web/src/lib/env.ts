/**
 * Type-safe environment variable access for the China deployment.
 *
 * The active runtime only depends on:
 * - Strapi configuration for CMS reads/writes and webhook revalidation
 * - Site/media URLs for frontend rendering
 * - Optional email configuration kept for legacy utility files
 */

/**
 * Server-side environment variables
 * These are only available on the server and should NEVER be exposed to the client.
 */
const serverEnv = {
  // Strapi CMS
  STRAPI_URL: process.env.STRAPI_URL,
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  STRAPI_WEBHOOK_SECRET: process.env.STRAPI_WEBHOOK_SECRET,

  // Resend
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  // Brevo (backup email provider)
  BREVO_API_KEY: process.env.BREVO_API_KEY,

  // Email provider selection
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,

  // Contact form
  CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO,

  // Email sender addresses
  EMAIL_FROM_INTERNAL: process.env.EMAIL_FROM_INTERNAL,
  EMAIL_FROM_USER: process.env.EMAIL_FROM_USER,

  // Node environment
  NODE_ENV: process.env.NODE_ENV,
} as const;

/**
 * Client-side environment variables
 * These are prefixed with NEXT_PUBLIC_ and safe to expose to the browser.
 */
const clientEnv = {
  // Site
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,

  // Media
  NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
  NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL:
    process.env.NEXT_PUBLIC_FEATURE_VIDEO_CDN_URL,
  NEXT_PUBLIC_VIDEO_CDN_URL: process.env.NEXT_PUBLIC_VIDEO_CDN_URL,
  NEXT_PUBLIC_MEDIA_URL: process.env.NEXT_PUBLIC_MEDIA_URL,

  // Node environment (also available client-side)
  NODE_ENV: process.env.NODE_ENV,
} as const;

/**
 * Validate that required environment variables are set
 * Throws an error during build/startup if any are missing.
 */
function validateEnv() {
  const errors: string[] = [];

  // Required server-side variables
  const requiredServer: (keyof typeof serverEnv)[] = [];

  // Required client-side variables
  const requiredClient: (keyof typeof clientEnv)[] = [];

  // Check server variables (only in server context)
  if (typeof window === "undefined") {
    for (const key of requiredServer) {
      if (!serverEnv[key]) {
        errors.push(`Missing required server environment variable: ${key}`);
      }
    }
  }

  // Check client variables
  for (const key of requiredClient) {
    if (!clientEnv[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  }

  // Throw if any errors
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.join("\n")}\n\nPlease check your .env.local file.`
    );
  }
}

// Validate on import (will throw during build if invalid)
// Disabled in production to avoid runtime overhead
if (process.env.NODE_ENV !== "production") {
  validateEnv();
}

/**
 * Combined environment variables
 * Access both server and client env vars through a single object.
 */
export const env = {
  ...clientEnv,
  ...serverEnv,
} as const;

/**
 * Type-safe getter for environment variables
 * Returns undefined instead of throwing for optional vars.
 *
 */
export function getEnv<T extends keyof typeof env>(
  key: T
): (typeof env)[T] | undefined {
  return env[key];
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === "development";
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return env.NODE_ENV === "production";
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return env.NODE_ENV === "test";
}

/**
 * Check if code is running on the server
 */
export function isServer(): boolean {
  return typeof window === "undefined";
}

/**
 * Check if code is running on the client
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Get the base URL for the site
 * Handles development vs production URLs.
 */
export function getSiteUrl(): string {
  if (env.NEXT_PUBLIC_SITE_URL) {
    return env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback for development
  if (isDevelopment()) {
    return "http://localhost:3000";
  }

  // Fallback for production (update with actual domain)
  return "https://isbim.com";
}

export function getStrapiUrl(): string {
  const url = isServer()
    ? env.STRAPI_URL || env.NEXT_PUBLIC_STRAPI_URL
    : env.NEXT_PUBLIC_STRAPI_URL;

  if (!url) {
    throw new Error(
      "Strapi base URL is not set. Configure STRAPI_URL for server requests and NEXT_PUBLIC_STRAPI_URL for client-rendered Strapi images."
    );
  }

  return url;
}

export function getStrapiApiToken(): string {
  return env.STRAPI_API_TOKEN || "";
}

export function getStrapiWebhookSecret(): string {
  return env.STRAPI_WEBHOOK_SECRET || "";
}

/**
 * Get Resend API key
 * Returns the Resend API key for server-side email operations.
 * Throws an error if not set in production.
 */
export function getResendApiKey(): string {
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey && isProduction()) {
    throw new Error(
      "RESEND_API_KEY is not set. Please configure it in your environment variables."
    );
  }

  return apiKey || "";
}

/**
 * Get contact email recipient
 * Returns the email address for internal contact form notifications.
 * Defaults to solution@isbim.com.hk if not set.
 */
export function getContactEmailTo(): string {
  return env.CONTACT_EMAIL_TO || "solution@isbim.com.hk";
}

/**
 * Get internal notification email sender
 * Returns the sender address for internal contact form notifications.
 *
 * Development: Uses @resend.dev (no domain verification required)
 * Production: Uses @isbim.com.hk (requires domain verification at https://resend.com/domains)
 *
 * Default: "isBIM Contact Form <noreply@resend.dev>"
 */
export function getEmailFromInternal(): string {
  return (
    env.EMAIL_FROM_INTERNAL || "isBIM Contact Form <noreply@resend.dev>"
  );
}

/**
 * Get user confirmation email sender
 * Returns the sender address for user confirmation emails.
 *
 * Development: Uses @resend.dev (no domain verification required)
 * Production: Uses @isbim.com.hk (requires domain verification at https://resend.com/domains)
 *
 * Default: "isBIM <noreply@resend.dev>"
 */
export function getEmailFromUser(): string {
  return env.EMAIL_FROM_USER || "isBIM <noreply@resend.dev>";
}

/**
 * Get Brevo API key
 * Returns the Brevo API key for backup email operations.
 * Optional - only needed when EMAIL_PROVIDER=brevo
 */
export function getBrevoApiKey(): string | undefined {
  return env.BREVO_API_KEY;
}

/**
 * Get email provider
 * Returns the configured email provider (resend or brevo).
 * Defaults to 'resend' if not specified.
 */
export function getEmailProvider(): "resend" | "brevo" {
  return (env.EMAIL_PROVIDER as "resend" | "brevo") || "resend";
}

export default env;
