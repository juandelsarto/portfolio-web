import { useTranslations } from "next-intl";

import { HomeSection } from "@/components/site/home-section";
import { type PieceSummary, WorkList } from "@/components/site/work/work-list";
import { getVisiblePieces } from "@/lib/work";

/** 01 Trabajo: no se muestra si no hay piezas para ver (nunca un estado vacío). */
export function WorkSection({ locale }: { locale: string }) {
  const t = useTranslations();
  const pieces = getVisiblePieces(locale);
  if (pieces.length === 0) return null;

  const summaries: PieceSummary[] = pieces.map((p) => ({
    slug: p.slug,
    title: p.title,
    line: p.line,
    type: p.type,
    status: p.status,
    featured: p.featured,
    simulated: p.simulated,
    version: p.version,
    stack: p.stack,
    cover: p.cover,
    demoUrl: p.demoUrl,
  }));

  return (
    <HomeSection
      id="trabajo"
      number="01"
      label={t("Nav.work")}
      description={t("Work.intro")}
    >
      <WorkList pieces={summaries} />
    </HomeSection>
  );
}
