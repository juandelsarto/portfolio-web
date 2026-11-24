import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { siteConfig } from "@/lib/site";
import { hasVisibleWork } from "@/lib/work";

const item =
  "inline-flex items-center rounded-full px-5 py-3 text-sm font-medium focus-visible:outline-offset-0";

/** Barra flotante de mobile (Nav/Mobile en Figma): Trabajo, CV y Contacto. */
export function MobileNav() {
  const t = useTranslations();
  const showWork = hasVisibleWork(useLocale());
  return (
    <nav
      aria-label={t("MobileNav.label")}
      className="fixed inset-x-4 bottom-4 z-40 md:hidden"
    >
      <ul className="flex items-center justify-between rounded-full bg-inverse px-1.5 py-1.5 text-inverse-foreground shadow-lg ring-1 ring-inverse-border">
        {showWork && (
          <li>
            <Link href="/#trabajo" className={item}>
              {t("Nav.work")}
            </Link>
          </li>
        )}
        <li>
          <a href={siteConfig.cvUrl} download className={item}>
            {t("Cv.short")}
            <span className="sr-only">{t("Cv.shortSr")}</span>
          </a>
        </li>
        <li>
          <Link
            href="/#contacto"
            className={`${item} bg-primary text-primary-foreground`}
          >
            {t("Nav.contact")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
