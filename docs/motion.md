# Principios de motion

Reglas de movimiento del sitio, para la identidad Core en tema claro y oscuro. Cada interacción usa una velocidad según su rol. Lo que entra lo hace con ease-out y lo que sale, con ease-in.

- **CSS primero:** transiciones, scroll-driven animations y View Transitions resuelven casi todo. Motion (motion.dev) entra solo donde CSS no alcanza (ver "04 · CSS o Motion").
- **Solo movimiento 2D:** color, fondo, borde, sombra, opacidad y desplazamiento. Sin 3D y sin parallax.
- **El contenido existe sin la animación:** nada queda oculto esperando que una animación termine.
- **Fuente:** las variables `motion/*` de Figma, en el frame "Principios de motion" de la página Design System. Los tokens se implementan en CSS en la tarjeta de tokens de la Etapa 1.

## 01 · Tokens

En CSS, cada token lleva la ruta de Figma con guiones.

### Duraciones

| Token                    | CSS                        | Core   | Uso                                          |
| ------------------------ | -------------------------- | ------ | -------------------------------------------- |
| `motion/duration/micro`  | `--motion-duration-micro`  | 80 ms  | press, toggle, check                         |
| `motion/duration/fast`   | `--motion-duration-fast`   | 120 ms | hover y foco (color, borde, sombra); cierres |
| `motion/duration/base`   | `--motion-duration-base`   | 200 ms | menús, dropdowns, toasts, cambio de tema     |
| `motion/duration/slow`   | `--motion-duration-slow`   | 320 ms | navegación mobile, secciones, páginas        |
| `motion/duration/slower` | `--motion-duration-slower` | 600 ms | momentos puntuales (hero); usar poco         |

### Curvas

| Token                      | CSS                          | Core                           | Uso                                             |
| -------------------------- | ---------------------------- | ------------------------------ | ----------------------------------------------- |
| `motion/easing/standard`   | `--motion-easing-standard`   | `cubic-bezier(0.2, 0, 0, 1)`   | cambios dentro de la pantalla                   |
| `motion/easing/enter`      | `--motion-easing-enter`      | `cubic-bezier(0, 0, 0, 1)`     | ease-out: lo que entra                          |
| `motion/easing/exit`       | `--motion-easing-exit`       | `cubic-bezier(0.3, 0, 1, 1)`   | ease-in: lo que sale                            |
| `motion/easing/emphasized` | `--motion-easing-emphasized` | `cubic-bezier(0.3, 0, 0, 1.3)` | rebote leve: confirmación, selección; usar poco |
| `motion/easing/linear`     | `--motion-easing-linear`     | `linear`                       | opacidad continua, progreso                     |

### Distancias y stagger

Las distancias son múltiplos de 4.

| Token                | CSS                    | Core  |
| -------------------- | ---------------------- | ----- |
| `motion/distance/xs` | `--motion-distance-xs` | 4 px  |
| `motion/distance/sm` | `--motion-distance-sm` | 8 px  |
| `motion/distance/md` | `--motion-distance-md` | 16 px |
| `motion/distance/lg` | `--motion-distance-lg` | 24 px |
| `motion/stagger`     | `--motion-stagger`     | 40 ms |

`motion/stagger` es el retraso entre los ítems de una lista cuando aparecen.

## 02 · Qué se anima

