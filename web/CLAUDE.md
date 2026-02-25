# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**isBIM Official Web** - A Palantir-level premium enterprise website built with the "Vibe Coding" tech stack philosophy. This project prioritizes exquisite animations, smooth scrolling experiences, and compile-time optimizations.

**Key Philosophy**: This is a high-performance, animation-rich website designed for **desktop, tablet, and mobile** responsiveness. Every feature should consider multi-device experiences.

## Tech Stack Architecture

This project follows a carefully orchestrated "layered" architecture where each technology has a specific role:

### Core Stack
- **Next.js 15.5.6** (App Router + Turbopack) - SSR/SSG, routing, SEO
- **Tailwind CSS v4** - Atomic CSS with design tokens
- **Shadcn/ui** (New York style) - Composable UI components
- **TypeScript** - Type safety throughout

### Internationalization (i18n)
- **Paraglide JS 2.5.0** - Compile-time i18n (NOT next-intl)
- **Strategy**: URL-based routing (`/zh/*`, `/en/*`) with cookie fallback
- **Base Locale**: Chinese (`zh`), secondary: English (`en`)
- **Critical**: Translations MUST be compiled before builds

### Animation Layer (Three-Tier System)
1. **Lenis** - Global smooth scrolling foundation (required for GSAP)
2. **GSAP + ScrollTrigger** - Large narrative scroll-based animations
3. **Framer Motion** - Component-level micro-interactions (hover, tap)

**Animation Coordination Rule**: Lenis provides the smooth scroll event stream that GSAP ScrollTrigger consumes. Framer Motion handles post-entrance interactions.

### Data & State
- **Sanity CMS** (Project: `4y8vgu6z`) - Headless CMS for dynamic content
- **TanStack Query** - API lifecycle management (loading, caching, errors)
- **Zustand** - Lightweight global state (modals, UI state)
- **React Hook Form + Zod** - Form handling with schema validation

## Critical Commands

### Development
```bash
npm run dev                    # Start dev server (Turbopack)
npm run paraglide:compile      # Compile i18n messages (REQUIRED after editing translations)
npm run build                  # Production build (auto-compiles i18n first)
```

### Adding UI Components
```bash
npx shadcn@latest add button   # Add Shadcn component
npx shadcn@latest add dialog   # Components are copied to src/components/ui/
```

### Sanity CMS
```bash
# Sanity Studio is configured but NOT auto-started
# Project ID: 4y8vgu6z, Dataset: production
# Access token stored in .env.local (do NOT commit)
```