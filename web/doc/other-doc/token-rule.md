# Design Token Naming Rules & Conventions

## Document Purpose

This document defines **strict naming rules** and **forbidden patterns** for the isBIM Design Token System. All developers must follow these rules when adding or modifying tokens.

**Last Updated**: 2025-12-06
**Enforcement**: Mandatory (will be enforced via Stylelint in Phase 5)
**Related**: [token-plan.md](./token-plan.md)

---

## Quick Reference

### Token Naming Patterns by Layer

| Layer | Prefix Pattern | Example |  Allowed | L Forbidden |
|-------|---------------|---------|-----------|-------------|
| **1. Foundations** | `--color-*`<br>`--space-*`<br>`--font-*`<br>`--shadow-*`<br>`--radius-*` | `--color-gray-900`<br>`--space-md`<br>`--font-size-lg`<br>`--shadow-xl`<br>`--radius-md` | Descriptive scale names | Semantic meanings |
| **2. Semantics** | `--text-*`<br>`--surface-*`<br>`--button-*`<br>`--border-*`<br>`--motion-*` | `--text-base`<br>`--surface-hero`<br>`--button-primary-bg`<br>`--border-subtle`<br>`--motion-fast` | Purpose-based | Page-specific |
| **3. Utilities** | `.{function}-{size}`<br>`.{element}` | `.gap-md`<br>`.btn-primary`<br>`.label` | Atomic, reusable | Page-prefixed |
| **4. Themes** | `--{component}-*` | `--carousel-card-bg`<br>`--hero-gradient` | Page-unique only | Duplicate global tokens |

---

## Rule 1: Foundation Layer Naming

### 1.1 Color Tokens

**Pattern**: `--color-{name}-{shade}`

```css
/*  CORRECT */
--color-white: #ffffff;
--color-black: #000000;
--color-gray-50: #f8fafc;
--color-gray-900: #1e2124;
--color-blue-500: #4e8af7;
--color-slate-850: #18181b;

/* L WRONG: Contains semantic meaning */
--color-primary: #4e8af7;        /* Use --brand-primary in semantic layer */
--color-text: #1e2124;           /* Use --text-base in semantic layer */
--color-background: #ffffff;     /* Use --surface-base in semantic layer */
--dark-gray: #1e2124;            /* Missing 'color' prefix */
```

**RGB Value Tokens** (for rgba usage):
```css
/*  CORRECT */
--color-white-rgb: 255, 255, 255;
--color-black-rgb: 0, 0, 0;

/* Usage */
background: rgba(var(--color-white-rgb), 0.8);
```

---

### 1.2 Spacing Tokens

**Pattern**: `--space-{size}` or legacy `--gutter`, `--h-spacing`, etc.

```css
/*  CORRECT */
--space-unit: 8px;
--space-xs: clamp(0.5rem, 1vw, 0.75rem);
--space-sm: clamp(1rem, 2vw, 1.5rem);
--space-md: clamp(1.5rem, 3vw, 2.5rem);
--space-lg: clamp(2rem, 4vw, 3rem);
--space-xl: clamp(2.25rem, 4vw, 3rem);

/* Legacy (backward compatibility) */
--gutter: 0.5555555556rem;
--v-gutter: 1.1111111111rem;
--h-spacing: 1.1111111111rem;

/* L WRONG */
--padding-md: 1rem;              /* Use --space-md */
--margin-large: 2rem;            /* Use --space-lg */
--section-gap: 3rem;             /* Use --space-xl */
```

**Container Tokens**:
```css
/*  CORRECT */
--container-max: 1920px;
--container-inline: clamp(1.5rem, 3vw, 2.5rem);

/* L WRONG */
--max-width: 1920px;             /* Missing 'container' context */
```

---

### 1.3 Typography Tokens

**Pattern**: `--font-{property}-{size/weight}`

