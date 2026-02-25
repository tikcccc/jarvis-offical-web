Vibe Coding 專案啟動指南 (Project Bootstrap Guide)

本指南列出了從 0 開始建立一個新專案，並安裝 tech_stack_architecture_flow.md 藍圖中定義的所有「核心技術棧」所需的命令。

步驟 1: 建立 Next.js 專案 (內建 Tailwind CSS)

這是我們的核心框架和樣式基礎。

# 1. 建立一個新的 Next.js 專案
#    - 我們將使用 TypeScript, Tailwind CSS, 和 ESLint
npx create-next-app@latest vibe-coding-project --typescript --tailwind --eslint

# 2. 進入專案目錄
cd vibe-coding-project


步驟 2: 初始化 Shadcn/ui (UI 元件)

這將設定 shadcn/ui，讓您能夠輕鬆地加入元件。

# 3. 執行 shadcn/ui 初始化命令
npx shadcn-ui@latest init


注意： 執行此命令時，它會向您詢問一系列問題。

請確認 tailwind.config.js 的路徑正確 (通常是 tailwind.config.ts)。

選擇您想要的 components.json 樣式（Default 或 New York）。

選擇您希望的 utils 和 components 資料夾別名（例如 @/lib/utils 和 @/components）。

步驟 3: 安裝「體驗層」套件

這包括了動畫、平滑滾動和全域狀態管理。

# 4. 安裝 GSAP (敘事動畫)
#    - @studio-freight/lenis (平滑滾動, GSAP 的好夥伴)
#    - framer-motion (UI 微互動)
#    - zustand (全域狀態)
npm install gsap @studio-freight/lenis framer-motion zustand


步驟 4: 安裝「資料互動」套件 (表單)

這包括了表單管理和資料驗證。

# 5. 安裝 React Hook Form (表單管理)
#    - zod (資料驗證)
#    - @hookform/resolvers (用於將 Zod 與 React Hook Form 連結)
npm install react-hook-form zod @hookform/resolvers


步驟 5: 安裝「資料互動」套件 (內容)

這包括了內容獲取 (Sanity) 和 API 狀態管理 (TanStack Query)。

# 6. 安裝 TanStack Query (資料獲取)
npm install @tanstack/react-query

# 7. 安裝 Sanity 客戶端 (Headless CMS)
#    - next-sanity: Next.js 整合工具
#    - @sanity/client: 核心 JS 客戶端
#    - @sanity/vision: 用於在 Next.js 中預覽草稿的工具 (可選但推薦)
npm install next-sanity @sanity/client @sanity/vision

Initialize your project with the CLI
Run this command in your Terminal to continue setting up your project.
npm create sanity@latest -- --template sanity-io/sanity-template-nextjs-clean --project 4y8vgu6z --dataset production

tokens:skX9FTYAa0LoDRsERHRF5JYhDCM82YCZTPaBKcCXvONyG4QjnBlRFJz031bYBJhTyQZbbt3Wj1yUsSp1nVYqWA2jZ5QetLHft6gtfQKfjs4sO8M7fy8fimRw37jaTwbkVtVCzQHvtqmkWfSMvJrA5WvcPm7nuk63d0rmftHuxoixMcoQe24v

token name:isbim

CORS origins
Hosts that can connect to the project API. http://localhost:3333

Project ID
4y8vgu6z

步驟 6: 安裝國際化 (i18n)

# 8. 安裝 next-intl
npm install next-intl


步驟 7: 啟動開發伺服器

# 9. 執行開發伺服器
npm run dev


總結

完成以上步驟後，您的專案已經安裝了所有必要的依賴項。

下一步是開始設定這些工具（例如：在 layout.tsx 中設定 Lenis、設定 next-intl 的 middleware 等），這部分應嚴格遵循 tech_stack_architecture_flow.md 文件中的「Phase 1: 基礎架構啟動」流程。