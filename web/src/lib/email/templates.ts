/**
 * Email Templates
 *
 * Purpose:
 * - Generate HTML and text email templates
 * - Support internationalization (en/zh)
 * - Provide CRM-ready formatting for internal notifications
 *
 * Templates:
 * 1. Internal Notification - Sent to solution@isbim.com.hk (English only)
 * 2. User Confirmation - Sent to user (i18n based on locale)
 */

/**
 * Contact form data structure
 */
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  companyName?: string;
  companyType?:
    | "Architectural"
    | "Engineering"
    | "Contractor"
    | "Developer"
    | "Government"
    | "IT"
    | "Other";
  jobTitle?: string;
  service: string;
  marketingConsent?: boolean;
}

/**
 * Email template return type
 */
interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate internal notification email (English only, CRM-ready)
 * Sent to: solution@isbim.com.hk
 */
export function generateInternalNotificationEmail(
  data: ContactFormData
): EmailTemplate {
  const fullName = `${data.firstName} ${data.lastName}`;
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Hong_Kong",
    dateStyle: "full",
    timeStyle: "long",
  });
  const marketingConsent = data.marketingConsent ?? false;

  const subject = `New Contact Form Submission - ${fullName}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
      <p style="margin: 8px 0 0 0; color: #e0f2fe; font-size: 14px;">isBIM Official Website</p>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      <!-- Submission Info -->
      <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #0369a1;">
          <strong>Submission Time:</strong> ${timestamp}
        </p>
      </div>

      <!-- Contact Details -->
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b;">Contact Information</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px; font-weight: 600; color: #64748b; width: 40%;">Name</td>
          <td style="padding: 12px 8px; color: #1e293b;">${fullName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px; font-weight: 600; color: #64748b;">Email</td>
          <td style="padding: 12px 8px; color: #1e293b;"><a href="mailto:${data.email}" style="color: #0ea5e9; text-decoration: none;">${data.email}</a></td>
        </tr>
        ${
          data.phoneNumber
            ? `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px; font-weight: 600; color: #64748b;">Phone</td>
          <td style="padding: 12px 8px; color: #1e293b;"><a href="tel:${data.phoneNumber}" style="color: #0ea5e9; text-decoration: none;">${data.phoneNumber}</a></td>
        </tr>
        `
            : ""
        }
      </table>

      <!-- Company Details -->
      ${
        data.companyName || data.companyType || data.jobTitle
          ? `
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b;">Company & Position</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        ${
          data.companyName
            ? `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px; font-weight: 600; color: #64748b; width: 40%;">Company</td>
          <td style="padding: 12px 8px; color: #1e293b;">${data.companyName}</td>
        </tr>
        `
            : ""
        }
        ${
          data.companyType
            ? `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px; font-weight: 600; color: #64748b;">Type</td>
          <td style="padding: 12px 8px; color: #1e293b;">${data.companyType}</td>
        </tr>
        `
            : ""
        }
        ${
          data.jobTitle
            ? `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px; font-weight: 600; color: #64748b;">Job Title</td>
          <td style="padding: 12px 8px; color: #1e293b;">${data.jobTitle}</td>
        </tr>
        `
            : ""
        }
      </table>
      `
          : ""
      }

      <!-- Service Request -->
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b;">Service Requested</h2>
      <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #166534;">${data.service}</p>
      </div>

      <!-- Marketing Consent -->
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b;">Marketing Consent</h2>
      <div style="padding: 16px; background-color: ${marketingConsent ? "#dcfce7" : "#fee2e2"}; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: ${marketingConsent ? "#166534" : "#991b1b"};">
          <strong>${marketingConsent ? "✓ Opted In" : "✗ Not Opted In"}</strong> - User ${marketingConsent ? "has" : "has not"} consented to receive marketing emails.
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align: center; padding-top: 16px;">
        <a href="mailto:${data.email}" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 14px;">Reply to ${data.firstName}</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 12px; color: #64748b;">
        This is an automated notification from isBIM Contact Form<br>
        19/F, Nathan Commercial Building, 430 Nathan Road, Yau Ma Tei, Hong Kong
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
NEW CONTACT FORM SUBMISSION
===========================

Submission Time: ${timestamp}

CONTACT INFORMATION
-------------------
Name: ${fullName}
Email: ${data.email}
${data.phoneNumber ? `Phone: ${data.phoneNumber}` : ""}

${
  data.companyName || data.companyType || data.jobTitle
    ? `
