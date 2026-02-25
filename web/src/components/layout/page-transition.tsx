'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from '@/lib/i18n';
import { useLocale } from '@/lib/i18n/locale-context';
import { useSearchParams } from 'next/navigation';
import { useLenis } from '@/components/smooth-scroll-provider';
import { m } from '@/components/motion/lazy-motion';

/* =========================================
   PAGE TRANSITION CONTEXT
   Broadcasts transition animation state to child components
   ========================================= */

interface PageTransitionContextValue {
    /** Whether the enter animation has completed and content can be revealed */
    isEnterComplete: boolean;
    /** Subscribe to enter complete event - returns unsubscribe function */
    onEnterComplete: (callback: () => void) => () => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

/**
 * Hook to access page transition state
 * Returns null if used outside PageTransition provider
 */
export function usePageTransition() {
    return useContext(PageTransitionContext);
}

/**
 * Hook that returns true when it's safe to start content animations
 * Handles case where PageTransition is not present (returns true immediately)
 */
export function useTransitionComplete() {
    const context = usePageTransition();

    // If no transition context (outside PageTransition), always return true
    if (!context) {
        return true;
    }

    // Return the current state from context
    return context.isEnterComplete;
}

/* =========================================
   INNER OVERLAY RUNNER
   Page transition animation core component
   ========================================= */

interface InnerOverlayProps {
    onAnimationComplete?: () => void;
}

/**
 * Time to wait before triggering content reveal
 * The brush animation is 0.9s but uses ease-out [0.22, 1, 0.36, 1],
 * so it visually clears the viewport around 500-600ms
 */
const CONTENT_REVEAL_DELAY = 200; // ms - when brush has visually cleared

/**
 * InnerOverlayRunner - Page transition animation core component
 *
 * Animation Flow:
 * 1. Initial: x=0% (overlay covers screen)
 * 2. Animate: x=200vw (slide right) -> transitionEnd teleport to x=-200vw (hidden left)
 * 3. Exit: x=0% (slide back from left to cover)
 *
 * This approach creates a unidirectional looping brush effect, avoiding the rewind feeling.
 *
 * Branding Note:
 * This animation runs on all route changes, including locale switching,
 * providing a consistent branded transition experience across the application.
 */
const InnerOverlayBase: React.FC<InnerOverlayProps> = ({ onAnimationComplete }) => {
    // Use timer to trigger callback - more reliable than onAnimationComplete with React.memo
    useEffect(() => {
        if (!onAnimationComplete) return;

        const timer = setTimeout(() => {
            onAnimationComplete();
        }, CONTENT_REVEAL_DELAY);

        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">

            {/* 1. Giant Parallelogram Brush */}
            <m.div
                className="absolute top-0 bottom-0 h-full will-change-transform"
                style={{
                    width: '220vw',
                    left: '-110vw',
                }}
                initial={{ x: "0%" }}
                animate={{
                    x: "260vw",
                    transitionEnd: {
                        x: "-260vw" // After animation, silently reset to far left to avoid residual edges on mobile DPR
                    }
                }}
                exit={{ x: "0%" }}
                transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1]
                }}
            >
                <div
                    className="w-full h-full bg-[#767676]"
                    style={{
                        transform: 'skewX(-20deg)',
                        transformOrigin: 'bottom left'
                    }}
                />
            </m.div>

            {/* 2. Logo with Shimmer Effect */}
            <m.div
                className="absolute inset-0 flex items-center justify-center z-[10000]"
                initial={{ opacity: 1 }}
                animate={{
                    opacity: 0,
                    transition: {
                        delay: 0.7,
                        duration: 0.3,
                    }
                }}
                exit={{
                    opacity: 1,
                    transition: {
                        duration: 0.2,
                    }
                }}
            >
                <div className="relative w-48 h-32">
                    {/* Background Layer - Black Logo (底層，半透明灰階) */}
                    <div className="absolute inset-0 opacity-30 grayscale">
                        <Image
                            src="/icons/isbim_black.svg"
                            alt="isBIM"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Foreground Layer - White Logo with Shimmer Mask */}
                    <m.div
                        className="absolute inset-0"
                        style={{
                            maskImage: 'linear-gradient(110deg, transparent 30%, black 45%, black 55%, transparent 70%)',
                            WebkitMaskImage: 'linear-gradient(110deg, transparent 30%, black 45%, black 55%, transparent 70%)',
                            maskSize: '250% 100%',
                            WebkitMaskSize: '250% 100%',
                        }}
                        animate={{
                            maskPosition: ['-120% 0', '220% 0'],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                            repeatDelay: 0.5,
                        }}
                    >
                        <Image
                            src="/icons/isbim_white.svg"
                            alt="isBIM"
                            fill
                            className="object-contain drop-shadow-sm"
                            priority
                        />
                    </m.div>
                </div>
            </m.div>
        </div>
    );
};
InnerOverlayBase.displayName = "InnerOverlayBase";
export const InnerOverlayRunner = React.memo(InnerOverlayBase);

