import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { AboutSection } from "@/components/site/about-section";
import { Hero } from "@/components/site/hero";
import { HomeSection } from "@/components/site/home-section";
import { showWork } from "@/lib/site";

// Home: Hero · 01 Trabajo · 02 Trayectoria · 03 Sobre mí · Contacto (footer).
// Trabajo y Trayectoria todavía son esqueletos: su contenido llega con sus
// tarjetas de la Etapa 2.
export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Nav");

  return (
    <main className="mx-auto max-w-[90rem] px-4 md:px-8 xl:px-16">
      <Hero />
      {showWork && (
        <HomeSection id="trabajo" number="01" label={t("work")}>
          {null}
        </HomeSection>
      )}
      <HomeSection id="trayectoria" number="02" label={t("trajectory")}>
        {null}
      </HomeSection>
      <AboutSection />
    </main>
  );
}
