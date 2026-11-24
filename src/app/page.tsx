import { homeSections, siteConfig } from "@/lib/site";

// Esqueleto de la Home: el contenido de cada sección llega en sus tarjetas de
// la Etapa 2 (Trabajo, Trayectoria, Sobre mí). Las anclas ya existen para el
// header y la barra mobile.
export default function Home() {
  return (
    <main className="mx-auto max-w-[90rem] px-4 md:px-8 xl:px-16">
      <section
        id="inicio"
        aria-labelledby="inicio-titulo"
        className="py-24 md:py-32"
      >
        <h1
          id="inicio-titulo"
          className="text-5xl font-bold tracking-tight md:text-7xl"
        >
          {siteConfig.name}
        </h1>
        <p className="mt-4 font-display text-2xl font-semibold text-foreground-secondary md:text-3xl">
          {siteConfig.role}
        </p>
      </section>

      {homeSections.map(({ id, label }, i) => (
        <section
          key={id}
          id={id}
          aria-labelledby={`${id}-titulo`}
          className="border-t border-border py-16 md:py-24"
        >
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h2 id={`${id}-titulo`} className="mt-2 text-4xl font-bold">
            {label}
          </h2>
        </section>
      ))}
    </main>
  );
}