```css
/*  CORRECT - Font families */
--font-heading: var(--font-heading-en);
--font-body: var(--font-body-en);
--font-display: var(--font-art-en);         /* Artistic/display font (Playfair) */
--font-cn: var(--font-alliance-zh);          /* Language-aware via :lang(zh*) */

/*  CORRECT - Font weights */
--weight-light: 300;
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
--weight-bolder: 800;

/*  CORRECT - Font sizes */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-6xl: 3.75rem;

/*  CORRECT - Responsive headline scale */
--heading-display: clamp(2.75rem, 7vw, 4.5rem);
--heading-hero: clamp(2rem, 6vw, 4.5rem);
--heading-section: clamp(1.75rem, 3vw, 2.75rem);

/* L WRONG */
--h1-size: 3rem;                 /* Use --heading-display */
--text-size-big: 2rem;           /* Use --font-size-2xl */
--bold-weight: 700;              /* Use --weight-bold */
```

---

### 1.4 Shadow Tokens

**Pattern**: `--shadow-{size}` + supporting tokens

```css
/*  CORRECT */
--shadow-tone: 0, 0, 0;
--inner-border: 0 0 0 1px rgba(var(--shadow-tone), 0.03);
--shadow-xs: var(--inner-border), 0 1px 2px rgba(var(--shadow-tone), 0.06);
--shadow-sm: var(--inner-border), 0 1px 3px rgba(var(--shadow-tone), 0.1);
--shadow-md: var(--inner-border), 0 2px 4px rgba(var(--shadow-tone), 0.1);
--shadow-lg: var(--inner-border), 0 4px 6px rgba(var(--shadow-tone), 0.1);
--shadow-xl: var(--inner-border), 0 10px 15px rgba(var(--shadow-tone), 0.15);
--shadow-2xl: var(--inner-border), 0 25px 50px -12px rgba(var(--shadow-tone), 0.25);

/* L WRONG */
--box-shadow-small: 0 1px 2px rgba(0,0,0,0.1);  /* Use --shadow-xs */
--card-shadow: 0 2px 4px rgba(0,0,0,0.1);       /* Use --shadow-md */
```

---

### 1.5 Border Radius Tokens

**Pattern**: `--radius-{size}` + semantic mappings

```css
/*  CORRECT - Primitives */
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;
--radius-circle: 50%;

/*  CORRECT - Semantic mappings (can be in this layer) */
--radius-btn: var(--radius-none);
--radius-btn-rounded: var(--radius-full);
--radius-media: var(--radius-lg);
--radius-media-rounded: var(--radius-xl);
--radius-chip: var(--radius-full);

/* L WRONG */
--border-radius-button: 9999px;  /* Use --radius-btn-rounded */
--rounded-corners: 0.5rem;       /* Use --radius-md */
```

---

### 1.6 Z-Index Tokens

**Pattern**: `--z-{layer}`

```css
/* ✅ CORRECT - Tiered scale with clear gaps */
/* Base Layer (0-10) */
--z-base: 0;
--z-1: 1;
--z-10: 10;

/* UI Elements (100-500) */
--z-sticky: 100;
--z-fixed: 200;
--z-floating: 300;
--z-header: 400;

/* Overlays (1000-2000) */
--z-dropdown: 1000;
--z-popover: 1100;
--z-tooltip: 1200;

/* Modals (5000-9000) */
--z-backdrop: 5000;
--z-modal: 5100;
--z-drawer: 5200;

/* Critical (9900+) */
--z-toast: 9900;
--z-loading: 9999;

/* ❌ WRONG */
--z-index-header: 100;               /* Use --z-header */
--header-z: 100;                     /* Wrong pattern */
--z-999: 999;                        /* Arbitrary value, use named layers */
```

**Usage**:
```css
/* ✅ CORRECT */
.header {
  position: sticky;
  z-index: var(--z-header);
}

.modal-backdrop {
  position: fixed;
  z-index: var(--z-backdrop);
}

/* ❌ WRONG */
.header {
  z-index: 100;                      /* Use var(--z-header) */
}

.modal {
  z-index: 99999;                    /* Don't use arbitrary values */
}
```

---

### 1.7 Line Height Tokens

**Pattern**: `--line-{emphasis}`

