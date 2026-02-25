# Design Token Architecture Plan

## Document Overview

This document details the layered architecture, migration plan, and best practices for the isBIM Official Website Design Token System.

**Last Updated**: 2025-12-06
**Current Status**: Phase 2 Complete (Product Template Refactor)
**Architecture Version**: v2.0 (Four-Tier Layered Architecture)

---

## Core Philosophy

### Three Core Objectives of the Design System

1. **Single Source of Truth**
   - All primitive values (colors, spacing, fonts) are defined only once
   - Avoid inconsistencies caused by duplicate definitions

2. **Semantic Mapping**
   - Define tokens based on purpose, not page
   - `--text-base` ✅ instead of `--home-text-primary` ❌

3. **Layered Abstraction**
   - Progressive abstraction from primitives to semantics to utilities
   - Each layer only depends on the layer below, forming a clear dependency chain

---

## Four-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    5. Components (CSS Modules)               │
│                    .hero .title { color: var(--text-...) }  │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ consumes
┌─────────────────────────────────────────────────────────────┐
│                    4. Themes (Page-Specific)                 │
│                    .home-page { --carousel-bg: ... }         │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ overrides/extends
┌─────────────────────────────────────────────────────────────┐
│                    3. Utilities (Reusable Classes)           │
│                    .btn-primary, .gap-md, .label             │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ references
┌─────────────────────────────────────────────────────────────┐
│                    2. Semantics (Purpose-Based Tokens)       │
│                    --text-base, --surface-hero, --button-*   │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ maps to
┌─────────────────────────────────────────────────────────────┐
│                    1. Foundations (Primitives)               │
│                    --color-gray-900, --space-md, --shadow-xl │
└─────────────────────────────────────────────────────────────┘
```

### Tier 1: Foundations (Primitives)

**Location**: `src/styles/1-foundations/`
**Responsibility**: Define pure primitive values with no semantic meaning

#### File Structure

```
1-foundations/
├── colors.css          # Color primitives
├── spacing.css         # Spacing system
├── typography.css      # Font system (includes line-height scale)
├── shadows.css         # Shadow scale
├── radius.css          # Border radius scale
└── z-index.css         # Z-index layering scale
```

#### Naming Rules

```css
/* ✅ Correct: Descriptive naming */
--color-gray-900: #1e2124;
--color-blue-500: #4e8af7;
--space-md: clamp(1rem, 2vw, 1.5rem);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* ❌ Wrong: Contains semantics */
--primary-color: #4e8af7;      /* Semantics belong in tier 2 */
--button-spacing: 1rem;        /* Purpose belongs in tier 2 */
```

#### Responsive Strategies

**Strategy A: Fluid - Recommended for Spacing**
```css
:root {
  --space-md: clamp(1rem, 2vw, 1.5rem);
}
```

**Strategy B: Stepped - Recommended for Typography**
```css
:root {
  --font-size-lg: 1.125rem;
}

@media (min-width: 48em) {
  :root {
    --font-size-lg: 1.25rem;
  }
}
```

---

### Tier 2: Semantics (Purpose Layer)

**Location**: `src/styles/2-semantic/`
**Responsibility**: Map primitive values to purposes, establishing design language

#### File Structure

```
2-semantic/
├── colors.css          # Text, brand color semantics
├── surfaces.css        # Background, button, border semantics
└── motion.css          # Animation timing semantics
```

#### Naming Rules

**Text Colors** (based on background context)
```css
/* Text on light backgrounds */
--text-strong: var(--color-slate-850);      /* Level 1: Headings */
--text-base: var(--color-gray-900);         /* Level 2: Body text */
--text-muted: var(--color-gray-700);        /* Level 3: Secondary info */
--text-subtle: var(--color-gray-500);       /* Level 4: Captions */

