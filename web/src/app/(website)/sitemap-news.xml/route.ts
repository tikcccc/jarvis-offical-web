import { getSiteUrl } from "@/lib/env";
import { getNewsSitemapEntries } from "@/strapi/lib";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toUrlNode(loc: string, lastmod: string) {
  return `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`;
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const newsEntries = await getNewsSitemapEntries().catch(() => []);

  const urls = newsEntries
    .filter((entry) => Boolean(entry.slug))
    .flatMap((entry) => {
      const lastmod = new Date(entry._updatedAt || Date.now()).toISOString();
      return [
        toUrlNode(`${siteUrl}/zh/newsroom/${entry.slug}`, lastmod),
        toUrlNode(`${siteUrl}/en/newsroom/${entry.slug}`, lastmod),
      ];
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
