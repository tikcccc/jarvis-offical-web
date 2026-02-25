import { Inter, Noto_Sans_SC, Playfair_Display, Roboto_Mono, Space_Grotesk } from "next/font/google";

export const allianceNo1 = Inter({
  variable: "--font-alliance-1",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});

export const allianceNo2 = Space_Grotesk({
  variable: "--font-alliance-2",
  display: "swap",
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});

export const allianceZh = Noto_Sans_SC({
  variable: "--font-alliance-zh",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
  subsets: ["latin"],
  weight: ["400","500","600","700","800","900"],
});

// Artistic / display font (Playfair Display)
export const allianceArt = Playfair_Display({
  variable: "--font-art",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});

// Monospace font (Roboto Mono with system fallbacks)
export const allianceMono = Roboto_Mono({
  variable: "--font-mono",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["ui-monospace", "monospace"],
});
