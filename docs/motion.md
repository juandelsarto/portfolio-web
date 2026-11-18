# Principios de motion

Reglas de movimiento comunes a todas las skins. Cada interacción usa una velocidad según su rol. Lo que entra lo hace con ease-out y lo que sale, con ease-in.

- **Solo movimiento 2D:** color, fondo, borde, sombra, opacidad y desplazamiento. Sin 3D y sin parallax.
- **Por skin:** cada skin puede ajustar los valores, pero nunca qué se anima ni la regla de movimiento reducido.
- **Fuente:** las variables `motion/*` de la colección **Skin** de Figma, en el frame "Principios de motion" de la página Design System.
- **CSS:** los tokens se implementan en la tarjeta "[E1] Implementar los tokens en CSS". Este documento define los nombres y valores.

## 01 · Tokens

En CSS, cada token lleva la ruta de Figma con guiones.

### Duraciones

| Token                    | CSS                        | Core   | Neubrutalista (propuesta) | Uso                                             |
| ------------------------ | -------------------------- | ------ | ------------------------- | ----------------------------------------------- |
| `motion/duration/micro`  | `--motion-duration-micro`  | 80 ms  | 60 ms                     | press, toggle, check                            |
| `motion/duration/fast`   | `--motion-duration-fast`   | 120 ms | 80 ms                     | hover y foco (color, borde, sombra); cierres    |
| `motion/duration/base`   | `--motion-duration-base`   | 200 ms | 140 ms                    | menús, dropdowns, toasts, cambio de skin y tema |
| `motion/duration/slow`   | `--motion-duration-slow`   | 320 ms | 200 ms                    | navegación mobile, secciones, páginas           |
| `motion/duration/slower` | `--motion-duration-slower` | 600 ms | 360 ms                    | momentos puntuales (hero); usar poco            |

### Curvas

| Token                      | CSS                          | Core                           | Neubrutalista (propuesta)      | Uso                                             |
| -------------------------- | ---------------------------- | ------------------------------ | ------------------------------ | ----------------------------------------------- |
| `motion/easing/standard`   | `--motion-easing-standard`   | `cubic-bezier(0.2, 0, 0, 1)`   | `cubic-bezier(0.4, 0, 0.2, 1)` | cambios dentro de la pantalla                   |
| `motion/easing/enter`      | `--motion-easing-enter`      | `cubic-bezier(0, 0, 0, 1)`     | `cubic-bezier(0, 0, 0.2, 1)`   | ease-out: lo que entra                          |
| `motion/easing/exit`       | `--motion-easing-exit`       | `cubic-bezier(0.3, 0, 1, 1)`   | `cubic-bezier(0.4, 0, 1, 1)`   | ease-in: lo que sale                            |
| `motion/easing/emphasized` | `--motion-easing-emphasized` | `cubic-bezier(0.3, 0, 0, 1.3)` | `cubic-bezier(0.2, 0, 0, 1)`   | rebote leve: confirmación, selección; usar poco |
| `motion/easing/linear`     | `--motion-easing-linear`     | `linear`                       | `linear`                       | opacidad continua, progreso                     |

### Distancias y stagger

Las distancias son múltiplos de 4.

| Token                | CSS                    | Core  | Neubrutalista (propuesta) |
| -------------------- | ---------------------- | ----- | ------------------------- |
| `motion/distance/xs` | `--motion-distance-xs` | 4 px  | 4 px                      |
| `motion/distance/sm` | `--motion-distance-sm` | 8 px  | 8 px                      |
| `motion/distance/md` | `--motion-distance-md` | 16 px | 16 px                     |
| `motion/distance/lg` | `--motion-distance-lg` | 24 px | 24 px                     |
| `motion/stagger`     | `--motion-stagger`     | 40 ms | 0 ms                      |

`motion/stagger` es el retraso entre los ítems de una lista cuando aparecen.

## 02 · Qué se anima

| Interacción                            | Propiedades                              | Duración      | Curva        | Desplazamiento                        |
| -------------------------------------- | ---------------------------------------- | ------------- | ------------ | ------------------------------------- |
| Hover de botón, link o tarjeta         | color, fondo, borde, sombra              | fast          | standard     | tarjeta: `-xs` en Y                   |
| Press (activo)                         | fondo, sombra                            | micro         | standard     | —                                     |
| Foco visible                           | anillo de foco                           | sin animación | —            | —                                     |
| Menú o dropdown: abrir                 | opacidad + desplazamiento                | base          | enter        | `xs` desde arriba                     |
| Menú o dropdown: cerrar                | opacidad                                 | fast          | exit         | —                                     |
| Navegación mobile: abrir               | opacidad + desplazamiento                | slow          | enter        | `lg` desde arriba                     |
| Navegación mobile: cerrar              | opacidad + desplazamiento                | base          | exit         | `lg` hacia arriba                     |
| Aparición de secciones (scroll)        | opacidad + desplazamiento, una sola vez  | slow          | enter        | `md` desde abajo; ítems con `stagger` |
| Cambio de skin o tema                  | color, fondo, borde, sombra (sin layout) | base          | standard     | —                                     |
| Navegación entre páginas o casos       | opacidad + desplazamiento                | slow          | standard     | `sm`                                  |
| Toast: entrar / salir                  | opacidad + desplazamiento                | base / fast   | enter / exit | `sm` desde abajo                      |
| Confirmación (copiar email, selección) | color, ícono                             | base          | emphasized   | —                                     |

Criterios:

- El foco nunca se anima: tiene que verse en el instante en que llega.
- Nada cambia el layout mientras se anima. Se anima `opacity`, `transform: translate` y los colores, nunca `width`, `height` ni `top`.
- Se anima solo lo que da información: el estado, de dónde viene algo o adónde va.

## 03 · Movimiento reducido

Aplica cuando el sistema pide `prefers-reduced-motion: reduce`.

- Sin desplazamientos ni escalas: solo fundidos de opacidad de hasta `fast` (120 ms), o nada.
- Las secciones aparecen visibles desde el inicio, sin reveal.
- El cambio de skin y tema es instantáneo.
- Nada se mueve en loop ni de forma automática.

En código, un bloque media query pone las distancias en 0 y acorta las duraciones:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-distance-xs: 0px;
    --motion-distance-sm: 0px;
    --motion-distance-md: 0px;
    --motion-distance-lg: 0px;
    --motion-stagger: 0ms;
    --motion-duration-slow: var(--motion-duration-fast);
    --motion-duration-slower: var(--motion-duration-fast);
  }
}
```

## 04 · Ajustes por skin

Los valores cambian con `data-skin` en `<html>`, igual que el resto de los tokens de la colección Skin.

- **Core:** valores de referencia.
- **Neubrutalista** (propuesta, pendiente de Juan): más seco y rápido, sin rebote. Los cambios de estado se sienten como "clics".
- **Editorial** (E9): más suave y lento (duraciones ×1.25, curva standard), sin desplazamientos o sin animación.
- **Neón** (E9): más veloz (duraciones ×0.75). Los brillos aparecen con opacidad, nunca parpadean.
- **Y2K** (E9): puede usar `emphasized` (rebote) en más interacciones.
- **Scrapbook** (E9): leves rotaciones 2D (±2°) en el hover de tarjetas y stickers.

Ninguna skin cambia qué se anima ni la regla de movimiento reducido.
