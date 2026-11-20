# Fondos por skin

Experimento de la tarjeta **[E2] Experimental, sin prioridad: fondo y motion interactivos**. Cada skin tiene tres fondos, todos con los colores de la página Skins de Figma (115:3560).

| Fondo         | Clase                     | Qué hace                                                                                                  |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| Hero animado  | `.skin-section--hero`     | Canvas con una escena por skin que reacciona al puntero, más un velo del color de fondo detrás del texto. |
| A · tonal     | `.skin-section--tonal`    | Mismo tema: `surface-raised` y un patrón suave.                                                           |
| B · contraste | `.skin-section--contrast` | Tema opuesto de la misma skin. En Neon, el otro preset (Neon ↔ Fósforo).                                  |

Para revisarlos: `pnpm dev` y abrir http://localhost:3000/dev/fondos (da 404 en producción).

## Uso

```tsx
import { BackgroundSection } from "@/components/site/backgrounds/BackgroundSection";

<BackgroundSection variant="hero" aria-labelledby="hero-title">…</BackgroundSection>
<BackgroundSection variant="tonal">…</BackgroundSection>
<BackgroundSection variant="contrast">…</BackgroundSection>
```

El color de texto de la sección ya sale de la paleta. Dentro de una sección, los colores se leen con las variables `--skin-*` (por ejemplo `text-(--skin-text-secondary)`).

## Escenas del hero

| Skin      | Escena                                                                            | Sección A · tonal                        | Sección B · contraste                          |
| --------- | --------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| Core      | Grilla de puntos que se aparta del puntero y toma el acento.                      | Grilla de 56 px que se desvanece.        | Trama de puntos y filete de acento de 4 px.    |
| Editorial | Renglones de papel que ondulan; el puntero los levanta. Grano de papel.           | Pautado con margen en el acento y grano. | Doble filete arriba y grano más marcado.       |
| Brutal    | Semitono de impresión; cerca del puntero aparece la capa de acento desregistrada. | Rayado diagonal y bordes de 3 px.        | Semitono en diagonal y bordes de 3 px.         |
| Neon      | Grilla synthwave con sol rayado; el punto de fuga sigue al puntero.               | Scanlines y halo de `accent`.            | Grilla de 40 px y halo de `secondary`.         |
| Y2K       | Blobs holográficos; uno sigue al puntero y deja una estela de destellos.          | Degradé holográfico en las esquinas.     | Destellos de 4 puntas y halo de `accent-fill`. |
| Cassette  | Franjas setentosas que suben en diagonal y ondulan; el puntero las levanta.       | Banda de 4 franjas arriba y grano.       | Banda de franjas abajo y grano.                |

## Reglas

- **Tope de intensidad detrás del texto:** el velo del hero va del 82 % al 0 % del color de fondo (`--skin-scrim-start` y `--skin-scrim-mid`); en mobile pasa a vertical.
- **Contraste sin JavaScript:** `palettes.css` redefine las variables `--skin-*` dentro de `.skin-section--contrast` según `data-skin` y `data-theme` de `<html>`. No hay parpadeo al cargar. Las variables de shadcn (`--background`, `--foreground`…) y la variante `dark:` de Tailwind no cambian dentro de la sección: eso queda para la tarjeta de tokens.
- **Performance:** un solo canvas, DPR tope 2, pausa fuera de pantalla (`IntersectionObserver`) y con la pestaña oculta. El canvas no hace layout.
- **Movimiento reducido:** con `prefers-reduced-motion: reduce` se dibuja un único cuadro y no hay reacción al puntero. Sin puntero (touch), el foco deriva solo.
- **Accesibilidad:** el canvas es decorativo (`aria-hidden`).

## Pendientes y decisiones abiertas

- **Paletas temporales:** `palettes.css` copia los colores de Figma con el prefijo `--skin-`. Se reemplazan por los tokens semánticos cuando cierre "[E1] Pasar la fuente de tokens a DTCG y ampliar el contrato de skin" (preset de fondo y tope de intensidad como tokens).
- **Ids de skin:** se usa `neubrutalista` (como el logo) para la skin Brutal, y `neon` / `fosforo` como temas de Neon.
- **Y2K · dark** es una propuesta derivada de sus tokens light: Figma solo define el tema claro.
- **Brutal · dark** existe en Figma, aunque la tarjeta de diseño de Brutal dice que tiene un solo tema. Confirmar.
- **Neon:** la grilla synthwave dibuja una perspectiva en 2D; revisar si choca con la regla "sin 3D y sin parallax" de `docs/motion.md`.
- Falta sumar el presupuesto de performance de E2 y el chequeo de contraste sobre el fondo en el CI de skins.