```css
/* ✅ CORRECT */
--line-tight: 1.1;                   /* Headings, display text */
--line-snug: 1.2;                    /* Large headings */
--line-normal: 1.5;                  /* Body text, default */
--line-relaxed: 1.6;                 /* Long-form content */
--line-loose: 1.7;                   /* Captions, descriptions */

/* ❌ WRONG */
--line-height-normal: 1.5;           /* Use --line-normal */
--lh-base: 1.5;                      /* Missing 'line' prefix */
--15: 1.5;                           /* Too vague */
```

**Typography Pairing**:
```css
/* ✅ CORRECT - Combine size + line-height */
.heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-tight);    /* Tight for headings */
}

.body-text {
  font-size: var(--font-size-base);
  line-height: var(--line-normal);   /* Normal for body */
}

/* ❌ WRONG - Hardcoded line-height */
.heading {
  font-size: var(--font-size-4xl);
  line-height: 1.1;                  /* Use var(--line-tight) */
}
```

---

## Rule 2: Semantic Layer Naming

### 2.1 Text Color Tokens

**Pattern**: `--text-{hierarchy}` or `--text-inverse-{hierarchy}`

```css
/*  CORRECT - Light backgrounds */
--text-strong: var(--color-slate-850);       /* Level 1: Headings */
--text-base: var(--color-gray-900);          /* Level 2: Body text */
--text-muted: var(--color-gray-700);         /* Level 3: Secondary */
--text-subtle: var(--color-gray-500);        /* Level 4: Captions */
--text-soft: #94a3b8;                        /* Level 5: Disabled */
--text-vsoft: var(--color-slate-300);        /* Level 6: Borders */

/*  CORRECT - Dark backgrounds */
--text-inverse-strong: var(--color-white);
--text-inverse-base: rgba(255, 255, 255, 0.85);
--text-inverse-muted: rgba(255, 255, 255, 0.75);
--text-inverse-subtle: rgba(255, 255, 255, 0.65);
--text-inverse-soft: rgba(255, 255, 255, 0.45);

/* L WRONG */
--text-primary: var(--color-gray-900);       /* Use --text-base */
--text-secondary: var(--color-gray-700);     /* Use --text-muted */
--heading-color: var(--color-gray-900);      /* Use --text-strong */
--white-text: #ffffff;                       /* Use --text-inverse-strong */
--home-text: var(--color-gray-900);          /* NO page prefixes! */
```

---

### 2.2 Surface (Background) Tokens

**Pattern**: `--surface-{context}`

```css
/*  CORRECT */
--surface-base: var(--color-white);          /* Main background */
--surface-raised: var(--color-white);        /* Cards, panels */
--surface-subtle: var(--color-gray-50);      /* Subtle sections */
--surface-muted: var(--color-gray-bg);       /* Gray sections */
--surface-tinted: var(--color-tinted);       /* Tinted sections */
--surface-hero: var(--color-black);          /* Hero/dark sections */
--surface-overlay: rgba(0, 0, 0, 0.5);       /* Video overlays */

/* L WRONG */
--bg-white: #ffffff;                         /* Use --surface-base */
--background-primary: #ffffff;               /* Use --surface-base */
--hero-background: #000000;                  /* Use --surface-hero */
--overlay-dark: rgba(0,0,0,0.5);             /* Use --surface-overlay */
```

---

### 2.3 Button Tokens

**Pattern**: `--button-{variant}-{property}`

```css
/*  CORRECT */
--button-primary-bg: var(--color-slate-850);
--button-primary-hover: var(--color-slate-800);
--button-primary-text: var(--color-white);
--button-primary-border: var(--color-slate-850);

/* L WRONG */
--btn-bg: var(--color-slate-850);            /* Missing variant */
--primary-button-color: #ffffff;             /* Wrong order */
--button-background: var(--color-slate-850); /* Missing variant */
```

---

### 2.4 Border Tokens

**Pattern**: `--border-{emphasis}`

```css
/*  CORRECT */
--border-subtle: var(--color-gray-300);
--border-strong: var(--color-slate-200);
--border-divider: var(--color-gray-bg);

/* L WRONG */
--border-color: var(--color-gray-300);       /* Missing emphasis */
--gray-border: var(--color-gray-300);        /* Wrong pattern */
```

---

### 2.5 Motion (Animation) Tokens

