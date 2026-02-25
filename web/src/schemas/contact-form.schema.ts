/**
 * Contact Form Validation Schema
 *
 * Purpose:
 * - Type-safe validation for contact form submissions
 * - Server-side validation using Zod
 * - Consistent validation rules across frontend and backend
 *
 * Usage:
 * ```tsx
 * import { contactFormSchema, type ContactFormInput } from "@/schemas/contact-form.schema";
 *
 * const validation = contactFormSchema.safeParse(formData);
 * if (!validation.success) {
 *   // Handle validation errors
 * }
 * ```
 */

import { z } from "zod";
import { VALIDATION } from "@/lib/constants";

/**
 * Contact Form Schema
 * Validates all fields from the contact form with appropriate constraints.
 */
export const contactFormSchema = z.object({
  /** First name - required, max 50 characters */
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .trim(),

  /** Last name - required, max 50 characters */
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .trim(),

  /** Email - required, must be valid email format */
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .regex(VALIDATION.EMAIL_REGEX, "Invalid email format")
    .toLowerCase()
    .trim(),

  /** Phone number - optional, must match phone regex if provided */
  phoneNumber: z
    .string()
    .regex(VALIDATION.PHONE_REGEX, "Invalid phone number")
    .trim()
    .optional()
    .or(z.literal("")),

  /** Company name - required, max 100 characters */
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters")
    .trim(),

  /** Company type - optional enum */
  companyType: z
    .enum(
      [
        "Architectural",
        "Engineering",
        "Contractor",
        "Developer",
        "Government",
        "IT",
        "Other",
      ],
      {
        message: "Please select a valid company type",
      }
    )
    .optional(),

  /** Job title - optional, max 100 characters */
  jobTitle: z
    .string()
    .max(100, "Job title must be less than 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  /** Service requested - required */
  service: z.string().min(1, "Please select a service"),

  /** Marketing consent - optional boolean */
  marketingConsent: z.boolean().optional(),
});

/**
 * Inferred TypeScript type from the schema
 */
export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * Type for validation errors
 */
export type ContactFormErrors = z.ZodError<ContactFormInput>;
