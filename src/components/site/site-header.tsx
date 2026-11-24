import { useTranslations } from "next-intl";

import { HeaderAfterHero } from "@/components/site/header-after-hero";
import { LogoSkins } from "@/components/site/logo/logo-skins";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { homeSections, siteConfig } from "@/lib/site";

/** Header fijo del sitio: marca, anclas de la Home, tema y Contacto. */
export function SiteHeader() {
  const t = useTranslations("Nav");
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-15 max-w-[90rem] items-center justify-between gap-6 px-4 md:h-18 md:px-8 xl:px-16">
        <Link href="/" className="flex items-center gap-3 rounded-sm">
          {/* Siempre el logo (el monograma JC queda solo para el favicon de 16 px). */}
          <LogoSkins decorative className="size-8 md:size-9" />
          <span className="text-sm font-semibold md:text-[0.9375rem]">
            {siteConfig.name}
            <span className="sr-only">{t("home")}</span>
          </span>
        </Link>

        <nav aria-label={t("label")} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {homeSections.map(({ id, key }) => (
              <li key={id}>
                <Link
                  href={`/#${id}`}
                  className="rounded-sm text-sm font-medium underline-offset-4 hover:underline"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <HeaderAfterHero />
          <Button asChild className="hidden md:inline-flex">
            <Link href="/#contacto">{t("contact")}</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
