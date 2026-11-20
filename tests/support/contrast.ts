/**
 * Contraste WCAG 2.2: luminancia relativa y relación entre dos colores.
 * Lo usan el test de pares de tokens (unit) y el de texto sobre fondos (e2e).
 */
export type Rgb = readonly [number, number, number];

export function hexToRgb(hex: string): Rgb {
  let h = hex.trim().replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = Number.parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function luminance([r, g, b]: Rgb): number {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

/** Mínimos AA: 4.5 texto normal; 3 texto grande y componentes de interfaz. */
export const AA_TEXT = 4.5;
export const AA_LARGE = 3;

/** Texto grande según WCAG: 24 px, o 18,66 px en negrita (700 o más). */
export function isLargeText(fontSizePx: number, fontWeight: number): boolean {
  return fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
}