**Pattern**: `--motion-{speed}` and `--ease-{type}`

```css
/*  CORRECT - Duration */
--motion-instant: 0.15s;
--motion-fast: 0.3s;
--motion-base: 0.5s;
--motion-slow: 0.8s;
--motion-slower: 1.2s;

/*  CORRECT - Easing */
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/*  CORRECT - Stagger */
--stagger-base: 0.12s;
--stagger-slow: 0.2s;

/*  CORRECT - Spring physics */
--spring-stiffness: 200;
--spring-damping: 20;

/* L WRONG */
--transition-duration: 0.3s;                 /* Use --motion-fast */
--animation-time: 0.5s;                      /* Use --motion-base */
--300ms: 0.3s;                               /* Too generic */
```

---

### 2.6 Brand Tokens

**Pattern**: `--brand-{role}`

```css
/*  CORRECT */
--brand-primary: var(--color-green-700);
--brand-accent: var(--color-blue-500);

/* L WRONG */
--primary-color: var(--color-green-700);     /* Use --brand-primary */
--accent: var(--color-blue-500);             /* Missing 'brand' prefix */
```

---

## Rule 3: Utility Class Naming

### 3.1 Spacing Utilities

**Pattern**: `.{type}-{size}`

```css
/*  CORRECT */
@layer components {
  .gap-sm { gap: var(--space-sm); }
  .gap-md { gap: var(--space-md); }
  .gap-lg { gap: var(--space-lg); }

  .stack-sm > :not([hidden]) ~ :not([hidden]) { margin-top: var(--space-sm); }
  .stack-md > :not([hidden]) ~ :not([hidden]) { margin-top: var(--space-md); }

  .padding-inline { padding-inline: var(--container-inline); }
}

/* L WRONG */
.home-gap-md { ... }                         /* NO page prefixes! */
.medium-gap { ... }                          /* Use .gap-md */
.spacing-md { ... }                          /* Too vague */
```

---

### 3.2 Typography Utilities

**Pattern**: `.{element}` or `.text-{modifier}`

```css
/*  CORRECT */
@layer components {
  .label {
    font-size: 0.8125rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .label-sm {
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .text-muted { color: var(--text-muted); }
  .text-inverse { color: var(--text-inverse-strong); }
}

/* L WRONG */
.home-label { ... }                          /* NO page prefixes! */
.uppercase-text { ... }                      /* Use .label */
.small-label { ... }                         /* Use .label-sm */
```

---

### 3.3 Container Utilities

**Pattern**: `.container-{type}`

```css
/*  CORRECT */
@layer components {
  .container-page {
    width: 100%;
    max-width: var(--container-max);
    margin-inline: auto;
  }

  .container-content {
    width: 92%;
    max-width: var(--container-max);
    margin-inline: auto;
  }

  .section-padding {
    padding-block: clamp(3rem, 6vw, 5.5rem);
  }
}

/* L WRONG */
.page-container { ... }                      /* Use .container-page */
.wrapper { ... }                             /* Too generic */
.main-container { ... }                      /* Use .container-page */
```

---

### 3.4 Button Utilities

**Pattern**: `.btn-{variant}`

```css
/*  CORRECT */
@layer components {
  .btn-primary {
    background: var(--button-primary-bg);
    color: var(--button-primary-text);
    transition: background var(--motion-fast);
  }

  .btn-primary:hover {
    background: var(--button-primary-hover);
  }

  /* Legacy alias */
  .button-strong {
    background: var(--button-primary-bg);
    color: var(--button-primary-text);
  }
}

/* L WRONG */
.primary-button { ... }                      /* Use .btn-primary */
.home-button { ... }                         /* NO page prefixes! */
.button-dark { ... }                         /* Use .btn-primary */
```

---

## Rule 4: Theme Layer Naming

### 4.1 Page-Specific Tokens

**Pattern**: `--{component}-{property}` (NO page prefixes like `--home-*`)

