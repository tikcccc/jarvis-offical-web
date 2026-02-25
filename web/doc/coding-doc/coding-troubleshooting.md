# Troubleshooting & Bug Fixes (Updated 2025-11-29)

**Purpose:** Record bugs encountered and their solutions. Keep entries concise (< 5 lines per fix).

**When to add:**
- Fixed a non-trivial bug (especially recurring patterns)
- Discovered library limitations or integration gotchas
- Found workarounds for build/deployment errors

**Format:** Problem → Root Cause → Solution  
**Cleanup:** Delete outdated issues when dependencies are upgraded or refactored

---

- Problem: Product Template 页面（Jarvis Pay 等）切换语言后文案错位（URL 与文案语言不一致）
  Root Cause: Server Component 中大量 m.*() 翻译调用 + 静态缓存导致 locale 切换后未重新渲染
  Solution: ✅ 已解决；将 `ProductPageLayout` 标记为 `"use client"`，所有翻译在客户端执行，自动响应 locale 变化。优势：(1) 只刷新一次（PageTransition 动画），(2) 无需 `dynamic = "force-dynamic"`，(3) 与 About-us/Home 模式一致
  Note: Newsroom/Careers 等动态资源页面（依赖 Sanity）应保持 Server Component + ISR 模式，不适用此方案

- Problem: 使用 `next export`（或全量静态化）时 /contact 预渲染失败  
  Root Cause: 页面依赖 Server Action（submitContactForm）和 headers()，不支持纯静态导出  
  Solution: 未解决；使用常规 `next build`（动态渲染）。若必须静态导出，需改为 API 路由/外部服务以移除 Server Action 依赖

- Problem: Feature title stays single-line after typewriter animation and overlaps the description column on wide headlines.
  Root Cause: TypewriterLines/TypewriterLinesReverse only marked completion on one line, so allLinesComplete never flipped for multi-line titles and whitespace-nowrap remained.
  Solution: Fire the line-complete handler for every line so the completion flag turns on when the final line finishes, letting whitespace reset and the title wrap normally.

- Problem: Reverse typewriter flickers once before disappearing (TypewriterLinesReverse/TypewriterText).
  Root Cause: Not fully identified; width-freezing attempts reduce reflow but GSAP per-char reverse still shifts layout when opacity drops.
  Solution: Pending. Investigate keeping container layout stable (clone fixed-size container or fade wrapper instead of per-char) to remove the flicker.

- Problem: Contact page scroll jank on desktop/mobile.
  Root Cause: Heavy CSS costs (backdrop-filter blur on form panel, fixed background with many absolute children, continuous pulse/bounce animations, gradient grid repaint, transition-all everywhere); no mobile downgrades.
  Solution: Plan to add will-change/GPU hints, mobile blur downgrade or solid fallback, pause non-critical animations via IntersectionObserver, lighten/sparsify the grid (or swap to static asset), replace transition-all with specific properties, and trim decorative elements/icons on small screens.

- Problem: Jarvis Generate/Sense sections padding resolves to 0px so titles/product lists misalign.
  Root Cause: `--jarvis-container-padding` maps to `--product-container-padding`, but the product tokens live under `.product-page` scope so on Jarvis page the variable chain breaks when that scope/class is missing.
  Solution: Pending. Options: ensure Jarvis wrapper includes `.product-page` (or move needed vars to `:root`), or set explicit `--jarvis-container-padding` value in jarvis.css to decouple from product tokens. Debug outlines/logs re-enabled for verification.
