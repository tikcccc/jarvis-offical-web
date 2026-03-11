import type { NextConfig } from "next";
import { paraglide } from "@inlang/paraglide-next/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    port: "",
    pathname: "/**",
  },
];

const remoteBaseUrls = [
  process.env.STRAPI_URL,
  process.env.NEXT_PUBLIC_STRAPI_URL,
  process.env.NEXT_PUBLIC_MEDIA_URL,
].filter((value): value is string => Boolean(value));

for (const baseUrl of new Set(remoteBaseUrls)) {
  const strapiUrl = new URL(baseUrl);
  remotePatterns.push({
    protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
    hostname: strapiUrl.hostname,
    port: strapiUrl.port,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [75, 85, 90, 100],
    remotePatterns,
  },
};

export default withBundleAnalyzer(paraglide({
  paraglide: {
    project: "./project.inlang",
    outdir: "./src/paraglide",
  },
  ...nextConfig,
}));
