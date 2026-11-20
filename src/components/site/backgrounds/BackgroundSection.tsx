import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

import { HeroBackground } from "./HeroBackground";

export type BackgroundVariant = "hero" | "tonal" | "contrast";

export interface BackgroundSectionProps extends ComponentPropsWithoutRef<"section"> {
  /**
   * - `hero`: fondo animado de la skin, con velo detrás del texto.
   * - `tonal`: mismo tema, superficie elevada y un patrón suave.
   * - `contrast`: tema opuesto de la misma skin (en Neon, el otro preset).
   */
  variant: BackgroundVariant;
}

/**
 * Sección con uno de los tres fondos de la skin activa. El contenido va en
 * `children`; el color de texto ya sale de la paleta del fondo.
 */
export function BackgroundSection({
  variant,
  className,
  children,
  ...props
}: BackgroundSectionProps) {
  return (
    <section
      {...props}
      data-bg={variant}
      className={cn("skin-section", `skin-section--${variant}`, className)}
    >
      {variant === "hero" && <HeroBackground />}
      {children}
    </section>
  );
}
