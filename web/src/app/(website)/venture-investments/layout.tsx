import { FooterConfig } from "@/components/layout/footer-config";

export default function VentureInvestmentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FooterConfig variant="charcoal" />
      {children}
    </>
  );
}
