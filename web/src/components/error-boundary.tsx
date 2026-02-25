/**
 * Error Boundary Component
 *
 * Purpose:
 * - Catch and handle React component errors gracefully
 * - Prevent entire app from crashing due to component errors
 * - Provide user-friendly error UI with retry option
 * - Log errors for debugging/monitoring
 *
 * Usage:
 * ```tsx
 * // Wrap components that might error
 * <ErrorBoundary fallback={<CustomError />}>
 *   <RiskyComponent />
 * </ErrorBoundary>
 *
 * // Or use the default error UI
 * <ErrorBoundary>
 *   <RiskyComponent />
 * </ErrorBoundary>
 * ```
 */

"use client";

import React, { Component, type ReactNode, type ErrorInfo } from "react";
import { isDevelopment } from "@/lib/env";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI to render on error */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Callback when reset is triggered */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - React error boundary component
 *
 * Catches JavaScript errors anywhere in child component tree,
 * logs them, and displays a fallback UI.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>Error: {error.message}</p>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   )}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With error logging
 * <ErrorBoundary
 *   onError={(error, info) => {
 *     logToService(error, info);
 *   }}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (isDevelopment()) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Custom fallback
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(this.state.error, this.reset);
        }
        return this.props.fallback;
      }

      // Default error UI
      return (
        <DefaultErrorFallback error={this.state.error} reset={this.reset} />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback UI
 * Displayed when ErrorBoundary catches an error and no custom fallback is provided.
 */
function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex min-h-[200px] flex-col items-center justify-center p-6 text-center"
    >
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Something went wrong
      </h2>

      <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        {isDevelopment()
          ? error.message
          : "An unexpected error occurred. Please try again."}
      </p>

      <button
        onClick={reset}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Try again
      </button>

      {isDevelopment() && (
        <details className="mt-4 w-full max-w-md text-left">
          <summary className="cursor-pointer text-xs text-neutral-500">
            Error details
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-neutral-100 p-2 text-xs dark:bg-neutral-800">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * withErrorBoundary HOC
 * Wraps a component with ErrorBoundary for convenient usage.
 *
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary(RiskyComponent, {
 *   fallback: <div>Error loading component</div>
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  // Set display name for debugging
  const componentName = Component.displayName || Component.name || "Component";
  WrappedComponent.displayName = `withErrorBoundary(${componentName})`;

  return WrappedComponent;
}

export default ErrorBoundary;