```css
/*  CORRECT */
.home-page {
  /* Carousel-specific tokens */
  --carousel-card-bg: var(--color-ink-900);
  --carousel-tab-border: #d4d4d8;
  --carousel-tab-bg: var(--color-white);
  --carousel-tab-bg-hover: #fafafa;
  --carousel-overlay: linear-gradient(...);

  /* Hero-specific tokens */
  --hero-gradient: linear-gradient(...);
  --hero-subtitle-color: var(--text-inverse-muted);

  /* CTA-specific tokens */
  --cta-border: var(--color-slate-200);
  --cta-overlay: linear-gradient(...);

  /* Platform-specific tokens */
  --platform-divider: var(--border-divider);
}

/* L WRONG */
.home-page {
  --home-carousel-bg: var(--color-ink-900);  /* Remove 'home' prefix! */
  --home-text-base: var(--color-gray-900);   /* Use global --text-base! */
  --home-shadow: 0 2px 4px rgba(0,0,0,0.1);  /* Use global --shadow-md! */
  --new-blue: #4e8af7;                       /* Add to 1-foundations/colors.css! */
}
```

---

### 4.2 Animation Timing Tokens (Page-Specific)

**Pattern**: `--{component}-{property}-{timing}`

```css
/*  CORRECT */
.home-page {
  /* Hero animation timings */
  --hero-title-duration: 1.2s;
  --hero-title-stagger: 0.2s;
  --hero-subtitle-duration: 1s;
  --hero-subtitle-delay: 1s;

  /* Carousel animation timings */
  --carousel-transition: 0.6s;
  --carousel-hidden-duration: 0.5s;
  --carousel-arrow-fade: 0.3s;

  /* CTA animation timings */
  --cta-image-duration: 1.2s;
  --cta-text-duration: 0.8s;
  --cta-text-stagger: 0.15s;
}

/* L WRONG */
.home-page {
  --animation-duration: 1.2s;                /* Too generic */
  --home-duration: 1.2s;                     /* Missing component context */
  --hero-animation: 1.2s;                    /* Missing property */
}
```

---

### 4.3 Overriding Global Semantics (Use Sparingly)

```css
/*  ALLOWED (with caution) */
.product-page {
  /* Override with reference to foundation */
  --surface-hero: var(--color-purple-900);
}

/* � CAUTION - Only if truly necessary */
.product-page {
  --surface-hero: linear-gradient(135deg, var(--color-purple-700) 0%, var(--color-blue-600) 100%);
}

/* L FORBIDDEN */
.product-page {
  --surface-hero: #9333ea;                   /* Add to foundations first! */
  --text-base: #111111;                      /* Don't override core semantics! */
}
```

---

## Rule 5: Component Layer Consumption

### 5.1 Token Reference Priority

```css
/* Priority 1: Use semantic tokens (BEST) */
.hero-section .title {
  color: var(--text-inverse-strong);
  background: var(--surface-hero);
}

/* Priority 2: Use theme tokens (page-specific) */
.carousel .card {
  background: var(--carousel-card-bg);
  border-color: var(--carousel-card-border);
}

/* Priority 3: Direct values (ONLY for unique needs) */
.special-gradient {
  background: linear-gradient(to right, rgba(0,0,0,0.6), transparent);
}

/* L FORBIDDEN: Page-prefixed tokens */
.hero-section .title {
  color: var(--home-text-inverse);           /* Deprecated! */
}
```

---

### 5.2 Component-Local Tokens

```css
/*  ALLOWED: Component defines its own API */
.hero-section-1 {
  --hero-title-color: var(--text-inverse-strong);
  --hero-subtitle-color: var(--hero-subtitle-color); /* From theme */
}

.hero-section-1 .title {
  color: var(--hero-title-color);
}

/* L WRONG: Skip the abstraction */
.hero-section-1 .title {
  color: var(--text-inverse-strong);         /* OK but less flexible */
}
```

---

## Rule 6: Forbidden Patterns

### 6.1 Page-Prefixed Global Tokens

```css
/* L FORBIDDEN */
--home-text-base: var(--color-gray-900);
--home-text-muted: var(--color-gray-700);
--home-shadow-md: 0 2px 4px rgba(0,0,0,0.1);
--home-gap-md: clamp(1rem, 2vw, 1.5rem);

--product-text-body: var(--color-gray-900);
--contact-text: #111827;
--newsroom-text-primary: #111827;

/*  CORRECT: Use global semantics */
--text-base: var(--color-gray-900);
--text-muted: var(--color-gray-700);
--shadow-md: 0 2px 4px rgba(0,0,0,0.1);
```

