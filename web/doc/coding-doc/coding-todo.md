# isBIM Website TODO (Coding TODO)

**Purpose:** Tracks all outstanding engineering tasks for the isBIM website. Remove items when done to keep the list lean.  
**Rules:** Finish -> delete; Add new items by priority/category; Review weekly.  
**Usage:** Claim/finish -> delete checkbox; Remove a section if fully done; Add new tasks under the right category.  
**Last Updated:** 2026-01-13

## Table of Contents
- [High Priority](#high-priority)
  - [Huawei Cloud deployment (HK main + CN accelerated domain)](#huawei-cloud-deployment-hk-main--cn-accelerated-domain)
  - [Email system production rollout](#email-system-production-rollout)
- [Sanity dynamic content i18n alignment (News/Careers)](#sanity-dynamic-content-i18n-alignment-newscareers)
- [SEO Tasks](#seo-tasks)
- [UI/UX Improvements](#uiux-improvements)
- [Bug Fixes](#bug-fixes)
- [Other Tasks](#other-tasks)

---

## High Priority

### Huawei Cloud deployment (HK main + CN accelerated domain)
**Background:** Deploy Next.js app to Huawei Cloud Hong Kong; keep primary domain on HK/overseas CDN and provide an ICP-licensed CN domain with mainland nodes.
- [ ] Domain/DNS: secure primary + CN domains; provision SSL certs; pick canonical host (www vs apex) and enforce 301 at CDN/ELB.
- [ ] Docker/CI: Add multi-stage Dockerfile (Node 20, `next build`, copy `.next/standalone` + `.next/static` + `public`, entry `server.js`), push image to SWR; update CI pipeline to buildx and push.
- [ ] Runtime: Deploy to CCE (preferred) or ECS with ELB in HK; configure readiness/liveness probes; allow egress to `*.sanity.io`, Resend, Brevo; set `NEXT_CACHE_DIR` and mount SFS/EVS if running multiple replicas.
- [ ] CDN: Main domain on HK/overseas nodes; CN domain (ICP) on mainland+global nodes; CNAME to respective CDN; back-to-origin via ELB. Cache long: `/_next/static/*`, `/public/*`, media. No/short cache: `/api/*`, `/actions/*`, `/studio/*`, `/_next/image*`, ISR pages, `/api/revalidate`. Keep `Host`/XFF, enable gzip/Brotli, HTTP/2/3.
- [ ] Env/Secrets: Set `NODE_ENV=production`, `NEXT_PUBLIC_SITE_URL`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`, `RESEND_API_KEY`, `BREVO_API_KEY`, `EMAIL_PROVIDER`, `CONTACT_EMAIL_TO`, `EMAIL_FROM_*`, `NEXT_PUBLIC_MEDIA_URL`, `NEXT_PUBLIC_VIDEO_CDN_URL`, `RATE_LIMIT_REDIS_URL` (Redis), optional `NEXT_CACHE_DIR`. Store in CCE Secret/ConfigMap or ECS env.
- [ ] Rate limiting: Replace contact-form in-memory Map with Redis (Huawei DCS) using `RATE_LIMIT_REDIS_URL`; keep logic 3/IP/5min; add graceful fallback if Redis absent (single-replica only).
- [ ] Webhook/ISR: Configure Sanity webhook to `https://<primary-domain>/api/revalidate` with `SANITY_WEBHOOK_SECRET`; verify ISR/regeneration works via CDN (no cache on that path).
- [ ] Email deliverability: Verify Resend (primary) and Brevo (backup) for `isbim.com.hk`; set SPF/DKIM/DMARC; ensure egress allowed; confirm dual-provider switch via `EMAIL_PROVIDER`.
- [ ] Observability/security: Enable WAF/CC on both CDNs; ELB logs to LTS; container logs to AOM/LTS; health checks on `/` or `/robots.txt`; CDN and WAF exclude `/api/revalidate` from caching.
- [ ] Health probe: Add `/api/health` lightweight route checking Redis (and Sanity token reachability if cheap); set liveness/readiness to that path; use higher `initialDelaySeconds` to avoid startup kills.
- [ ] Next.js config: Ensure `output: "standalone"` and `images.remotePatterns`/`images.domains` cover Sanity CDN and media CDN domains.
- [ ] Trust proxy: Configure trust proxy (app/middleware) so `X-Forwarded-For` yields real client IP for Redis rate limiting behind CDN/ELB.
- [ ] WAF/CDN rules: Allow Sanity webhook IPs; ensure `Set-Cookie` headers are not cached at CDN; keep `/api/revalidate` uncached.

### Email system production rollout

**Background:** Contact form email is complete in dev; Resend + Brevo dual providers (v4.1). Production needs custom-domain verification for deliverability.

#### Option A: Resend domain verification (recommended, default)
- [ ] Resend console: https://resend.com/domains
- [ ] Add domain `isbim.com.hk`; fetch DNS records.
- [ ] DNS: SPF `v=spf1 include:_spf.resend.com ~all`; DKIM `resend._domainkey`; DMARC optional `v=DMARC1; p=none; rua=mailto:dmarc@isbim.com.hk`.
- [ ] Wait for DNS propagation; confirm "Verified" in Resend.
- [ ] Vercel env: ensure `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_FROM_INTERNAL=isBIM Contact Form <noreply@isbim.com.hk>`, `EMAIL_FROM_USER=isBIM <noreply@isbim.com.hk>`, `CONTACT_EMAIL_TO=solution@isbim.com.hk`.
- [ ] Prod test: submit form; log shows resend; internal mail received; user confirmation received; not in spam; rate limit (3/IP/5min) works.

#### Option B: Brevo domain verification (optional fallback)
- [ ] Brevo console: https://app.brevo.com/senders/domain/list
- [ ] Add domain `isbim.com.hk`; fetch DNS records.
- [ ] DNS: SPF `v=spf1 include:spf.brevo.com ~all`; DKIM `mail._domainkey`; DMARC optional `v=DMARC1; p=none; rua=mailto:dmarc@isbim.com.hk`.
- [ ] Wait for DNS propagation; confirm "Authenticated".
- [ ] Note SPF merge if both providers: `v=spf1 include:_spf.resend.com include:spf.brevo.com ~all`.
- [ ] Vercel env when switching: set `EMAIL_PROVIDER=brevo`, ensure `BREVO_API_KEY`, redeploy.
- [ ] Brevo test: submit form; log shows brevo; mail delivered; deliverability acceptable.

**Related files:** `.env.local`, `.env.production`, `src/lib/email/email-client.ts`, `src/lib/email/brevo-client.ts`, `src/lib/email/resend-client.ts`, `src/lib/email/send-contact-email.ts`, `src/lib/env.ts`, `src/schemas/contact-form.schema.ts`.

**Decision guidance:** Prefer Resend first; Brevo optional; merge SPF if dual.

---

### Sanity dynamic content i18n alignment (News/Careers)

**Goal:** Dynamic content follows i18n routes with bilingual data; avoid code-side translation mapping.

**Recommended approach:** Single dataset, two documents per item (`languageTag` en/zh + `translationKey`); localized slug/SEO per language.

**Tasks:**
- [ ] Schema: Add `languageTag` (en/zh) + `translationKey` to `news`/`career`; allow same group slugs per language; show language in preview.
- [ ] Studio: Enable `@sanity/document-internationalization` or custom "Duplicate to zh/en" action to auto-copy and set language/slug.
- [ ] GROQ: List/detail filtered by `languageTag`, fallback to en; cache tags `sanity:{type}:{translationKey}`; routes use language slug.
- [ ] Revalidate/SEO: Webhook revalidates by `translationKey` (news/career together); `hreflang`/sitemap use sibling documents in the same group.
- [ ] Configure Sanity webhook -> `/api/revalidate` to refresh newsroom/careers (tags: `sanity:news`, `sanity:newsCategory`, `sanity:career`) after publish.

---

## SEO Tasks

### Pre-launch SEO infra (pending domain/DNS)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to final domain; verify `metadataBase`, sitemap, robots, and canonical/hreflang output.
- [ ] Add Google Search Console verification (HTML file or `metadata.verification`) after domain is live.
- [ ] Submit `/sitemap.xml` to GSC post-launch; confirm robots access and successful crawl/render in production.

### Infrastructure checks
- [ ] Validate metadata and structured data in Google Search Console.

### JARVIS product pages (8)
- [ ] `/jarvis-agent` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-pay` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-air` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-eagle-eye` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-ssss` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-dwss` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-cdcp` - metadata + SoftwareApplication schema + breadcrumb
- [ ] `/jarvis-assets` - metadata + SoftwareApplication schema + breadcrumb

### Services pages (4)
- [ ] `/jarvis-jpm` - metadata + Service schema + breadcrumb
- [ ] `/bim-consultancy` - metadata + Service schema + breadcrumb
- [ ] `/project-finance` - metadata + Service schema + breadcrumb
- [ ] `/venture-investments` - metadata + Service schema + breadcrumb

### Support pages
- [ ] `/careers` - metadata
- [ ] `/privacy` - basic metadata
- [ ] `/terms` - basic metadata
- [ ] `/cookies` - basic metadata

### SEO enhancements
- [ ] OG image per product/service (1200x630) - design task
- [ ] Google Rich Results Test for all structured data
- [ ] News sitemap (optional)
- [ ] Image sitemap (optional)
- [ ] Full Google Search Console audit

**Keyword guardrails:** brand (isBIM/isBIM Limited); geo (Hong Kong/香港); dual identity (AI tech + Construction tech); industry (ConTech, construction AI, building technology, 智能建筑).

**Notes:** Static pages use `messages/en.json` and `messages/zh.json`; Newsroom and Careers use Sanity; target Google & Bing; exclude `/contact`, `/jarvis-ai-suite`.

---

## UI/UX Improvements

_(No open items)_

---

## Bug Fixes

### Brevo email sending 403 error
- [ ] Check Brevo API Key permissions (https://app.brevo.com/settings/keys/api).
- [ ] Verify `sendTransacEmail` parameters per Brevo SDK docs.
- [ ] Add detailed error logging with full Brevo response.
- [ ] Test Brevo API Playground with the key.
- [ ] Consider contacting Brevo support.

**Related files:** `src/lib/email/email-client.ts` (lines 96-112), `src/lib/email/brevo-client.ts`, `.env.local`.

**Workaround:** Use Resend as primary (`EMAIL_PROVIDER=resend`); keep Brevo as backup until fixed.

---

## Other Tasks

_(No open items)_
