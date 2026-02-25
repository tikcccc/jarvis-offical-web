/** Tailwind config bridging CSS variables to utilities */
module.exports = {
  theme: {
    extend: {
      spacing: {
        section: 'var(--section-v-spacing)',
        gutter: 'var(--gutter)',
      },
      borderRadius: {
      },
    },
  },
};