---

### 6.2 Duplicate Primitives in Themes

```css
/* L FORBIDDEN */
.contact-page {
  --gray-900: #1e2124;                       /* Already in foundations! */
  --white: #ffffff;                          /* Already in foundations! */
  --shadow-card: 0 2px 4px rgba(0,0,0,0.1);  /* Use global --shadow-md! */
}

/*  CORRECT: Reference global tokens */
.contact-page {
  --card-bg: var(--color-white);
  --card-shadow: var(--shadow-md);
}
```

---

### 6.3 Semantic Meanings in Foundation Layer

```css
/* L FORBIDDEN */
:root {
  --primary-color: #4e8af7;
  --heading-text: #1e2124;
  --body-background: #ffffff;
}

/*  CORRECT: Pure primitives in foundation */
:root {
  --color-blue-500: #4e8af7;
  --color-gray-900: #1e2124;
  --color-white: #ffffff;
}

/* Then map in semantic layer */
:root {
  --brand-primary: var(--color-blue-500);
  --text-strong: var(--color-gray-900);
  --surface-base: var(--color-white);
}
```

---

### 6.4 Page-Prefixed Utility Classes

```css
/* L FORBIDDEN */
.home-gap-md { gap: var(--space-md); }
.home-label { font-size: 0.8125rem; }
.home-button-strong { background: var(--button-primary-bg); }

.contact-btn-primary { background: var(--color-gray-900); }
.newsroom-load-more { background: var(--color-slate-850); }

/*  CORRECT: Global utilities */
.gap-md { gap: var(--space-md); }
.label { font-size: 0.8125rem; }
.btn-primary { background: var(--button-primary-bg); }
```

---

### 6.5 Hardcoded Values in Components

```css
/* � DISCOURAGED (but not forbidden for special cases) */
.special-component {
  color: #1e2124;                            /* Prefer --text-base */
  padding: 1rem;                             /* Prefer --space-md */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);     /* Prefer --shadow-md */
}

/*  PREFERRED */
.special-component {
  color: var(--text-base);
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
}
```

---

## Rule 7: File Organization Rules

### 7.1 Import Order (CRITICAL)

```css
/* globals.css - DO NOT REORDER */

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

/* 5. Animations */
@import "../styles/home-animations.css";
```

**Why this order matters**:
- Foundations define raw values
- Semantics reference foundations
- Utilities reference semantics
- Themes override semantics
- Animations reference themes

Changing this order will break the token cascade!

---

### 7.2 File Placement Rules

| Token Type | Correct Location | L Wrong Location |
|-----------|------------------|------------------|
| Raw color `#4e8af7` | `1-foundations/colors.css` | `4-themes/home.css` |
| `--text-base` | `2-semantic/colors.css` | `1-foundations/colors.css` |
| `.btn-primary` | `3-utilities/buttons.css` | `4-themes/home.css` |
| `--carousel-card-bg` | `4-themes/home.css` | `2-semantic/surfaces.css` |
| Hero animation timings | `4-themes/home.css` | `2-semantic/motion.css` |
| `@keyframes fadeIn` | `home-animations.css` | `4-themes/home.css` |

---

## Rule 8: Migration Rules

### 8.1 When Refactoring Legacy Files

**DO**:
-  Identify duplicate global tokens � delete and reference global
-  Extract reusable patterns � move to utilities
-  Keep truly page-unique tokens � move to themes
-  Verify visual consistency after migration

**DON'T**:
- L Copy-paste entire files without analysis
- L Keep page prefixes when moving to global
- L Mix primitives and semantics in same file
- L Skip visual regression testing

---

### 8.2 Adding New Tokens Checklist

Before adding a new token, ask:

1. **Is this value used in 2+ pages?**
   - Yes � Add to semantic layer
   - No � Add to theme layer

