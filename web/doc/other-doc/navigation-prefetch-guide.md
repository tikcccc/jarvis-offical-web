# Navigation & Prefetch Strategy Guide

## 概述

本項目使用 Paraglide 的 `Link` 組件處理多語言導航，並提供增強的 `LocalizedLink` 組件實現智能預取策略，消除首次頁面跳轉延遲。

## 核心問題

### 為什麼首次點擊會有延遲？

當使用 `next/link` + `buildHref()` 時：
1. 客戶端先執行 `buildHref()` 生成多語言 URL
2. 點擊連結觸發導航
3. **Paraglide middleware 必須再次處理 URL**（檢測語言、重寫路徑）
4. 才開始載入頁面內容

這導致 **雙重處理** + middleware 開銷 = 明顯的首次導航延遲（約 200-500ms）。

### 解決方案

使用 Paraglide 提供的 `Link` 組件：
- 自動處理 locale 前綴
- 單次 URL 處理（無雙重解析）
- 內建智能預取機制
- 與 middleware 無縫整合

---

## 導航組件選擇指南

### 1. `Link` from `@/lib/i18n` （推薦用於大多數場景）

**適用場景：**
- 所有標準導航需求
- 需要自動語言前綴處理
- 希望使用 Next.js 默認預取行為

**使用方式：**
```tsx
import { Link } from "@/lib/i18n";
import { ROUTES } from "@/lib/constants";

// 基本使用
<Link href={ROUTES.HOME}>首頁</Link>

// 啟用預取（默認行為）
<Link href={ROUTES.ABOUT} prefetch>關於我們</Link>

// 禁用預取（較少使用）
<Link href={ROUTES.PRIVACY} prefetch={false}>隱私政策</Link>
```

**優點：**
- ✅ 自動語言前綴（`/en/about`, `/zh/about`）
- ✅ 與 Paraglide middleware 完美整合
- ✅ 零配置，開箱即用
- ✅ 輕量級，無額外邏輯

**限制：**
- 只支持 Next.js 默認的預取行為（viewport 預取）
- 無法自定義預取時機

---

### 2. `LocalizedLink` from `@/components/ui/localized-link` （進階場景）

**適用場景：**
- 重要的 CTA 按鈕（需要最快響應）
- 長頁面中的 footer/sidebar 連結（viewport 預取）
- 低優先級連結（idle 預取）
- 需要精細控制預取時機

**預取模式說明：**

| 模式 | 觸發時機 | 適用場景 | 性能影響 |
|------|---------|---------|---------|
| `"auto"` | viewport 進入 | 默認行為 | 中等 |
| `"hover"` | 鼠標懸停/聚焦 | CTA、主導航 | 最快感知速度 |
| `"viewport"` | 連結進入視口 | Footer、側邊欄 | 中等 |
| `"idle"` | 瀏覽器空閒時 | 隱私政策等低優先級 | 最低 |
| `"off"` | 不預取 | 外部連結、低頻頁面 | 無 |

**使用範例：**

```tsx
import { LocalizedLink } from "@/components/ui/localized-link";
import { ROUTES } from "@/lib/constants";

// 1. Hover 預取 - 重要 CTA（推薦）
<LocalizedLink href={ROUTES.CONTACT} prefetchMode="hover">
  聯繫我們
</LocalizedLink>

// 2. Viewport 預取 - Footer 連結
<LocalizedLink href={ROUTES.ABOUT} prefetchMode="viewport">
  關於
</LocalizedLink>

// 3. Idle 預取 - 低優先級
<LocalizedLink href={ROUTES.PRIVACY} prefetchMode="idle">
  隱私政策
</LocalizedLink>

// 4. Auto 模式 - 默認行為
<LocalizedLink href={ROUTES.HOME}>
  首頁
</LocalizedLink>

// 5. 關閉預取 - 外部連結
<LocalizedLink href="/api/download" prefetchMode="off">
  下載
</LocalizedLink>
```

**優點：**
- ✅ 四種智能預取策略
- ✅ Hover 模式可提供 200-500ms 提前加載
- ✅ Viewport 模式優化長頁面體驗
- ✅ Idle 模式利用空閒時間，不阻塞主線程
- ✅ 完全向後兼容，默認行為與 `Link` 相同

**技術實現：**
- **Hover 模式**：`onMouseEnter` + `onFocus` 事件
- **Viewport 模式**：`IntersectionObserver` (rootMargin: 50px)
- **Idle 模式**：`requestIdleCallback` (fallback: setTimeout 2s)
- **防重複預取**：`useRef` 追蹤狀態

---

## 實際應用建議

### Topbar（頂部導航欄）
```tsx
// Logo - hover 預取
<LocalizedLink href={ROUTES.HOME} prefetchMode="hover">
  <Image src="/logo.svg" alt="Logo" />
</LocalizedLink>

// Get Started 按鈕 - hover 預取
<LocalizedLink href={ROUTES.CONTACT} prefetchMode="hover">
  開始使用
</LocalizedLink>
```

### Menu Overlay（菜單覆蓋層）
```tsx
// 主導航項 - hover 預取
<LocalizedLink href={ROUTES.SERVICES} prefetchMode="hover">
  服務
</LocalizedLink>

// 次級導航 - viewport 預取
<LocalizedLink href={ROUTES.JARVIS.AGENT} prefetchMode="viewport">
  JARVIS Agent
</LocalizedLink>
```

### Footer（頁腳）
```tsx
// 產品連結 - viewport 預取
<LocalizedLink href={ROUTES.JARVIS.PAY} prefetchMode="viewport">
  JARVIS Pay
</LocalizedLink>

// 法律連結 - idle 預取
<LocalizedLink href="/privacy" prefetchMode="idle">
  隱私政策
</LocalizedLink>
```

