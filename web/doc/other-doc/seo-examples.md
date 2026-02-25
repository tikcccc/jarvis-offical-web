# SEO Implementation Examples

This document provides practical examples of implementing SEO metadata across different page types.

## Table of Contents
- [Home Page](#home-page)
- [Static Pages](#static-pages)
- [Dynamic Pages (Sanity CMS)](#dynamic-pages-sanity-cms)
- [Structured Data](#structured-data)

## Home Page

**File:** `src/app/page.tsx`

```tsx
import type { Metadata } from "next";
import { sanityFetch, buildCacheTags, REVALIDATE, IMAGE_ASSET_BY_SLUG_QUERY } from "@/sanity/lib";
import type { ImageAsset } from "@/sanity/lib";
import { urlFor } from "@/sanity/lib";
import { generatePageMetadata, COMMON_KEYWORDS } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch OG image from Sanity
  const heroImage = await sanityFetch<ImageAsset | null>({
    query: IMAGE_ASSET_BY_SLUG_QUERY,
    params: { slug: "home-hero" },
    tags: buildCacheTags("imageAsset", "home-hero"),
    revalidate: REVALIDATE.DAY,
  }).catch(() => null);

  const imageUrl = heroImage?.file
    ? urlFor(heroImage.file)?.width(1200).height(630).url()
    : undefined;

  return generatePageMetadata({
    title: "Construction AI Platform - Powering Global Economies",
    description: "isBIM delivers cutting-edge construction AI solutions...",
    path: "/",
    locale: "en",
    image: imageUrl,
    keywords: [...COMMON_KEYWORDS, "construction platform"],
  });
}

export default async function Home() {
  // Page content...
}
```

## Static Pages

### About Us Page

**File:** `src/app/about-us/page.tsx`

```tsx
import type { Metadata } from "next";
import { generatePageMetadata, COMMON_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "About isBIM",
  description:
    "Learn about isBIM's mission to revolutionize construction with AI-powered solutions and smart infrastructure management.",
  path: "/about-us",
  locale: "en",
  keywords: [...COMMON_KEYWORDS, "about", "company", "mission"],
});

export default function AboutUs() {
  // Page content...
}
```

### Services Page

**File:** `src/app/services-products/page.tsx`

```tsx
import type { Metadata } from "next";
import { generatePageMetadata, COMMON_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Our Services & Products",
  description:
    "Explore isBIM's comprehensive suite of AI-powered construction solutions, from JARVIS AI to BIM consultancy and project management.",
  path: "/services-products",
  locale: "en",
  keywords: [...COMMON_KEYWORDS, "services", "products", "solutions"],
});

export default function ServicesProducts() {
  // Page content...
}
```

## Dynamic Pages (Sanity CMS)

### Blog Post Page

**File:** `src/app/posts/[slug]/page.tsx`

```tsx
import type { Metadata } from "next";
import { generatePostMetadata } from "@/sanity/lib";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata(slug, "en");
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  // Fetch and render post...
}
```

### Product Page

**File:** `src/app/products/[slug]/page.tsx`

```tsx
import type { Metadata } from "next";
import { generateProductMetadata } from "@/sanity/lib";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateProductMetadata(slug, "en");
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  // Fetch and render product...
}
```

### News Article Page

**File:** `src/app/newsroom/[slug]/page.tsx`

```tsx
import type { Metadata } from "next";
import { generateNewsMetadata } from "@/sanity/lib";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateNewsMetadata(slug, "en");
}

export default async function NewsPage({ params }: PageProps) {
  const { slug } = await params;
  // Fetch and render news...
}
```

### Career Position Page

**File:** `src/app/careers/[slug]/page.tsx`

```tsx
import type { Metadata } from "next";
import { generateCareerMetadata } from "@/sanity/lib";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateCareerMetadata(slug, "en");
}

export default async function CareerPage({ params }: PageProps) {
  const { slug } = await params;
  // Fetch and render career position...
}
```

## Structured Data

### Organization Schema (Site-wide)

Add to `src/app/layout.tsx`:

```tsx
import { generateOrganizationSchema } from "@/lib/seo";

export default async function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Article Schema (Blog Posts)

Add to individual post pages:

```tsx
import { generateArticleSchema } from "@/lib/seo";
import { urlFor } from "@/sanity/lib";

export default async function PostPage({ params }) {
  const post = await fetchPost(params.slug);

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    image: urlFor(post.mainImage)?.width(1200).url() || "",
    publishedTime: post.publishedAt,
    modifiedTime: post._updatedAt,
    author: post.author?.name,
    url: `https://isbim.com/posts/${params.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Post content */}
    </>
  );
}
```

### Breadcrumb Schema

```tsx
import { generateBreadcrumbSchema } from "@/lib/seo";

export default function ProductPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: "JARVIS Agent", url: "/products/jarvis-agent" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {/* Page content */}
    </>
  );
}
```

## Best Practices

### 1. Cache Strategy
- **Static pages**: Use constant `metadata` export
- **Dynamic pages**: Use `generateMetadata()` with Sanity cache
- **OG images**: Cache for at least 1 hour (home page: 1 day)

### 2. Image Optimization
```tsx
// Always optimize Open Graph images
const ogImage = urlFor(image)
  ?.width(1200)
  .height(630)
  .format("webp")
  .quality(85)
  .url();
```

### 3. Keywords
```tsx
import { COMMON_KEYWORDS } from "@/lib/seo";

// Combine common + page-specific keywords
keywords: [...COMMON_KEYWORDS, "specific", "keywords"]
```

### 4. Error Handling
```tsx
// Always provide fallback for failed Sanity fetches
const data = await sanityFetch(...).catch(() => null);

if (!data) {
  return generatePageMetadata({
    title: "Not Found",
    description: "...",
    noIndex: true, // Don't index error pages
  });
}
```

### 5. Locale Support
```tsx
// Pass locale from params or headers
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  return generatePostMetadata(slug, locale);
}
```

## Testing SEO

### Check Open Graph Tags
```bash
# Use Open Graph debugger
https://www.opengraph.xyz/?url=https://isbim.com
```

### Validate Structured Data
```bash
# Use Google's Rich Results Test
https://search.google.com/test/rich-results
```

### Check Metadata
```tsx
// View page source (Ctrl+U) and look for:
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:image" content="..." />
<meta name="twitter:card" content="summary_large_image" />
<script type="application/ld+json">...</script>
```
