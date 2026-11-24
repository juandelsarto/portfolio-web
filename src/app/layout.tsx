import type { Metadata } from "next";

import { MobileNav } from "@/components/site/mobile-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
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
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only z-50 rounded-sm bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Ir al contenido principal
        </a>
        <SiteHeader />
        <div id="contenido" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </div>
        <SiteFooter />
        <MobileNav />
      </body>
    </html>
  );
}
