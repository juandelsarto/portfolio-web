# Logo

El logo es la cara de Juan, de un solo color: el acento de la paleta Core (`--color-text-accent`, que vale `#c03b16` en claro y `#e7552e` en oscuro).

Tiene dos dibujos, uno por tema, igual que el componente `Logo` de Figma (página Design System):

| Tema   | Figma         | Archivo                                   | Dibujo                                       |
| ------ | ------------- | ----------------------------------------- | -------------------------------------------- |
| Claro  | `Tema=Claro`  | `src/components/site/logo/logo-light.svg` | el original                                  |
| Oscuro | `Tema=Oscuro` | `src/components/site/logo/logo-dark.svg`  | el mismo dibujo invertido, con borde externo |

- **Componente:** `Logo` (`src/components/site/logo/Logo.tsx`). Renderiza los dos SVG y muestra el del tema activo con CSS (`dark:hidden` / `dark:block`, ligados a `data-theme` en `<html>`): no hay parpadeo al cargar ni JavaScript.
- **Lienzo:** cuadrado (`viewBox="0 0 440 440"`). El tamaño lo da el contenedor: pasar un ancho con `className` (por ejemplo `w-8`).
- **Color:** los SVG usan `fill="currentColor"` y el componente aplica `text-brand`. Sin colores fijos.
- **Accesibilidad:** por defecto es `role="img"` con el nombre "Juan Cruz Del Sarto"; con `decorative` se oculta a lectores de pantalla (cuando el link ya nombra a Juan, como en el header).
- **Dónde va:** en todo el sitio, incluido el header (siempre visible) y el favicon de 32 px.
- **Favicon de 16 px:** es el único lugar del monograma JC (Afacad Flux, sin fondo, color acento; frame "Marca" en Figma), porque a ese tamaño la cara no se lee.

## Skins archivadas

Los logos de las skins anteriores a Core (Cassette, Y2K, Neon, Brutal y Editorial) quedan en Figma como `Archivo · Logo (skins)` y no se usan como logo.

`LogoSkins` (`src/components/site/logo/logo-skins.tsx`) envuelve al `Logo` y, mientras el puntero está encima, los recorre uno cada 0,7 s según el tema activo (Y2K no tiene versión oscura: usa la clara). Al salir vuelve al logo. Con `prefers-reduced-motion: reduce` no cambia, y en pantallas táctiles no se activa. Las imágenes (`public/logo/skins/*.webp`, 192 × 192, exportadas de Figma) se cargan recién en el primer hover. Se usa en el header.

En Figma, el set de archivo tiene la misma interacción en el prototipo: al entrar el puntero empieza a cambiar cada 0,7 s y al salir vuelve a la primera variante.

## Actualizar el logo

1. Exportar las variantes `Tema=Claro` y `Tema=Oscuro` de Figma como SVG, cambiar el color por `fill="currentColor"` en el `<svg>` y sacar el `clip-path`.
2. Reemplazar `logo-light.svg` y `logo-dark.svg`.
3. Correr `pnpm logo:build` (regenera `logo-markup.ts`) y `pnpm test`.
