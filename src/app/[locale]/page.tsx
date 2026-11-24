import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { AboutSection } from "@/components/site/about-section";
import { Hero } from "@/components/site/hero";
import { TrajectorySection } from "@/components/site/trajectory-section";
import { WorkSection } from "@/components/site/work/work-section";

// Home: Hero · 01 Trabajo · 02 Trayectoria · 03 Sobre mí · Contacto (footer).
export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-[90rem] px-4 md:px-8 xl:px-16">
      <Hero />
      <WorkSection locale={locale} />
      <TrajectorySection />
      <AboutSection />
    </main>
  );
}
