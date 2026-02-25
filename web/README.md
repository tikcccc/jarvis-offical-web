# isBIM Official Web

Next.js 15 app for isBIM’s marketing site and embedded Sanity Studio. Uses Paraglide i18n, GSAP/Framer Motion, Lenis, TanStack Query, and typed Sanity data fetching.

## Project Layout
- `src/app/layout.tsx` – fonts + globals only.
- `(website)/` – public site with providers, Topbar, Footer, PageTransition, sitemap/robots.
- `(studio)/studio/[[...index]]/page.tsx` – Sanity Studio (NextStudio) isolated layout.
- Components: `src/components/layout/*`, `src/components/sections/*`, `src/components/motion/lazy-motion.tsx` (LazyMotion `m` factory).
- i18n: `src/lib/i18n/locale-context.tsx`, `route-builder.ts`, barrel `index.ts` (client imports).
- Sanity data layer: `src/sanity/lib/*` (client, fetch, queries, types, image).
- Fonts: `src/app/fonts.ts`.

## Requirements
- Node 18.18+ (Next.js 15), npm.

## Scripts
- `npm run dev` – start dev server.
- `npm run build` – compile Paraglide messages then Next build.
- `npm run start` – run production server.
- `npm run lint` – lint with ESLint.
- `npm run analyze` – build with bundle analyzer (`.next/analyze/*.html`).
- `npm run paraglide:compile` – regenerate Paraglide outputs (`src/paraglide`).

## Key Conventions
- Route groups: `(website)` for public UI, `(studio)` for Studio-only; keep shared providers out of root layout.
- Framer Motion: use `MotionProvider` + `m` from `components/motion/lazy-motion`; import `AnimatePresence` directly when needed.
- i18n: client code imports from `@/lib/i18n/index` (hooks) and server code uses pure functions (`buildHref`, `linkTo`). Locale comes from headers; no `[locale]` segments.
- Sanity: use `sanityFetch` with tags and `REVALIDATE` constants; build image URLs via `urlFor`.
- Styling/layout: Tailwind v4; shared container utilities in `globals.css`; Lenis for smooth scroll.

## Developing
1) Install deps: `npm install`
2) Dev: `npm run dev` and open http://localhost:3000
3) Lint: `npm run lint`
4) Analyze bundles: `npm run analyze` and open `.next/analyze/client.html`

## Notes
- Studio is excluded from public providers/topbar/footer; keep it minimal.
- Remember to run `npm run paraglide:compile` when message catalog changes.
