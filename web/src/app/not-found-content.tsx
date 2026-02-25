"use client";

import { Link } from "@/lib/i18n";
import * as m from "@/paraglide/messages";
import { m as motion } from "@/components/motion/lazy-motion";

export function NotFoundContent() {
  return (
    <main className="container-content section-padding">
      <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 200px)' }}>

        {/* 404 Error Heading */}
        <h1 className="font-hero-headline mb-6" style={{ color: 'var(--text-inverse-strong)' }}>
          {m.notfound_title()}
        </h1>

        {/* Main Message */}
        <p className="font-body-lg mb-4" style={{ color: 'var(--text-inverse-base)' }}>
          {m.notfound_message()}
        </p>

        {/* Description */}
        <p className="font-body-base mb-8 max-w-2xl" style={{ color: 'var(--text-inverse-muted)' }}>
          {m.notfound_description()}
        </p>

        {/* Back to Home Button with Hover Animation */}
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          <Link
            href="/"
            className="font-label-lg inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            {m.notfound_button()}

            {/* Animated Arrow */}
            <motion.span
              aria-hidden="true"
              className="inline-block"
              variants={{
                rest: { x: 0 },
                hover: { x: 4 }
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
