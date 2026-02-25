# Coding Docs Index (v4.0 - 2025-11-29)

**🚨 CRITICAL RULE: DO NOT MODIFY THIS FILE 🚨**
**This is a read-only index/compass for navigation. Updates belong in the specific files listed below.**

---

## 📁 File Responsibilities

### 📘 `coding-archite.md` - Architecture Documentation
**Purpose:** System architecture, tech stack layers, file structure, module relationships
**Update when:**
- Adding/removing core dependencies (Lenis, GSAP, Sanity, etc.)
- Changing folder structure or naming conventions
- Adding new architectural layers (auth, payment, analytics)
- Modifying environment variable structure
- Updating CDN/deployment infrastructure

**Keep concise:** Focus on "what exists" and "how it connects", not implementation details

---

### 📗 `coding-rules.md` - Coding Standards
**Purpose:** Code style rules, naming conventions, anti-patterns, best practices
**Update when:**
- Establishing new coding patterns (animation timing, component structure)
- Defining import/export rules for new libraries
- Adding TypeScript type safety requirements
- Setting animation coordination rules (Lenis + GSAP + Framer Motion)
- Documenting i18n usage patterns

**Keep concise:** Use bullet points and code snippets. Avoid long explanations.

---

### 📕 `coding-troubleshooting.md` - Bug Fixes & Reminders
**Purpose:** Record bugs encountered, solutions applied, and warnings for future work
**Update when:**
- Fixing a non-trivial bug (especially recurring ones)
- Discovering library limitations or gotchas
- Solving integration issues between dependencies
- Finding workarounds for build/deployment errors

**Format:** Problem → Root Cause → Solution (keep under 5 lines per entry)
**Keep concise:** Delete outdated issues. Only keep relevant troubleshooting patterns.

---

### 📙 `coding-todo.md` - Task Tracking
**Purpose:** Track **uncompleted** development tasks only
**Update when:**
- Starting a new feature/module that requires multiple steps
- Discovering production deployment requirements
- Planning SEO, performance, or security improvements

**Keep concise:** Delete completed tasks immediately. No historical records.

---

### 📓 `coding-backup-plan.md` - Service Alternatives
**Purpose:** Document backup solutions for critical services (email, CMS, CDN, deployment)
**Update when:**
- Evaluating alternatives for cost/feature reasons
- Preparing disaster recovery options
- Documenting migration paths from current services

**Keep concise:** Feature comparison tables, migration difficulty (⭐ ratings), code examples

---

### 📔 `coding-update.md` - Change Log
**Purpose:** Historical record of major changes and version history
**Update when:**
- Completing major features (contact form, SEO system, etc.)
- Upgrading core dependencies (Next.js, Tailwind, etc.)
- Refactoring significant modules

**Keep concise:** Date + brief description + files affected

---

## 🧭 Quick Decision Tree

**Need to know system structure?** → Read `coding-archite.md`
**Need to follow code style?** → Read `coding-rules.md`
**Hit a bug or warning?** → Check `coding-troubleshooting.md`, then add solution if new
**Planning new work?** → Check `coding-todo.md`
**Evaluating service alternatives?** → Check `coding-backup-plan.md`
**Looking for change history?** → Read `coding-update.md`

---

**Last Updated:** 2025-11-29
**Maintained by:** Claude Code (AI Agent)


