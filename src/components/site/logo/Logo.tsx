import { cn } from "@/lib/utils";

import { LOGO_SVG } from "./logo-markup";

/**
 * Qué combinación de partes muestra el logo.
 * - `auto` (por defecto): la que corresponde a la skin activa (`data-skin` en `<html>`).
 * - El resto fuerza una combinación; sirve para previsualizar en `/dev/ui`.
 */
export type LogoPreset =
  "auto" | "core" | "neubrutalista-a" | "neubrutalista-b";

export interface LogoProps {
  preset?: LogoPreset;
  /**
   * Usar cuando el logo acompaña un texto o un link que ya nombra a Juan
   * (por ejemplo, el link del header con `aria-label`): se oculta a lectores de pantalla.
   */
  decorative?: boolean;
  className?: string;
}

function buildMarkup(preset: LogoPreset, decorative: boolean) {
  let markup = LOGO_SVG.replace(
    'data-preset="auto"',
    `data-preset="${preset}"`,
  );

  if (decorative) {
    markup = markup
      .replace(' aria-label="Juan Cruz Del Sarto"', "")
      .replace(' role="img"', ' aria-hidden="true" focusable="false"')
      .replace("<title>Juan Cruz Del Sarto</title>", "");
  }

  return markup;
}

/**
 * Logo modular: un dibujo de la cara con partes que cambian según la skin
 * (pelo, anteojos, bigote, barba y un extra). El tamaño lo define el contenedor:
 * pasar un ancho con `className` (por ejemplo `w-8`); el alto sale de la proporción.
 * Los colores salen de `--logo-line`, `--logo-hair`, `--logo-accent` y `--logo-skin`,
 * con `currentColor` como respaldo. Ver docs/logo.md.
 */
export function Logo({
  preset = "auto",
  decorative = false,
  className,
}: LogoProps) {
  return (
    <span
      className={cn("inline-block shrink-0", className)}
      // El SVG es estático y propio (logo.svg): no hay contenido de usuarios.
      dangerouslySetInnerHTML={{ __html: buildMarkup(preset, decorative) }}
    />
  );
}
