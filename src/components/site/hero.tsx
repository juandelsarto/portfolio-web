import { useLocale, useTranslations } from "next-intl";

import { EmailCopy } from "@/components/site/email-copy";
import { Logo } from "@/components/site/logo/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { hasVisibleWork } from "@/lib/work";

/**
 * Hero de la Home (Figma: Home v3 → Hero). A la derecha va el escenario del
 * logo en su versión estática: el logo animado es el ítem experimental de la
 * Etapa 2 y esta es su alternativa sin movimiento.
 */
export function Hero() {
  const t = useTranslations();
  const showWork = hasVisibleWork(useLocale());
  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className="flex flex-col gap-8 pt-10 pb-12 md:py-24 xl:flex-row xl:items-center xl:justify-between xl:gap-8"
    >
      <div className="flex min-w-0 flex-col gap-7 xl:max-w-[52.5rem]">
        <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          {t("Site.location")}
        </p>

        <h1
          id="inicio-titulo"
          className="text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em] md:text-5xl md:leading-none lg:text-[4.25rem]"
        >
          <span className="block">{siteConfig.name}</span>{" "}
          {/* Dos líneas: nombre y rol. El rol no se parte ("y UI" no queda sola). */}
          <span className="block text-balance text-muted-foreground xl:whitespace-nowrap">
            {t("Site.role")}
          </span>
        </h1>

        <p className="max-w-[41.25rem] text-base leading-[1.45] text-foreground-secondary md:text-[1.3125rem]">
          {t("Hero.lead")} {t("Hero.proposal")}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {showWork && (
            <Button asChild>
              <Link href="/#trabajo">{t("Hero.ctaWork")}</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href={siteConfig.cvUrl} download>
              {t("Cv.download")}
              <span className="sr-only">{t("Cv.pdfSr")}</span>
            </a>
          </Button>
          <EmailCopy />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="flex shrink-0 xl:size-110 xl:items-center xl:justify-center xl:rounded-sm xl:border xl:border-border xl:bg-muted"
      >
        <Logo decorative className="w-22 xl:w-42" />
      </div>
    </section>
  );
}
