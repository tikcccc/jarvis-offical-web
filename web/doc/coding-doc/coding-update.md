# isBIM 官网更新日志 (Change Log)

**文件说明:** 本文件记录 isBIM 官网的主要变更和版本历史。当完成重大功能(联系表单、SEO 系统等)、升级核心依赖(Next.js、Tailwind 等)或重构重要模块时需要更新此文件。

**更新原则:**
- 记录日期 + 简要描述 + 影响的文件
- 保持简洁,每条更新不超过 3-5 行
- 按时间倒序排列(最新的在前)
- 仅记录重大变更,避免记录小修小补

**Last Updated**: 2025-11-30

---

## 2025-11-30 (v4.2)
- **Product Template System**: Created Palantir-inspired product page template for JARVIS product showcase pages
- **Components**: `HeroSection` (sticky video hero), `NarrativeTrack` (scroll-driven storytelling with dark→light transition), `FeatureSection` (Video/Details toggle with next/image), `ProductCTASection`, `ProductPageLayout` (composite component)
- **Optimizations**:
  - Replaced `<img>` with `next/image` in FeatureSection for optimized loading
  - Added ARIA accessibility (tablist/tab/tabpanel roles + keyboard navigation) to Video/Details toggle
  - Created `useInViewAnimation` hook for reversible scroll-driven CSS class toggling
  - Mobile scroll optimization: NarrativeTrack now uses 250vh on mobile (vs 350vh desktop)
  - Added SEO schemas (SoftwareApplicationSchema + BreadcrumbSchema) to JARVIS Pay page
- **CSS**: Added `.product-section`, `.product-char`, `.product-block-anim`, `.product-stage2-text::before` utilities in `globals.css`
- **Files**: `src/components/product-template/*`, `src/hooks/use-in-view-animation.ts`, `src/app/(website)/jarvis-pay/page.tsx`, `src/app/(website)/jarvis-pay/layout.tsx`, `src/app/globals.css`

## 2025-11-29 (v4.1)
- **Dual Email Provider System**: Added Brevo as backup email provider alongside Resend; switch via `EMAIL_PROVIDER` env var (`resend` [default] | `brevo`)
- **Architecture**: Created unified email client (`lib/email/email-client.ts`) that routes to appropriate provider; Brevo client singleton (`lib/email/brevo-client.ts`); updated `send-contact-email.ts` to use unified interface
- **Environment**: Added `BREVO_API_KEY` and `EMAIL_PROVIDER` to env system; updated `.env.local`/`.env.production` templates
- **Documentation**: Updated `coding-archite.md` (Tech Stack, Library/Config, Email Provider Configuration section, Email pattern), `coding-rules.md` (Contact Form Email section), and this change log
- **Provider Details**: Resend (3000 emails/month, domain verification required for production) + Brevo (9000 emails/month, optional verification)
- **Files**: `src/lib/email/brevo-client.ts` (new), `src/lib/email/email-client.ts` (new), `src/lib/email/send-contact-email.ts`, `src/lib/email/index.ts`, `src/lib/env.ts`, `.env.local`, `.env.production`, `doc/coding-doc/coding-archite.md`, `doc/coding-doc/coding-rules.md`

## 2025-11-29 (v4.0)
- **Email System**: Moved sender addresses to env vars (`EMAIL_FROM_INTERNAL`, `EMAIL_FROM_USER`); use `@resend.dev` for dev, `@isbim.com.hk` for production
- **Documentation**: Added file descriptions to all coding docs; created `coding-backup-plan.md` for service alternatives (Resend → Brevo migration guide)
- **Files**: `.env.local`, `.env.production`, `src/lib/env.ts`, `src/lib/email/send-contact-email.ts`, `doc/coding-doc/*`

## 2025-11-26 (v3.7)
- Added reusable typewriter suite in `src/components/animations/typewriter.tsx` (barrel-exported): `TypewriterText` (character-level), `TypewriterWidth` (width-based with cursor + ScrollTrigger), `TypewriterLines` (multi-line sequencing).
- Replaced about-us title animation with `TypewriterWidth` while preserving 1.5s/40-step blue cursor + ScrollTrigger timing; simplified `Section` to drop duplicate typewriter logic while keeping existing reveal animations.

## 2025-11-26 (v3.6)
- Services & Products page rebuilt with dark cyberpunk theme (noise + grid + emerald glow), shimmer hero, GPU spotlight cards, Bento grid, expandable service details, and final CTA; new component suite (`background-layers`, `hero-section`, `services-grid`, `service-card`, `spotlight-card`, `corner-brackets`, `cta-section`) plus `servicesData` (5 entries). Build succeeded (5.92 kB page, 141 kB first load JS).

## 2025-11-26 (v3.5)
- Added optional video CDN override via `NEXT_PUBLIC_VIDEO_CDN_URL`; centralized video URLs through `media-config` (`getVideoUrl`/`JARVIS_VIDEOS`) for hero + platform media; docs refreshed (coding.md, coding-archite.md, coding-rules.md).

## 2025-11-26 (v3.4)
- Added hreflang/canonical helper (`generateHreflangAlternates`) and tightened robots.txt for Studio/API/_next/admin/json/revalidate plus CN search engines and AI bots.
- Introduced `JsonLd` helpers (Organization/Product/JobPosting/Breadcrumb) and render Organization schema in `app/layout.tsx`.
- Enabled on-demand ISR webhook (`/api/revalidate`) with `SANITY_WEBHOOK_SECRET`; expanded Sanity post/product schemas with SEO fields (metaTitle/metaDescription/openGraphImage/keywords) and required alt text (10-125 chars).
- Performance/UX: fixed Footer min-height to prevent CLS; marked LCP media `priority` (Topbar logo, CTA media, interactive carousel center/hero).

## 2025-11-26 (v3.3)
- Added tsconfig `baseUrl` for `@/*` aliases; clears module resolution warnings.
- Fixed Topbar logo sizing (width/height) to remove Next.js aspect ratio warning.

## 2025-11-26 (v3.2)
- Split routes into `(website)` vs `(studio)` groups; root layout now fonts/globals only; website layout owns providers + Topbar/Footer; Studio isolated to bare shell.
- Added MotionProvider (LazyMotion + `m`) and migrated Framer usages to `m`; keep `AnimatePresence` imports only.
- Footer newsletter form lazy-loaded; shared fonts moved to `src/app/fonts.ts`; home `revalidate` set to literal `3600`.
- Docs updated: coding-archite.md, coding-rules.md.
