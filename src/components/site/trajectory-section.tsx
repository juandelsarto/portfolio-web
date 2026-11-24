import { useTranslations } from "next-intl";

import { HomeSection } from "@/components/site/home-section";
import { type Job, TrajectoryList } from "@/components/site/trajectory-list";
import { siteConfig } from "@/lib/site";

/** 02 Trayectoria: los puestos como hitos, con LinkedIn y el CV. */
export function TrajectorySection() {
  const t = useTranslations();
  const jobs = t.raw("Trajectory.jobs") as Job[];

  return (
    <HomeSection
      id="trayectoria"
      number="02"
      label={t("Nav.trajectory")}
      description={t("Trajectory.intro")}
    >
      <TrajectoryList jobs={jobs} />
      <p className="flex flex-wrap gap-6 pt-6 text-sm font-medium">
        <a
          href={siteConfig.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline-offset-4 hover:underline"
        >
          {t("Trajectory.linkedin")}
          <span className="sr-only">{t("Trajectory.newTabSr")}</span>
        </a>
        <a
          href={siteConfig.cvUrl}
          download
          className="text-brand underline-offset-4 hover:underline"
        >
          {t("Cv.downloadArrow")}
          <span className="sr-only">{t("Cv.pdfSr")}</span>
        </a>
      </p>
    </HomeSection>
  );
}
