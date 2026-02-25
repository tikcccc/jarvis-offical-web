import { FooterConfig } from "@/components/layout/footer-config";

export default function BIMConsultancyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FooterConfig variant="charcoal" />
      {children}
    </>
  );
}
