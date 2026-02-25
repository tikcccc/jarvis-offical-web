"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * TanStack Query Provider
 *
 * Provides React Query client for server state management.
 * Used for:
 * - Sanity CMS data fetching
 * - API requests with caching
 * - Loading/error states management
 *
 * Configuration:
 * - staleTime: 5 minutes (data considered fresh)
 * - cacheTime: 10 minutes (unused data kept in cache)
 * - refetchOnWindowFocus: false (avoid unnecessary refetches)
 *
 * @see https://tanstack.com/query/latest/docs/react/overview
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  // Create QueryClient instance per component mount (not per render)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Unused data stays in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Don't refetch on window focus (can be enabled per-query)
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
