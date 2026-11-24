import { useTranslations } from "next-intl";

import { EmailCopy } from "@/components/site/email-copy";
import { siteConfig } from "@/lib/site";

const socials = [
  { label: "LinkedIn", short: "in", href: siteConfig.links.linkedin },
  { label: "GitHub", short: "GH", href: siteConfig.links.github },
] as const;

const mono = "font-mono text-xs tracking-wide uppercase";

/**
 * Contacto y footer (Footer en Figma). Contacto es el CTA principal del sitio:
 * el email va grande y copiable. Siempre en tema oscuro: fondo navy y texto claro.
 */
export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer
      id="contacto"
      // El borde superior es el mismo del header y sigue el tema del sitio:
      // en oscuro separa el footer del fondo de la página, que es del mismo navy.
      className="border-t border-border"
      aria-labelledby="contacto-titulo"
    >
      {/* Siempre en tema oscuro: los tokens se resuelven con sus valores de
          [data-theme="dark"], así el contraste no cambia con el tema del sitio. */}
      <div data-theme="dark" className="bg-background text-foreground">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-9 px-4 pt-16 pb-28 md:px-8 md:pt-24 md:pb-10 xl:px-16">
          <p className={`${mono} text-muted-foreground`}>{t("Footer.label")}</p>

          <div className="flex flex-col gap-4">
            <h2 id="contacto-titulo" className="text-3xl font-bold">
              {t("Footer.title")}
            </h2>
            <p className="max-w-xl text-foreground">{t("Footer.body")}</p>
          </div>

          <EmailCopy size="grande" />

          <div className="flex flex-wrap items-center gap-5">
            <ul className="flex items-center gap-3">
              {socials.map(({ label, short, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong font-mono text-xs font-medium hover:bg-accent"
                  >
                    {/* El nombre accesible empieza con el texto visible (WCAG 2.5.3). */}
                    {short}
                    <span className="sr-only">
                      {t("Footer.socialSr", { network: label })}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <span aria-hidden="true" className="h-6 w-px bg-border" />
            <a
              href={siteConfig.cvUrl}
              download
              className="font-medium underline-offset-4 hover:underline"
            >
              {t("Cv.downloadArrow")}
              <span className="sr-only">{t("Cv.pdfSr")}</span>
            </a>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-5 md:flex-row md:items-center md:justify-between">
            <p className={`${mono} text-muted-foreground`}>
              {t("Footer.copyright", {
                year,
                name: siteConfig.name,
                location: t("Site.location"),
              })}
            </p>
            <p
              className={`${mono} flex flex-wrap gap-x-2 text-muted-foreground`}
            >
              <span>{t("Footer.stack")}</span>
              <a
                href={siteConfig.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {t("Footer.code")}
                <span className="sr-only">{t("Footer.newTabSr")}</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