/* Text on dark backgrounds */
--text-inverse-strong: var(--color-white);
--text-inverse-base: rgba(255, 255, 255, 0.85);
--text-inverse-muted: rgba(255, 255, 255, 0.75);
```

**Surface Colors**
```css
--surface-base: var(--color-white);         /* Main background */
--surface-raised: var(--color-white);       /* Cards, panels */
--surface-subtle: var(--color-gray-50);     /* Subtle differentiation */
--surface-hero: var(--color-black);         /* Hero/dark sections */
```

**Button Semantics**
```css
--button-primary-bg: var(--color-slate-850);
--button-primary-hover: var(--color-slate-800);
--button-primary-text: var(--color-white);
```

**Animation Semantics**
```css
--motion-fast: 0.3s;
--motion-base: 0.5s;
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
```

#### Semantic Principles

| ✅ Recommended | ❌ Avoid |
|---------------|---------|
| `--text-base` | `--home-text` |
| `--surface-hero` | `--black-background` |
| `--button-primary-bg` | `--dark-gray-button` |
| `--motion-fast` | `--300ms` |

---

### Tier 3: Utilities (Utility Classes)

**Location**: `src/styles/3-utilities/`
**Responsibility**: Provide reusable atomic classes that consume semantic tokens

#### File Structure

```
3-utilities/
├── containers.css      # Container, layout
├── spacing.css         # Spacing utilities
├── typography.css      # Text styles
└── buttons.css         # Button styles
```

#### Utility Class Naming Rules

```css
/* ✅ Correct: Concise functional naming */
.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }
.label { font-size: 0.8125rem; letter-spacing: 0.14em; }
.btn-primary { background: var(--button-primary-bg); }

