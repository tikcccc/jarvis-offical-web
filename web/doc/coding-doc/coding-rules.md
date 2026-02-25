# Coding Rules - isBIM Official Web

**Last Updated**: 2025-12-13 (Footer refactor: FooterBase/FooterRenderer/FooterConfig + footer-tokens; removed HideDefaultFooter) | **Version**: 4.3

## Layout & Routing
- `(website)` owns providers/Topbar/Footer/PageTransition; `(studio)` stays bare (no providers/i18n).
- `src/app/layout.tsx`: fonts + globals only; keep app structure flat (no `[locale]` folders).

## i18n (FROZEN)
- **Navigation**: Always use `import { Link } from "@/lib/i18n"` - never `next/link`. Link handles locale prefixes automatically. Add `prefetch` prop for important routes.
- **CTAs/Client links**: Prefer `LocalizedLink` from `@/components/ui/localized-link` for buttons/CTA links (use `prefetchMode="hover"` for primary actions); keep using `Link` from `@/lib/i18n` in simple cases.
- **Routing**: Use `useRouter/usePathname/redirect` from `@/lib/i18n`, not `next/navigation`.
- **Server utils**: Use `buildHref(path, locale)` in server components only; never handcraft `/${locale}` paths.
- Do not touch `src/lib/i18n/locale-context.tsx`, `route-builder.ts`, `index.ts`, `i18n.ts` or `src/app/layout.tsx` order.