### Hero Section CTA
```tsx
// 主要行動召喚 - hover 預取
<LocalizedLink
  href={ROUTES.CONTACT}
  prefetchMode="hover"
  className="cta-button"
>
  立即開始
</LocalizedLink>
```

---

## 性能優化最佳實踐

### 1. 按重要性分層預取

**關鍵路徑（Hover）**
- 主導航連結
- CTA 按鈕
- Logo

**次要路徑（Viewport）**
- Footer 連結
- 側邊欄導航
- 產品卡片連結

**低優先級（Idle）**
- 法律頁面（Terms, Privacy）
- 幫助文檔
- 舊版頁面

### 2. 避免過度預取

❌ **錯誤做法：**
```tsx
// 所有連結都用 hover 模式
<LocalizedLink href={ROUTES.PRIVACY} prefetchMode="hover">
  隱私政策
</LocalizedLink>
```

✅ **正確做法：**
```tsx
// 低優先級用 idle 模式
<LocalizedLink href={ROUTES.PRIVACY} prefetchMode="idle">
  隱私政策
</LocalizedLink>
```

### 3. 移動端優化

在移動設備上，hover 模式無效（無鼠標），自動降級為 focus 事件：
```tsx
// 移動端會在觸摸聚焦時預取
<LocalizedLink href={ROUTES.CONTACT} prefetchMode="hover">
  聯繫我們
</LocalizedLink>
```

### 4. 監控網絡質量

`LocalizedLink` 內部已處理預取失敗（silent fail），無需額外邏輯：
```tsx
// 預取失敗不會影響導航，只是少了預加載優化
<LocalizedLink href={ROUTES.ABOUT} prefetchMode="hover">
  關於
</LocalizedLink>
```

---

## 遷移指南

### 從 `next/link` + `buildHref()` 遷移

**舊代碼：**
```tsx
import Link from "next/link";
import { useLocalizedHref } from "@/lib/i18n";

function MyComponent() {
  const { buildHref } = useLocalizedHref();

  return (
    <Link href={buildHref(ROUTES.HOME)}>
      首頁
    </Link>
  );
}
```

**新代碼（方案 1 - 簡單）：**
```tsx
import { Link } from "@/lib/i18n";

function MyComponent() {
  return (
    <Link href={ROUTES.HOME} prefetch>
      首頁
    </Link>
  );
}
```

**新代碼（方案 2 - 進階）：**
```tsx
import { LocalizedLink } from "@/components/ui/localized-link";

function MyComponent() {
  return (
    <LocalizedLink href={ROUTES.HOME} prefetchMode="hover">
      首頁
    </LocalizedLink>
  );
}
```

**性能提升：**
- ❌ 舊方案：雙重 URL 處理 + middleware 開銷 = ~300-500ms 延遲
- ✅ 新方案（Link）：單次處理 + 自動預取 = ~100ms 延遲
- ✅ 新方案（LocalizedLink hover）：提前預取 = **幾乎零延遲**

---

## 技術細節

### Paraglide Link 工作原理

```tsx
// 內部實現（簡化版）
function Link({ href, prefetch, children }) {
  const locale = useLocale();

  // 自動添加 locale 前綴
  const localizedHref = `/${locale}${href}`;

  return (
    <NextLink
      href={localizedHref}
      prefetch={prefetch}
    >
      {children}
    </NextLink>
  );
}
```

### LocalizedLink 預取機制

```tsx
// Hover 模式實現
const handleMouseEnter = () => {
  if (!hasPrefetched.current) {
    router.prefetch(href); // 手動觸發預取
    hasPrefetched.current = true;
  }
};

// Viewport 模式實現
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      router.prefetch(href);
      observer.disconnect();
    }
  }, { rootMargin: "50px" });

  observer.observe(linkRef.current);
}, []);
```

---

## 常見問題

### Q: 為什麼不能直接用 `next/link`？

**A:** `next/link` 不知道如何處理 Paraglide 的語言前綴，會導致：
- 雙重 URL 處理
- Middleware 額外開銷
- 首次導航延遲

### Q: `prefetch` 屬性會增加初始載入時間嗎？

**A:** 不會。預取是異步的，且只在以下情況發生：
- Hover 模式：用戶懸停時
- Viewport 模式：連結進入視口時
- Idle 模式：瀏覽器空閒時
- Auto 模式：Next.js 自動判斷

### Q: 所有連結都應該用 `prefetchMode="hover"` 嗎？

**A:** 不應該。遵循分層策略：
- 重要 CTA → `hover`
- 次要導航 → `viewport`
- 低優先級 → `idle`

### Q: 移動端 hover 模式有效嗎？

**A:** 部分有效。觸摸設備會在 `focus` 事件時預取，仍能提供一定優化。

---

## 總結

### 使用 `Link` 當：
- ✅ 標準導航需求
- ✅ 想要簡單、零配置的解決方案
- ✅ Next.js 默認預取行為已足夠

### 使用 `LocalizedLink` 當：
- ✅ 需要最快的感知速度（CTA 按鈕）
- ✅ 希望優化長頁面體驗（footer）
- ✅ 需要精細控制預取時機
- ✅ 想利用空閒時間預加載

### 絕對不要：
- ❌ 使用 `next/link` + `buildHref()`
- ❌ 手動拼接 `/${locale}${path}`
- ❌ 所有連結都用 `hover` 模式
- ❌ 忽略預取策略（會影響用戶體驗）
