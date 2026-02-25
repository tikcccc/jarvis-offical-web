import type { Metadata } from "next";
import { languageTag } from "@/paraglide/runtime";
import { generatePageMetadata } from "@/lib/seo";
import ContactClient from "./contact-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = languageTag();
  const title = locale === "zh"
    ? "联系我们 | isBIM"
    : "Contact isBIM | AI & Construction Technology Company";
  const description = locale === "zh"
    ? "与 isBIM 团队取得联系，了解 JARVIS AI 套件、BIM 咨询与建筑科技解决方案。"
    : "Connect with the isBIM team to learn about the JARVIS AI Suite, BIM consultancy, and construction technology solutions.";

  return generatePageMetadata({
    title,
    description,
    path: "/contact",
    locale,
  });
}

export default function ContactPage() {
  return <ContactClient />;
}
