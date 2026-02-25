/**
 * useBodyScrollLock Hook
 *
 * Purpose:
 * - Lock/unlock body scroll behavior
 * - Used for modals, full-screen menus, etc.
 * - Supports multiple simultaneous locks (reference counting)
 *
 * Use Cases:
 * - Full-screen navigation menu (menu-overlay)
 * - Modal dialogs
 * - Image lightbox
 * - Mobile sidebars
 *
 * Features:
 * - Automatically saves and restores original overflow value
 * - Auto cleanup on unmount
 * - SSR safe
 * - Multiple lock support with reference counting
 */

"use client";

import { useEffect, useRef, useId } from "react";

// Global lock counter to handle multiple simultaneous locks
let lockCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

function getScrollbarWidth(): number {
  if (typeof window === "undefined" || typeof document === "undefined") return 0;
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

/**
 * useBodyScrollLock - Lock/unlock body scroll with multiple lock support
 *
 * @param lock - Whether to lock the body scroll
 *
 * @example
 * ```tsx
 * function Modal({ isOpen }: { isOpen: boolean }) {
 *   useBodyScrollLock(isOpen);
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div className="fixed inset-0 bg-black/50">
 *       Modal content...
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple overlays can coexist
 * function App() {
 *   const [menuOpen, setMenuOpen] = useState(false);
 *   const [modalOpen, setModalOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Menu isOpen={menuOpen} />  // Uses useBodyScrollLock(menuOpen)
 *       <Modal isOpen={modalOpen} /> // Uses useBodyScrollLock(modalOpen)
 *     </>
 *   );
 *   // Body scroll unlocks only when BOTH are closed
 * }
 * ```
 */
export function useBodyScrollLock(lock: boolean): void {
  // Generate unique ID for this lock instance
  const lockId = useId();
  const isLockedRef = useRef(false);

  useEffect(() => {
    // SSR guard
    if (typeof document === "undefined") return;

    if (lock && !isLockedRef.current) {
      // Increment lock count
      if (lockCount === 0) {
        // First lock: save original overflow
        originalOverflow = document.body.style.overflow;
        originalPaddingRight = document.body.style.paddingRight;

        const scrollbarWidth = getScrollbarWidth();
        if (scrollbarWidth > 0) {
          const computedPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
          document.body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
        }
        document.body.style.overflow = "hidden";
      }
      lockCount++;
      isLockedRef.current = true;
    } else if (!lock && isLockedRef.current) {
      // Decrement lock count
      lockCount = Math.max(0, lockCount - 1);
      isLockedRef.current = false;

      if (lockCount === 0) {
        // Last lock released: restore original overflow
        document.body.style.overflow = originalOverflow || "unset";
        document.body.style.paddingRight = originalPaddingRight;
      }
    }

    // Cleanup on unmount
    return () => {
      if (isLockedRef.current) {
        lockCount = Math.max(0, lockCount - 1);
        isLockedRef.current = false;

        if (lockCount === 0) {
          document.body.style.overflow = originalOverflow || "unset";
          document.body.style.paddingRight = originalPaddingRight;
        }
      }
    };
  }, [lock, lockId]);
}

export default useBodyScrollLock;
