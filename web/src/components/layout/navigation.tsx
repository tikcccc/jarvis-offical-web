/**
 * Navigation Component
 *
 * 用途：
 * - 主導航菜單組件
 * - 包含多級下拉菜單（Dropdown Menu）
 * - 從navigation.ts讀取菜單結構
 *
 * 功能需求：
 * 1. 桌面端導航
 *    - 水平排列的菜單項
 *    - 鼠標懸停顯示下拉菜單
 *    - "Services and AI Products"展開顯示所有JARVIS產品
 *    - 使用Shadcn的DropdownMenu組件
 *
 * 2. 移動端導航
 *    - 全屏或側邊欄漢堡菜單
 *    - 可折疊的二級菜單（Accordion樣式）
 *    - 從右側或左側滑入
 *    - 使用Framer Motion實現動畫
 *
 * 3. 當前頁面高亮
 *    - 使用usePathname獲取當前路徑
 *    - 匹配當前路由的菜單項高亮顯示
 *    - 父級菜單也高亮（如果子頁面被激活）
 *
 * 4. 語言支持
 *    - 菜單label使用Paraglide messages
 *    - 支持中英文切換
 *
 * 5. 動畫效果
 *    - 下拉菜單淡入動畫
 *    - 移動端菜單滑入動畫
 *    - 懸停時的微動畫（scale, underline等）
 *
 * Props：
 * - variant?: "desktop" | "mobile"
 * - onItemClick?: () => void (移動端點擊菜單項後關閉)
 * - className?: string
 *
 * 數據來源：
 * - 從@/data/navigation導入navigationMenu
 *
 * 使用場景：
 * - 在Header組件中引用
 * - 根據屏幕尺寸渲染桌面或移動版本
 */

"use client";

// TODO: 實現Navigation組件
// TODO: 導入navigationMenu數據
// TODO: 使用Shadcn DropdownMenu實現桌面端下拉
// TODO: 使用Framer Motion實現移動端側邊欄
// TODO: 添加當前路由高亮邏輯