2. **Is this a raw primitive value?**
   - Yes � Add to foundations
   - No � Add to semantics or themes

3. **Does a similar token already exist?**
   - Yes � Reuse it
   - No � Create new with proper naming

4. **Will this be reused across components?**
   - Yes � Create utility class
   - No � Use in component CSS module

---

## Rule 9: Responsive Token Rules

### 9.1 When to Use clamp()

```css
/*  USE clamp() for: */
--space-md: clamp(1rem, 2vw, 1.5rem);        /* Spacing */
--heading-hero: clamp(2rem, 6vw, 4.5rem);    /* Fluid typography */
--container-inline: clamp(1.5rem, 3vw, 2.5rem); /* Container padding */

/* L DON'T use clamp() for: */
--color-gray-900: clamp(...);                 /* Colors don't scale */
--weight-bold: clamp(...);                    /* Weights are fixed */
```

---

### 9.2 When to Use @media

```css
/*  USE @media for: */
@media (min-width: 48em) {
  :root {
    --font-size-lg: 1.25rem;                 /* Stepped typography */
    --gutter: 1.6666666667rem;               /* Legacy tokens */
  }
}

/* L DON'T use @media for: */
@media (min-width: 48em) {
  :root {
    --color-gray-900: #000000;               /* Colors don't change */
  }
}
```

---

## Rule 10: Documentation Requirements

### 10.1 Comments in Token Files

```css
/*  GOOD: Clear section headers */
/* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
   TEXT COLORS - LIGHT BACKGROUNDS
   PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
--text-strong: var(--color-slate-850);       /* Level 1: Headings */
--text-base: var(--color-gray-900);          /* Level 2: Body text */
--text-muted: var(--color-gray-700);         /* Level 3: Secondary */

/* L BAD: No structure */
--text-strong: var(--color-slate-850);
--text-base: var(--color-gray-900);
--text-muted: var(--color-gray-700);
```

---

### 10.2 Deprecation Warnings

```css
/* � DEPRECATED: Use --text-base instead */
--home-text-primary: var(--text-base);

/* Legacy alias for backward compatibility (Phase 1 only) */
.button-strong {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}
```

---

## Enforcement Strategy

### Phase 1-4: Manual Review
- PR reviews check token naming
- Visual regression testing required
- Manual checklist before merge

### Phase 5: Automated Enforcement
- Stylelint rules for token naming patterns
- Pre-commit hooks to block violations
- CI/CD pipeline checks

---

## Quick Decision Tree

```
Adding a new token?

  Is it a raw value (color hex, px value)?
    YES � 1-foundations/

  Is it used in 2+ pages?
    YES � 2-semantic/

  Is it a reusable pattern (3+ components)?
    YES � 3-utilities/

  Is it unique to one page?
     YES � 4-themes/
```

---

## Checklist for New Developers

Before committing token changes:

- [ ] Checked if similar token exists
- [ ] Used correct naming pattern for layer
- [ ] No page prefixes in global tokens
- [ ] No duplicate primitives
- [ ] Added to correct file location
- [ ] Maintained import order in globals.css
- [ ] Added clear comments
- [ ] Tested visual consistency
- [ ] Updated this document if new patterns emerge

## Service Template Addendum (JPM/BIM/Finance/Ventures)
- Theme file `src/styles/4-themes/service.css` follows the standard import order; `service-shell` currently uses 90%/88% width (max 1700px, padding 0) and a full-bleed hero background. Keep these values token-driven; no inline hex/px.
- Components in `src/components/service-template/` (hero/methodology/engine/data/gallery/cta) must consume design tokens only; data stays in `src/data/services.ts` (no inline duplicates).
- Layout conventions: sections use unified 7/5 columns; stats grid is 2×2 with `border-[var(--border-subtle)]`; large numbers stick to tokenized typography (e.g., 6xl/7xl via semantic tokens).
- Links/CTA must use i18n Link/LocalizedLink; `HideDefaultFooter` + `FooterCharcoal` remain in layout wrappers.

---

**Last Review**: 2025-12-06
**Next Review**: After Phase 2 completion
**Maintainers**: Development Team
**Enforcement**: Manual (� Automated in Phase 5)