COMPANY & POSITION
------------------
${data.companyName ? `Company: ${data.companyName}` : ""}
${data.companyType ? `Type: ${data.companyType}` : ""}
${data.jobTitle ? `Job Title: ${data.jobTitle}` : ""}
`
    : ""
}

SERVICE REQUESTED
-----------------
${data.service}

MARKETING CONSENT
-----------------
${marketingConsent ? "✓ Opted In" : "✗ Not Opted In"} - User ${marketingConsent ? "has" : "has not"} consented to receive marketing emails.

---
isBIM Official Website
19/F, Nathan Commercial Building, 430 Nathan Road, Yau Ma Tei, Hong Kong
  `.trim();

  return { subject, html, text };
}

/**
 * Generate user confirmation email (i18n: en/zh)
 * Sent to: user's email address
 */
export function generateUserConfirmationEmail(
  data: ContactFormData,
  locale: "en" | "zh"
): EmailTemplate {
  const isZh = locale === "zh";

  const subject = isZh ? "感謝您聯繫 isBIM" : "Thank you for contacting isBIM";

  const greeting = isZh
    ? `親愛的 ${data.firstName},`
    : `Dear ${data.firstName},`;

  const bodyText = isZh
    ? "我們已收到您的查詢,並將盡快回覆。我們的團隊將審查您的訊息,並在 1-2 個工作日內回覆。"
    : "We have received your inquiry and will get back to you shortly. Our team will review your message and respond within 1-2 business days.";

  const submissionDetailsTitle = isZh ? "提交詳情" : "Submission Details";
  const serviceLabel = isZh ? "所需服務" : "Service Requested";
  const footerText = isZh ? "此致<br>isBIM 團隊" : "Best regards,<br>isBIM Team";
  const contactInfoText = isZh
    ? "如有緊急事項,請致電"
    : "For urgent matters, please call";

  const html = `
<!DOCTYPE html>
<html lang="${isZh ? "zh-HK" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang TC', 'Microsoft YaHei', sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 48px 24px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">isBIM</h1>
      <p style="margin: 12px 0 0 0; color: #e0f2fe; font-size: 16px;">Building Information Modeling Platform</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 32px;">
      <!-- Greeting -->
      <p style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #1e293b;">${greeting}</p>

      <!-- Confirmation Message -->
      <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin-bottom: 32px; border-radius: 4px;">
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #166534;">
          ${bodyText}
        </p>
      </div>

      <!-- Submission Summary -->
      <h2 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #1e293b; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0;">${submissionDetailsTitle}</h2>

      <table style="width: 100%; margin-bottom: 32px;">
        <tr>
          <td style="padding: 12px 0; font-size: 14px; color: #64748b; font-weight: 600;">${serviceLabel}:</td>
        </tr>
        <tr>
          <td style="padding: 0 0 16px 0; font-size: 15px; color: #0ea5e9; font-weight: 600;">${data.service}</td>
        </tr>
      </table>

      <!-- Contact Info -->
      <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b;">${contactInfoText}:</p>
        <p style="margin: 0; font-size: 18px; font-weight: 600; color: #0ea5e9;">
          <a href="tel:+85223828380" style="color: #0ea5e9; text-decoration: none;">+852 2382 8380</a>
        </p>
        <p style="margin: 12px 0 0 0; font-size: 13px; color: #64748b;">
          <a href="mailto:solution@isbim.com.hk" style="color: #0ea5e9; text-decoration: none;">solution@isbim.com.hk</a>
        </p>
      </div>

      <!-- Closing -->
      <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #475569;">
        ${footerText}
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f172a; padding: 32px 24px; text-align: center;">
      <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #ffffff;">isBIM</p>
      <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.6;">
        19/F, Nathan Commercial Building<br>
        430 Nathan Road, Yau Ma Tei, Hong Kong<br>
        <a href="https://www.isbim.com.hk" style="color: #0ea5e9; text-decoration: none;">www.isbim.com.hk</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
${subject}
${"=".repeat(subject.length)}

${greeting}

${bodyText}

${submissionDetailsTitle}
${"-".repeat(submissionDetailsTitle.length)}
${serviceLabel}: ${data.service}

${contactInfoText}: +852 2382 8380
Email: solution@isbim.com.hk

${footerText.replace("<br>", "\n")}

---
isBIM
19/F, Nathan Commercial Building
430 Nathan Road, Yau Ma Tei, Hong Kong
www.isbim.com.hk
  `.trim();

  return { subject, html, text };
}
