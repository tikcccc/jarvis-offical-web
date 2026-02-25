# JARVIS Sections Refactoring Plan

## Goal
Make both sections use **IDENTICAL HTML structure and CSS class names**, differing only in:
- Background colors
- Text colors
- Accent colors
- Grid column proportions
- Visual column content (glass panel vs simple container)

---

## Unified Class Names

| Purpose | Unified Class Name | Used In |
|---------|-------------------|---------|
| Section wrapper | `.section` | Both |
| Background grid | `.bgOverlay` | Both (optional) |
| Container | `.container` | Both |
| Header | `.header` | Both |
| Label | `.label` | Both |
| Heading | `.heading` | Both |
| Grid | `.grid` | Both |
| **Product list column** | `.productColumn` | Both |
| **Product item** | `.productItem` | Both |
| Product item active | `.productItemActive` | Both |
| Product item header | `.productItemHeader` | Both |
| Product item title | `.productItemTitle` | Both |
| Product item description | `.productItemDesc` | Both |
| Arrow icon | `.arrow` | Both |
| **Visual column** | `.visualColumn` | Both |
| Screen container | `.screenContainer` | Both |
| Placeholder text | `.placeholderText` | Both |

---

## HTML Template (100% Identical)

```tsx
<section className={styles.section}>
  {/* Optional: Background overlay */}
  {hasBgOverlay && <div className={styles.bgOverlay} />}

  <div className={`${styles.container} jarvis-section-shell`}>
    {/* Header */}
    <div className={styles.header}>
      <div>
        <span className={styles.label}>{labelText}</span>
        <h2 className={styles.heading}>
          {/* Heading content with theme-specific styling */}
        </h2>
      </div>
    </div>

    {/* Grid */}
    <div className={styles.grid}>
      {/* Column 1: Product List */}
      <div className={styles.productColumn}>
        {ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className={`${styles.productItem} ${
              activeIndex === idx ? styles.productItemActive : ''
            }`}
            onMouseEnter={() => setActiveIndex(idx)}
          >
            <div className={styles.productItemHeader}>
              <h3 className={styles.productItemTitle}>{item.title}</h3>
              <svg className={styles.arrow}>{/* SVG path */}</svg>
            </div>
            <div className={styles.productItemDesc}>{item.description}</div>
          </div>
        ))}
      </div>

      {/* Column 2: Visual */}
      <div className={styles.visualColumn}>
        <div className={styles.screenContainer}>
          {/* Theme-specific visual content */}
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## CSS Structure (Identical in Both Files)

### Section & Container
```css
.section { /* Theme-specific background */ }
.bgOverlay { /* Optional grid background */ }
.container { /* Vertical padding only */ }
```

### Header
```css
.header { /* margin, border, padding */ }
.label { /* size, weight, letter-spacing */ }
.heading { /* size, weight, letter-spacing */ }
```

### Grid
```css
.grid { /* gap, min-height */ }
@media (min-width: 1024px) {
  .grid { grid-template-columns: X fr Y fr; } /* ONLY DIFFERENCE */
}
```

### Product Column
```css
.productColumn { /* flex, gap, justify */ }
.productItem { /* transition, border, opacity */ }
.productItemActive { /* padding-left, border-color */ }
.productItemHeader { /* flex, padding, border */ }
.productItemTitle { /* font-size: 1.875rem (SAME) */ }
.productItemDesc { /* font-size: 0.875rem (SAME) */ }
.arrow { /* size, transition */ }
```

### Visual Column
```css
.visualColumn { /* flex, align, justify */ }
.screenContainer { /* size: 560px, radius: 0.75rem (SAME) */ }
.placeholderText { /* font-size, weight */ }
```

---

## Theme Differences (Via CSS Variables)

### Generate Section (Light Theme)
```css
.section {
  --bg-color: var(--jarvis-surface-light);
  --header-border: rgba(0, 0, 0, 0.05);
  --label-color: var(--jarvis-accent-primary);
  --heading-color: var(--jarvis-text-strong);
  --item-border: rgba(0, 0, 0, 0.05);
  --item-title-color: var(--jarvis-text-strong);
  --desc-color: var(--text-muted);
  --arrow-color: var(--jarvis-accent-primary);
  --screen-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.15);
}
```

### Sense Section (Dark Theme)
```css
.section {
  --bg-color: var(--jarvis-surface-dark);
  --header-border: rgba(255, 255, 255, 0.1);
  --label-color: var(--text-inverse-muted);
  --heading-color: var(--text-inverse-strong);
  --item-border: rgba(255, 255, 255, 0.1);
  --item-title-color: var(--text-inverse-strong);
  --desc-color: var(--text-inverse-muted);
  --arrow-color: var(--jarvis-accent-neon);
  --screen-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
}
```

---

## Grid Differences

| Section | Grid Columns (desktop) | Product Column | Visual Column |
|---------|----------------------|----------------|---------------|
| **Generate** | `5fr 7fr` | Left (smaller) | Right (larger) |
| **Sense** | `7fr 5fr` | Right (smaller) | Left (larger) |

This is controlled by:
```css
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 5fr 7fr; /* Generate */
    grid-template-columns: 7fr 5fr; /* Sense */
  }
}
```

And order in mobile:
```css
.productColumn {
  order: 2; /* Generate: mobile 2, desktop 1 */
  order: 2; /* Sense: always 2 */
}

.visualColumn {
  order: 1; /* Generate: mobile 1, desktop 2 */
  order: 1; /* Sense: always 1 */
}
```

---

## Implementation Steps

1. ✅ Analyze current differences
2. ⏳ Rewrite `generate-section.module.css` with unified class names
3. ⏳ Rewrite `sense-section.module.css` with unified class names
4. ⏳ Update `generate-section.tsx` with unified HTML
5. ⏳ Update `sense-section.tsx` with unified HTML
6. ✅ Test alignment in browser
