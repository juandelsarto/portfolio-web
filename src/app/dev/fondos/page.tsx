import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackgroundSection } from "@/components/site/backgrounds/BackgroundSection";

import { SkinSwitcher } from "./SkinSwitcher";

export const metadata: Metadata = {
  title: "Fondos por skin (desarrollo)",
};

const projects = [
  {
    title: "Boarding RSVP",
    summary: "RSVP, admin con ⌘K y modo puerta offline.",
  },
  {
    title: "Configurador de armarios",
    summary: "White-label, con Storybook público.",
  },
  {
    title: "Lab",
    summary: "Piezas cortas con código en vivo.",
  },
];

const wrap = "mx-auto w-full max-w-6xl px-6 md:px-12";
const eyebrow =
  "mb-5 font-mono text-xs tracking-widest text-(--skin-text-muted) uppercase";
const h2 = "max-w-[18ch] text-4xl font-semibold tracking-tight md:text-5xl";

// Página interna para revisar los tres fondos de cada skin (tarjeta [E2]
// fondo y motion interactivos). No se publica en producción.
export default function DevFondosPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <>
      <SkinSwitcher />
      <main>
        <BackgroundSection
          variant="hero"
          aria-labelledby="hero-title"
          className="flex min-h-[min(88vh,820px)] items-center py-24"
        >
          <div className={wrap}>
            <p className={eyebrow}>Hero · animado</p>
            <h1
              id="hero-title"
              className="max-w-[12ch] text-5xl leading-none font-semibold tracking-tight md:text-7xl"
            >
              Diseño adaptable
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-(--skin-text-secondary)">
              Mové el puntero sobre el fondo. Con movimiento reducido queda un
              cuadro fijo.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#tonal"
                className="rounded-lg bg-(--skin-accent-fill) px-5 py-3.5 text-sm font-semibold text-(--skin-on-accent)"
              >
                Ver la sección tonal
              </a>
              <a
                href="#contraste"
                className="rounded-lg border-2 border-(--skin-border-strong) px-5 py-3.5 text-sm font-semibold"
              >
                Ver el contraste
              </a>
            </div>
          </div>
        </BackgroundSection>

        <BackgroundSection
          variant="tonal"
          id="tonal"
          aria-labelledby="tonal-title"
          className="py-24 md:py-32"
        >
          <div className={wrap}>
            <p className={eyebrow}>Sección A · tonal</p>
            <h2 id="tonal-title" className={h2}>
              Proyectos seleccionados
            </h2>
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {projects.map((project) => (
                <li
                  key={project.title}
                  className="rounded-xl border border-(--skin-border) bg-(--skin-surface) p-6"
                >
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="mt-2 text-sm text-(--skin-text-secondary)">
                    {project.summary}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </BackgroundSection>

        <BackgroundSection
          variant="contrast"
          id="contraste"
          aria-labelledby="contrast-title"
          className="py-24 md:py-32"
        >
          <div className={wrap}>
            <p className={eyebrow}>Sección B · contraste (tema opuesto)</p>
            <h2 id="contrast-title" className={h2}>
              Sistemas, tokens y detalle
            </h2>
            <p className="mt-6 max-w-[60ch] leading-relaxed text-(--skin-text-secondary)">
              Esta sección carga el tema opuesto de la misma skin. Las variables
              se redefinen dentro de la sección, así que el contenido no
              necesita estilos propios.
            </p>
          </div>
        </BackgroundSection>

        <BackgroundSection
          variant="tonal"
          aria-labelledby="tonal-2-title"
          className="py-24 md:py-32"
        >
          <div className={wrap}>
            <p className={eyebrow}>Sección A · otra vez, para ver el ritmo</p>
            <h2 id="tonal-2-title" className={h2}>
              Un texto largo se lee sin esfuerzo
            </h2>
            <p className="mt-6 max-w-[60ch] leading-relaxed text-(--skin-text-secondary)">
              Los patrones tonales quedan por debajo del tope de intensidad: el
              texto de cuerpo de un caso tiene que leerse con buen contraste y
              una medida cómoda.
            </p>
          </div>
        </BackgroundSection>
      </main>
    </>
  );
}
