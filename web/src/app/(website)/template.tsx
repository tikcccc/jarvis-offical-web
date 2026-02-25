"use client";

import { PageTransition } from "@/components/layout/page-transition";

export default function LocaleTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