## Env & ISR
- Read env via `env.ts` only; `NEXT_PUBLIC_MEDIA_URL`/`NEXT_PUBLIC_VIDEO_CDN_URL` drive media bases; `SANITY_WEBHOOK_SECRET` required for `/api/revalidate`.
- Contact form email: `RESEND_API_KEY` (required), `CONTACT_EMAIL_TO` (default: solution@isbim.com.hk).
- Email sender addresses: `EMAIL_FROM_INTERNAL` (internal notifications), `EMAIL_FROM_USER` (user confirmations).
  - Development (`.env.local`): Use `@resend.dev` domain (no verification needed)
  - Production (`.env.production`): Use `@isbim.com.hk` domain (requires DNS verification at https://resend.com/domains)
  - Access via `getEmailFromInternal()` and `getEmailFromUser()` from `@/lib/env`
- Environment file hierarchy: `.env.local` (dev, highest priority, not committed) > `.env.production` (template, committed) > `src/lib/env.ts` (code layer, type-safe access)

## Media & Assets
- Videos via CDN links using `media-config` (`getVideoUrl`/`JARVIS_VIDEOS`); avoid hardcoded `/videos/*`.
- Images鍎厛浣跨敤鏈湴 `/public` 璩囨簮銆?
- 鍕曟厠鍏у闋侊紙Newsroom銆丆areers锛変娇鐢?Sanity 绠＄悊璩囨枡锛涘叾浠栭爜闈笉渚濊炒 Sanity銆?
- `NEXT_PUBLIC_VIDEO_CDN_URL` can override video base; keep filenames consistent.
- When embedding any video, extract the first frame with `ffmpeg` as a poster (store under `public/images/post` via `ffmpeg -i <video> -frames:v 1 -q:v 2 <poster>`), set it as `poster`, and preload `metadata` for buffering fallback.
- **Next.js Images**: Declare all quality values in `next.config.ts` `images.qualities` array (currently: [75, 85, 90, 100]) to avoid warnings in Next.js 15+ and prepare for Next.js 16 requirement.

## Motion & GSAP
- Import `m` from `components/motion/lazy-motion`; `AnimatePresence` only when needed. No direct `motion` imports.
- Services/Products: keep SpotlightCard + CornerBrackets for hover/spotlight; don't reinvent mousemove handlers.
- Use `TypewriterText/TypewriterWidth/TypewriterLines` from `components/animations`; about-us headings stick to `TypewriterWidth` defaults (1.5s, 40 steps, blue block cursor, ScrollTrigger once) via the shared Section; keep Services/Products hero on character-level `TypewriterText`.
- **ScrollTrigger Components**: Use `useLayoutEffect` (not `useEffect`) + `gsap.context()` wrapper; cleanup with `ctx.revert()`; add `invalidateOnRefresh: true` to ScrollTrigger config for layout-shift resilience.
- **Lenis Integration**: `smooth-scroll-provider.tsx` connects Lenis to ScrollTrigger via `lenisInstance.on("scroll", ScrollTrigger.update)` and handles Edge browser image lazy-loading with staggered refresh (300ms/1000ms/window-load). Do not modify this integration.

## Styling & Tokens
- Design tokens 位于 `src/styles/*-design-tokens.css` + `design-tokens.ts`；不要重复定义 breakpoints/z-index/colors/fonts。页面/组件字体只用对应 token（home/product/aboutus/services/contact/newsroom/layout），避免再写 `font-sans/font-mono`。
- Layout 导航/页脚/Topbar/Menu 使用 `layout-design-tokens.css` (AllianceNo2 标题/AllianceNo1 链接/标签)；页面 token 负责本页字号/行高（保持现有大小）。
- Spacing/shape/motion：Home/Product/About/Contact/Newsroom 已提供 container/section/stack/grid、radius/shadow、motion (duration/easing/stagger) token；禁止再写零散 `pt-28`/`gap-12`/`rounded-lg`/`duration-300`，改用对应 utility（如 `home-section-padding`、`product-radius-card`、`about-section-padding`、`contact-form-grid`、`newsroom-section`）。
- 动效：统一用全局 `animation-design-tokens.css` + 页级 motion token；typewriter/GSAP/Framer 参数读 token，避免硬编码 easing/时长。
- Tailwind v4 utilities；shimmer utility 仍在 `globals.css`（Services/Products hero）。

## Services & Products Page
- Dark cyberpunk vibe: `bg-[#050505]`, emerald accents, `BackgroundLayers`, `ServicesGrid` -> `ServiceCard`/`SpotlightCard`/`CornerBrackets`, `CtaSection` (footer driven by FooterConfig variant).
- Data from `src/data/services.ts` (5 entries) only; no inline duplicates.
- Uses dedicated `layout.tsx` with `<FooterConfig variant="charcoal" />` (global `FooterRenderer` applies variant; HideDefaultFooter removed).

## Service Template (JPM/BIM/Finance/Ventures)
- 架构：Server `page.tsx` 只做 SEO（`generateServicePageSEO`）；Client `ServiceTemplate` 负责渲染与交互，数据集中在 `src/data/services.ts`。
- 样式：`4-themes/service.css`（`service-shell` 宽 90%/88%，`max-width: 1700px`，padding 0），hero 全屏铺底，其他段落用 service-shell；禁止随意改 token 顺序，遵循 token-plan/token-rule。
- 组件：`service-template/` 下的 hero/methodology/engine/data/gallery/cta，颜色/间距/动效均用设计 token，不得硬编码 hex/px。
- 布局：方法论/数据/引擎/图库统一 7/5 分栏；Performance Delta 右侧 2×2 指标栅格，数值保持大字号（6xl/7xl），标签 12px/14px，分隔线用 `border-[var(--border-subtle)]`。
- CTA：左对齐，布局通过 `<FooterConfig variant="charcoal" />` 指定深色 footer，依赖全局 `FooterRenderer`；链接遵循 i18n 规范使用 `Link/LocalizedLink`。

## Product Template (JARVIS Product Pages)
- **Architecture**: Server Wrapper + Client Content pattern
  - `page.tsx` (Server Component): SEO metadata generation + JSON-LD Schema ONLY
  - `{product}-client.tsx` (Client Component): ALL m.*() translations executed client-side
  - Benefits: Single page refresh, no `dynamic = "force-dynamic"`, automatic locale responsiveness
- **CRITICAL i18n Rule**:
  - 鉂?NEVER call m.*() in Server Component and pass as props (pre-renders as static strings 鈫?locale mismatch)
  - 鉁?ALWAYS create dedicated `{product}-client.tsx` marked `"use client"` with all m.*() calls inside
  - Example: `jarvis-pay/page.tsx` (Server) 鈫?`jarvis-pay/jarvis-pay-client.tsx` (Client with m.*())
- **Data Source Rule**: Static resources ONLY (Paraglide m.* translations). NOT for Sanity-based pages (Newsroom/Careers use Server Component + ISR).
- Palantir-inspired design: sticky video hero, scroll-driven narrative, feature sections with Video/Details toggle.
- Components: `HeroSection`, `NarrativeTrack`, `FeatureSection`, `ProductCTASection`, `ProductPageLayout` (composite) - ALL marked `"use client"`.
- **Layout**: Use dedicated `layout.tsx` with `<FooterConfig variant="charcoal" />` (same pattern as services-products); global `FooterRenderer` 负责渲染对应变体。
- **NarrativeTrack**: Responsive scroll height via `mobileScrollHeight` (250vh) / `desktopScrollHeight` (350vh) props. Uses `data-text` + `::before` pseudo-element for gradient text overlay.
- **FeatureSection**: Uses `next/image` with fill+sizes for optimized images. ARIA tablist/tab/tabpanel roles + keyboard navigation (ArrowLeft/ArrowRight) for accessibility.
- **SEO**: Add `SoftwareApplicationSchema` + `BreadcrumbSchema` via `<JsonLd>` in Server Component wrapper for each product page.
- **Animation hooks**: Use `useInViewAnimation` for reversible scroll-driven CSS class toggling.
- **CSS utilities**: `.product-section`, `.product-char`, `.product-block-anim`, `.product-stage2-text` in `globals.css`.
- **Guardrails (2025-02)**:
  - Server wrapper only: `generateMetadata` may call `m.*()`; JSON-LD content should use static strings. Build all URLs with `getSiteUrl()` + `buildHref()` (no hand-crafted locale prefixes).
  - Client content: all translations live in `{product}-client.tsx`; do not pass server-rendered `m.*()` strings as props.
  - Media: use `getVideoUrl`/`JARVIS_VIDEOS` (or feature helpers) instead of `/videos/...` literals so CDN overrides/encoding apply.
  - Links/CTA: use `Link` or `LocalizedLink` from `@/lib/i18n`; avoid `next/link` to keep locale-aware routing/prefetch.

## Sanity & SEO
- **Sanity**: Fetch with `sanityFetch` + typed queries; tag caches; no `any`; no direct `process.env`. Registered schemas: `newsType`, `careerType` only.
- **Dynamic Content Pages (Newsroom, Careers)**:
  - Architecture: Server Component + Sanity CMS + ISR (different from Product Template)
  - Use `sanityFetch()` with cache tags for on-demand revalidation
  - Keep Server Component for SEO and data fetching optimization
  - Do NOT apply Product Template's client component pattern to these pages
- **SEO Metadata**: Use generators from `seo-generators.ts` for all pages:
  - Products: `generateProductPageSEO(productKey, title, desc, locale)`
  - Services: `generateServicePageSEO(serviceKey, title, desc, locale)`
  - About: `generateAboutPageSEO(locale)`
  - Services overview: `generateServicesPageSEO(locale)`
  - Newsroom: `generateNewsroomPageSEO(locale)`
  - Careers: `generateCareersPageSEO(locale)`
- **Critical keywords**: All pages MUST include isBIM + Hong Kong/棣欐腐 + dual identity (AI + Construction tech). Generators enforce this automatically via `composeKeywords()`.
- **Structured data**: Use helpers from `json-ld.tsx`:
  - Organization: `createOrganizationSchema()` (company info)
  - Software: `createSoftwareApplicationSchema()` (JARVIS products)
  - Breadcrumb: `createBreadcrumbSchema()` (navigation)
  - Render with `<JsonLd data={schema} id="unique-id" />`
- **Sitemap**: Keep exclusions (`/jarvis-ai-suite` redesign, `/contact` low priority). Leave canonical/hreflang helpers and ISR webhook flow untouched.

## Contact Form Email (Dual Provider: Resend + Brevo)
- **Architecture**: Use Server Action `submitContactForm` from `actions/contact-form.action.ts`; never call email APIs directly from client.
- **Provider Selection**: Switch via `EMAIL_PROVIDER` env var (`resend` [default] | `brevo`); routing handled by `sendEmail()` from `lib/email/email-client.ts`.
- **Dual emails**: Internal (English, to `getContactEmailTo()`) + User confirmation (i18n based on locale).
- **Sender addresses**: Use `getEmailFromInternal()` and `getEmailFromUser()` from `@/lib/env`; never hardcode sender addresses.
- **Rate limiting**: 3 submissions/IP/5min (in-memory Map); WARNING: NOT serverless-compatible (use Redis for distributed deployment).
- **Validation**: `contactFormSchema` from `schemas/contact-form.schema.ts`; enforce server-side.
- **Templates**: `lib/email/templates.ts`; HTML + plain text, responsive, inline CSS.
- **Env variables**:
  - `EMAIL_PROVIDER`: `resend` (default) | `brevo` - controls which provider to use
  - `RESEND_API_KEY`: Required if using Resend
  - `BREVO_API_KEY`: Required if using Brevo
  - `CONTACT_EMAIL_TO`: Optional (defaults to solution@isbim.com.hk)
  - `EMAIL_FROM_INTERNAL`/`EMAIL_FROM_USER`: Optional (defaults to `@resend.dev` for dev, `@isbim.com.hk` for production)
- **Provider details**:
  - Resend: 3000 emails/month free, requires domain verification for production
  - Brevo: 9000 emails/month free, optional domain verification

## Contact Page
- **Architecture**: Client Component (`"use client"`) with `useLocale()` from `@/lib/i18n/locale-context`.
- **i18n**: All UI copy pulled from `messages/*.json` via `@/paraglide/messages` (no inline `locale === "zh"` conditionals). Service/company option labels also localized; keep values stable for backend.
- **Design tokens**: Uses `contact-design-tokens.css` with product template gradient system (purple鈫抍yan: `#9881F3鈫?13C9BA`).
- **Styling**: Light architectural theme (`bg-[#f8fafc]`), technical grid background, CAD corner markers, glass panel form.
- **Form**: React Hook Form + Zod (`contactFormSchema`), submits via Server Action `submitContactForm`.
- **Map**: OpenStreetMap iframe embed + Google Maps external link; coordinates for 430 Nathan Road, Yau Ma Tei.
- **CSS utilities**: `.contact-page`, `.contact-panel`, `.contact-gradient-text`, `.contact-badge`, `.contact-input`, `.contact-label`, `.contact-btn-primary`.

## Newsroom Page
- **Architecture**: Server Component + Client Component hybrid matching original prototype exactly.
  - List page: `newsroom/page.tsx` (Server) fetches data, `newsroom-page-client.tsx` (Client) handles ALL interactivity
  - Detail page: `newsroom/[slug]/page.tsx` (Server) for SEO, `news-detail-client.tsx` (Client) for display
  - Client component handles: view switching (grid/magazine/feed), category filtering, pagination, internal routing to detail view
  - Use `sanityFetch()` with cache tags (`sanity:news`, `sanity:newsCategory`) for ISR
- **Design Alignment**: A-class content page aligned with Home page (white background #FDFDFD, NOT gray like About Us).
  - Rationale: Home + Newsroom = A-class pages (white); About Us + Contact = B-class pages (gray/light)
- **Design tokens**: Uses `newsroom-design-tokens.css` for magazine editorial styling.
- **Styling**: White background (#FDFDFD), Alliance font family, transparent cards with white featured card, noise overlay texture.
- **Data Schema**:
  - `newsType`: title, slug, subtitle, mainImage (with alt), excerpt, body (rich text), category (reference), tags, author, readTime, publishedAt, featured, status (draft/published/archived), seo (metaTitle, metaDescription, openGraphImage, keywords)
  - `newsCategoryType`: title, slug, description, color (hex for badges)
- **Features**:
  - Three layout modes: Grid (auto-fill cards), Magazine (12-col asymmetric), Feed (list view)
  - Category filtering with dynamic color badges from `newsCategory.color`
  - Featured article always displayed with white background and larger aspect ratio (21:9)
  - Regular cards: transparent background, subtle white overlay on hover, 16:9 aspect ratio
  - Framer Motion staggered fade-in animations (`.newsroom-animate-in` with delay classes)
  - Noise overlay for editorial texture (`.newsroom-noise-overlay`)
- **CSS utilities**: `.newsroom-container`, `.newsroom-content`, `.newsroom-article-container`, `.newsroom-title`, `.newsroom-article-title`, `.newsroom-card-title`, `.newsroom-card`, `.newsroom-card-featured`, `.newsroom-category-badge`, `.newsroom-filter-btn`, `.newsroom-layout-btn`, `.newsroom-image-cover`, `.newsroom-image-featured`, `.newsroom-grid`, `.newsroom-magazine`, `.newsroom-feed`.
- **Queries**: Use typed queries from `queries.ts`:
  - `NEWS_CATEGORIES_QUERY`: Fetch all categories (for filter UI)
  - `FEATURED_NEWS_QUERY`: Single featured article (status=published, featured=true)
  - `NEWS_LIST_QUERY`: Paginated news list with `$start` and `$end` params
  - `NEWS_BY_CATEGORY_QUERY`: Filtered by category `$categoryId` with pagination
  - `NEWS_DETAIL_QUERY`: Single article with full SEO and body content
  - `RELATED_NEWS_QUERY`: 3 related articles from same category (excludes current)
  - `NEWS_METADATA_QUERY`: SEO metadata only (for `generateMetadata`)
- **SEO**: Use `generateNewsroomPageSEO()` for list page; build detail page metadata from `NEWS_METADATA_QUERY` with fallbacks (seo.metaTitle 鈫?title, seo.metaDescription 鈫?subtitle/excerpt).
- **Design Reference**: `doc/reference-doc/pages/newsroom/newsroom-page.html` (original prototype).
- Styles:
  - Layering顺序：tokens（值）→ globals（reset/base）→ themes/{page}（作用域变量）→ {page}-utilities（容器/间距/labels/buttons 等，可作用域到页面）→ {page}-animations（作用域 keyframes）→ 组件 module CSS。
  - Tokens：值放 `tokens.css`，响应式仅在 tokens (:root media) 中定义；主题覆盖在 `themes/{page}.css`，不写类。
  - 组件：使用 CSS Modules，颜色/间距/圆角/动效参数用 `var(--token)`，数值响应式用 clamp token；布局方向类可用 media query。
  - Keyframes：通用的放页面动画文件并作用域（如 `.home-page`），专用的放组件 module。
  - Tailwind bridge：在 `tailwind.config.js` 把需要的 colors/spacing/radius/shadow 映射到 CSS vars。

