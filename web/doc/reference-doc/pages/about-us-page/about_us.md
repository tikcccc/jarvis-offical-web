Role: Vibe Coding 資深前端架構師 (Senior Frontend Architect)

1. 任務目標 (Objective)

開發一個具備「Palantir 風格」的高質感、敘事型企業「About Us」頁面。該頁面需展現 isBIM 作為基礎設施 AI 領導者的品牌形象，結合極簡主義 (Minimalism)、精密排版 (Precision Typography) 與 電影感互動 (Cinematic Interactions)。

2. 核心技術棧 (The Stack)

必須嚴格遵循 Vibe Coding 終極技術棧：

Framework: Next.js (App Router)

Styling: Tailwind CSS (專注於 neutral 色系與 grid 佈局)

Animation: GSAP (Core + ScrollTrigger)

Smooth Scroll: Lenis

State Management: Zustand (用於管理導航狀態與章節聯動)

Utils: cn (clsx + tailwind-merge)

3. 設計視覺規範 (Visual Specifications)

主題: Light Mode / Clean Tech。

色調: 背景 bg-neutral-50，文字 text-neutral-900 (主標) / text-neutral-600 (內文)，強調色 text-blue-600 (isBIM Blue)。

排版 (Typography):

標題採用「Ghost Title」疊加技術（底層透明描邊或隱藏，上層實色裁切）。

強調左側大標題 (Title) 與右側副標題 (Subtitle) 的頂部對齊 (Top Alignment)。

紋理: 背景需疊加低透明度的 noise.svg 與 mix-blend-multiply，增加紙質/底片質感。

4. 組件架構詳解 (Component Architecture)

A. 基礎設施 (Infrastructure)

useNavStore: 使用 Zustand 創建 store，存儲 activeSection (number)。

useExternalScripts: (若無 npm 環境) 負責動態加載 GSAP 與 Lenis CDN。

B. 導航組件 (StickyNav)

位置: 固定於左下角 (fixed bottom-10 left-10)。

行為:

顯示 01, 02, 03 索引。

當 activeSection 改變時，當前數字需執行 "Hard Glitch" (硬故障) 動畫：

使用 GSAP steps(1)。

序列：瞬間變藍/位移 -> 瞬間變黑/復位 -> 瞬間變藍/縮放 -> 恢復。

非當前章節文字透明度降低，標題隱藏。

C. 視覺組件 (RevealTitle & TechDivider)

RevealTitle: 取代普通的 h2/h3。

效果: 文字單詞 (Words) 初始狀態為 blur(10px), y: 20, opacity: 0。

觸發: 當進入視窗 85% 處時，使用 stagger 逐詞清晰浮現 (Cinematic Blur Reveal)。

互動: Hover 時平滑過渡為藍色。

TechDivider: 自定義分隔線。

樣式: 極細灰線，上方疊加一個漸變光流 (Gradient Flow)。

互動: Hover 時光流透明度提高。

D. 核心區塊 (Section)

佈局: min-h-screen，使用 CSS Grid (grid-cols-1 lg:grid-cols-2)。

Header區域:

左側: Index (01/03) + 巨大標題 (Title)。標題需包含一個絕對定位的「藍色光標 (Cursor)」。

右側: 精選副標題 (Subtitle)。需有左側藍色邊框 (border-l-2)，且必須與左側大標題的字體頂部對齊 (修正 mb 與 pt 確保視覺平衡)。

Content區域:

對於 "What We Do" 章節，使用 FeatureRow 子組件進行垂直堆疊佈局。

每個 FeatureRow 包含左側標題 (使用 RevealTitle) 與右側內容 + ArrowLink (帶有底部滑動線條的按鈕)。

5. 動畫邏輯 (Animation Logic)

Lenis 初始化: 在 Root 層級啟動平滑滾動，並將其 raf 與 GSAP ticker 同步。

ScrollTrigger 綁定:

每個 Section 監聽 start: "top 55%"。

當觸發時，更新 Zustand 的 setActiveSection。

標題進場:

標題容器寬度從 0% -> 100% (steps easing)。

藍色光標 left 從 0% -> 100% (同步 steps easing)。

光標需持續閃爍 (opacity yoyo)。

6. 內容結構 (Content Map)

Section 01: "Why We’re Here"

副標: "isBIM is accelerating the global infrastructure build-out..."

圖片: 建築/結構工程風格圖。

Section 02: "What We Do"

佈局: 4個垂直排列的 FeatureRow。

內容: Verticalized AI copilot, Nation-scale partnerships, Strategic capital, Resilient infrastructure.

Section 03: "Where We Are Going"

副標: "We are building a future where every infrastructure project is AI-native..."

結尾: Full-screen Footer / Call-to-Action 區塊。

執行指令:
請根據以上架構，生成完整的 React (.tsx) 代碼。確保代碼是響應式的 (Mobile/Desktop)，並優化 GSAP 的內存管理 (使用 gsap.context 或在 useEffect 中正確清除)。