import { useTranslations } from "next-intl";

/** "Ir al contenido principal": el primer elemento con Tab. */
export function SkipLink() {
  const t = useTranslations();
  return (
    <a
      href="#contenido"
      className="sr-only z-50 rounded-sm bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      {t("SkipLink")}
    </a>
  );
}