| Interacción                                | Propiedades                                           | Duración      | Curva        | Desplazamiento                        |
| ------------------------------------------ | ----------------------------------------------------- | ------------- | ------------ | ------------------------------------- |
| Hover de botón, link o tarjeta             | color, fondo, borde, sombra                           | fast          | standard     | tarjeta: `-xs` en Y                   |
| Press (activo)                             | fondo, sombra                                         | micro         | standard     | —                                     |
| Foco visible                               | anillo de foco                                        | sin animación | —            | —                                     |
| Menú o dropdown: abrir                     | opacidad + desplazamiento                             | base          | enter        | `xs` desde arriba                     |
| Menú o dropdown: cerrar                    | opacidad                                              | fast          | exit         | —                                     |
| Navegación mobile: abrir                   | opacidad + desplazamiento                             | slow          | enter        | `lg` desde arriba                     |
| Navegación mobile: cerrar                  | opacidad + desplazamiento                             | base          | exit         | `lg` hacia arriba                     |
| Aparición de secciones (scroll)            | opacidad + desplazamiento, una sola vez               | slow          | enter        | `md` desde abajo; ítems con `stagger` |
| Cambio de tema                             | color, fondo, borde, sombra (sin layout)              | base          | standard     | —                                     |
| Navegación entre piezas                    | opacidad + desplazamiento                             | slow          | standard     | `sm`                                  |
| Toast: entrar / salir                      | opacidad + desplazamiento                             | base / fast   | enter / exit | `sm` desde abajo                      |
| Confirmación (copiar email, selección)     | color, ícono                                          | base          | emphasized   | —                                     |
| Vista previa de la demo (hover en Trabajo) | opacidad de la imagen o el video                      | base          | enter        | —                                     |
| Filtros de Trabajo: reordenar la grilla    | opacidad + desplazamiento (sin layout animado en CSS) | base          | standard     | según la posición nueva               |
| Detalle de Trayectoria: abrir / cerrar     | opacidad + alto del contenido                         | base / fast   | enter / exit | —                                     |

Criterios:

- El foco nunca se anima: tiene que verse en el instante en que llega.
- Nada cambia el layout mientras se anima. Se anima `opacity`, `transform: translate` y los colores, nunca `width`, `height` ni `top`. Única excepción: el detalle desplegable de Trayectoria, con las técnicas de "04 · CSS o Motion".
- Se anima solo lo que da información: el estado, de dónde viene algo o adónde va.

## 03 · Movimiento reducido

Aplica cuando el sistema pide `prefers-reduced-motion: reduce`.

- Sin desplazamientos ni escalas: solo fundidos de opacidad de hasta `fast` (120 ms), o nada.
- Las secciones aparecen visibles desde el inicio, sin reveal.
- El cambio de tema es instantáneo.
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

## 04 · CSS o Motion

La regla: si CSS lo resuelve con el mismo resultado y accesibilidad, va en CSS. Motion se usa como diferencial en componentes puntuales, cargado con `LazyMotion` y el componente `m`, solo donde se importa.

| Interacción                                                 | Técnica                                                                                                             | Por qué                                                                |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Hover, press, foco, menús, toasts, copiar email             | Transiciones CSS con los tokens                                                                                     | Cambios de estado simples; no necesitan JavaScript                     |
| Aparición de secciones al hacer scroll                      | Scroll-driven animations (`animation-timeline: view()`) dentro de `@supports`                                       | Sin JavaScript; donde no hay soporte, el contenido ya está visible     |
| Cambio de tema                                              | View Transitions API (fundido de toda la página)                                                                    | Un solo fundido en lugar de transicionar cada color                    |
| Navegación entre piezas                                     | View Transitions; revisar la integración con Next 16 en `node_modules/next/dist/docs/` antes de implementar         | Transición entre rutas sin librería; si no hay soporte, sin transición |
| Detalle desplegable de Trayectoria                          | `<details>` con `::details-content` e `interpolate-size`, o `grid-template-rows` de `0fr` a `1fr`                   | Anima la apertura sin medir alturas en JavaScript                      |
| Reordenar la grilla al filtrar                              | View Transitions con `view-transition-name` por card; Motion (`layout`) si hace falta interrumpir a mitad de camino | Las cards se mueven a su lugar nuevo en vez de saltar                  |
| Gestos con física (arrastrar, soltar, inercia) en las demos | Motion                                                                                                              | CSS no tiene springs ni gestos                                         |
| Secuencias orquestadas o morphing de SVG en las demos       | Motion                                                                                                              | Coordinar varios pasos o interpolar paths es más claro con Motion      |

Criterios para sumar Motion:

- Se justifica en el PR: qué no resolvía CSS.
- Siempre con `useReducedMotion` o la variante reducida equivalente: misma regla de "03 · Movimiento reducido".
- No se importa en el layout global ni en la Home salvo en el componente que lo necesita.
