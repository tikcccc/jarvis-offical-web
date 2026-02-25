Vibe Coding 技術棧：架構與協作流程

本文檔定義了 Vibe Coding 企業網站的「終極技術棧」及其協同工作流程。我們的目標是建立一個清晰、可擴展且高效的工作模式，讓 AI 助手能精確執行。

1. 核心技術棧 (The Stack)

以下是我們選定的技術組合，旨在實現 Palantir 等級的精緻度與效能：

分類

技術

核心職責

核心框架

Next.js (App Router)

處理路由、頁面結構、渲染 (SSR/SSG) 和 SEO 基礎。

SEO

Next.js Metadata API

集中管理每個頁面的 title, description 等元數據。

樣式

Tailwind CSS

提供原子級 CSS 類別，用於快速、一致的樣式開發。

UI 元件

Shadcn/ui

提供高品質、可組合的 UI 基礎元件（如按鈕、彈窗、表單）。

敘事動畫

GSAP + ScrollTrigger

負責大型、基於滾動的「敘事性」進場動畫和場景轉換。

UI 動畫

Framer Motion

負責元件級的「微互動」和狀態動畫（如點擊、懸停）。

滾動體驗

Lenis

提供全局的平滑滾動，這是 GSAP ScrollTrigger 流暢運作的關鍵。

全域狀態

Zustand

管理跨元件的輕量級全域狀態（例如彈窗的開啟/關閉）。

內容管理

Sanity (Headless CMS)

管理和提供動態內容（如部落格、服務項目）。

資料獲取

TanStack Query

管理 API 請求的生命週期（載入中、成功、錯誤、快取）。

表單管理

React Hook Form

高效處理複雜表單的狀態、驗證和提交。

資料驗證

Zod

定義表單資料的 schema，並與 React Hook Form 整合。

國際化

next-intl

（模擬）管理多語言內容，使文本易於替換和維護。

2. 技術啟動與協作流程 (The Flow)

這個流程描述了從基礎架構到使用者互動，各技術如何被「啟動」並「分工合作」。

Phase 1: 基礎架構啟動 (Foundation Setup)

Next.js 作為一切的基礎，定義 app 目錄結構。

Lenis 必須在根佈局 (layout.tsx) 中被初始化。這會建立一個全局的平滑滾動環境，它是所有滾動動畫的基礎。

Tailwind CSS 在專案初始化時配置完成，其 tailwind.config.js 定義了品牌的設計規範（如顏色、字體）。

Phase 2: 頁面建構 (Page Building)

Next.js Metadata API：在任何 page.tsx 的頂部，我們首先使用 generateMetadata 來定義該頁面的 SEO。

Shadcn/ui：開發者使用 npx shadcn-ui@latest add 指令，將需要的元件（如 Button, Dialog）「複製」到專案中，然後像堆疊樂高一樣組合出頁面結構。

next-intl (模擬)：所有靜態文本不被硬編碼。它們通過一個模擬的 useTranslations 鉤子 (hook) 來獲取，例如 t('heroTitle')。這確保了內容的集中管理和未來擴展性。

Phase 3: 體驗層（動畫）(Experience Layer)

GSAP + ScrollTrigger：主管「宏觀」。當頁面滾動時，ScrollTrigger 會被觸發，執行大型的敘事動畫（例如：Hero 標題的序列進場）。它依賴 Phase 1 中 Lenis 提供的平滑滾動事件。

Framer Motion：主管「微觀」。它包裹在互動元件上（如 Shadcn 按鈕）。當使用者懸停 (whileHover) 或點擊 (whileTap) 時，Framer Motion 會提供即時的、有彈性的視覺反饋。

協作：GSAP 負責「帶領」元件進場，Framer Motion 負責元件「進場後」的互動。

Phase 4: 互動性與狀態 (Interactivity & State)

觸發 (以「訂閱快訊」為例)：使用者點擊 Shadcn Button。

狀態管理 (Zustand)：按鈕的 onClick 事件觸發 useSubscriptionModal store 中的 open() action。

UI 響應 (Shadcn/ui)：一個 Shadcn Dialog 元件的 open 屬性「監聽」著 Zustand store 中的 isOpen 狀態。當 isOpen 變為 true 時，彈窗自動顯示。

Phase 5: 資料互動 (Data Interaction)

A. 內容獲取 (Content Fetching - e.g., Blog Posts)

資料來源 (Sanity)：內容在 Sanity Studio 中被建立和管理。

使用伺服器元件 (async/await client.fetch) 來獲取這些靜態內容

B. 複雜邏輯 (Form Submission - e.g., Newsletter)

表單結構 (React Hook Form)：在 Dialog 內部，使用 useForm 來初始化表單。

驗證 (Zod)：useForm 透過 zodResolver 載入一個 Zod schema，該 schema 定義了（例如）email 欄位的驗證規則。

UI 反饋 (Shadcn/ui)：Shadcn 的 Form 元件與 React Hook Form 綁定，自動處理並顯示 Zod 提供的錯誤訊息。

提交 (TanStack Query)：當表單驗證通過並提交時，onSubmit 函數會調用 useMutation。

useMutation 接管了所有 API 互動：它會自動將按鈕設為 disabled（因為 isPending 為 true），模擬 API 請求，並在 isSuccess 時更新 UI（例如顯示「感謝訂閱」）。