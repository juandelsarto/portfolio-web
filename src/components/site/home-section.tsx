import { cn } from "@/lib/utils";

interface HomeSectionProps {
  id: string;
  /** Número de la sección en la Home ("01", "02", "03"). */
  number: string;
  label: string;
  /** Línea breve bajo la etiqueta (Figma: "De 2 a 4, cada una con…"). */
  description?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Sección numerada de la Home (Figma: "01 Trabajo", "03 Sobre mí"…): etiqueta
 * "03 — Sobre mí" a la izquierda, fija mientras se recorre la sección en
 * desktop, y el contenido a la derecha. En mobile la etiqueta va arriba.
 */
export function HomeSection({
  id,
  number,
  label,
  description,
  className,
  children,
}: HomeSectionProps) {
  const titleId = `${id}-titulo`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col gap-6 border-t border-border py-12 md:py-20 lg:flex-row lg:gap-16",
        className,
      )}
    >
      <div className="lg:w-60 lg:shrink-0">
        <div className="flex flex-col gap-2 lg:sticky lg:top-24">
          <h2
            id={titleId}
            className="font-mono text-xs font-medium tracking-wide uppercase"
          >
            <span aria-hidden="true">{number} — </span>
            {label}
          </h2>
          {description && (
            <p className="text-[0.8125rem] leading-normal text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  );
}
