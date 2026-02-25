/**
 * Resend Email Client
 *
 * Purpose:
 * - Initialize Resend client with API key
 * - Provide singleton instance for email operations
 * - Server-side only module
 *
 * Usage:
 * ```tsx
 * import { resend } from "@/lib/email/resend-client";
 *
 * await resend.emails.send({ ... });
 * ```
 */

import { Resend } from "resend";
import { getResendApiKey, isServer } from "@/lib/env";

/**
 * Resend client instance
 * Singleton pattern - initialized once on server-side
 */
let resendInstance: Resend | null = null;

/**
 * Get or create Resend client instance
 */
function getResendClient(): Resend {
  // Ensure server-side only
  if (!isServer()) {
    throw new Error(
      "Resend client can only be used on the server side. This is a critical security error."
    );
  }

  // Return existing instance if available
  if (resendInstance) {
    return resendInstance;
  }

  // Get API key
  const apiKey = getResendApiKey();

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured. Please set it in your environment variables."
    );
  }

  // Create new instance
  resendInstance = new Resend(apiKey);

  return resendInstance;
}

/**
 * Exported Resend client
 * Use this for all email operations
 */
export const resend = getResendClient();
