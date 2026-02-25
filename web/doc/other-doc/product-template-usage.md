# Product Template Usage (JARVIS Product Pages)

Applies to static product pages built on `src/components/product-template/*` (Jarvis Pay/Agent/etc.). No Sanity data; all content is Paraglide `m.*()` and static media.

## Pattern
- Server wrapper `page.tsx`: only `generateMetadata` may call `m.*()`. JSON-LD should use static strings; build URLs with `getSiteUrl()` + `buildHref()` (no hand-crafted locale prefixes).
- Client content `{product}-client.tsx`: `"use client"`; all translations and layout props live here. Do **not** pass server-rendered `m.*()` strings.
- Layout `layout.tsx`: `HideDefaultFooter` + `FooterCharcoal` to replace the white global footer.

## Steps to create a new product page
1) Copy an existing product route (e.g. `src/app/(website)/jarvis-pay/`) and rename files accordingly.
2) Update `page.tsx`:
   - Keep `generateMetadata` with `generateProductPageSEO`.
   - For JSON-LD, use static strings and URLs from `getSiteUrl()` + `buildHref()`.
   - Import the client component only; no other `m.*()` calls.
3) Update `{product}-client.tsx`:
   - Import `ProductPageLayout`.
   - Build props with `m.*()` translations.
   - Media: use `JARVIS_VIDEOS`/`JARVIS_POSTERS` and `getVideoUrl` for feature clips (no hardcoded `/videos/...`).
   - CTA/link props should be locale-aware (`/contact` is ok because `Link` from `@/lib/i18n` prefixes locale).
4) (Optional) Extend media config:
   - Add feature clips to `JARVIS_VIDEOS` or create a local `const featureVideos = { ...getVideoUrl("...") }`.
5) Verify imports:
   - Links: `Link`/`LocalizedLink` from `@/lib/i18n` (not `next/link`).
   - Motion: `m` from `components/motion/lazy-motion`.

## Component props (summary)
- `HeroSection`: `productName`, optional `productSubtitle`, `videoSrc`, optional `posterSrc`, `metadata[]`, optional `logoComponent`.
- `NarrativeTrack`: `stage1Text`, `stage2Text`, optional `stage2Gradient`, `description`, optional `descriptionHighlight`, optional `scrollPrompt`, optional `mobileScrollHeight`/`desktopScrollHeight`.
- `FeatureSection`: `index` ("0.1"), `totalFeatures`, `title[]`, `description`, `mediaSrc`, optional `mediaType` ("video"|"image"), optional `mediaPoster`, optional `details[]`, optional `videoLabel`/`detailsLabel`, `isLast`, optional `imagePriority` (set `true` for above-the-fold images to disable lazy).
- `ProductCTASection`: `title`, `subtitle`, `buttonText`, optional `buttonHref` (defaults to `/contact`).

## Do / Don't
- Do: keep all translations in the client component; use helpers for media URLs; use i18n `Link`.
- Don't: call `m.*()` in server JSON-LD content; hardcode `/videos/...`; use `next/link` on product pages.
