1. 實作目標 (Implementation Objective)
構建一個高科技感、Palantir 風格的「全螢幕沉浸式導航覆蓋層 (Menu Overlay)」。該元件需結合敘事性動畫 (Narrative Animation) 與 響應式 UI 狀態 (Reactive UI State)，在保持極致效能的同時，提供深度的資訊層次感。

2. 核心技術棧與職責 (Tech Stack & Responsibilities)
狀態管理 (State Management) - Zustand

實作：建立 useMenuStore，包含 isOpen (布林值) 與 activePreview (字串)。

解決方案：解決了傳統 Props Drilling 問題，實現了 Header (觸發按鈕) 與 Overlay (顯示層) 之間的狀態解耦，並支援多層級菜單的 hover 狀態共享。

混合動畫引擎 (Hybrid Animation Engine)

GSAP (GreenSock) - 敘事層：

實作：封裝 TypewriterText 元件。

解決方案：負責處理「小字體數據」、「狀態標籤」的打字機進場效果。這創造了一種「系統正在即時運算與載入數據」的科技敘事感 (Tech Narrative)。

Framer Motion - UI 互動層：

實作：使用 AnimatePresence 包裹 Overlay，並利用 staggerChildren 技術。

解決方案：負責大型區塊的物理運動（滑入/滑出）以及列表項目的 Staggered Fade Up (交錯上浮)。確保 UI 元素的出現具有節奏感與流暢性，而非生硬的切換。

樣式與佈局 (Styling & Layout) - Tailwind CSS

實作：採用 Grid 系統 (12 Columns)，左側 (5 Cols) 為導航樹，右側 (7 Cols) 為動態內容區。

解決方案：

視覺平衡：加大了左側導航字體 (text-4xl) 與間距，解決了畫面空洞的問題。

無干擾滾動：使用 [&::-webkit-scrollbar]:hidden 隱藏了側欄滾動條，保留滾動功能但移除了視覺噪音，維持介面的純淨度。

3. 關鍵解決方案亮點 (Key Solution Highlights)
動態內容預覽 (Dynamic Content Projection)：

當使用者 Hover 在特定父級菜單（如 "JARVIS AI Suite"）時，右側面板會即時切換 (AnimatePresence mode='wait') 顯示對應的產品子列表。若無 Hover，則顯示默認的 Newsroom 資訊。這創造了一種「即時預覽」的高效瀏覽體驗。

雙層次動畫策略 (Dual-Layer Animation Strategy)：

嚴格區分「裝飾性動畫 (GSAP)」與「結構性動畫 (Framer Motion)」。文字標籤像終端機一樣逐字打出，而核心內容則像現代 App 一樣優雅上浮。這種對比強化了 Vibe Coding 的標誌性美學。

巢狀導航結構 (Nested Navigation Logic)：

資料結構支援 type: 'group'，允許遞歸渲染子選單。配合 Lucide Icons (CornerDownRight) 提供清晰的視覺層級指引。