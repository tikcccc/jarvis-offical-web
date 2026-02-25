"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./hero-section.module.css";
import { useTransitionComplete } from "@/components/layout/page-transition";

/**
 * 字母動畫配置
 * type: "instant" = 穩定錨點（瞬間出現，不閃爍）
 * type: "glitch" = 故障補全（延遲閃爍進場）
 */
interface CharConfig {
  char: string;
  type: "instant" | "glitch";
  delay?: 50 | 100 | 150 | 200 | 250 | 300 | 350;
}

/**
 * 預設產品名稱動畫配置
 * 根據 Cyberpunk/HUD 風格規則：
 * - 3 個字母：1 個穩定錨點
 * - 4 個字母：2 個穩定錨點（首尾）
 * - 5+ 個字母：2-3 個穩定錨點
 */
const PRODUCT_ANIMATIONS: Record<string, CharConfig[]> = {
  // EAGLE EYE (9字 -> 3個穩定: E, G, Y) - 延遲加長，節奏更穩
  "EAGLE EYE": [
    { char: "E", type: "instant" },
    { char: "A", type: "glitch", delay: 200 },
    { char: "G", type: "instant" },
    { char: "L", type: "glitch", delay: 300 },
    { char: "E", type: "glitch", delay: 100 },
    { char: " ", type: "instant" }, // 空格
    { char: "E", type: "glitch", delay: 350 },
    { char: "Y", type: "instant" },
    { char: "E", type: "glitch", delay: 250 },
  ],

  // AGENT (5字 -> 2個穩定: A, T - 首尾呼應) - 節奏調整
  AGENT: [
    { char: "A", type: "instant" },
    { char: "G", type: "glitch", delay: 250 },
    { char: "E", type: "glitch", delay: 150 },
    { char: "N", type: "glitch", delay: 300 },
    { char: "T", type: "instant" },
  ],

  // PAY (3字 -> 1個穩定: A) - 節奏調整
  PAY: [
    { char: "P", type: "glitch", delay: 200 },
    { char: "A", type: "instant" },
    { char: "Y", type: "glitch", delay: 300 },
  ],

  // AIR (3字 -> 1個穩定: A) - 延遲加長，節奏更穩
  AIR: [
    { char: "A", type: "instant" },
    { char: "I", type: "glitch", delay: 200 },
    { char: "R", type: "glitch", delay: 300 },
  ],

  // SSSS (4字 -> 2個穩定: S_S_) - 節奏調整
  SSSS: [
    { char: "S", type: "instant" },
    { char: "S", type: "glitch", delay: 250 },
    { char: "S", type: "instant" },
    { char: "S", type: "glitch", delay: 150 },
  ],

  // DWSS (4字 -> 2個穩定: D__S - 首尾呼應) - 節奏調整
  DWSS: [
    { char: "D", type: "instant" },
    { char: "W", type: "glitch", delay: 300 },
    { char: "S", type: "glitch", delay: 200 },
    { char: "S", type: "instant" },
  ],

  // CDCP (4字 -> 2個穩定: C__P - 首尾呼應) - 節奏調整
  CDCP: [
    { char: "C", type: "instant" },
    { char: "D", type: "glitch", delay: 150 },
    { char: "C", type: "glitch", delay: 250 },
    { char: "P", type: "instant" },
  ],

  // ASSETS (6字 -> 2個穩定: A____S - 首尾呼應) - 節奏調整
  ASSETS: [
    { char: "A", type: "instant" },
    { char: "S", type: "glitch", delay: 250 },
    { char: "S", type: "glitch", delay: 150 },
    { char: "E", type: "glitch", delay: 350 },
    { char: "T", type: "glitch", delay: 200 },
    { char: "S", type: "instant" },
  ],
};

/**
 * 延遲值到 CSS class 的映射
 */
const DELAY_CLASS_MAP: Record<number, string> = {
  50: styles.delay50,
  100: styles.delay100,
  150: styles.delay150,
  200: styles.delay200,
  250: styles.delay250,
  300: styles.delay300,
  350: styles.delay350,
};

interface GlitchTextProps {
  /** 要顯示的文字（必須在 PRODUCT_ANIMATIONS 中有配置） */
  text: string;
  /** 額外的 CSS class */
  className?: string;
  /** 是否啟用動畫（用於控制進場時機） */
  animate?: boolean;
}

/**
 * GlitchText Component
 *
 * Cyberpunk/HUD 風格的文字進場動畫組件
 * 實現「穩定錨點」與「故障補全」效果
 */
export function GlitchText({
  text,
  className,
  animate = true,
}: GlitchTextProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const isTransitionComplete = useTransitionComplete();
  const containerRef = useRef<HTMLSpanElement>(null);

  // 獲取該文字的動畫配置
  const config = PRODUCT_ANIMATIONS[text.toUpperCase()];

  // 當 animate 變為 true 時觸發動畫
  useEffect(() => {
    if (animate && config) {
      // 重置動畫
      setIsAnimating(false);

      // 等待頁面轉場遮罩清除後再啟動文字動畫
      if (!isTransitionComplete) {
        return;
      }

      // 短暫延遲後啟動動畫（確保 DOM 更新）
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [animate, config, isTransitionComplete]);

  // 如果沒有配置，直接返回普通文字
  if (!config) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={containerRef} className={cn(styles.glitchTitle, className)}>
      {config.map((charConfig, index) => {
        // 空格特殊處理
        if (charConfig.char === " ") {
          return (
            <span key={index} style={{ width: "0.3em" }}>
              &nbsp;
            </span>
          );
        }

        const isInstant = charConfig.type === "instant";
        const delayClass = charConfig.delay
          ? DELAY_CLASS_MAP[charConfig.delay]
          : "";

        return (
          <span
            key={index}
            className={cn(
              styles.glitchChar,
              isAnimating && (isInstant ? styles.animInstant : styles.animGlitch),
              isAnimating && !isInstant && delayClass
            )}
          >
            {charConfig.char}
          </span>
        );
      })}
    </span>
  );
}

/**
 * 導出預設配置供外部使用或擴展
 */
export { PRODUCT_ANIMATIONS };
export type { CharConfig };
