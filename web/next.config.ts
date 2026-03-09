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

if (process.env.STRAPI_URL) {
  const strapiUrl = new URL(process.env.STRAPI_URL);
  remotePatterns.push({
    protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
    hostname: strapiUrl.hostname,
    port: strapiUrl.port,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
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
