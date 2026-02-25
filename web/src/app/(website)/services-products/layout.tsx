/**
 * Services & Products Page Layout
 *
 * Sets footer variant to charcoal via FooterConfig.
 */

import { FooterConfig } from "@/components/layout/footer-config";

export default function ServicesProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FooterConfig variant="charcoal" />
      {children}
    </>
  );
}
