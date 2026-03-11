import localFont from "next/font/local";

export const allianceNo1 = localFont({
  src: [
    {
      path: "../../fonts/google/Inter-Variable.ttf",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--font-alliance-1",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

export const allianceNo2 = localFont({
  src: [
    {
      path: "../../fonts/google/SpaceGrotesk-Variable.ttf",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-alliance-2",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

export const allianceZh = localFont({
  src: [
    {
      path: "../../fonts/google/NotoSansSC-Variable.ttf",
      weight: "400 900",
      style: "normal",
    },
  ],
  variable: "--font-alliance-zh",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// Artistic / display font (Playfair Display)
export const allianceArt = localFont({
  src: [
    {
      path: "../../fonts/google/PlayfairDisplay-Variable.ttf",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--font-art",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// Monospace font (Roboto Mono with system fallbacks)
export const allianceMono = localFont({
  src: [
    {
      path: "../../fonts/google/RobotoMono-Variable.ttf",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});
