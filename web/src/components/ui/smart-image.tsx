"use client";

import Head from "next/head";
import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Source = {
  /** Source URL for the given type (e.g., AVIF/WebP). */
  src: string;
  /** MIME type, e.g., image/avif, image/webp. */
  type?: string;
  /** Optional media query for responsive sources. */
  media?: string;
};

export interface SmartImageProps
  extends Omit<ImageProps, "src" | "alt" | "fill" | "width" | "height" | "placeholder"> {
  /** Primary image URL */
  src: string;
  /** Alt text */
  alt: string;
  /** Fallback image URL when primary fails */
  fallbackSrc?: string;
  /** Optional multi-format sources for <picture> */
  sources?: Source[];
  /** Preload the effective image (adds <link rel="preload">) */
  preload?: boolean;
  /** Wrap the picture element with this class */
  wrapperClassName?: string;
  /** Class applied to the rendered <Image> */
  imageClassName?: string;
  /** Use fill layout */
  fill?: boolean;
  /** Required when fill=false */
  width?: number;
  /** Required when fill=false */
  height?: number;
  /** Optional blur placeholder */
  blurDataURL?: string;
  /** Placeholder behavior; defaults to blur when blurDataURL is provided */
  placeholder?: "blur" | "empty";
}

/**
 * SmartImage
 *
 * A reusable image component that centralizes:
 * - Multi-format support via <picture>
 * - Optional preload hints
 * - Fallback switching on error
 * - Blur placeholders
 */
export function SmartImage(props: SmartImageProps) {
  const {
    src,
    alt,
    fallbackSrc,
    sources,
    preload,
    wrapperClassName,
    imageClassName,
    fill,
    width,
    height,
    blurDataURL,
    placeholder,
    onError,
    ...rest
  } = props;

  const [useFallback, setUseFallback] = useState(false);

  const effectiveSrc = useMemo(
    () => (useFallback && fallbackSrc ? fallbackSrc : src),
    [fallbackSrc, src, useFallback]
  );

  const resolvedPlaceholder =
    placeholder ?? (blurDataURL ? "blur" : "empty");

  const handleError: NonNullable<ImageProps["onError"]> = (event) => {
    if (!useFallback && fallbackSrc) {
      setUseFallback(true);
    }
    onError?.(event);
  };

  return (
    <>
      {preload ? (
        <Head>
          <link rel="preload" as="image" href={effectiveSrc} />
        </Head>
      ) : null}

      <picture className={wrapperClassName}>
        {sources?.map((source) => (
          <source
            key={`${source.type ?? "src"}-${source.src}`}
            srcSet={source.src}
            type={source.type}
            media={source.media}
          />
        ))}
        <Image
          {...rest}
          src={effectiveSrc}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          className={cn("object-cover", imageClassName)}
          placeholder={resolvedPlaceholder}
          blurDataURL={resolvedPlaceholder === "blur" ? blurDataURL : undefined}
          onError={handleError}
        />
      </picture>
    </>
  );
}

export default SmartImage;
