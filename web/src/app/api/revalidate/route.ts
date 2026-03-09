import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { getStrapiWebhookSecret } from "@/lib/env";

type StrapiWebhookPayload = {
  model?: string;
  uid?: string;
  event?: string;
  entry?: {
    slug?: string;
  };
};

function isAuthorized(request: NextRequest) {
  const secret = getStrapiWebhookSecret();
  if (!secret) return true;

  const headerSecret = request.headers.get("x-strapi-webhook-secret");
  if (headerSecret === secret) return true;

  const authorization = request.headers.get("authorization");
  if (authorization === `Bearer ${secret}`) return true;

  return false;
}

function revalidateLocalizedPath(path: string) {
  revalidatePath(`/en${path}`);
  revalidatePath(`/zh${path}`);
}

function revalidateFromPayload(payload: StrapiWebhookPayload) {
  const model = payload.model || payload.uid?.split(".").pop();
  const slug = payload.entry?.slug;

  switch (model) {
    case "news":
      revalidateLocalizedPath("/newsroom");
      if (slug) revalidateLocalizedPath(`/newsroom/${slug}`);
      break;
    case "case-study":
      revalidateLocalizedPath("/case-studies");
      if (slug) revalidateLocalizedPath(`/case-studies/${slug}`);
      break;
    case "career":
      revalidateLocalizedPath("/careers");
      if (slug) revalidateLocalizedPath(`/careers/${slug}`);
      break;
    case "application-setting":
      revalidateLocalizedPath("/careers");
      break;
    default:
      break;
  }

  revalidatePath("/sitemap.xml");
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as StrapiWebhookPayload;
    revalidateFromPayload(payload);

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      model: payload.model || payload.uid || null,
      event: payload.event || null,
    });
  } catch (error) {
    console.error("[Strapi Revalidate Error]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Strapi revalidation webhook endpoint is active",
    timestamp: Date.now(),
  });
}
