import { cn } from "@/lib/utils";

import { LOGO_SVG } from "./logo-markup";

export interface LogoProps {
  /**
   * Usar cuando el logo acompaña un texto o un link que ya nombra a Juan
   * (por ejemplo, el link del header con `aria-label`): se oculta a lectores de pantalla.
   */
  decorative?: boolean;
  className?: string;
}

function buildMarkup(decorative: boolean) {
  if (!decorative) return LOGO_SVG;
  return LOGO_SVG.replace(' aria-label="Juan Cruz Del Sarto"', "")
    .replace(' role="img"', ' aria-hidden="true" focusable="false"')
    .replace("<title>Juan Cruz Del Sarto</title>", "");
}

/**
 * Logo: un dibujo de la cara de Juan (pelo, cejas, anteojos, bigote y barba).
 * El tamaño lo define el contenedor: pasar un ancho con `className` (por
 * ejemplo `w-8`); el alto sale de la proporción. El color sale de `--logo-line`
 * y `--logo-hair` (el acento, en globals.css), con `currentColor` como
 * respaldo. Ver docs/logo.md.
 */
export function Logo({ decorative = false, className }: LogoProps) {
  return (
    <span
      className={cn("inline-block shrink-0", className)}
      // El SVG es estático y propio (logo.svg): no hay contenido de usuarios.
      dangerouslySetInnerHTML={{ __html: buildMarkup(decorative) }}
    />
  );
}
