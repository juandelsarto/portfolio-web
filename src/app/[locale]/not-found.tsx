import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <main className="mx-auto flex max-w-[90rem] flex-col items-start gap-6 px-4 py-24 md:px-8 md:py-32 xl:px-16">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        {t("label")}
      </p>
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
        {t("title")}
      </h1>
      <Button asChild>
        <Link href="/">{t("back")}</Link>
      </Button>
    </main>
  );
}
