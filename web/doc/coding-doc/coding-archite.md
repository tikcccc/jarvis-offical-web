# isBIM Official Web Architecture (v3.14)

**文件说明:** 本文件记录 isBIM 官网的系统架构、技术栈分层、文件结构和模块关系。当添加/移除核心依赖、修改文件夹结构、增加新架构层(认证、支付、分析)或更新环境变量结构时需要更新此文件。

**更新原则:**
- 聚焦"存在什么"和"如何连接",避免实现细节
- 保持简洁,使用列表和代码块
- 删除过时的架构信息

**Last Updated**: 2026-02-09 (Case Studies architecture added as a Newsroom-parallel Sanity module)

## Deployment Architecture
- **Deployment Target**: Huawei Cloud (华为云)
- **Architecture**: Pure frontend application with Next.js Server Actions (no separate backend)
- **Rendering**: SSG + ISR (Incremental Static Regeneration) for optimal performance
- **Serverless Compatibility**: ⚠️ Current rate limiting uses in-memory Map (not serverless-compatible); requires distributed cache (Redis) or container deployment with session affinity for multi-instance scenarios

## Tech Stack
- Next.js 15 (App Router, Webpack build), TypeScript, Tailwind CSS v4
- Paraglide v1 i18n (LocaleContext pattern + PrefixStrategy) - /en and /zh are always prefixed routes
- Animations: Lenis (smooth scroll), GSAP, Framer Motion via `MotionProvider` + `m`
- Data/UI: TanStack Query, Zustand (`menu-store.ts`, `footer-store.ts`)
- CMS: Sanity only for dynamic content (Newsroom posts, Case Studies entries, Careers positions); other pages use local/static data
- Media: videos via CDN (`media-config` + `NEXT_PUBLIC_VIDEO_CDN_URL`/`NEXT_PUBLIC_MEDIA_URL`), images prefer local `/public` assets
- Email: Dual-provider system (Resend primary, Brevo backup) - switch via `EMAIL_PROVIDER` env var
- SEO: `generatePageMetadata`, JSON-LD schemas, sitemap/robots generators


## App Structure (high level)
```
src/app/
  layout.tsx                    # fonts + globals only (no providers)
  (website)/
    layout.tsx                  # await headers() -> setLanguageTag() -> LocaleProvider -> AppProviders -> Topbar/FooterRenderer
    template.tsx                # PageTransition (client) wrapper
    page.tsx                    # Home
    about-us/page.tsx
    services-products/page.tsx
    jarvis-*/page.tsx           # agent/pay/air/eagle-eye/ssss/dwss/cdcp/assets/jpm
    bim-consultancy/page.tsx
    project-finance/page.tsx
    venture-investments/page.tsx
    newsroom/page.tsx
    case-studies/page.tsx
    case-studies/[slug]/page.tsx
    careers/page.tsx
    contact/page.tsx
    contact/contact-client.tsx # client-only contact form UI
    privacy/page.tsx            # minimal placeholder
    terms/page.tsx              # minimal placeholder
    cookies/page.tsx            # minimal placeholder
    sitemap.ts                  # dynamic sitemap
    robots.ts                   # robots with Studio exclusions
  (studio)/
    studio/[[...index]]/page.tsx  # Sanity Studio (NextStudio)
  actions/
    contact-form.action.ts      # Server Action for contact form (Zod validation + rate limiting + email sending)
  api/
    revalidate/route.ts         # Sanity webhook -> on-demand ISR (HMAC secret)
```

### Services Template (JPM / BIM / Finance / Ventures)
- Pattern: Server wrapper `page.tsx` (SEO via `generateServicePageSEO`) + client `ServiceTemplate` (content/data).
- Data source: `src/data/services.ts` (hero/narrative/engine/stats/gallery/meta); no inline duplicates.
- Theme: `src/styles/4-themes/service.css` (service-shell width 90%/88%, max-width 1700px, padding 0); hero is full-bleed, sections use service-shell.
- Components: `service-template/*` (hero/methodology/engine/data/gallery/cta) consume design tokens; avoid hardcoded hex/spacing.
- Pages: `/jarvis-jpm`, `/bim-consultancy`, `/project-finance`, `/venture-investments` all share this template and set footer via `<FooterConfig variant="charcoal" />` (global FooterRenderer reads Zustand store; no HideDefaultFooter).

