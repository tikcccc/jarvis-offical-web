# Role
您是 Vibe Coding 的資深技術架構師。請嚴格遵循「終極技術棧 (The Stack)」與「協作流程 (The Flow)」文檔，構建一個企業級的 Call-to-Action (CTA) 區塊。

# Design & Aesthetics
- **視覺參考**：Palantir 企業官網。
- **核心風格**：極簡主義、冷峻的排版、精確的留白、高質感的互動。
- **佈局**：響應式雙欄佈局。左側為全高或 4:3 比例的情境圖片，右側為標題與行動呼籲。

# Technical Stack (Strict Enforcement)
- **Core**: Next.js (App Router).
- **Styling**: Tailwind CSS.
- **UI Components**: Shadcn/ui (`Button`).
- **Icons**: Lucide React.
- **Macro Animation**: GSAP + ScrollTrigger (負責敘事性進場)。
- **Micro Animation**: Framer Motion (負責元件互動)。

# Implementation Steps (The Flow)

## Phase 2: Page Building (Structure)
1.  創建 `CTASection.tsx` (或 jsx)。
2.  使用 Tailwind CSS 構建 `grid grid-cols-1 md:grid-cols-2` 佈局。
3.  **關鍵 Ref 設定**：因為要使用 GSAP 控制 DOM，請為 `container`、`image` 和 `textWrapper` 創建 `useRef`。
4.  **內容**：
    - 圖片：使用高質感的 Unsplash 圖片 (商業/科技類)。
    - 文字：標題 "There is so much left to build" (參考 Palantir)，副標題為簡短的使命宣言。
    - 按鈕：Shadcn Button (Outline variant)，帶有箭頭圖標。

## Phase 3: Experience Layer (The Hybrid Engine)
這是 Vibe Coding 的核心簽名風格，請嚴格執行「分工」：

**1. Macro Animation (GSAP + ScrollTrigger)**
- **職責**：當使用者滾動到此區塊時，執行「敘事性進場」。
- **實作細節**：
  - 使用 `useLayoutEffect` (或 `useEffect`) 配合 `gsap.context` 進行範圍管理 (Cleanup is mandatory)。
  - 建立一個 `gsap.timeline`，綁定 `scrollTrigger`。
  - **Trigger 設定**：`start: "top 75%"` (當區塊頂部到達視口 75% 處觸發)。
  - **動畫序列**：
    - **Step A**: 左側圖片從左方滑入並淡入 (`x: -80, opacity: 0` -> `x: 0, opacity: 1`)，使用 `power3.out` 緩動，持續 1.2秒。
    - **Step B**: 右側文字內容 (標題、副標題、按鈕) 依序上浮 (`y: 40, opacity: 0` -> `y: 0`)。
    - **關鍵時機**：使用 `-=0.8` 的 offset，讓文字動畫在圖片動畫結束前就開始 (Overlap)，創造流暢的敘事感。

**2. Micro Interaction (Framer Motion)**
- **職責**：負責按鈕的觸覺反饋。
- **實作細節**：
  - 使用 `motion.div` 包裹 Shadcn Button。
  - 設定 `whileHover={{ scale: 1.05 }}` (懸停輕微放大)。
  - 設定 `whileTap={{ scale: 0.95 }}` (點擊輕微縮小)。
  - **注意**：Framer Motion **不**負責進場動畫，只負責互動。

# Constraints & Best Practices
- 必須是單一文件組件 (Single File Component)，但內部邏輯需清晰分離。
- 確保在 `useEffect/useLayoutEffect` 的 return 函數中執行 `ctx.revert()` 以清理 GSAP 實例。
- 圖片需加上一層半透明的 Gradient Overlay 以增加文字可讀性或氛圍。