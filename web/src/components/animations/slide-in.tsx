/**
 * SlideIn Animation Wrapper Component
 *
 * 用途：
 * - 包裝子元素，提供方向性滑入動畫
 * - 基於Framer Motion實現
 * - 元素從指定方向滑入視口
 *
 * 動畫效果：
 * - 從左/右/上/下滑入
 * - 伴隨透明度變化（0 → 1）
 * - 可配置滑動距離、延遲和時長
 *
 * 使用場景：
 * - 側邊欄導航的展開
 * - 產品特性從左右交替滑入
 * - Modal對話框從底部滑入
 * - 移動端菜單從側邊滑入
 *
 * Props：
 * - children: ReactNode
 * - direction: "left" | "right" | "up" | "down" (滑入方向)
 * - delay?: number (延遲，秒，默認0)
 * - duration?: number (時長，秒，默認0.5)
 * - distance?: number (滑動距離，像素，默認100)
 * - once?: boolean (是否只觸發一次，默認true)
 * - className?: string
 *
 * 實現要點：
 * - 根據direction計算initial位置：
 *   - left: { x: -distance, opacity: 0 }
 *   - right: { x: distance, opacity: 0 }
 *   - up: { y: -distance, opacity: 0 }
 *   - down: { y: distance, opacity: 0 }
 * - animate: { x: 0, y: 0, opacity: 1 }
 * - transition: { delay, duration, ease: "easeInOut" }
 *
 * 示例用法：
 * <SlideIn direction="left" delay={0.3}>
 *   <FeatureBlock />
 * </SlideIn>
 */

"use client";

// TODO: 實現SlideIn組件
// TODO: 根據direction屬性計算initial動畫值
// TODO: 使用Framer Motion的motion.div
// TODO: 添加TypeScript類型（SlideInProps）
