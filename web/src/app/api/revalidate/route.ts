import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import {
  getBaiduPushToken,
  getSiteUrl,
  getStrapiWebhookSecret,
} from "@/lib/env";

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

function getRevalidatePaths(payload: StrapiWebhookPayload): string[] {
  const model = payload.model || payload.uid?.split(".").pop();
  const slug = payload.entry?.slug;
  const paths = new Set<string>();

  switch (model) {
    case "news":
      paths.add("/newsroom");
      if (slug) paths.add(`/newsroom/${slug}`);
      break;
    case "case-study":
      paths.add("/case-studies");
      if (slug) paths.add(`/case-studies/${slug}`);
      break;
    case "career":
      paths.add("/careers");
      if (slug) paths.add(`/careers/${slug}`);
      break;
    case "application-setting":
      paths.add("/careers");
      break;
    default:
      break;
  }

  return [...paths];
}

function revalidateFromPaths(paths: string[]) {
  for (const path of paths) {
    revalidateLocalizedPath(path);
  }

  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap-news.xml");
}

function toAbsoluteLocalizedUrls(paths: string[]): string[] {
  const siteUrl = getSiteUrl();
  const urls = new Set<string>();

  for (const path of paths) {
    urls.add(`${siteUrl}/zh${path}`);
    urls.add(`${siteUrl}/en${path}`);
  }

  return [...urls];
}

async function pushUrlsToBaidu(urls: string[]) {
  const token = getBaiduPushToken();
  if (!token || urls.length === 0) {
    return {
      enabled: Boolean(token),
      submitted: 0,
      status: null as number | null,
    };
  }

  const siteHost = new URL(getSiteUrl()).host;
  const endpoint = `http://data.zz.baidu.com/urls?site=${encodeURIComponent(siteHost)}&token=${encodeURIComponent(token)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: urls.join("\n"),
    cache: "no-store",
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      `Baidu push failed (${response.status}): ${body.slice(0, 500)}`
    );
  }

  return {
    enabled: true,
    submitted: urls.length,
    status: response.status,
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as StrapiWebhookPayload;
    const paths = getRevalidatePaths(payload);
    revalidateFromPaths(paths);

    const baiduUrls = toAbsoluteLocalizedUrls(paths);
    const baiduPush = await pushUrlsToBaidu(baiduUrls).catch((error) => {
      console.error("[Baidu Push Error]", error);
      return {
        enabled: true,
        submitted: 0,
        status: null as number | null,
        error: error instanceof Error ? error.message : String(error),
      };
    });

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      model: payload.model || payload.uid || null,
      event: payload.event || null,
      paths,
      baiduPush,
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
