/**
 * Unified Email Client
 *
 * Purpose:
 * - Abstract email provider selection (Resend vs Brevo)
 * - Switch provider via environment variable EMAIL_PROVIDER
 * - Maintain compatibility with existing code
 *
 * Usage:
 * ```tsx
 * import { sendEmail } from "@/lib/email/email-client";
 *
 * const result = await sendEmail({
 *   from: "sender@example.com",
 *   to: "recipient@example.com",
 *   subject: "Hello",
 *   html: "<p>Hello World</p>",
 * });
 *
 * if (result.success) {
 *   console.log(`Email sent via ${result.provider}`);
 * }
 * ```
 */

import { resend } from "./resend-client";
import { getBrevoClient } from "./brevo-client";

/**
 * Email provider type
 */
type EmailProvider = "resend" | "brevo";

/**
 * Get current email provider from environment
 * Defaults to 'resend' if not specified
 */
function getEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER as EmailProvider;
  return provider === "brevo" ? "brevo" : "resend"; // Default to Resend
}

/**
 * Unified email parameters
 */
export interface EmailParams {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Unified email result
 */
export interface EmailResult {
  success: boolean;
  provider: EmailProvider;
  error?: unknown;
}

/**
 * Send email using configured provider
 *
 * Automatically routes to Resend or Brevo based on EMAIL_PROVIDER environment variable.
 * Provider is selected at runtime for each email send operation.
 *
 * @param params - Email parameters (from, to, subject, html, text, replyTo)
 * @returns Promise with success status, provider used, and optional error
 */
/**
 * Parse email address from string
 * Handles formats: "email@example.com" or "Name <email@example.com>"
 */
function parseEmailAddress(emailString: string): {
  email: string;
  name?: string;
} {
  const match = emailString.match(/^(?:(.+?)\s*<)?([^>]+?)>?$/);
  if (match) {
    const [, name, email] = match;
    return {
      email: email.trim(),
      name: name?.trim(),
    };
  }
  return { email: emailString.trim() };
}

export async function sendEmail(params: EmailParams): Promise<EmailResult> {
  const provider = getEmailProvider();

  try {
    if (provider === "brevo") {
      // Parse sender email (Brevo requires separate name and email)
      const sender = parseEmailAddress(params.from);
      const brevoClient = getBrevoClient();

      // Use Brevo
      await brevoClient.sendTransacEmail({
        sender: sender,
        to: Array.isArray(params.to)
          ? params.to.map((email) => parseEmailAddress(email))
          : [parseEmailAddress(params.to)],
        subject: params.subject,
        htmlContent: params.html,
        textContent: params.text,
        replyTo: params.replyTo ? parseEmailAddress(params.replyTo) : undefined,
      });

      return { success: true, provider: "brevo" };
    } else {
      // Use Resend (default)
      const result = await resend.emails.send({
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        replyTo: params.replyTo,
      });

      if (result.error) {
        return { success: false, provider: "resend", error: result.error };
      }

      return { success: true, provider: "resend" };
    }
  } catch (error) {
    return { success: false, provider, error };
  }
}
