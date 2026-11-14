# Logo

El logo es un dibujo de la cara de Juan. La cara se mantiene reconocible en todas las skins; lo que cambia son partes sueltas: el pelo, los anteojos, el bigote, la barba y un extra opcional.

- **Fuente única:** `src/components/site/logo/logo.svg`.
- **Componente:** `Logo` (`src/components/site/logo/Logo.tsx`).
- **Figma:** sección "Logo modular (E1)" en la página Design System. El component set `Logo` tiene una variante por skin, y las partes están en `Logo/Pelo`, `Logo/Anteojos`, `Logo/Bigote`, `Logo/Barba`, `Logo/Extra` y `Logo/Base`.

## Estructura

Un solo SVG (`viewBox="-4 -4 312 462"`) con todas las variantes de cada parte. Cada variante es un elemento con tres atributos:

| Atributo       | Qué indica                   | Ejemplo                                                  |
| -------------- | ---------------------------- | -------------------------------------------------------- |
| `data-part`    | La parte                     | `hair`, `glasses`, `mustache`, `beard`, `extra`, `brows` |
| `data-variant` | La variante de esa parte     | `pompadour`, `square-bold`, `shades`                     |
| `data-in`      | En qué combinaciones aparece | `core neubrutalista`                                     |

`brows` (las cejas) es la base fija: tiene `data-in="all"` y se ve siempre.

| Parte      | Variantes                                        |
| ---------- | ------------------------------------------------ |
| `hair`     | `pompadour` (Core), `pompadour-flat`, `flat-top` |
| `glasses`  | `classic` (Core), `square-bold`, `shades`        |
| `mustache` | `classic` (Core), `block`                        |
| `beard`    | `full` (Core), `goatee-block`                    |
| `extra`    | `sticker` (Core no tiene extra)                  |

## Cómo cambia con la skin

El `<style>` interno del SVG oculta todas las variantes y muestra solo las que corresponden:

- Con `data-preset="auto"` (por defecto), según `data-skin` en `<html>`: se ven las que tienen `core` o `neubrutalista` en `data-in`.
- Con un preset forzado (`core`, `neubrutalista-a`, `neubrutalista-b`), se ven las que tienen ese preset. Sirve para revisar las propuestas en `/dev/ui`.

```tsx
<Logo className="w-8" />                    // sigue la skin activa
<Logo preset="neubrutalista-b" className="w-24" />
<Logo decorative className="w-8" />         // dentro de un link que ya tiene aria-label
```

**Neubrutalista está pendiente de elección.** Hay dos propuestas en Figma:

- **A:** jopo plano con contorno, anteojos cuadrados gruesos, y el bigote y la barba de Core.
- **B:** flat-top, lentes de sol en bloque, bigote y chivita en bloque, y un sticker de estrella.

Hasta que se elija, Neubrutalista muestra las partes de Core. Al elegir, se agrega `neubrutalista` al `data-in` de las variantes elegidas y se saca de las de Core.

### Agregar una skin

1. Dibujar en Figma las variantes nuevas de las partes que cambian, dentro de los component sets `Logo/*`, sobre el mismo lienzo de 312 × 462.
2. Sumar una variante de skin al set `Logo`.
3. En `logo.svg`, agregar los elementos nuevos con su `data-part`, `data-variant` y `data-in`. A las partes que se reutilizan, sumarles el nombre de la skin en `data-in`.
4. Agregar la regla de la skin en el `<style>` del SVG, igual que la de `neubrutalista`.
5. Correr `pnpm logo:build` para regenerar `logo-markup.ts`; un test verifica que estén sincronizados.

### Ideas para las skins de E9

- **Editorial:** pelo peinado al costado, anteojos redondos finos y sin barba completa.
- **Neón:** anteojos tipo visor con brillo en `--logo-accent` y un mechón de color en el pelo.
- **Y2K:** anteojos ovalados de color, pelo con puntas y un extra de estrellitas.
- **Scrapbook:** partes como recortes con borde blanco y un extra de cinta adhesiva.

## Colores

El SVG no tiene colores fijos. Usa cuatro variables CSS:

| Variable        | Qué pinta                                         | Respaldo       |
| --------------- | ------------------------------------------------- | -------------- |
| `--logo-line`   | Cejas, anteojos, bigote, barba y contornos        | `currentColor` |
| `--logo-hair`   | Pelo                                              | `--logo-line`  |
| `--logo-accent` | Brillos del pelo y extras                         | transparente   |
| `--logo-skin`   | Relleno de los lentes en los anteojos de contorno | transparente   |

En Figma son los tokens de componente `logo/line`, `logo/hair` y `logo/accent`, que apuntan a `color/text-primary`, `color/text-primary` y `color/pattern`. Se definen en CSS en la tarjeta "[E1] Implementar los tokens en CSS"; mientras tanto el logo toma el color del texto.

## Accesibilidad

- Por defecto tiene `role="img"`, `aria-label` y `<title>` con el nombre "Juan Cruz Del Sarto".
- Con `decorative`, queda con `aria-hidden="true"` y sin título. Va dentro de un link que ya tiene su propio nombre accesible, como el del header ("Juan Cruz Del Sarto, ir al inicio").
- Se ve nítido de 16 a 200 px de ancho; se verificó renderizando a esos tamaños. A 16 px los brillos del pelo se pierden, pero la silueta se sigue reconociendo.
