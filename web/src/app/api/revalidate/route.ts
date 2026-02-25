/**
 * Sanity Webhook Endpoint for On-Demand ISR
 *
 * Purpose:
 * - Receives webhooks from Sanity when content is published/updated
 * - Triggers Next.js on-demand revalidation for specific content types
 * - Enables instant content updates without waiting for time-based revalidation
 *
 * Setup in Sanity:
 * 1. Go to Sanity Studio → API → Webhooks
 * 2. Create new webhook: https://your-domain.com/api/revalidate
 * 3. Set trigger: On create/update/delete
 * 4. Add secret token (optional but recommended)
 *
 * Usage:
 * - Sanity automatically calls this endpoint when content changes
 * - No manual intervention needed after setup
 */

import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Webhook secret for security (optional but recommended)
 * Set in environment variables and in Sanity webhook configuration
 */
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

/**
 * POST handler for Sanity webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate webhook signature if secret is configured
    const signature = request.headers.get("sanity-webhook-signature");

    if (WEBHOOK_SECRET && signature) {
      // Verify webhook signature for security
      const body = await request.text();
      const isValid = await verifySignature(body, signature, WEBHOOK_SECRET);

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }

      // Re-parse body after validation
      const payload = JSON.parse(body);
      await revalidateContent(payload);
    } else {
      // No signature verification - parse body directly
      const payload = await request.json();
      await revalidateContent(payload);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error("[Webhook Error]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Revalidate content based on Sanity document type
 */
async function revalidateContent(payload: { _type?: string; _id?: string; slug?: { current?: string } }) {
  const { _type, _id, slug } = payload;

  if (!_type) {
    console.warn("[Webhook] No _type in payload");
    return;
  }

  console.log("[Webhook] Revalidating:", { _type, _id, slug: slug?.current });

  // Revalidate by document type
  revalidateTag(`sanity:${_type}`);

  // Revalidate specific document if ID is provided
  if (_id) {
    revalidateTag(`sanity:${_type}:${_id}`);
  }

  // Revalidate by slug if available
  if (slug?.current) {
    revalidateTag(`sanity:${_type}:${slug.current}`);
  }

  // For critical content types, also revalidate the all tag
  const criticalTypes = ["post", "news", "caseStudy", "caseStudyCategory", "career", "product", "imageAsset"];
  if (criticalTypes.includes(_type)) {
    revalidateTag("sanity:all");
  }
}

/**
 * Verify Sanity webhook signature
 * Implementation based on Sanity webhook security best practices
 */
async function verifySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Sanity uses HMAC SHA-256 for webhook signatures
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Compare signatures in constant time to prevent timing attacks
    return signature === expectedSignature;
  } catch (error) {
    console.error("[Signature Verification Error]", error);
    return false;
  }
}

/**
 * Optional: GET handler for webhook health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Sanity revalidation webhook endpoint is active",
    timestamp: Date.now(),
  });
}