### Layout / UI
```
src/components/layout/
  topbar.tsx
  menu-overlay.tsx
  footer-base.tsx / footer.tsx / footer-charcoal.tsx (thin wrappers)
  footer-renderer.tsx (global render via footer-store) / footer-config.tsx (page-level variant toggle)
  newsletter-form.tsx   # lazy-loaded in footer
  locale-switcher.tsx
  page-transition.tsx   # global transition overlay; disables browser scroll restoration and uses Lenis/window smooth scroll to top on load/after transitions
  motion/lazy-motion.tsx# LazyMotion provider + `m`
src/components/
  smooth-scroll-provider.tsx  # Lenis provider with ScrollTrigger integration; handles Edge browser image lazy-loading via multiple refresh timings (300ms, 1000ms, window load)
```
- Menu overlay JARVIS AI Suite cards now deep-link to their localized product routes (uses `buildHref` + `ROUTES.JARVIS.*` on click).
- **Lenis + ScrollTrigger**: `smooth-scroll-provider.tsx` connects Lenis scroll events to ScrollTrigger (`lenisInstance.on("scroll", ScrollTrigger.update)`) and refreshes at 300ms/1000ms/window-load to handle Edge browser's deferred image loading.
- **Footer architecture**: Single global `<FooterRenderer>` in `(website)/layout.tsx` reads Zustand `footer-store`; per-page/layout sets variant via `<FooterConfig variant="charcoal" | "default" />`. Tokens live in `src/styles/footer-tokens.css`. `HideDefaultFooter` removed.
- **PageTransition context**: `useTransitionComplete()` gates client animations until the transition overlay finishes (prevents early ScrollTrigger calculations).

### Sections (selected)
```
src/components/sections/
  hero-section-1.tsx
  interactive-carousel.tsx
  section3-placeholder.tsx    # GSAP ScrollTrigger animation (sparse-to-dense text); uses useLayoutEffect + gsap.context pattern
  section4-platform-list.tsx
  section5-cta.tsx
  scroll-prompt.tsx
```
- **Section3**: Uses `useLayoutEffect` + `gsap.context()` for ScrollTrigger animations; gated by `useTransitionComplete()`; `invalidateOnRefresh: true` ensures correct position calculations after layout shifts.

### Services & Products Page
```
src/components/services-products/
  background-layers.tsx   # noise + tech grid + emerald glow layers
  hero-section.tsx        # dark hero with shimmer text
  services-grid.tsx       # Bento grid with staggered Framer animations
  service-card.tsx        # interactive cards (hover expand, grayscale->color)
  spotlight-card.tsx      # GPU mouse-follow spotlight wrapper
  corner-brackets.tsx     # HUD-style brackets overlay
  cta-section.tsx         # final CTA with local grid background
```
- services data: `src/data/services.ts` (5 services/products)

### Newsroom Page
```
src/app/(website)/newsroom/
  page.tsx                    # Server Component - SEO + data fetching from Sanity
  newsroom-page-client.tsx    # Client Component - matches prototype with routing/filter/view logic
  [slug]/
    page.tsx                  # Server Component - news detail page with SEO
    news-detail-client.tsx    # Client Component - detail view with related articles
```
- **Architecture Pattern**: Server Component + Client Component hybrid (matches prototype exactly)
  - List page: Server fetches from Sanity, client handles all interactivity
  - Detail page: Separate route with Server/Client split for SEO optimization
