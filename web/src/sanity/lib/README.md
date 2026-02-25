# Sanity Data Layer

Typed, cached, and performant data fetching layer for Sanity CMS.

## Architecture

### Files

- **`client.ts`** - Sanity client configuration with environment-based CDN
- **`fetch.ts`** - Type-safe fetch wrapper with Next.js cache integration
- **`queries.ts`** - GROQ query definitions for all content types
- **`types.ts`** - TypeScript types matching Sanity schemas
- **`image.ts`** - Image URL builder utilities
- **`index.ts`** - Barrel export for convenience

## Features

### 1. Environment-Based CDN Configuration

```tsx
import { client, writeClient } from "@/sanity/lib";

// Read operations - uses CDN in production
const data = await client.fetch(query);

// Write operations - bypasses CDN
await writeClient.create(document);
```

**CDN Strategy:**
- **Production**: CDN enabled for fast, cached reads
- **Development**: CDN disabled for fresh data
- **Writes**: Always bypass CDN for consistency

### 2. Type-Safe Fetch with Cache Management

```tsx
import { sanityFetch, buildCacheTags, REVALIDATE } from "@/sanity/lib";
import type { ImageAsset } from "@/sanity/lib";

const image = await sanityFetch<ImageAsset | null>({
  query: IMAGE_ASSET_BY_SLUG_QUERY,
  params: { slug: "home-cta" },
  tags: buildCacheTags("imageAsset", "home-cta"),
  revalidate: REVALIDATE.HOUR,
});
```

**Cache Tags:**
- Automatic prefixing: `["imageAsset"]` → `["sanity:all", "sanity:imageAsset"]`
- Granular invalidation: `revalidateTag("sanity:imageAsset:home-cta")`
- Global invalidation: `revalidateTag("sanity:all")`

### 3. Revalidation Strategies

```tsx
// Time-based revalidation
revalidate: REVALIDATE.HOUR        // Every hour
revalidate: REVALIDATE.DAY         // Every day
revalidate: REVALIDATE.FIVE_MINUTES // Every 5 minutes

// On-demand only
revalidate: false

// Dynamic/realtime (no cache)
cache: "no-store"
```

### 4. Typed Queries

All queries are defined with `defineQuery` for GROQ syntax validation:

```tsx
import { IMAGE_ASSET_BY_SLUG_QUERY, POSTS_QUERY } from "@/sanity/lib";

// Queries are typed and validated at build time
const posts = await sanityFetch<Post[]>({
  query: POSTS_QUERY,
  tags: ["post"],
});
```

## Usage Examples

### Fetching a Single Document

```tsx
import { sanityFetch, IMAGE_ASSET_BY_SLUG_QUERY, buildCacheTags, REVALIDATE } from "@/sanity/lib";
import type { ImageAsset } from "@/sanity/lib";

async function getImage(slug: string) {
  return sanityFetch<ImageAsset | null>({
    query: IMAGE_ASSET_BY_SLUG_QUERY,
    params: { slug },
    tags: buildCacheTags("imageAsset", slug),
    revalidate: REVALIDATE.HOUR,
  });
}
```

### Fetching a List

```tsx
import { sanityFetch, POSTS_QUERY, REVALIDATE } from "@/sanity/lib";
import type { Post } from "@/sanity/lib";

async function getPosts() {
  return sanityFetch<Post[]>({
    query: POSTS_QUERY,
    tags: ["post"],
    revalidate: REVALIDATE.FIVE_MINUTES,
  });
}
```

### Dynamic/Realtime Data

```tsx
// For data that changes frequently or needs to be fresh
const liveData = await sanityFetch({
  query: LIVE_QUERY,
  cache: "no-store", // Bypass cache completely
});
```

### On-Demand Revalidation

```tsx
// In a Sanity webhook endpoint or API route
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const { _type, _id } = await request.json();

  // Revalidate specific document type
  revalidateTag(`sanity:${_type}`);

  // Revalidate specific document
  revalidateTag(`sanity:${_type}:${_id}`);

  // Or revalidate everything
  revalidateTag("sanity:all");

  return Response.json({ revalidated: true });
}
```

## Cache Tag Patterns

| Pattern | Example | Use Case |
|---------|---------|----------|
| `sanity:all` | - | Invalidate all Sanity content |
| `sanity:{type}` | `sanity:post` | Invalidate all posts |
| `sanity:{type}:{id}` | `sanity:post:my-post` | Invalidate specific post |

## Performance Optimization

### Projection (Select Only What You Need)

All queries use GROQ projection to minimize payload:

```groq
*[_type == "post"][0] {
  _id,
  title,
  slug,
  // Only fetch what you need
}
```

### Image Optimization

```tsx
import { urlFor } from "@/sanity/lib";

// Responsive images
const url = urlFor(image)
  ?.width(1200)
  .height(630)
  .format("webp")
  .quality(80)
  .url();
```

### Query Logging (Development Only)

In development, all queries are logged to console:

```
[Sanity Fetch] {
  query: "*[_type == 'imageAsset' && slug.current == $slug][0]...",
  params: { slug: "home-cta" },
  tags: ["sanity:all", "sanity:imageAsset", "sanity:imageAsset:home-cta"],
  revalidate: 3600
}
```

## Best Practices

1. **Always use typed queries** from `queries.ts`
2. **Tag appropriately** for granular cache control
3. **Use projection** to minimize data transfer
4. **Set revalidation times** based on content update frequency
5. **Use `buildCacheTags`** for consistent tag naming
6. **Log errors** but gracefully handle failures

## Future Enhancements

- [ ] Sanity webhook integration for automatic revalidation
- [ ] Query result caching in memory (for high-traffic routes)
- [ ] Query analytics/monitoring
- [ ] GROQ builder utilities for dynamic queries
