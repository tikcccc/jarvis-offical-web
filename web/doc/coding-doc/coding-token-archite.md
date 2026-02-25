# Design Token System Architecture

**isBIM Official Web - 設計變數系統架構文件**

Last Updated: 2025-12-11
Version: 2.0 (Post-Refactor)

---

## 📋 目錄

1. [系統概述](#系統概述)
2. [分層架構](#分層架構)
3. [命名規範](#命名規範)
4. [斷點系統](#斷點系統)
5. [字體系統](#字體系統)
6. [顏色系統](#顏色系統)
7. [間距系統](#間距系統)
8. [文件結構](#文件結構)
9. [使用指南](#使用指南)
10. [遷移紀錄](#遷移紀錄)

---

## 系統概述

本專案採用 **Layered Token Architecture（分層變數架構）**，將設計變數分為多個層級，確保系統的可維護性、一致性和擴展性。

### 核心理念

- **單一來源**：每個變數只在一個地方定義
- **語義分離**：基礎變數與語義變數分離
- **層級清晰**：從 Foundations → Semantics → Utilities → Themes
- **響應式優先**：使用 `clamp()` 和斷點實現流動設計

---

## 分層架構

```
┌─────────────────────────────────────────────────────────┐
│  6. ANIMATIONS (動畫定義)                                │
├─────────────────────────────────────────────────────────┤
│  5. COMPONENTS (組件專屬樣式)                            │
├─────────────────────────────────────────────────────────┤
│  4. THEMES (頁面主題覆寫)                                │
│     - home.css, product.css, jarvis.css, service.css    │
├─────────────────────────────────────────────────────────┤
│  3. UTILITIES (可複用 Class)                             │
│     - containers.css, font-types.css, buttons.css       │
├─────────────────────────────────────────────────────────┤
│  2. SEMANTIC LAYER (語義映射)                            │
│     - colors.css, surfaces.css, motion.css              │
├─────────────────────────────────────────────────────────┤
│  1. FOUNDATIONS (基礎原語)                               │
│     - breakpoints.css, colors.css, spacing.css          │
│     - typography.css, shadows.css, radius.css           │
└─────────────────────────────────────────────────────────┘
```

### Layer 1: Foundations（基礎層）

**定義**: 純粹的設計原語，不帶任何語義意義。

**包含**:
- 顏色原值（`--color-blue-500`, `--color-gray-900`）
- 間距階梯（`--space-xs`, `--space-md`）
- 字體族（`--font-heading-en`, `--font-body-en`）
- 字重（`--weight-regular`, `--weight-bold`）
- 斷點（`--bp-tablet`, `--bp-laptop`）
- 陰影（`--shadow-xs`, `--shadow-2xl`）
- 圓角（`--radius-sm`, `--radius-lg`）

**特點**:
- ✅ 不依賴其他變數
- ✅ 只定義具體數值
- ✅ 不包含語義（不使用 "primary", "danger" 等命名）

### Layer 2: Semantic Layer（語義層）

**定義**: 將基礎變數映射為有意義的語義變數。

**包含**:
- 文字顏色（`--text-base`, `--text-muted`, `--text-inverse-strong`）
- 表面顏色（`--surface-base`, `--surface-hero`）
- 動畫（`--motion-fast`, `--ease-smooth`）

**範例**:
```css
/* 2-semantic/colors.css */
:root {
  --text-base: var(--color-gray-900);      /* 引用 Foundation */
  --text-muted: var(--color-gray-700);
  --surface-hero: var(--color-slate-950);
}
```

**特點**:
- ✅ 依賴 Foundations 層
- ✅ 提供業務語義
- ✅ 便於主題切換（只需修改 Semantic 層映射）

### Layer 3: Utilities（工具層）

**定義**: 可複用的 CSS Class，不限定於特定組件。

**包含**:
- 容器類（`.container-content`, `.container-wide`）
- 字體類型（`.font-display-hero`, `.font-body-lg`）
- 按鈕樣式（`.btn-primary`, `.btn-outline`）

**範例**:
```css
/* 3-utilities/font-types.css */
@layer components {
  .font-display-hero {
    font-family: var(--font-heading-en);
    font-size: clamp(2rem, 6vw, 4.5rem);
    font-weight: var(--weight-bolder);
    line-height: 1.05;
    letter-spacing: -0.025em;
  }
}
```

**特點**:
- ✅ 使用 `@layer components` 確保正確層疊順序
- ✅ 可在多個頁面/組件複用
- ✅ 與 Tailwind 的 utility-first 理念一致

### Layer 4: Themes（主題層）

**定義**: 頁面專屬的設計變數覆寫。

**包含**:
- `home.css` - 首頁主題
- `product.css` - 產品頁主題（JARVIS/其他產品）
- `service.css` - 服務頁主題
- `newsroom.css` - 新聞室主題

**範例**:
```css
/* 4-themes/jarvis.css */
.jarvis-page {
  --surface-hero: var(--color-screen-bg);  /* 深色背景 */
  --text-accent: var(--color-neon-cyan);   /* 霓虹青強調色 */
}
```

---

## 命名規範

### Foundations 層命名

#### 顏色
```css
--color-{hue}-{shade}
範例: --color-blue-500, --color-gray-900, --color-slate-850
```

#### 間距
```css
--space-{size}
範例: --space-xs, --space-md, --space-xl
```

#### 字體
```css
--font-{type}-{locale}
範例: --font-heading-en, --font-body-en, --font-cn
```

#### 字重
```css
--weight-{name}
範例: --weight-light, --weight-regular, --weight-bold, --weight-bolder
```

#### 斷點
```css
--bp-{device}
範例: --bp-mobile, --bp-tablet, --bp-laptop, --bp-desktop
```

### Semantic 層命名

#### 文字顏色
```css
--text-{emphasis}
範例: --text-base, --text-muted, --text-soft, --text-inverse-strong
```

#### 表面顏色
```css
--surface-{context}
範例: --surface-base, --surface-hero, --surface-muted
```

#### 動畫
```css
--motion-{property}
範例: --motion-fast, --motion-base, --ease-smooth, --stagger-base
```

### Utilities 層命名

#### Class 命名（BEM 簡化版）
```css
.{prefix}-{descriptor}-{variant}
範例: .font-display-hero, .container-content-wide, .btn-outline
```

---

## 斷點系統

### 四斷點策略

本專案採用 **四階層斷點系統**，覆蓋主流設備：

```css
/* 1-foundations/breakpoints.css */
:root {
  --bp-mobile: 0px;       /* 📱 手機：0 - 767px */
  --bp-tablet: 768px;     /* 📱 平板：768px - 1023px */
  --bp-laptop: 1024px;    /* 💻 筆電：1024px - 1599px */
  --bp-desktop: 1600px;   /* 🖥️  桌機：1600px+ */
}
```

### 容器 Max-Width 策略

```css
:root {
  --container-max-mobile: 100%;      /* 全寬 */
  --container-max-tablet: 720px;     /* 收緊閱讀寬度 */
  --container-max-laptop: 1280px;    /* 保守寬度 */
  --container-max-desktop: 1920px;   /* 大氣設計 */
}
```

### 實際應用範例

```css
/* 3-utilities/containers.css */
.container-content {
  width: 92%;
  max-width: 100%;
  margin-inline: auto;
}

@media (min-width: 768px) {
  .container-content {
    width: 90%;
    max-width: 720px;
  }
}

@media (min-width: 1024px) {
  .container-content {
    width: 88%;
    max-width: 1100px;  /* 筆電區間保守 */
  }
}

@media (min-width: 1600px) {
  .container-content {
    max-width: 1440px;  /* 桌機上限 */
  }
}
```

### 筆電區間保護機制

針對 **1024px - 1599px**（筆電螢幕），特別加入高度限制：

```css
/* 3-utilities/responsive-media.css */
@media (min-width: 1024px) and (max-width: 1599px) {
  .showcase-media {
    max-height: 500px;
    object-fit: cover;
  }

  .cta-media {
    max-height: 400px;
    object-fit: cover;
  }
}
```

**原因**: 防止圖片在垂直空間有限的筆電螢幕上佔據過多高度。

---

## 字體系統

### Font Families

```css
/* 1-foundations/typography.css */
:root {
  --font-heading-en: var(--font-alliance-2), var(--font-alliance-1), var(--font-fallback);
  --font-body-en: var(--font-alliance-1), var(--font-fallback);
  --font-cn: var(--font-alliance-zh), var(--font-alliance-1), var(--font-alliance-2), var(--font-fallback);
}
```

### 8 種 Font Type Utilities

| Type | Class | 用途 | Font Size | Weight | Line Height |
|------|-------|------|-----------|--------|-------------|
| 1 | `.font-display-hero` | Hero 超大標題 | `clamp(2rem, 6vw, 4.5rem)` | 800 | 1.05 |
| 2 | `.font-container-title` | 區塊標題 | `clamp(2.5rem, 5vw, 4.5rem)` | 600 | 1.1 |
| 3 | `.font-feature` | 特色標題 | `clamp(2.5rem, 6vw, 5.5rem)` | 500 | 1.1 |
| 4 | `.font-container-subtitle` | 卡片標題 | `clamp(1.75rem, 3vw, 2.75rem)` | 700 | 1.15 |
| 5 | `.font-hero-subtitle` | Hero 副標題 | `clamp(1.125rem, 2.2vw, 1.5rem)` | 400 | 1.65 |
| 6 | `.font-body-lg` | 大正文 | `clamp(1.0625rem, 2vw, 1.375rem)` | 400 | 1.65 |
| 7 | `.font-body-base` | 標準正文 | `clamp(0.9375rem, 1vw, 1.0625rem)` | 400 | 1.6 |
| 8 | `.font-label` / `.font-label` | 標籤 | `0.8125rem` / `0.75rem` | 600 | 1.2 |

### 中文環境行高保護

針對中文（筆畫密集），自動放寬行高：

```css
/* 3-utilities/font-types.css */
:lang(zh) .font-display-hero,
:lang(zh) .font-container-title,
:lang(zh) .font-feature,
:lang(zh-HK) .font-display-hero,
:lang(zh-HK) .font-container-title,
:lang(zh-HK) .font-feature,
:lang(zh-CN) .font-display-hero,
:lang(zh-CN) .font-container-title,
:lang(zh-CN) .font-feature,
:lang(zh-TW) .font-display-hero,
:lang(zh-TW) .font-container-title,
:lang(zh-TW) .font-feature {
  line-height: 1.25; /* 中文至少需要 1.25 才能呼吸 */
  letter-spacing: 0; /* 中文通常不需要負字距 */
}
```

**原因**: 英文在 1.05 行高下表現良好，但中文（如「層」「警」「畫」）在此行高下會視覺衝突。

---

## 顏色系統

### Color Primitives（顏色原語）

```css
/* 1-foundations/colors.css */
:root {
  /* 核心中性色 */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f8fafc;
  --color-gray-100: #f3f3f3;
  --color-gray-300: #d1d5db;
  --color-gray-500: #64748b;
  --color-gray-700: #334155;
  --color-gray-900: #1e2124;

  /* 擴展 Slate 調色盤 */
  --color-slate-50: #f4f4f5;
  --color-slate-300: #c5d2e1;
  --color-slate-850: #18181b;
  --color-slate-950: #0f172a;

  /* 品牌色 */
  --color-blue-500: #4e8af7;
  --color-green-700: #2b5945;

  /* 產品強調色 */
  --color-cyan: #13c9ba;
  --color-violet: #8A2BE2;
  --color-neon-cyan: #00FFFF;  /* JARVIS 霓虹青 */
}
```

### Semantic Colors（語義顏色）

```css
/* 2-semantic/colors.css */
:root {
  /* 文字顏色層級（淺色背景） */
  --text-strong: #18181b;              /* Level 1: 強調 */
  --text-base: #1e2124;                /* Level 2: 主要 */
  --text-muted: #334155;               /* Level 3: 柔和 */
  --text-soft: #94a3b8;                /* Level 4: 微弱 */

  /* 文字顏色層級（深色背景） */
  --text-inverse-strong: #ffffff;               /* 最清晰 */
  --text-inverse-base: rgba(255, 255, 255, 0.85);
  --text-inverse-muted: rgba(255, 255, 255, 0.75);
  --text-inverse-soft: rgba(255, 255, 255, 0.45);
}
```

---

## 間距系統

### Spacing Scale

```css
/* 1-foundations/spacing.css */
:root {
  /* 基礎單位 */
  --space-unit: 8px;

  /* 流動間距（使用 clamp） */
  --space-xs: clamp(0.5rem, 1vw, 0.75rem);
  --space-sm: clamp(1rem, 2vw, 1.5rem);
  --space-md: clamp(1.5rem, 3vw, 2.5rem);
  --space-lg: clamp(2rem, 4vw, 3rem);
  --space-xl: clamp(2.25rem, 4vw, 3rem);

  /* 容器 */
  --container-max: 1920px;
  --container-inline: clamp(1.5rem, 3vw, 2.5rem);
  --height-nav: 86px;

  /* Grid 系統 */
  --grid: repeat(12, minmax(10px, 1fr));
  --gutter: 0.5555555556rem;
  --v-gutter: 1.1111111111rem;
  --section-v-spacing: 3.3333333333rem;
}
```

### 響應式 Gutter

```css
@media (min-width: 768px) {
  :root {
    --gutter: 0.8333333333rem;
    --v-gutter: 1.6666666667rem;
    --section-v-spacing: 4.4444444444rem;
  }
}

@media (min-width: 1024px) {
  :root {
    --gutter: 1.6666666667rem;
    --h-spacing: 1.6666666667rem;
    --section-v-spacing: 5.5555555556rem;
  }
}
```

---

## 文件結構

```
src/
├── app/
│   └── globals.css                    # 總入口（Import 順序至關重要）
│
└── styles/
    ├── 1-foundations/                 # Layer 1: 基礎原語
    │   ├── breakpoints.css           # 斷點系統
    │   ├── colors.css                # 顏色原語
    │   ├── spacing.css               # 間距系統
    │   ├── typography.css            # 字體、字重、行高
    │   ├── shadows.css               # 陰影系統
    │   ├── radius.css                # 圓角系統
    │   └── z-index.css               # Z 軸層級
    │
    ├── 2-semantic/                    # Layer 2: 語義映射
    │   ├── colors.css                # 文字、背景顏色語義
    │   ├── surfaces.css              # 表面語義
    │   └── motion.css                # 動畫語義
    │
    ├── 3-utilities/                   # Layer 3: 可複用 Classes
    │   ├── containers.css            # 容器 (.container-content, .container-wide)
    │   ├── spacing.css               # 間距工具類
    │   ├── typography.css            # 傳統字體工具類
    │   ├── font-types.css            # 8 種字體組合包
    │   ├── responsive-media.css      # 筆電圖片高度限制
    │   └── buttons.css               # 按鈕樣式
    │
    ├── 4-themes/                      # Layer 4: 頁面主題
    │   ├── home.css
    │   ├── product.css
    │   ├── jarvis.css
    │   ├── service.css
    │   └── newsroom.css
    │
    └── 5-animations/                  # Layer 5: 動畫定義
        ├── home-animations.css
        ├── product-animations.css
        └── jarvis-animations.css
```

---

## 使用指南

### 如何選擇正確的變數

#### ❌ 錯誤做法

```css
/* 直接使用 Foundations 層變數（缺乏語義） */
.my-component {
  color: var(--color-gray-900);
  background: var(--color-slate-950);
}
```

#### ✅ 正確做法

```css
/* 使用 Semantic 層變數（有明確意義） */
.my-component {
  color: var(--text-base);
  background: var(--surface-hero);
}
```

**原因**: Semantic 變數提供業務含義，便於主題切換。

### 如何新增設計變數

#### 步驟 1: 確定變數層級

- **基礎數值**（顏色、尺寸）→ Foundations
- **業務語義**（文字顏色、表面）→ Semantics
- **可複用樣式**（字體組合、容器）→ Utilities

#### 步驟 2: 在對應文件中定義

```css
/* 範例：新增品牌紅色 */

/* 1. 在 1-foundations/colors.css 定義原色 */
--color-red-500: #ef4444;

/* 2. 在 2-semantic/colors.css 映射語義 */
--status-error: var(--color-red-500);
--text-danger: var(--color-red-500);

/* 3. 在組件中使用語義變數 */
.error-message {
  color: var(--text-danger);
}
```

### 如何使用 Font Type Utilities

#### 在 TSX 組件中使用

```tsx
import { cn } from "@/lib/utils";
import styles from "./my-component.module.css";

export function MyComponent() {
  return (
    <div>
      <h1 className={cn("font-display-hero", styles.title)}>
        超大標題
      </h1>
      <p className="font-body-lg">
        大正文描述段落
      </p>
    </div>
  );
}
```

#### 在 Module CSS 中使用

```css
/* my-component.module.css */

/* ❌ 不要重複定義字體樣式 */
.title {
  font-family: var(--font-heading-en);
  font-size: clamp(2rem, 6vw, 4.5rem);
  /* ... 重複定義 */
}

/* ✅ 只保留顏色等組件專屬樣式 */
.title {
  color: var(--text-inverse-strong);
}
```

### 響應式設計最佳實踐

#### 使用 clamp() 實現流動尺寸

```css
/* ✅ 推薦：自動縮放，無需媒體查詢 */
.my-heading {
  font-size: clamp(1.5rem, 3vw, 3rem);
  padding: clamp(1rem, 2vw, 2rem);
}

/* ❌ 不推薦：手動定義多個斷點 */
.my-heading {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .my-heading {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .my-heading {
    font-size: 3rem;
  }
}
```

#### 容器使用建議

```tsx
/* 標準內容寬度 */
<section className="container-content">
  <h2>標準內容區塊</h2>
</section>

/* 寬版佈局（如 Feature 展示） */
<section className="container-content-wide">
  <div className="grid grid-cols-2">...</div>
</section>

/* 長文閱讀 */
<article className="container-narrow">
  <p>最佳閱讀寬度...</p>
</article>

/* 全屏（如 Hero、Carousel） */
<section className="container-page">
  <div>全屏內容</div>
</section>
```

---

## 遷移紀錄

### v2.0 (2025-12-11) - Token System 重構

#### 主要改動

1. **刪除 `tokens.css`**
   - 原因：與 Foundations 層大量重複
   - 動作：將所有變數遷移至分層架構

2. **新增 `1-foundations/breakpoints.css`**
   - 內容：四斷點系統定義
   - 原因：統一斷點管理

3. **統一斷點單位**
   - 從：混用 `em` 和 `px`（如 `35em`, `60em`）
   - 到：統一使用 `px`（`768px`, `1024px`, `1600px`）
   - 影響文件：`typography.css`, `spacing.css`

4. **新增 `3-utilities/font-types.css`**
   - 內容：8 種字體組合包 + 中文行高保護
   - 原因：統一 Home Page 字體，消除 module.css 重複

5. **新增中文行高保護**
   - 位置：`font-types.css` 底部
   - 內容：針對 `:lang(zh)` 系列，放寬行高至 1.25
   - 原因：避免漢字在緊密行高下視覺衝突

#### 文件變更清單

**新增**:
- `1-foundations/breakpoints.css`
- `3-utilities/font-types.css`
- `3-utilities/responsive-media.css`

**刪除**:
- `tokens.css` ❌

**修改**:
- `globals.css` - 更新 import 順序
- `1-foundations/typography.css` - 斷點從 em 改為 px
- `1-foundations/spacing.css` - 斷點從 em 改為 px
- All Home Page sections - 字體樣式遷移至 utility classes

#### 破壞性變更

⚠️ **無破壞性變更** - 所有視覺效果保持一致

所有變數已完整遷移，舊代碼引用的變數名稱保持不變。

---

## 常見問題 (FAQ)

### Q1: 為什麼要分層？直接用 Tailwind 不行嗎？

**A**: Tailwind 適合 **utility-first**，但大型項目需要 **設計系統**：

- ✅ 語義變數便於主題切換（如 Dark Mode）
- ✅ 設計 token 確保一致性
- ✅ 與 Tailwind 互補，不衝突

### Q2: 什麼時候用 CSS 變數，什麼時候用 Tailwind Class？

**A**:

- **CSS 變數**: 顏色、間距、字體等 **設計決策**
- **Tailwind Class**: 佈局、對齊、快速樣式 **實現細節**

```tsx
/* ✅ 混合使用 */
<div className="flex items-center gap-md px-6 py-4" style={{ color: 'var(--text-base)' }}>
  {/* Tailwind 處理佈局，CSS 變數處理顏色 */}
</div>
```

### Q3: 中文行高保護會影響所有中文內容嗎？

**A**: 不會，只影響使用 **Display 類標題**（`.font-display-hero`, `.font-container-title`, `.font-feature`）的元素。

Body 類文字（`.font-body-lg`, `.font-body-base`）本身行高已足夠（1.6-1.65），不需要額外保護。

### Q4: 如何決定使用哪個容器 Class？

**A**:

| 容器 Class | Max-Width (Desktop) | 用途 |
|-----------|---------------------|------|
| `.container-page` | `1920px` | 全屏區域（Hero, Carousel） |
| `.container-content-wide` | `1920px` (Desktop) / `1366px` (Laptop) | 寬版佈局（Feature 展示） |
| `.container-content` | `1440px` | 標準內容區塊 |
| `.container-narrow` | `880px` | 長文閱讀（文章、部落格） |

### Q5: 如何測試響應式斷點？

**A**: 在 Chrome DevTools 中測試關鍵寬度：

- **768px** - Tablet 起點
- **1024px** - Laptop 起點（筆電保護啟動）
- **1366px** - 常見筆電解析度
- **1600px** - Desktop 起點（寬版容器釋放）
- **1920px** - Full HD 桌面

---

## 貢獻指南

### 新增設計變數時，請遵循：

1. ✅ 確定變數屬於哪一層（Foundations / Semantics / Utilities）
2. ✅ 使用正確的命名規範
3. ✅ 在對應文件中定義（不要混入其他文件）
4. ✅ 更新本文件的相關章節

### Code Review Checklist

- [ ] 變數定義在正確的層級
- [ ] 變數名稱符合命名規範
- [ ] 沒有重複定義（與現有變數衝突）
- [ ] 有語義的地方使用 Semantic 變數，而非 Foundations
- [ ] 響應式設計優先使用 `clamp()`
- [ ] 新增變數已記錄在本文件

---

## 參考資源

- [Tailwind CSS Design System](https://tailwindcss.com/docs/customizing-colors)
- [Design Tokens W3C Spec](https://www.w3.org/community/design-tokens/)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Responsive Typography with clamp()](https://web.dev/min-max-clamp/)

---

**維護者**: isBIM Development Team
**最後更新**: 2025-12-11
**版本**: 2.0
