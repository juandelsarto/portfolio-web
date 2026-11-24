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
import { getBaseUrl, siteConfig } from "@/lib/site";
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
    metadataBase: getBaseUrl(),
    title: t("title"),
    description: t("description"),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    alternates: { canonical: `/${locale}` },
    robots: {
      index: siteConfig.indexable,
      follow: siteConfig.indexable,
    },
    // La imagen OG y la de Twitter salen de opengraph-image.png y
    // twitter-image.png en esta carpeta (frame "og-image-1200x630" de Figma).
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      url: `/${locale}`,
      locale: t("ogLocale"),
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    // Favicon: 16 px con el monograma JC y 32 px con el logo, en la versión del
    // tema del sistema (Figma: frame "Marca"). favicon.ico está en app/; el
    // resto, en public/icons/.
    icons: {
      icon: [
        {
          url: "/icons/favicon-16.png",
          sizes: "16x16",
          type: "image/png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icons/favicon-16-dark.png",
          sizes: "16x16",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/icons/favicon-32.png",
          sizes: "32x32",
          type: "image/png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icons/favicon-32-dark.png",
          sizes: "32x32",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: {
        url: "/icons/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
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
