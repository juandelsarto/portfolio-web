# Logo

El logo es un dibujo de la cara de Juan: pelo, cejas, anteojos, bigote y barba. Es de un solo color, el acento de la paleta Core (`--color-text-accent`), en los dos temas.

- **Fuente única:** `src/components/site/logo/logo.svg`.
- **Componente:** `Logo` (`src/components/site/logo/Logo.tsx`).
- **Figma:** component set `Logo`, variante `Skin=Core` (claro y oscuro), en la página Design System.
- **Favicon de 16 y 32 px:** monograma JC en Afacad Flux, sin fondo y en color acento (frame "Marca" en Figma). A ese tamaño la cara no se lee.

## Estructura

Un solo SVG (`viewBox="-4 -4 312 462"`). Cada parte es un elemento con `data-part` (`hair`, `brows`, `glasses`, `mustache`, `beard`) y `data-variant`, para poder animarlas o cambiarlas por separado más adelante.

Los colores salen de variables CSS, con `currentColor` como respaldo:

| Variable        | Uso                                       | Valor actual          |
| --------------- | ----------------------------------------- | --------------------- |
| `--logo-line`   | contorno, cejas, anteojos, bigote y barba | `--color-text-accent` |
| `--logo-hair`   | pelo                                      | `--color-text-accent` |
| `--logo-accent` | reflejos del pelo                         | transparente          |
| `--logo-skin`   | relleno de la cara                        | transparente          |

## Uso

```tsx
<Logo className="w-8" />
<Logo decorative className="w-8" /> // dentro de un link que ya tiene aria-label
```

## Cambiar el logo

1. Editar `logo.svg` (o exportarlo de Figma sobre el mismo lienzo de 312 × 462), sin colores fijos: solo las clases `f-line`, `f-hair`, `f-accent`, `f-skin` y `s-line`.
2. Correr `pnpm logo:build` para regenerar `logo-markup.ts`; un test verifica que estén sincronizados.