- **Client Features**: View switching (grid/magazine/feed), category filtering, pagination, internal routing
- **Design**: Original prototype style - white background (#FDFDFD), editorial magazine layout
- **Data**: Sanity CMS (newsType with full schema, newsCategoryType with colors)
- Reference: `doc/reference-doc/pages/newsroom/newsroom-page.html` (original prototype)

### Case Studies Page (Case Center)
```
src/app/(website)/case-studies/
  page.tsx                      # Server Component - SEO + data fetching from Sanity
  case-studies-page-client.tsx  # Client Component - same interaction model as Newsroom list
  [slug]/
    page.tsx                    # Server Component - case detail page with SEO
    case-detail-client.tsx      # Client Component - detail view with related cases
```
- **Architecture Pattern**: 1:1 parallel module copied from Newsroom (Server + Client split)
  - List page: Server fetches from Sanity, client handles filtering/layout switching
  - Detail page: Separate route with Server/Client split for SEO optimization
- **Data**: Sanity CMS (`caseStudyType`, `caseStudyCategoryType`) with field structure mirrored from `newsType` / `newsCategoryType`
- **Implementation Strategy**: Prefer copy-first (independent files/namespaces) over deep abstraction, so future Case Studies-specific changes do not affect Newsroom

### Product Template (JARVIS Product Pages)
```
src/components/product-template/
  hero-section.tsx          # 'use client' - Sticky video hero with gradient overlays
  narrative-track.tsx       # 'use client' - 350vh scroll-driven storytelling (dark→light transition, char reveal)
  feature-section.tsx       # 'use client' - Feature showcase with Video/Details toggle, next/image
  cta-section.tsx           # 'use client' - Final CTA with gradient background
  product-page-layout.tsx   # 'use client' - Composite layout (combines Hero+Narrative+Features+CTA)
  index.ts                  # Barrel exports + ProductFeature/ProductPageLayoutProps types

src/app/(website)/jarvis-pay/
  page.tsx                  # Server Component - SEO metadata + JSON-LD Schema only
  jarvis-pay-client.tsx     # 'use client' - All m.*() translations executed client-side
  layout.tsx                # sets <FooterConfig variant="charcoal" /> (global FooterRenderer applies variant)
```
- **Architecture Pattern**: Server Wrapper + Client Content
  - `page.tsx` (Server Component): SEO metadata + JSON-LD Schema only, NO m.*() calls except metadata generation
  - `{product}-client.tsx` (Client Component): ALL content m.*() translations executed client-side
  - Key: m.*() calls in Server Component are pre-rendered and passed as static strings → causes locale mismatch
  - Solution: All page content translations must execute in dedicated client file (e.g., `jarvis-pay-client.tsx`)
  - Advantages: (1) Single page refresh on locale switch, (2) No `dynamic = "force-dynamic"` needed, (3) Real-time locale responsiveness
- **Data Source**: Static resources only (Paraglide m.* translations), NOT Sanity CMS
- **Contrast with Dynamic Pages**: Newsroom/Careers/Case Studies use Server Component + Sanity + ISR pattern (different from Product Template)
- Design reference: `doc/reference-doc/pages/product-template/`
- Layout: use dedicated `layout.tsx` with `<FooterConfig variant="charcoal" />`; global FooterRenderer applies the variant (HideDefaultFooter removed)
- Responsive scroll height: 250vh mobile, 350vh desktop (via `mobileScrollHeight`/`desktopScrollHeight` props)
- SEO: Uses `SoftwareApplicationSchema` + `BreadcrumbSchema` for structured data
- Accessibility: ARIA tablist/tab/tabpanel roles + keyboard navigation for Video/Details toggle

### Animations
```
src/components/animations/
  scroll-reveal.tsx          # Framer + useInView
  parallax-section.tsx       # placeholder
  slide-in.tsx               # placeholder
  typewriter.tsx             # TypewriterText/TypewriterWidth/TypewriterLines (GSAP + ScrollTrigger)
  index.ts                   # barrel for animations suite
```
- `TypewriterWidth` drives about-us section titles (1.5s duration, 40 steps, blue block cursor, ScrollTrigger once).

### Hooks (barrel: src/hooks/index.ts)
- Scroll/viewport: `useScrollProgress`, `useInView`
- RWD: `useMediaQuery`, `useIsMobile/Tablet/Desktop/LargeDesktop`
- Smooth scroll: `useSmoothScrollTo`, `useScrollToElement`, `useScrollToTop` (Lenis fallback native)
- Body scroll: `useBodyScrollLock`
- GSAP: `useGsapAnimation`, `useGsapTimeline`
- Autoplay: `useAutoplay`
- Animations: `useInViewAnimation` (reversible scroll-driven CSS class toggling)

### Library / Config
```
src/lib/
  design-tokens.ts        # color/spacing/radius/shadows/z-index/typography/animation tokens
  animations.ts           # GSAP config from tokens
  animation-variants.ts   # Framer variants from tokens
  constants.ts            # ROUTES + IDs/breakpoints/etc.
  env.ts                  # typed env + sanityConfig + getResendApiKey + getBrevoApiKey + getEmailProvider + getContactEmailTo + getEmailFromInternal + getEmailFromUser + NEXT_PUBLIC_MEDIA_URL + NEXT_PUBLIC_VIDEO_CDN_URL
  media-config.ts         # getVideoUrl/getImageUrl + JARVIS_VIDEOS + CDN helpers
  email/
    resend-client.ts      # Resend client initialization (primary)
    brevo-client.ts       # Brevo client initialization (backup)
    email-client.ts       # Unified email interface (routes to Resend/Brevo based on EMAIL_PROVIDER)
    templates.ts          # Email templates (internal notification + user confirmation, i18n)
    send-contact-email.ts # Dual email orchestration (uses email-client)
    index.ts              # Barrel export
  i18n/
    locale-context.tsx    # LocaleProvider + useLocale (FROZEN)
    route-builder.ts      # buildHref/linkTo/useLocalizedHref (FROZEN)
    index.ts              # Barrel export: Link/useRouter/usePathname/redirect + locale utils (FROZEN)
  i18n.ts                 # Paraglide Navigation API (Link/useRouter/redirect) - server component
next.config.ts            # images.qualities: [75, 85, 90, 100] for Next.js 15+ image quality validation
```

### SEO & Sitemap
- `src/lib/seo.ts` + `src/lib/seo-generators.ts`: shared metadata helpers (OpenGraph/Twitter/hreflang) with locale-prefixed canonicals.
- JSON-LD: Root `Organization` in `src/app/layout.tsx`; product pages add `SoftwareApplication` + `Breadcrumb`; home adds org + suite schema.
- Sitemap: `src/app/(website)/sitemap.ts` emits locale-prefixed URLs; includes static pages + Sanity news/case-studies/careers slugs with `en`/`zh` alternates.
- Robots: `src/app/(website)/robots.ts` disallows `/studio`, `/api`, `/_next`; exposes sitemap URL; blocks GPTBot/Google-Extended.

### Environment Variables
Project uses three environment file layers:

**1. `src/lib/env.ts` (TypeScript module)**
- NOT an env file - code layer for type-safe env access
- Exports helper functions: `getResendApiKey()`, `getContactEmailTo()`, `getEmailFromInternal()`, `getEmailFromUser()`
- Runtime validation in development mode
- Single source of truth for environment variable access

**2. `.env.local` (Local development)**
- Used for localhost:3000 development
- Highest priority - overrides all other env files
- NOT committed to Git (.gitignore)
- Contains development-safe values (e.g., `EMAIL_FROM_INTERNAL=isBIM Contact Form <noreply@resend.dev>`)

**3. `.env.production` (Production template)**
- Reference template for production deployment
- Committed to Git (with placeholder values)
- Not used directly - deployment platforms (Vercel) use these as reference
- Contains production values (e.g., `EMAIL_FROM_INTERNAL=isBIM Contact Form <noreply@isbim.com.hk>`)

**Email Sender Configuration:**
- Development: `@resend.dev` domain (no verification needed)
- Production: `@isbim.com.hk` domain (requires DNS verification at https://resend.com/domains)
- Variables: `EMAIL_FROM_INTERNAL` (internal notifications), `EMAIL_FROM_USER` (user confirmations)

**Email Provider Configuration:**
- Primary: Resend (default, 3000/月免费)
- Backup: Brevo (9000/月免费)
- Variables: `RESEND_API_KEY` (required), `BREVO_API_KEY` (optional), `EMAIL_PROVIDER` (resend|brevo, default: resend)

### UI Components
```
src/components/ui/
  localized-link.tsx      # Enhanced Link wrapper with auto-prefetch (optional alternative to @/lib/i18n Link)
  ...other ui components
```

### Data
```
src/data/
  products.ts           # product cards
  services.ts           # placeholder
  navigation.ts         # nav definitions; pass buildHref to localize
```

### Schemas
```
src/schemas/
  contact-form.schema.ts  # Zod validation schema for contact form (server-side validation)
```

### Styles
```
  src/styles/
    animations.css  # placeholder keyframes
    typography.css  # placeholder typography utilities
    home-utilities.css          # home containers/spacing/labels/buttons/radius (utilities)
    home-animations.css         # home-scoped keyframes (hud flicker, bounce) under .home-page
    themes/home.css             # .home-page scoped var overrides + base overrides (font/background/overflow)
    tokens.css                  # global primitives + semantics + responsive overrides (values only)
  - home-design-tokens.css      # removed from imports; legacy file deleted after migration
  - aboutus-design-tokens.css   # about page palette + typography helpers (about-section/bg/overlay/text); AllianceNo2 titles, AllianceNo1 body/labels
  - services-design-tokens.css  # services/products page palette (dark + emerald), selection, badge/border helpers
  - contact-design-tokens.css   # contact page palette (light bg + product gradient), form/panel/badge utilities; layout/spacing (container/section/stack/form-grid), shape/shadow, motion (fast/base/slow/delay), underline/CTA animation tokens
  - newsroom-design-tokens.css  # newsroom page design (A-class content page aligned with Home: white #FDFDFD, Alliance fonts, magazine editorial style, transparent cards, noise overlay); includes layout/spacing (container/section/grid), shape/shadow, motion tokens (fast/base/slow/stagger) reused in Framer variants
  - case-studies-design-tokens.css # cloned from newsroom tokens initially; can diverge for case-specific visual direction
  - layout-design-tokens.css    # shared layout tokens for nav/menu/footer typography (AllianceNo2 headings, AllianceNo1 links/labels)
    ```
    - globals.css: imports home/product/aboutus/services/contact/newsroom/case-studies/layout tokens; retains custom variant + shared shimmer (services/products hero)

### SEO & ISR
```
src/lib/seo.ts                     # canonical + hreflang helpers (x-default, en/en-US/en-GB/zh/zh-CN/zh-HK/zh-TW)
src/lib/seo-generators.ts          # SEO metadata generators with hierarchical keyword system; enforces brand (isBIM) + geographic (Hong Kong) + dual identity (AI + Construction tech) on all pages
src/components/seo/json-ld.tsx     # JsonLd component + helpers: Organization/Product/JobPosting/Breadcrumb/SoftwareApplication schemas
src/app/(website)/robots.ts        # disallow Studio/API/_next/admin/json/revalidate; includes CN search engines and AI bots
src/app/layout.tsx                 # renders Organization schema (JsonLd)
src/app/api/revalidate/route.ts    # webhook endpoint with SANITY_WEBHOOK_SECRET for tag-based revalidation
```

**SEO Strategy** (Phase 1 Complete):
- **Hierarchical keywords**: 5 levels (Brand → Identity → Technology → Specific → Geographic)
- **Critical keywords** guaranteed on all pages: isBIM, Hong Kong/香港, AI technology company, Construction technology company
- **Schema.org structured data**: Organization, SoftwareApplication (for JARVIS products), Breadcrumb
- **OG images**: 1200x630 assets in `public/images/og` for home/services/newsroom and all JARVIS products
- **Noindex**: `/jarvis-ai-suite` marked `noIndex` while redesigning
- **P0 pages optimized**: Home, About Us, Services & Products, Newsroom, Case Studies (with metadata + schemas)
- **Sitemap**: Excludes `/jarvis-ai-suite` (redesign), lowers `/contact` priority, locale-prefixed URLs only
- **Generators**: `generateProductPageSEO()`, `generateServicePageSEO()`, `generateAboutPageSEO()`, `generateServicesPageSEO()`, `generateNewsroomPageSEO()`, `generateCaseStudiesPageSEO()`, `generateCareersPageSEO()`

### Sanity Data Layer
```
src/sanity/lib/
  client.ts            # Sanity clients (read/write) with env-based CDN
  fetch.ts             # Type-safe fetch wrapper with Next.js cache + tags
  queries.ts           # Typed GROQ queries (defineQuery): NEWS_* + CASE_STUDY_* (mirrored from NEWS_*) + CAREER_* + sitemap queries
  types.ts             # TypeScript types for all schemas
  image.ts             # Image URL builder
  index.ts             # Barrel export
  README.md            # Data layer documentation
```

### Sanity Schemas
```
src/sanity/schemaTypes/
  newsType.ts          # News posts with comprehensive fields (title, slug, subtitle, mainImage, excerpt, body, category reference, tags, author, readTime, featured, status, SEO group)
  newsCategoryType.ts  # News categories (title, slug, description, color for badges)
  caseStudyType.ts     # Case Studies entries, same field structure as newsType
  caseStudyCategoryType.ts # Case Studies categories, same structure as newsCategoryType
  careerType.ts        # Career positions (live)
  index.ts             # register schemas
```

#### Sanity SEO/Media Fields (current)
| Document | Field | Type | Notes | File |
|---|---|---|---|---|
| news | `title` | string | max 100 chars | src/sanity/schemaTypes/newsType.ts |
| news | `slug` | slug | auto-generated from title | src/sanity/schemaTypes/newsType.ts |
| news | `subtitle` | string | optional, max 200 chars | src/sanity/schemaTypes/newsType.ts |
| news | `mainImage` | image | with alt text (required) | src/sanity/schemaTypes/newsType.ts |
| news | `excerpt` | text | optional, falls back to subtitle | src/sanity/schemaTypes/newsType.ts |
| news | `body` | array | rich text with images, H2/H3, quotes | src/sanity/schemaTypes/newsType.ts |
| news | `category` | reference | to newsCategory (required) | src/sanity/schemaTypes/newsType.ts |
| news | `tags` | array<string> | optional tags | src/sanity/schemaTypes/newsType.ts |
| news | `author` | string | default: "isBIM Team" | src/sanity/schemaTypes/newsType.ts |
| news | `readTime` | number | minutes (1-60) | src/sanity/schemaTypes/newsType.ts |
| news | `publishedAt` | datetime | required | src/sanity/schemaTypes/newsType.ts |
| news | `featured` | boolean | show as featured article | src/sanity/schemaTypes/newsType.ts |
| news | `status` | string | draft/published/archived | src/sanity/schemaTypes/newsType.ts |
| news | `seo.metaTitle` | string | max ~60 chars | src/sanity/schemaTypes/newsType.ts |
| news | `seo.metaDescription` | text | max ~160 chars | src/sanity/schemaTypes/newsType.ts |
| news | `seo.openGraphImage` | image | recommended 1200x630 | src/sanity/schemaTypes/newsType.ts |
| news | `seo.keywords` | array<string> | optional list | src/sanity/schemaTypes/newsType.ts |
| newsCategory | `title` | string | required | src/sanity/schemaTypes/newsCategoryType.ts |
| newsCategory | `slug` | slug | auto-generated from title | src/sanity/schemaTypes/newsCategoryType.ts |
| newsCategory | `description` | text | optional | src/sanity/schemaTypes/newsCategoryType.ts |
| newsCategory | `color` | string | hex color for badges (e.g., #10b981) | src/sanity/schemaTypes/newsCategoryType.ts |
| caseStudy | same field set as `news` | mixed | 1:1 mirror of newsroom content model | src/sanity/schemaTypes/caseStudyType.ts |
| caseStudyCategory | same field set as `newsCategory` | mixed | 1:1 mirror of newsroom category model | src/sanity/schemaTypes/caseStudyCategoryType.ts |
| career | `metaTitle` | string | max ~60 chars | src/sanity/schemaTypes/careerType.ts |
| career | `metaDescription` | text | max ~160 chars | src/sanity/schemaTypes/careerType.ts |

### Public Assets
```
public/
  images/
    og/                   # 1200x630 Open Graph assets (home/services/newsroom/case-studies/product)
  videos/
  icons/
  fonts/Alliance/*.woff2  # via next/font/local
```
- Media CDN: `NEXT_PUBLIC_VIDEO_CDN_URL` (video-only override) falls back to `NEXT_PUBLIC_MEDIA_URL`, else local `/videos`; use `getVideoUrl`/`JARVIS_VIDEOS`.

## Boundaries
- **FROZEN**: `src/lib/i18n/locale-context.tsx`, `src/lib/i18n/route-builder.ts`, `src/lib/i18n/index.ts`, `src/app/layout.tsx` (await headers -> setLanguageTag -> LocaleProvider order), route groups `(website)` / `(studio)` separation.
- **OPEN**: layout JSX/CSS in `(website)`, Paraglide language list, UI components, new pages, navigation data, styles placeholders, animation placeholders, schema placeholders.

## Patterns & Rules (current)
- **Content sources & Rendering Patterns**:
  - **Static Product Pages** (Jarvis Pay, etc.): Client Component pattern (ProductPageLayout), Paraglide m.* translations, no Sanity
  - **Dynamic Content Pages** (Newsroom, Case Studies, Careers): Server Component + Sanity CMS + ISR, use `sanityFetch()` with cache tags
  - Videos: CDN links (via `media-config`/`JARVIS_VIDEOS`)
  - Images: prefer local `/public` assets
- **Email (Contact Form)**:
  - Backend: Dual-provider system via Server Actions (`submitContactForm` in `actions/contact-form.action.ts`)
  - Providers: Resend (primary, 3000/月) + Brevo (backup, 9000/月), switch via `EMAIL_PROVIDER` env
  - Architecture: `email-client.ts` routes to `resend-client.ts`/`brevo-client.ts` based on config
  - Dual emails: Internal notification (English, to `CONTACT_EMAIL_TO`) + User confirmation (i18n: en/zh)
  - Rate limiting: 3 submissions per IP per 5 minutes (in-memory Map)
    - ⚠️ **Serverless limitation**: Not compatible with multi-instance serverless
    - **Deployment options**: Single-instance container | Distributed cache (Redis) | Remove rate limiting
  - Validation: Zod schema (`contact-form.schema.ts`) with server-side enforcement
  - Templates: HTML + plain text, responsive, provider-agnostic
  - Environment: `RESEND_API_KEY`/`BREVO_API_KEY`, `EMAIL_PROVIDER` (default: resend), `CONTACT_EMAIL_TO` (default: solution@isbim.com.hk)
  - Error handling: User-friendly localized messages, logs provider used
  - Both providers are serverless-compatible (stateless HTTP)
- **i18n Navigation**:
  - Standard: `import { Link } from "@/lib/i18n"` with `prefetch` prop
  - Advanced: `import { LocalizedLink } from "@/components/ui/localized-link"` with `prefetchMode="hover|viewport|idle|auto|off"`
  - DO NOT use `next/link` or `buildHref()` manually
  - Routing hooks: `useRouter/usePathname/redirect` from `@/lib/i18n`
  - Server utils: `buildHref(path, locale)` / `linkTo(key, locale)`
  - Never handcraft `/${locale}` paths
  - See [navigation-prefetch-guide.md](./navigation-prefetch-guide.md) for detailed strategy
- **Hydration**: Locale provided via Context from layout; `suppressHydrationWarning` removed from `<html>/<body>`.
- **Design tokens**: Single source of truth in `design-tokens.ts`; drives GSAP/Framer configs (`lib/animations.ts`, `lib/animation-variants.ts`) and hooks (`use-media-query.ts`). No duplicate breakpoints/z-index in `constants.ts`. Per-page tokens now cover color/typography/spacing/layout/shape/shadow/motion; use provided utility classes (`home-*`, `product-*`, `about-*`, `contact-*`, `newsroom-*`, `case-studies-*`, `layout-*`) instead of ad-hoc Tailwind spacing/radius/transition values.
- **Providers**: Global providers centralized in `AppProviders`; Zustand store limited to `menu-store.ts`.
- **Env**: Use `lib/env.ts`; do not read `process.env` directly in app code.
- **Legal pages**: `/privacy`, `/terms`, `/cookies` exist as placeholders to prevent 404 in nav/footer/menu.
- **Build tooling**: Turbopack disabled due to Sanity bundle issues; scripts use Webpack (`next dev`, `next build`).
- **Sanity Client**: Use `client` (read, CDN-enabled in prod) or `writeClient` (write, CDN-bypassed) from `@/sanity/lib/client`.
- **Sanity Fetching**: Use `sanityFetch()` from `@/sanity/lib/fetch` with typed queries from `queries.ts`; supports tag-based revalidation and environment-aware caching.
- **Cache Strategy**: Tag all queries (`sanity:all`, `sanity:{type}`, `sanity:{type}:{id}`); use `REVALIDATE` constants for time-based revalidation; use `revalidateTag()` for on-demand invalidation.
- **Studio isolation**: Studio lives under `(studio)` route group; keep bare layout for Studio only.
- **Sanity usage in app**: Use typed queries and `sanityFetch` for all data operations; home uses `IMAGE_ASSET_BY_SLUG_QUERY` with cache tags and hourly revalidation.
- **Motion**: Use `MotionProvider`/`m` from `components/motion/lazy-motion` instead of direct `motion` imports; keep `AnimatePresence` named imports.
- **SEO Metadata**: Use generators from `seo-generators.ts` (`generateProductPageSEO`, `generateServicePageSEO`, etc.) for all pages; generators enforce critical keywords (isBIM + Hong Kong/香港 + AI/Construction tech dual identity) automatically. Canonical URLs are locale-prefixed; `metadataBase` is set in `src/app/layout.tsx`.
- **SEO Schemas**: Use helpers from `json-ld.tsx` (`createOrganizationSchema`, `createSoftwareApplicationSchema`, `createBreadcrumbSchema`) and render with `<JsonLd data={schema} id="unique-id" />`. Organization schema for company pages, SoftwareApplication for JARVIS products, Breadcrumb for navigation hierarchy.
- **Careers JobPosting**: List page emits `JobPosting` graph for all published roles with localized URLs.
- **SEO Sitemap**: Exclude `/jarvis-ai-suite` (redesign) and lower `/contact` priority; keep robots exclusions for Studio/API/Next assets/admin/json/revalidate.
- **ISR**: Sanity webhook hits `api/revalidate` with `SANITY_WEBHOOK_SECRET` (HMAC) and revalidates tags from payload.
- **Media**: Do not hardcode `/videos/*`; use `getVideoUrl` or `JARVIS_VIDEOS` so CDN overrides work (spaces auto-encoded).
- **Services page**: Keep dark cyberpunk theme (`bg-[#050505]`, emerald accents); wrap with `BackgroundLayers`, `ServicesGrid`, `CtaSection`; use `ServiceCard`/`SpotlightCard`/`CornerBrackets` for interactive cards and `servicesData` for content. Page layout uses `<FooterConfig variant="charcoal" />` + global `FooterRenderer` (no HideDefaultFooter).
- **About Us**: Use the shared `Section` wrapper with `TypewriterWidth` for headings; keep defaults (1.5s, 40 steps, blue cursor, ScrollTrigger once) and reuse existing reveal timelines (no bespoke GSAP per section).
- **Contact page**: Light architectural theme (`bg-[#f8fafc]`, product template purple→cyan gradient accents); uses `contact-design-tokens.css` for panel/form/badge utilities + layout/stack/form-grid/shape/shadow/motion tokens (underline + CTA overlays). Client Component with `useLocale()` + inline i18n. Form uses Server Action (`submitContactForm`), Zod validation, OpenStreetMap embed + Google Maps link.
- **Newsroom page**: A-class content page aligned with Home (white background #FDFDFD); uses `newsroom-design-tokens.css` for magazine editorial styling (color/type + layout/spacing + shape/shadow + motion). Server Component + Sanity CMS + ISR pattern (NOT Product Template client pattern). Architecture: List page (`newsroom/page.tsx`) fetches news via `NEWS_LIST_QUERY`/`NEWS_BY_CATEGORY_QUERY`/`FEATURED_NEWS_QUERY`/`NEWS_CATEGORIES_QUERY`; Detail page (`newsroom/[slug]/page.tsx`) uses `NEWS_DETAIL_QUERY` + `RELATED_NEWS_QUERY`. Features: Three layout modes (Grid/Magazine/Feed), category filtering with dynamic color badges, transparent cards with white featured card, Framer Motion staggered animations (durations/stagger aligned to tokens), noise overlay texture. Design reference: `doc/reference-doc/pages/newsroom/newsroom-redesign.html`. Data: Sanity newsType (title, slug, subtitle, mainImage, excerpt, body, category reference, tags, author, readTime, featured, status, SEO) + newsCategoryType (title, slug, description, color).
- **Case Studies page**: Mirrors Newsroom architecture 1:1 under `/case-studies` with independent file namespace and Sanity document types (`caseStudy`, `caseStudyCategory`). Implemented as a code-copy module from Newsroom (list/detail/client/query/schema/SEO flow) to keep modification boundaries clear; only extract shared helpers when both modules have stable common behavior.

### Product Template - updated guardrails (2025-02)
- Server wrapper (`page.tsx`): only `generateMetadata` may call `m.*()`. JSON-LD text should use static strings; build URLs with `getSiteUrl()` + `buildHref()` (no hand-crafted `/${locale}`).
- Client content (`{product}-client.tsx`): all translations and layout props live here. Do not pass server-rendered `m.*()` strings down.
- Media: use `getVideoUrl`/`JARVIS_VIDEOS` (and feature-specific helpers) instead of hardcoded `/videos/...` so CDN overrides and URL encoding work.
- Links/CTA: use `Link` or `LocalizedLink` from `@/lib/i18n`; avoid `next/link` to keep locale prefix/prefetch consistent across product pages.

## Backlog / Placeholder
- Animations: `parallax-section.tsx`, `slide-in.tsx`, `animations.css`, `typography.css`.
- Sections: `section3-placeholder.tsx` (content pending).
- Sanity: `projectType.ts` decision (deprecate or merge).