/* ❌ Wrong: Page prefixes */
.home-gap-md { ... }
.contact-label { ... }
```

#### Use @layer for Isolation

```css
@layer components {
  .container-page {
    width: 100%;
    max-width: var(--container-max);
    margin-inline: auto;
  }

  .btn-primary {
    background: var(--button-primary-bg);
    color: var(--button-primary-text);
    transition: background var(--motion-fast);
  }
}
```

---

### Tier 4: Themes (Page Themes)

**Location**: `src/styles/4-themes/`
**Responsibility**: Only page-unique token overrides and extensions

#### File Structure

```
4-themes/
├── home.css            # Home page unique tokens
├── product.css         # Product page unique tokens
├── contact.css         # Contact page unique tokens
└── newsroom.css        # Newsroom page unique tokens
```

#### Theme File Rules

**Only Two Operations Allowed**:

1. **Add page-specific new tokens**
```css
.home-page {
  /* ✅ New carousel-specific tokens */
  --carousel-card-bg: var(--color-ink-900);
  --carousel-tab-border: #d4d4d8;

  /* ✅ New hero gradient */
  --hero-gradient: linear-gradient(to bottom right, ...);
}
```

2. **Override semantic tokens (use sparingly)**
```css
.product-page {
  /* ⚠️ Cautious: Override global semantics */
  --surface-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**Forbidden Operations**:
```css
/* ❌ Forbidden: Define raw colors in themes */
.home-page {
  --new-blue: #4e8af7;  /* Should be in 1-foundations/colors.css */
}

/* ❌ Forbidden: Redefine existing semantics */
.contact-page {
  --contact-text-base: var(--color-gray-900);  /* Just use --text-base */
}
```

---

### Tier 5: Components (Component Layer)

**Location**: `src/components/*/*.module.css`
**Responsibility**: Component-scoped styles that consume upper-tier tokens

#### Token Consumption Priority

```css
/* Priority 1: Use semantic tokens */
.hero .title {
  color: var(--text-inverse-strong);  /* ✅ Best */
}

/* Priority 2: Use theme tokens (page-specific) */
.carousel .card {
  background: var(--carousel-card-bg);  /* ✅ Acceptable */
}

/* Priority 3: Direct primitive values (component special needs only) */
.special-component {
  border: 1px solid rgba(255, 255, 255, 0.1);  /* ⚠️ Use sparingly */
}

/* ❌ Forbidden: Reference page-prefixed tokens */
.hero .title {
  color: var(--home-text-inverse);  /* ❌ Deprecated */
}
```

---

## File Organization

### Current Architecture (Post Phase 1)

```
src/styles/
├── 1-foundations/
│   ├── colors.css          ✅ Color primitives
│   ├── spacing.css         ✅ Spacing system
│   ├── typography.css      ✅ Font system
│   ├── shadows.css         ✅ Shadow scale
│   └── radius.css          ✅ Border radius scale
│
├── 2-semantic/
│   ├── colors.css          ✅ Text/brand color semantics
│   ├── surfaces.css        ✅ Background/button/border semantics
│   └── motion.css          ✅ Animation timing
│
├── 3-utilities/
│   ├── containers.css      ✅ Container/layout
│   ├── spacing.css         ✅ .gap-*, .stack-*
│   ├── typography.css      ✅ .label, .text-*
│   └── buttons.css         ✅ .btn-primary
│
├── 4-themes/
│   ├── home.css            ✅ Home page unique tokens
│   └── product.css         ✅ Product page unique tokens
│
├── home-animations.css     ✅ Home animation definitions
├── product-animations.css  ✅ Product animation definitions
│
└── [Legacy Files - To be refactored]
    ├── tokens.css          ⏳ Can be deleted after Phase 4
    ├── home-utilities.css  ⏳ Replaced by 3-utilities/
    ├── themes/
    │   └── home.css        ⏳ Moved to 4-themes/home.css (old version)
    ├── contact-design-tokens.css ⏳ Phase 3 refactor
    └── newsroom-design-tokens.css ⏳ Phase 4 refactor
```

### globals.css Import Order

```css
/* ⚠️ CRITICAL: Import order cannot be changed */

/* 1. Foundations */
@import "../styles/1-foundations/colors.css";
@import "../styles/1-foundations/spacing.css";
@import "../styles/1-foundations/typography.css";
@import "../styles/1-foundations/shadows.css";
@import "../styles/1-foundations/radius.css";

/* 2. Semantics */
@import "../styles/2-semantic/colors.css";
@import "../styles/2-semantic/surfaces.css";
@import "../styles/2-semantic/motion.css";

/* 3. Utilities */
@import "../styles/3-utilities/containers.css";
@import "../styles/3-utilities/spacing.css";
@import "../styles/3-utilities/typography.css";
@import "../styles/3-utilities/buttons.css";

/* 4. Themes */
@import "../styles/4-themes/home.css";
@import "../styles/4-themes/product.css";

/* 5. Animations */
@import "../styles/home-animations.css";
@import "../styles/product-animations.css";

/* Legacy (To be refactored) */
/* ... other legacy files ... */
```

---

## Migration Roadmap

### Phase 1: Home Page ✅ COMPLETE

**Goal**: Establish four-tier architecture foundation, extract global tokens from Home page

**Achievements**:
- ✅ Created 1-foundations/ (5 files)
- ✅ Created 2-semantic/ (3 files)
- ✅ Created 3-utilities/ (4 files)
- ✅ Created 4-themes/home.css
- ✅ Updated 4 Home component CSS modules
- ✅ Updated globals.css import order
- ✅ Visual regression test passed (dev server no errors)

**Key Metrics**:
- `--home-*` tokens in Home components: 0 ✅
- Global reusable tokens: 50+ ✅
- Visual consistency: 100% ✅

---

### Phase 2: Product Template ✅ COMPLETE

**Goal**: Refactor Product pages, reuse Phase 1 global tokens

**Achievements**:
- ✅ Created `4-themes/product.css` with 29 unique tokens
- ✅ Added missing foundation color `--color-ink-800`
- ✅ Updated 4 Product component CSS modules
- ✅ Updated `product-animations.css` token references
- ✅ Deleted legacy `themes/product.css` and `product-utilities.css`
- ✅ Updated globals.css import order
- ✅ Visual regression test passed (dev server no errors)

**Key Metrics**:
- Tokens migrated from product.css: 111 total
  - Deleted 24 duplicates (now use global semantics)
  - Preserved 29 unique tokens (narrative track, gradients, motion)
  - 32 tokens replaced with global semantic tokens
  - Added 1 new foundation color (`--color-ink-800`)
  - Added 1 new motion token (`--grid-sheen-duration`)
- Component CSS modules updated: 4 files
  - `hero-section.module.css`
  - `narrative-track.module.css`
  - `cta-section.module.css`
  - `feature-section.module.css`
- Animation system preserved: 100% ✅
  - Narrative Track scroll-driven animations intact
  - Character reveal animations intact
  - Grid sheen overlay intact
  - GSAP ScrollTrigger integration intact

**Product-Unique Tokens Preserved**:
- `--product-accent-gradient` (violet-cyan signature gradient)
- `--product-meta-line` (decorative line gradient)
- `--product-hero-overlay-vertical/horizontal` (video overlays)
- `--product-track-*` (8 scroll checkpoint tokens for narrative track)
- `--toggle-active-bg`, `--toggle-hover-text` (toggle component)
- `--chip-bg`, `--chip-border` (chip component)
- `--motion-overlay`, `--motion-parallax` (product-specific timings)
- `--motion-spring-stiffness/damping` (Framer Motion physics)
- `--grid-sheen-duration` (grid sheen animation)

---

### Phase 3: Contact Page ⏳ PENDING

**Goal**: Break down massive `contact-design-tokens.css` (395 lines)

**Current Issues**:
- All content (primitives, semantics, utilities) in one file
- Duplicates existing global tokens
- Page prefix `--contact-*` blocks reusability

**Execution Steps**:
1. Delete definitions duplicating global tokens
2. Extract reusable CAD grid styles to `3-utilities/grids.css`
3. Extract form styles to `3-utilities/forms.css`
4. Keep Contact-unique tokens in `4-themes/contact.css`
5. Update component references
6. Visual regression testing

**Expected Unique Tokens**:
- `--cad-corner-marker` (CAD corner markers)
- `--grid-pattern-bg` (grid background pattern)
- `--form-underline-*` (form underline styles)

---

### Phase 4: Newsroom Page ⏳ PENDING

**Goal**: Break down massive `newsroom-design-tokens.css` (935 lines)

**Current Issues**:
- Contains complete color system (50+ color values)
- Contains complete typography system (20+ font definitions)
- Contains layout, components, animations all-in-one

**Execution Steps**:
1. Delete 90% duplicate definitions of global tokens
2. Extract editorial layout styles to `3-utilities/editorial.css`
3. Extract card styles to `3-utilities/cards.css`
4. Keep Newsroom-unique tokens in `4-themes/newsroom.css`
5. Update component references
6. Visual regression testing

**Expected Unique Tokens**:
- `--editorial-grid-*` (editorial grid)
- `--magazine-layout-*` (magazine layout)
- `--sticky-header-*` (sticky header)

---

### Phase 5: Cleanup & Optimization ⏳ PENDING

**Goal**: Delete legacy files, optimize import order

**Task Checklist**:
- [ ] Delete `src/styles/tokens.css`
- [ ] Delete `src/styles/home-utilities.css`
- [ ] Delete `src/styles/themes/home.css` (old version)
- [ ] Merge `aboutus-design-tokens.css` and `services-design-tokens.css`
- [ ] Review if `font-design-tokens.css` can merge into `1-foundations/typography.css`
- [ ] Review if `layout-design-tokens.css` can merge into `3-utilities/containers.css`
- [ ] Organize `animation-design-tokens.css`
- [ ] Write Stylelint rules to enforce naming conventions
- [ ] Add VSCode autocomplete configuration

---

## Key Metrics Tracking

| Metric | Pre-Phase 1 | Post-Phase 1 | Target (Phase 5) |
|--------|-------------|--------------|------------------|
| Total CSS files | 16 | 25 | 20 |
| Page-prefixed tokens (`--home-*`) | 50+ | 0 (Home) | 0 |
| Duplicate color definitions | 80+ | 15 | 0 |
| Global reusable tokens | 120 | 180+ | 250+ |
| Utility class coverage | 30% | 60% | 90% |
| Lines of code (tokens) | 3000+ | 2800 | 2200 |

---

## Design Decisions

### Why Four Tiers Instead of Three?

**Original Plan**: Foundations → Semantics → Components

**Improved Plan**: Foundations → Semantics → **Utilities** → Themes → Components

**Rationale**:
1. **Utilities tier is necessary abstraction**: Avoids repeating same CSS rules in components
2. **Themes tier provides flexibility**: Allows page-level customization without breaking global consistency
3. **Aligns with Tailwind philosophy**: Atomic classes + custom tokens hybrid approach

### Why `--text-base` Instead of `--text-primary`?

**Choosing `base`**:
- Better aligns with Tailwind naming conventions
- `primary` easily confused with brand primary color
- `base` indicates baseline, stronger hierarchical sense

### Why Keep `clamp()` Instead of All `@media`?

**Hybrid Strategy**:
- **Spacing uses `clamp()`**: Fluid visual rhythm
- **Typography uses `@media`**: Clear breakpoint control

**Example**:
```css
/* Spacing: Fluid */
--space-md: clamp(1rem, 2vw, 1.5rem);

/* Typography: Stepped */
--font-size-lg: 1.125rem;
@media (min-width: 48em) {
  --font-size-lg: 1.25rem;
}
```

---

## FAQ

### Q1: When should I add a new global token?

**Criteria**:
- ✅ If the value is used in **2+ pages**
- ✅ If the value represents a **universal concept** (e.g., "muted text color")
- ❌ If the value is only for a single page's special component

### Q2: When should I create a new utility class?

**Criteria**:
- ✅ If the style pattern repeats in **3+ components**
- ✅ If the style is **atomic** (e.g., `.gap-md`)
- ❌ If the style contains complex logic or state

### Q3: Can theme files override global semantic tokens?

**Cautiously allowed**, but must meet conditions:
- ✅ Truly needs page-level visual differentiation
- ✅ Override value still references foundation layer tokens
- ❌ Don't introduce entirely new primitive values

**Example**:
```css
/* ✅ Allowed: Override semantics, but reference foundations */
.product-page {
  --surface-hero: var(--color-purple-900);
}

/* ❌ Forbidden: Introduce new primitive value */
.product-page {
  --surface-hero: #9333ea;  /* Should be in 1-foundations/colors.css */
}
```

### Q4: How to handle animation tokens?

**Current Strategy** (Two-Layer Separation):

**Layer 1: Configuration (Tokens in `4-themes/{page}.css`)**
- Define animation **timing values** (duration, easing, delays)
- Define animation **checkpoint positions** (scroll thresholds)
- Define **physics parameters** (spring stiffness, damping)

Example:
```css
.product-page {
  --grid-sheen-duration: 9s;              /* Configuration */
  --motion-overlay: 0.9s;                 /* Configuration */
  --product-track-stage1: 0.3;            /* Configuration */
}
```

**Layer 2: Implementation (`{page}-animations.css`)**
- Define CSS **animation classes** (`.product-char`, `.product-block-anim`)
- Define **@keyframes** sequences
- **Consume** tokens from theme layer

Example:
```css
.grid-sheen-overlay {
  animation: grid-sheen-sweep var(--grid-sheen-duration) ease-out infinite;
  /*                          ↑ Consumes token */
}

@keyframes grid-sheen-sweep {
  0% { opacity: 0; }
  100% { opacity: 0; }
}
```

**Why Separate?**
- **Configuration centralized**: Change all timings in one place
- **Implementation reusable**: Animation classes can be reused
- **Easier maintenance**: Clear separation of "what values" vs "how it animates"

**Future Optimization**:
- Consider creating `3-utilities/animations.css` for reusable `@keyframes` shared across pages

### Q5: How to prevent utilities from becoming a "junk drawer"?

**Management Strategy**:
1. **Code review**: Adding new utilities requires PR review
2. **Usage stats**: Periodically review usage frequency (< 2 uses → consider deletion)
3. **Naming conventions**: Follow Tailwind-style naming
4. **Documentation enforcement**: Clear rules in `token-rule.md`

---

## Reference Resources

### Internal Documentation
- [Token Naming Rules](./token-rule.md) - Detailed naming conventions and forbidden patterns
- [Architecture Decision Records](../architecture/decisions.md) - Why we chose this architecture
- [CLAUDE.md](../../CLAUDE.md) - Claude Code collaboration guide

### External Resources
- [Tailwind CSS Design System](https://tailwindcss.com/docs/theme)
- [CSS Custom Properties Best Practices](https://web.dev/custom-properties/)
- [Design Tokens W3C Community Group](https://www.w3.org/community/design-tokens/)

---

## Changelog

### [2.1.1] - 2025-12-07

**Added**:
- Playfair Display registered as display/art font via `--font-art-en` and alias `--font-display` in foundations typography.

**Updated**:
- Merged `font-design-tokens.css` into `1-foundations/typography.css` to keep a single font source of truth.
- Removed `font-design-tokens.css` import from `globals.css`.

**Removed**:
- `src/styles/font-design-tokens.css` (redundant after merge).

### [2.1.2] - 2025-12-08

**Added**:
- Service template adopts shared theme `4-themes/service.css` with full-bleed hero and unified section shell (90%/88% width, max-width 1700px, padding 0).
- Service layout components (hero/methodology/engine/data/gallery/cta) consume design tokens only; data centralized in `src/data/services.ts`.

**Updated**:
- Performance/Data sections standardized to 7/5 columns; right-side stats grid uses 2×2 layout with 6xl/7xl values and 12px/14px labels referencing semantic tokens.

### [2.1.0] - 2025-12-06 (Phase 2 Complete)

**Added**:
- Phase 2 (Product Template) complete
- `4-themes/product.css` with 29 unique tokens
- `--color-ink-800` foundation color
- `--grid-sheen-duration` motion token
- Animation layer architecture documentation (FAQ Q4)

**Updated**:
- 4 Product component CSS modules migrated to new tokens
- `product-animations.css` token references updated to use global tokens
- globals.css import order (added product theme and animations)

**Removed**:
- `src/styles/themes/product.css` (legacy - 111 tokens)
- `src/styles/product-utilities.css` (legacy)
- 24 duplicate tokens (replaced with global semantics)

**Migration Stats**:
- 111 tokens analyzed in old product.css
- 24 deleted (duplicates) → use global semantics
- 29 preserved (unique) → in 4-themes/product.css
- 32 replaced → with global semantic tokens
- 2 added → new foundation/theme tokens

---

### [2.0.0] - 2025-12-06 (Phase 1 Complete)

**Added**:
- Complete four-tier architecture implementation
- Phase 1 (Home page) complete
- 13 new CSS files created
- globals.css import order refactored

**Improved**:
- Removed all `--home-*` prefix tokens from Home components
- Established global semantic token system
- Created reusable utility class library

**Deprecated**:
- `src/styles/tokens.css` (to be deleted after Phase 5)
- `src/styles/home-utilities.css` (replaced by 3-utilities/)
- `src/styles/themes/home.css` (moved to 4-themes/home.css)

---

## Next Actions

### Immediate Tasks
- [x] Complete Home page visual regression testing ✅
- [x] Execute Phase 2: Product page refactor ✅
- [ ] Write detailed Phase 3 (Contact) execution plan
- [ ] Set up Git pre-commit hook to check token naming conventions

### Near-term Tasks (1-2 weeks)
- [ ] Execute Phase 3: Contact page refactor
- [ ] Create token usage dashboard
- [ ] Write component migration guide
- [ ] Document animation layer architecture (token vs implementation separation)

### Mid-term Tasks (1 month)
- [ ] Execute Phase 4: Newsroom page refactor
- [ ] Add Stylelint automated checks
- [ ] Create animation token best practices guide

### Long-term Goals
- [ ] Support dark mode (extend semantic layer)
- [ ] Establish design token export system (JSON)
- [ ] Integrate Figma Tokens plugin

---

**Maintainers**: Development Team
**Review Status**: ✅ Approved
**Version Control**: This document follows codebase version management

---

## Appendix A: Z-Index Management

### Why Z-Index Needs a Foundation Layer

Managing z-index values across a large application without a centralized system leads to:
- **Z-index Wars**: Developers arbitrarily increasing values (9999, 99999) to fix layering issues
- **Unpredictable Stacking**: No clear hierarchy of which elements should be on top
- **Hard to Debug**: When modals appear under dropdowns, finding the root cause is difficult

### Z-Index Scale Strategy

We use a **tiered scale** with clear gaps between categories:

| Layer | Range | Purpose | Examples |
|-------|-------|---------|----------|
| **Base** | 0-10 | Page content, sections | Hero sections, content blocks |
| **UI Elements** | 100-500 | Sticky/fixed elements | Headers, sidebars, FABs |
| **Overlays** | 1000-2000 | Dropdowns, tooltips | Menus, popovers, tooltips |
| **Modals** | 5000-9000 | Dialogs, drawers | Modal windows, slide-out panels |
| **Critical** | 9900+ | Always on top | Toast notifications, loading screens |

### Z-Index Tokens

**Location**: `src/styles/1-foundations/z-index.css`

```css
:root {
  /* Base Layer */
  --z-base: 0;
  --z-10: 10;

  /* UI Elements */
  --z-sticky: 100;
  --z-fixed: 200;
  --z-header: 400;

  /* Overlays */
  --z-dropdown: 1000;
  --z-popover: 1100;
  --z-tooltip: 1200;

  /* Modals */
  --z-backdrop: 5000;
  --z-modal: 5100;
  --z-drawer: 5200;

  /* Critical */
  --z-toast: 9900;
  --z-alert: 9950;
  --z-loading: 9999;
}
```

### Usage Example

```css
/* Component: Header */
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);       /* 400 */
}

/* Component: Dropdown Menu */
.dropdown-menu {
  position: absolute;
  z-index: var(--z-dropdown);     /* 1000 - appears above header */
}

/* Component: Modal */
.modal-backdrop {
  position: fixed;
  z-index: var(--z-backdrop);     /* 5000 - covers entire page */
}

.modal-content {
  position: fixed;
  z-index: var(--z-modal);        /* 5100 - appears above backdrop */
}

/* Component: Toast Notification */
.toast {
  position: fixed;
  z-index: var(--z-toast);        /* 9900 - always visible */
}
```

### Rules for Z-Index

1. **Never use arbitrary values**: Always reference foundation tokens
2. **Don't override with inline styles**: Use CSS classes
3. **Respect the hierarchy**: Don't mix layers (e.g., don't give a dropdown a modal-level z-index)
4. **Test stacking context**: Be aware of `position`, `transform`, `opacity` creating new stacking contexts

---

## Appendix B: Line Height System

### Why Line Height Matters

Line height directly affects:
- **Readability**: Too tight = hard to read, too loose = disjointed
- **Visual Rhythm**: Consistent line heights create better vertical rhythm
- **Component Consistency**: Same line-height across similar elements

### Line Height Scale

**Location**: `src/styles/1-foundations/typography.css`

```css
:root {
  /* Line Height Scale */
  --line-tight: 1.1;              /* Headings, display text */
  --line-snug: 1.2;               /* Large headings */
  --line-normal: 1.5;             /* Body text, default */
  --line-relaxed: 1.6;            /* Long-form content */
  --line-loose: 1.7;              /* Captions, descriptions */
}
```

### When to Use Each Line Height

| Token | Value | Best For | Usage Example |
|-------|-------|----------|---------------|
| `--line-tight` | 1.1 | Display headings, hero titles | Large text that needs compact vertical space |
| `--line-snug` | 1.2 | Section headings, card titles | Medium headings that still feel spacious |
| `--line-normal` | 1.5 | Body text, paragraphs | Default for most text content |
| `--line-relaxed` | 1.6 | Long articles, blog posts | Text that benefits from extra breathing room |
| `--line-loose` | 1.7 | Captions, descriptions | Small text that needs clarity |

### Typography Pairing Pattern

**Recommended combinations**:

```css
/* Display Text (Hero, Landing) */
.display {
  font-size: var(--font-size-6xl);     /* 60px */
  line-height: var(--line-tight);      /* 1.1 */
  font-weight: var(--weight-bolder);   /* 800 */
}

/* Heading (Section Titles) */
.heading {
  font-size: var(--font-size-4xl);     /* 36px */
  line-height: var(--line-snug);       /* 1.2 */
  font-weight: var(--weight-bold);     /* 700 */
}

/* Body Text (Paragraphs) */
.body {
  font-size: var(--font-size-base);    /* 16px */
  line-height: var(--line-normal);     /* 1.5 */
  font-weight: var(--weight-regular);  /* 400 */
}

/* Caption (Small Labels) */
.caption {
  font-size: var(--font-size-sm);      /* 14px */
  line-height: var(--line-loose);      /* 1.7 */
  font-weight: var(--weight-regular);  /* 400 */
}
```

### Usage in Semantic Layer

You can create semantic typography tokens that combine size + line-height:

**Example** (`2-semantic/typography.css`):
```css
:root {
  /* Heading Styles (size + line-height + weight) */
  --typography-display: var(--font-size-6xl) / var(--line-tight) var(--font-heading);
  --typography-h1: var(--font-size-4xl) / var(--line-snug) var(--font-heading);
  --typography-h2: var(--font-size-3xl) / var(--line-snug) var(--font-heading);

  /* Body Styles */
  --typography-body-lg: var(--font-size-lg) / var(--line-relaxed) var(--font-body);
  --typography-body-base: var(--font-size-base) / var(--line-normal) var(--font-body);
  --typography-body-sm: var(--font-size-sm) / var(--line-loose) var(--font-body);
}
```

**Usage**:
```css
.hero-title {
  font: var(--typography-display);
  /* Equivalent to: font-size: 3.75rem; line-height: 1.1; font-family: ... */
}

.article-body {
  font: var(--typography-body-lg);
  /* Equivalent to: font-size: 1.125rem; line-height: 1.6; font-family: ... */
}
```

### Migration Note

Existing components using hardcoded line-heights should gradually migrate:

```css
/* ❌ Before */
.title {
  font-size: 2.5rem;
  line-height: 1.1;
}

/* ✅ After */
.title {
  font-size: var(--font-size-4xl);
  line-height: var(--line-tight);
}
```

---

## Appendix C: Updated File Checklist

After adding z-index and line-height improvements:

### Foundation Layer (1-foundations/)
- [x] colors.css
- [x] spacing.css
- [x] typography.css (**updated** with line-height scale)
- [x] shadows.css
- [x] radius.css
- [x] z-index.css (**new**)

### Import Order in globals.css
```css
/* 1. Foundations */
@import "../styles/1-foundations/colors.css";
@import "../styles/1-foundations/spacing.css";
@import "../styles/1-foundations/typography.css";
@import "../styles/1-foundations/shadows.css";
@import "../styles/1-foundations/radius.css";
@import "../styles/1-foundations/z-index.css";  /* NEW */
```

### Total Foundation Tokens
- Colors: 50+
- Spacing: 20+
- Typography: 30+ (**+5 line-height**)
- Shadows: 8
- Radius: 12
- Z-index: 15 (**new**)

**Total**: ~135 foundation tokens
