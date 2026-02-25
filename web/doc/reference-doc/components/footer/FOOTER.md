# Footer Component

## 概述

通用 Footer 組件，用於整個網站的底部區域。基於原參考設計，並已針對 isBIM 網站的視覺效果進行優化調整。

## 功能特點

- **響應式佈局**：支持桌面、平板、手機等多種設備尺寸
- **四列式結構**：
  1. 品牌標識與社交媒體
  2. AI 平台產品鏈接
  3. 公司信息鏈接
  4. Newsletter 訂閱表單
- **表單驗證**：使用 Zod + React Hook Form 進行電子郵件驗證
- **微互動**：Framer Motion 提供流暢的 hover 效果
- **深淺色主題**：自動適配網站的主題系統
- **Alliance 字體**：使用 Alliance No.1 和 Alliance No.2 字體保持品牌一致性

## 使用方式

Footer 已在 `src/app/[locale]/layout.tsx` 中全局引用：

```tsx
import { Footer } from "@/components/layout/footer";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Topbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

## 設計調整

相比參考設計 (`footer_component.html`)，已做以下優化調整：

### 字體大小
- Logo 文字：`text-2xl` → `text-xl` (更精緻)
- Logo 圖標：`h-9 w-9` → `h-8 w-8`
- 描述文字：保持 `text-sm`
- 標題：保持 `text-xs` (小型大寫)
- 連結文字：保持 `text-sm`
- 版權文字：保持 `text-xs`

### 間距與佈局
- 整體 padding：`py-16 lg:py-24` → `py-12 lg:py-20` (更緊湊)
- 列間距：`gap-12 lg:gap-16` → `gap-10 lg:gap-12`
- 內部間距：`space-y-6` → `space-y-5`
- 連結間距：`space-y-3` → `space-y-2.5`
- 分隔線間距：`my-12` → `my-10`
- 底部間距：`space-y-4` → `space-y-3`

### 微互動
- Hover 移動距離：`x: 4` → `x: 3` (更細膩)
- 添加 `damping: 20` 使動畫更平滑

### 顏色與對比
- 使用 Tailwind CSS 的設計令牌（design tokens）
- 適配淺色/深色主題
- 保持良好的可訪問性對比度

### 表單
- Input 高度：`h-10` → `h-9` (更符合整體比例)
- Button 尺寸：保持 `h-9 w-9`
- 反饋訊息：`y: 10` → `y: 8` (更平滑的動畫)

## 依賴項

- `@radix-ui/react-separator`: 分隔線組件
- `react-hook-form`: 表單處理
- `@hookform/resolvers`: Zod resolver
- `zod`: 表單驗證
- `framer-motion`: 動畫效果
- `lucide-react`: 圖標庫

## 自定義配置

### 修改連結

在 `footer.tsx` 中修改連結數組：

```tsx
const productLinks = [
  { name: "JARVIS Agent", href: "/products/agent" },
  // 添加更多產品...
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  // 添加更多公司信息...
];
```

### 修改社交媒體

```tsx
const socialIcons = [
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/..." },
  // 添加或修改社交平台...
];
```

### 訂閱表單處理

目前使用模擬 API 請求。在生產環境中，修改 `onSubmit` 函數：

```tsx
const onSubmit = async (data: SubscriptionFormValues) => {
  // 替換為實際的 API 請求
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  // ...
};
```

## 樣式類

組件使用以下自定義 CSS 類（定義在 `globals.css`）：

- `.footer-brand-text`: 品牌文字字體 (Alliance No.2)
- `.footer-alliance-font`: 一般文字字體 (Alliance No.1)

## 可訪問性

- 所有社交媒體按鈕包含 `aria-label`
- 表單輸入包含適當的 `type` 和 `placeholder`
- 錯誤訊息清晰可見
- 鍵盤導航友好

## 維護注意事項

1. 更新連結時確保路徑正確
2. 社交媒體 URL 應指向實際的企業賬號
3. 定期檢查表單驗證邏輯
4. 保持與設計系統的一致性
