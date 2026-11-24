import Link from "next/link";

import { HeaderAfterHero } from "@/components/site/header-after-hero";
import { Monogram } from "@/components/site/monogram";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import { homeSections, siteConfig } from "@/lib/site";

/** Header fijo del sitio: marca, anclas de la Home, tema y Contacto. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-15 max-w-[90rem] items-center justify-between gap-6 px-4 md:h-18 md:px-8 xl:px-16">
        <Link href="/" className="flex items-center gap-3 rounded-sm">
          <Monogram className="size-6 text-xl md:size-7 md:text-2xl" />
          <span className="text-sm font-semibold md:text-[0.9375rem]">
            {siteConfig.name}
            <span className="sr-only">, ir al inicio</span>
          </span>
        </Link>

        <nav aria-label="Secciones" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {homeSections.map(({ id, label }) => (
              <li key={id}>
                <Link
                  href={`/#${id}`}
                  className="rounded-sm text-sm font-medium underline-offset-4 hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <HeaderAfterHero />
          <Button asChild className="hidden md:inline-flex">
            <Link href="/#contacto">Contacto</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
