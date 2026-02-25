/**
 * ParallaxSection Component
 *
 * 用途：
 * - 視差滾動效果包裝器
 * - 元素滾動速度與頁面不同，形成深度感
 * - 基於GSAP ScrollTrigger實現
 *
 * 視差效果：
 * - 背景圖片或元素以不同速度滾動
 * - 創造3D深度錯覺
 * - speed參數控制滾動倍率（0-2）
 *   - speed < 1: 比頁面慢（背景層）
 *   - speed > 1: 比頁面快（前景層）
 *
 * 使用場景：
 * - Hero section的背景圖片視差
 * - 產品展示的多層疊加效果
 * - 長頁面的背景裝飾元素
 * - 創建Palantir風格的深度視覺
 *
 * Props：
 * - children: ReactNode
 * - speed?: number (滾動速度倍率，默認0.5，範圍0-2)
 *   - 0: 完全固定
 *   - 0.5: 慢速滾動（常用於背景）
 *   - 1: 與頁面同步（無視差）
 *   - 1.5-2: 快速滾動（前景）
 * - className?: string
 *
 * 實現要點：
 * - 使用GSAP ScrollTrigger
 * - 使用useRef獲取元素引用
 * - useEffect中初始化ScrollTrigger：
 *   gsap.to(ref.current, {
 *     y: (1 - speed) * scrollProgress,
 *     scrollTrigger: { trigger, scrub: true }
 *   })
 * - 組件卸載時清理ScrollTrigger.kill()
 * - 注意：需要Lenis已初始化
 *
 * 示例用法：
 * <ParallaxSection speed={0.3}>
 *   <BackgroundImage />
 * </ParallaxSection>
 */

"use client";

// TODO: 實現ParallaxSection組件
// TODO: 使用GSAP ScrollTrigger實現視差
// TODO: 添加cleanup邏輯（unmount時kill ScrollTrigger）
// TODO: 考慮移動端性能（可選擇性禁用視差）
