import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MobileNav } from "@/components/site/mobile-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SkipLink } from "@/components/site/skip-link";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import { themeScript } from "@/lib/theme";

import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: t("title"),
    description: t("description"),
    robots: {
      index: siteConfig.indexable,
      follow: siteConfig.indexable,
    },
    openGraph: {
      locale: t("ogLocale"),
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Render estático: el idioma sale de la ruta, no de los headers.
  setRequestLocale(locale);

  return (
    // data-theme lo pone themeScript antes de hidratar: por eso
    // suppressHydrationWarning en <html>.
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Script propio y estático, sin datos de usuarios. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <SkipLink />
          <SiteHeader />
          <div id="contenido" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </div>
          <SiteFooter />
          <MobileNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
