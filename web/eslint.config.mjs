import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/paraglide/**",
    ],
  },
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "framer-motion",
              importNames: ["motion"],
              message:
                "Use m from '@/components/motion/lazy-motion' instead of importing motion directly.",
            },
            {
              name: "framer-motion",
              importNames: ["default"],
              message:
                "Use m from '@/components/motion/lazy-motion' instead of default importing motion.",
            },
            {
              name: "framer-motion",
              importNames: ["m"],
              message:
                "Use m from '@/components/motion/lazy-motion' to ensure LazyMotion tree-shaking.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
