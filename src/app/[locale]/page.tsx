import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { AboutSection } from "@/components/site/about-section";
import { Hero } from "@/components/site/hero";
import { HomeSection } from "@/components/site/home-section";
import { WorkSection } from "@/components/site/work/work-section";

// Home: Hero · 01 Trabajo · 02 Trayectoria · 03 Sobre mí · Contacto (footer).
// Trayectoria todavía es un esqueleto: su contenido llega con su tarjeta de la
// Etapa 2.
export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Nav");

  return (
    <main className="mx-auto max-w-[90rem] px-4 md:px-8 xl:px-16">
      <Hero />
      <WorkSection locale={locale} />
      <HomeSection id="trayectoria" number="02" label={t("trajectory")}>
        {null}
      </HomeSection>
      <AboutSection />
    </main>
  );
}
