import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  robots: {
    index: siteConfig.indexable,
    follow: siteConfig.indexable,
  },
  openGraph: {
    locale: "es_AR",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={siteConfig.locale}>
      <body>{children}</body>
    </html>
  );
}