/* =========================================
   PAGE TRANSITION COMPONENT
   Main page transition wrapper with context provider
   ========================================= */

/**
 * PageTransition - Main page transition wrapper component
 * Compatible with Next.js App Router template.tsx
 *
 * Provides consistent branded transition animation for all route changes,
 * including page navigation and locale switching.
 *
 * Usage in template.tsx:
 * ```tsx
 * import { PageTransition } from "@/components/layout/page-transition";
 *
 * export default function Template({ children }) {
 *   return <PageTransition>{children}</PageTransition>;
 * }
 * ```
 *
 * Child components can use `useTransitionComplete()` hook to know when
 * to start their entrance animations.
 */
interface PageTransitionProps {
    children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const pathname = usePathname(); // canonical (no locale)
    const locale = useLocale();
    const searchParams = useSearchParams();
    const searchKey = searchParams?.toString() ?? "";
    const transitionKey = `${pathname}?${searchKey}|${locale}`;
    const shouldScrollTopRef = useRef(false);
    const { lenis } = useLenis();
    const disableTransition =
        pathname.includes('/newsroom') ||
        pathname.includes('/case-studies') ||
        pathname.includes('/careers');

    // Transition state
    const [isEnterComplete, setIsEnterComplete] = useState(false);
    const listenersRef = useRef<Set<() => void>>(new Set());

    // Reset state on route/locale/search change
    useEffect(() => {
        setIsEnterComplete(false);
    }, [transitionKey]);

    // Handle animation complete
    const handleEnterComplete = useCallback(() => {
        setIsEnterComplete(true);
        // Notify all subscribers
        listenersRef.current.forEach(callback => callback());
    }, []);

    // Subscribe to enter complete event
    const onEnterComplete = useCallback((callback: () => void) => {
        listenersRef.current.add(callback);
        return () => {
            listenersRef.current.delete(callback);
        };
    }, []);

    // Context value - memoized to prevent unnecessary re-renders
    const contextValue = useMemo<PageTransitionContextValue>(() => ({
        isEnterComplete,
        onEnterComplete,
    }), [isEnterComplete, onEnterComplete]);

    // On first load, disable browser scroll restoration and scroll to top smoothly
    useEffect(() => {
        if (typeof window === "undefined") return;
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
        const raf = requestAnimationFrame(() => {
            if (lenis) {
                lenis.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });

        return () => {
            if ("scrollRestoration" in history) {
                history.scrollRestoration = "auto";
            }
            cancelAnimationFrame(raf);
        };
    }, [lenis]);

    // Mark that we should scroll to top after the exit animation completes
    useEffect(() => {
        shouldScrollTopRef.current = true;
    }, [transitionKey]);

    const performScrollIfPending = useCallback(() => {
        if (!shouldScrollTopRef.current) return;
        shouldScrollTopRef.current = false;
        requestAnimationFrame(() => {
            if (lenis) {
                lenis.scrollTo(0, { immediate: false });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }, [lenis]);

    // Scroll to top after enter animation completes (ensures overlay is gone)
    useEffect(() => {
        if (!isEnterComplete) return;
        performScrollIfPending();
    }, [isEnterComplete, performScrollIfPending]);

    // If transitions are disabled (e.g., newsroom), still perform scroll-to-top on route/locale/search change
    useEffect(() => {
        if (!disableTransition) return;
        performScrollIfPending();
    }, [transitionKey, disableTransition, performScrollIfPending]);

    if (disableTransition) {
        return (
            <PageTransitionContext.Provider value={{ isEnterComplete: true, onEnterComplete: () => () => {} }}>
                <div className="relative w-full min-h-screen">
                    {children}
                </div>
            </PageTransitionContext.Provider>
        );
    }

    return (
        <PageTransitionContext.Provider value={contextValue}>
            <AnimatePresence
                mode="wait"
                onExitComplete={performScrollIfPending}
            >
                <div key={transitionKey} className="relative w-full min-h-screen">
                    {/* Page content fade in/out */}
                    <m.div
                        key={`page-${transitionKey}`}
                        className="min-h-screen w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            delay: 0.1,
                            duration: 0.9,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >
                        {children}
                    </m.div>

                    {/* Transition overlay */}
                    <InnerOverlayRunner
                        key={`overlay-${transitionKey}`}
                        onAnimationComplete={handleEnterComplete}
                    />
                </div>
            </AnimatePresence>
        </PageTransitionContext.Provider>
    );
};

/**
 * PageWrapper - Alternative page wrapper for custom usage
 * Use this if you need more control over the transition behavior
 */
interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
    return (
        <div className="relative w-full min-h-screen">
            <m.div
                className={`min-h-screen w-full ${className}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    delay: 0.2,
                    duration: 0.5
                }}
            >
                {children}
            </m.div>

            <InnerOverlayRunner />
        </div>
    );
};

export default PageTransition;
