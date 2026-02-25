/**
 * JARVIS DWSS Product Page Layout
 *
 * Sets footer variant to charcoal.
 */

import { FooterConfig } from "@/components/layout/footer-config";

export default function JarvisDwssLayout({
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
