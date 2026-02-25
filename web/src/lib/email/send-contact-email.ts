/**
 * Contact Form Email Sender
 *
 * Purpose:
 * - Orchestrate sending of dual emails (internal + user confirmation)
 * - Handle Resend API errors gracefully
 * - Provide typed responses for server actions
 *
 * Usage:
 * ```tsx
 * import { sendContactFormEmails } from "@/lib/email/send-contact-email";
 *
 * const result = await sendContactFormEmails(formData, "en");
 * if (result.success) {
 *   // Handle success
 * }
 * ```
 */

import { sendEmail } from "./email-client";
import {
  generateInternalNotificationEmail,
  generateUserConfirmationEmail,
  type ContactFormData,
} from "./templates";
import {
  getContactEmailTo,
  getEmailFromInternal,
  getEmailFromUser,
} from "@/lib/env";

/**
 * Email sending response type
 */
interface SendEmailResponse {
  success: boolean;
  error?: string;
}

/**
 * Send contact form emails
 *
 * Sends two emails:
 * 1. Internal notification to configured email (default: solution@isbim.com.hk) (English)
 * 2. User confirmation to the submitter's email (i18n based on locale)
 *
 * @param data - Contact form data
 * @param locale - User's locale for confirmation email (en/zh)
 * @returns Promise with success status and optional error message
 */
export async function sendContactFormEmails(
  data: ContactFormData,
  locale: "en" | "zh"
): Promise<SendEmailResponse> {
  try {
    // Get internal email recipient from environment
    const internalEmailTo = getContactEmailTo();

    // Generate email templates
    const internalEmail = generateInternalNotificationEmail(data);
    const userEmail = generateUserConfirmationEmail(data, locale);

    // Send internal notification email
    // Uses configured provider (Resend or Brevo) based on EMAIL_PROVIDER environment variable
    const internalResult = await sendEmail({
      from: getEmailFromInternal(),
      to: internalEmailTo,
      subject: internalEmail.subject,
      html: internalEmail.html,
      text: internalEmail.text,
      replyTo: data.email,
    });

    // Check if internal email failed
    if (!internalResult.success) {
      console.error(
        `Failed to send internal notification via ${internalResult.provider}:`,
        internalResult.error
      );
      return {
        success: false,
        error:
          locale === "zh"
            ? "發送失敗,請稍後再試。"
            : "Failed to send message. Please try again later.",
      };
    }

    // Send user confirmation email
    const userResult = await sendEmail({
      from: getEmailFromUser(),
      to: data.email,
      subject: userEmail.subject,
      html: userEmail.html,
      text: userEmail.text,
    });

    // Check if user email failed
    if (!userResult.success) {
      console.error(
        `Failed to send user confirmation via ${userResult.provider}:`,
        userResult.error
      );
      // Don't fail the whole operation if user confirmation fails
      // The important internal notification was sent successfully
      console.warn(
        "User confirmation email failed, but internal notification was sent"
      );
    }

    // Log which provider was used
    console.log(`✅ Emails sent successfully via ${internalResult.provider}`);

    // Both emails sent successfully (or at least internal was sent)
    return {
      success: true,
    };
  } catch (error) {
    // Catch any unexpected errors
    console.error("Unexpected error sending contact form emails:", error);

    return {
      success: false,
      error:
        locale === "zh"
          ? "發送失敗,請稍後再試。"
          : "Failed to send message. Please try again later.",
    };
  }
}
