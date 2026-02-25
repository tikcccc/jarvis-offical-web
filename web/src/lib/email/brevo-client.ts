/**
 * Brevo Email Client (Backup Provider)
 *
 * Purpose:
 * - Initialize Brevo client with API key
 * - Provide singleton instance for email operations
 * - Server-side only module
 *
 * Usage:
 * ```tsx
 * import { brevoClient } from "@/lib/email/brevo-client";
 *
 * await brevoClient.sendTransacEmail({ ... });
 * ```
 */

import * as brevo from "@getbrevo/brevo";
import { isServer } from "@/lib/env";

/**
 * Brevo client instance
 * Singleton pattern - initialized once on server-side
 */
let brevoInstance: brevo.TransactionalEmailsApi | null = null;

/**
 * Get or create Brevo client instance
 */
export function getBrevoClient(): brevo.TransactionalEmailsApi {
  // Ensure server-side only
  if (!isServer()) {
    throw new Error(
      "Brevo client can only be used on the server side. This is a critical security error."
    );
  }

  // Return existing instance if available
  if (brevoInstance) {
    return brevoInstance;
  }

  // Get API key from environment
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error(
      "BREVO_API_KEY is not configured. Please set it in your environment variables."
    );
  }

  // Create new instance
  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

  brevoInstance = apiInstance;

  return brevoInstance;
}

