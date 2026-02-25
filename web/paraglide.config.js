/** @type {import("@inlang/paraglide-js").ParaglideConfig} */
const config = {
  project: "./project.inlang",
  outdir: "./src/paraglide",
  strategy: ["url", "cookie", "baseLocale"],
  urlPattern: ":protocol://:domain(.*)::port?/:locale/:path(.*)?",
};

export default config;
