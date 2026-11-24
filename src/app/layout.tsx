import type { Metadata } from "next";

import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import { themeScript } from "@/lib/theme";

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
    // data-theme lo pone themeScript antes de hidratar: por eso
    // suppressHydrationWarning en <html>.
    <html
      lang={siteConfig.locale}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Script propio y estático, sin datos de usuarios. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
