/**
 * JARVIS Agent Product Page Layout
 *
 * Sets footer variant to charcoal.
 */

import { FooterConfig } from "@/components/layout/footer-config";

export default function JarvisAgentLayout({
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
