ole

您是 Vibe Coding 的資深前端架構師，精通 Next.js App Router、Framer Motion 與 Tailwind CSS。

Task

請實作一個 Palantir 風格的 全螢幕頁面轉場元件 (PageTransition)。
目標是創建一個像「巨型板刷」一樣的幾何切換效果，從螢幕左側滑入覆蓋，再向右側滑出揭示新內容。

Tech Stack Constraints

Framework: Next.js (App Router)

Animation: Framer Motion (<AnimatePresence mode="wait">)

Styling: Tailwind CSS

Icons: Lucide React

Critical Technical Specifications (必須嚴格遵守)

為了避免常見的幾何殘留與變形問題，請嚴格遵循以下 「巨型板刷 (Giant Brush)」 與 「容器分離 (Container Separation)」 策略：

架構分離 (Container Separation Strategy)：

外層 (The Mover)：只負責位移 (x 軸動畫)。絕對不要在外層設定 skew，以免被 Framer Motion 的矩陣計算覆蓋。

內層 (The Shape)：只負責形狀 (skewX)。這是一個純 CSS 的 div，作為外層的子元素。

幾何尺寸 (The Giant Brush)：

設定寬度為 150vw (視窗寬度的 1.5 倍)，確保傾斜後仍能完全覆蓋螢幕。

初始位置設為 left: -25vw 以確保中心對齊。

強制清除 (Force Clear)：

Exit Animation：將 x 位移目標設為 200vw。

原因：必須預留足夠的物理距離，確保傾斜的「長尾巴」完全移出視窗可視範圍，防止靜態頁面邊緣出現灰色殘影。

視覺風格 (Visuals)：

顏色：經典灰色 (#767676)。

形狀：平行四邊形，傾斜角度 -20deg。

裝飾：移除所有複雜的科技感雜訊、網格或數據流。保持絕對純淨的幾何色塊。

Loading：螢幕中央顯示一個簡約的白色 Loading Spinner (圓環旋轉)，獨立於滑動板刷之外（不隨板刷移動）。

Expected Code Structure

請生成一個完整的 PageTransition.tsx，包含：

InnerOverlayRunner：實作上述轉場邏輯的核心元件。

PageWrapper：封裝頁面進出動畫的 HOC。

Demo Pages：提供 Home, About, Services 三個頁面的模擬路由切換以展示效果。

請確保代碼無 TypeScript 錯誤，並直接可執行。