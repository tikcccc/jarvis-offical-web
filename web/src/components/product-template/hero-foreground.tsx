"use client";

import { cn } from "@/lib/utils";
import styles from "./hero-section.module.css";
import { GlitchText, PRODUCT_ANIMATIONS } from "./glitch-text";

/**
 * MetadataItem - 右側功能菜單項目
 */
export interface MetadataItem {
  /** 主標題文字 */
  title: string;
  /** Hover 時顯示的副標題 */
  subtitle?: string;
  /** Icon 組件 (SVG) */
  icon?: React.ReactNode;
}

/**
 * HeroForeground Props
 */
interface HeroForegroundProps {
  /** 公司/品牌名稱 (空心描邊字) - 例如 "JARVIS" */
  brandName?: string;
  /** 產品名稱 (實心白字) - 例如 "PAY" */
  productName: string;
  /** 產品副標題描述 */
  productSubtitle?: string;
  /**
   * Metadata 項目列表
   * - 舊版: string[] (純文字)
   * - 新版: MetadataItem[] (帶 icon 和 hover 效果)
   */
  metadata: string[] | MetadataItem[];
  /** 自定義 Logo 組件 (覆蓋 brandName + productName) */
  logoComponent?: React.ReactNode;
  /** 是否顯示左側裝飾竪線 (默認 true) */
  showLeftLine?: boolean;
  /** 是否顯示底部邊框線 (默認 true) */
  showBottomBorder?: boolean;
}

/**
 * 檢查是否為 MetadataItem 類型
 */
function isMetadataItem(item: string | MetadataItem): item is MetadataItem {
  return typeof item === "object" && "title" in item;
}

/**
 * HeroForeground Component
 *
 * Foreground content layer (title and metadata) that moves with scroll.
 * Positioned absolutely to allow smooth upward movement synchronized with NarrativeTrack.
 *
 * 支援兩種模式：
 * 1. 舊版: productName + string[] metadata
 * 2. 新版: brandName(空心) + productName(實心) + MetadataItem[] (帶 icon)
 */
export function HeroForeground({
  brandName,
  productName,
  productSubtitle,
  metadata,
  logoComponent,
  showLeftLine = true,
  showBottomBorder = true,
}: HeroForegroundProps) {
  // 判斷是否為新版 MetadataItem 格式
  const isNewFormat =
    metadata.length > 0 && isMetadataItem(metadata[0] as string | MetadataItem);

  // 過濾有效的 metadata
  const cleanedMetadata = metadata.filter((item) => {
    if (typeof item === "string") {
      return item?.trim().length > 0;
    }
    return item?.title?.trim().length > 0;
  });

  return (
    <div
      data-hero-foreground="true"
      className="absolute top-0 left-0 w-full h-screen z-10 pointer-events-none"
    >
      <div
        className={cn(
          "relative h-full w-full flex flex-col justify-end will-change-transform transition-transform duration-[180ms] ease-out",
          styles.foreground,
          styles.heroPadding
        )}
      >
        {/* Main content area (match service hero grid layout) */}
        <div
          className={cn(
            "grid grid-cols-12 items-end w-full pointer-events-auto relative",
            styles.heroContentOffset,
            showBottomBorder && styles.bottomBorder,
            showLeftLine && styles.leftDecoLine
          )}
          style={{ gap: "var(--product-gap)" }}
        >
          {/* Left: Brand + Product Name */}
          <div
            className={cn(
              "col-span-12 md:col-span-8 flex flex-col max-w-5xl xl:max-w-none",
              showLeftLine && "md:pl-8"
            )}
            style={{ gap: "var(--product-gap-sm)" }}
          >
            {logoComponent || (
              <div className="flex flex-col">
                {/* Brand Name - 空心描邊字 (如果提供) */}
                {brandName && (
                  <h2
                    className="font-product-title-hero-outline xl:whitespace-nowrap select-none -ml-1"
                  >
                    {brandName}
                  </h2>
                )}
                {/* Product Name - 實心白字 + Glitch 進場動畫 */}
                <h1
                  className={cn(
                    "font-product-title-hero xl:whitespace-nowrap",
                    !brandName && "text-white",
                    brandName &&
                      "text-white mix-blend-normal drop-shadow-2xl -ml-1"
                  )}
                >
                  {/* 如果產品名稱有 Glitch 動畫配置，使用 GlitchText */}
                  {PRODUCT_ANIMATIONS[productName.toUpperCase()] ? (
                    <GlitchText text={productName} animate={true} />
                  ) : (
                    productName
                  )}
                </h1>
              </div>
            )}

            {/* 副標題區域 (帶橫線) */}
            {productSubtitle && (
              <div className={cn(styles.subtitleLine, "mt-4 pl-1")}>
                <p className="font-product-hero-subtitle text-gray-300">
                  {productSubtitle}
                </p>
              </div>
            )}
          </div>

          {/* Right: Metadata */}
          <div className="col-span-12 md:col-span-4 hidden md:flex flex-col items-end justify-end">
            {isNewFormat ? (
              /* 新版: Icon + 文字 + Hover 動畫 */
              <div className="flex flex-col items-end space-y-3">
                {(cleanedMetadata as MetadataItem[]).map((item, i) => (
                  <div key={i} className={styles.metaIconItem}>
                    <div className={styles.metaIconText}>
                      <div
                        className={cn(
                          styles.metaIconTitle,
                          "font-product-meta-icon-title text-white"
                        )}
                      >
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div
                          className={cn(
                            styles.metaIconSubtext,
                            "font-product-meta-icon-subtext"
                          )}
                        >
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                    {item.icon && (
                      <div className={styles.metaIconCircle}>{item.icon}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* 舊版: 純文字列表 */
              <div
                className={cn(
                  "font-product-label-bold tracking-[0.28em] relative flex flex-col items-end pr-2 pl-8",
                  styles.metaLine,
                  styles.metadataLine,
                  styles.gapSm,
                  styles.metaColor
                )}
              >
                {(cleanedMetadata as string[]).map((item, i) => (
                  <span
                    key={i}
                    className="max-w-[240px] text-right leading-tight hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile metadata - horizontal layout */}
        <div
          className={cn(
            "font-product-label-bold tracking-[0.18em] flex md:hidden mt-6 flex-wrap pointer-events-auto",
            styles.metaChipWrap
          )}
        >
          {cleanedMetadata.slice(0, 4).map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full border backdrop-blur-[1px]"
            >
              {typeof item === "string" ? item : item.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
