/**
 * Email Service Barrel Export
 *
 * Purpose:
 * - Centralized export point for email functionality
 * - Simplifies imports throughout the application
 *
 * Usage:
 * ```tsx
 * import { sendContactFormEmails, type ContactFormData } from "@/lib/email";
 * ```
 */

export { sendContactFormEmails } from "./send-contact-email";
export { sendEmail } from "./email-client";
export type { ContactFormData } from "./templates";
export type { EmailParams, EmailResult } from "./email-client";
