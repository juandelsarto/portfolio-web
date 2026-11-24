import { cn } from "@/lib/utils";

import { LOGO_DARK_SVG, LOGO_LIGHT_SVG } from "./logo-markup";

export interface LogoProps {
  /**
   * Usar cuando el logo acompaña un texto o un link que ya nombra a Juan
   * (por ejemplo, el link del header): se oculta a lectores de pantalla.
   */
  decorative?: boolean;
  className?: string;
}

/**
 * Logo: la cara de Juan, en el color de acento. Tiene dos dibujos, igual que
 * el componente Logo de Figma: `Tema=Claro` (el original) y `Tema=Oscuro` (el
 * mismo dibujo invertido, con borde externo). Se muestra el del tema activo
 * con CSS (`data-theme` en `<html>`), así que no hay parpadeo al cargar ni
 * JavaScript. El tamaño lo define el contenedor: pasar un ancho con
 * `className` (por ejemplo `w-8`); el lienzo es cuadrado. Ver docs/logo.md.
 */
export function Logo({ decorative = false, className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-block aspect-square shrink-0 overflow-hidden align-middle text-brand",
        className,
      )}
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": "Juan Cruz Del Sarto" })}
    >
      {/* Los SVG son estáticos y propios (exportados de Figma): no hay contenido de usuarios. */}
      <span
        className="block size-full dark:hidden [&>svg]:size-full"
        dangerouslySetInnerHTML={{ __html: LOGO_LIGHT_SVG }}
      />
      <span
        className="hidden size-full dark:block [&>svg]:size-full"
        dangerouslySetInnerHTML={{ __html: LOGO_DARK_SVG }}
      />
    </span>
  );
}
