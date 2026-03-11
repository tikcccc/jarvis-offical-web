# isBIM Official Web

Next.js 15 app for isBIM’s marketing site. Uses Paraglide i18n, GSAP/Framer Motion, Lenis, TanStack Query, and a typed Strapi data layer.

## Project Layout
- `src/app/layout.tsx` – fonts + globals only.
- `(website)/` – public site with providers, Topbar, Footer, PageTransition, sitemap/robots.
- Components: `src/components/layout/*`, `src/components/sections/*`, `src/components/motion/lazy-motion.tsx` (LazyMotion `m` factory).
- i18n: `src/lib/i18n/locale-context.tsx`, `route-builder.ts`, barrel `index.ts` (client imports).
- Strapi data layer: `src/strapi/lib/*` (API, types, blocks, image).
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
- Route groups: `(website)` for public UI; keep shared providers out of root layout.
- Framer Motion: use `MotionProvider` + `m` from `components/motion/lazy-motion`; import `AnimatePresence` directly when needed.
- i18n: client code imports from `@/lib/i18n/index` (hooks) and server code uses pure functions (`buildHref`, `linkTo`). Locale comes from headers; no `[locale]` segments.
- Strapi: use `src/strapi/lib/api.ts` on the server; build media URLs via `src/strapi/lib/image.ts`.
- Styling/layout: Tailwind v4; shared container utilities in `globals.css`; Lenis for smooth scroll.

## Developing
1) Install deps: `npm install`
2) Dev: `npm run dev` and open http://localhost:3000
3) Lint: `npm run lint`
4) Analyze bundles: `npm run analyze` and open `.next/analyze/client.html`

## Docker (Local Full Stack)
- From repo root: `docker compose -f deploy/docker/docker-compose.local.yml up --build`
- Web: `http://localhost:3000`
- CMS Admin: `http://localhost:1337/admin`
- If Strapi APIs are private, export `WEB_STRAPI_API_TOKEN` before startup.

## Notes
- Remember to run `npm run paraglide:compile` when message catalog changes.
