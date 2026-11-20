import { describe, expect, it } from "vitest";

import {
  AA_LARGE,
  AA_TEXT,
  contrastRatio,
  hexToRgb,
} from "../support/contrast";
import { ALL_COMBOS, readPalettes } from "../support/skins";

/**
 * Pares de color que cada skin y tema tiene que cumplir (WCAG 2.2 AA).
 * - Texto: 4.5:1 sobre todas las superficies donde puede aparecer.
 * - Acento como texto grande, links o íconos, y bordes fuertes: 3:1 (1.4.11).
 */
const PAIRS: { fg: string; bg: string; min: number }[] = [
  ...["bg", "surface", "surface-raised"].flatMap((bg) =>
    ["text-primary", "text-secondary", "text-muted"].map((fg) => ({
      fg,
      bg,
      min: AA_TEXT,
    })),
  ),
  { fg: "on-accent", bg: "accent-fill", min: AA_TEXT },
  { fg: "on-secondary", bg: "secondary-fill", min: AA_TEXT },
  { fg: "accent", bg: "bg", min: AA_LARGE },
  { fg: "accent", bg: "surface", min: AA_LARGE },
  { fg: "border-strong", bg: "bg", min: AA_LARGE },
  { fg: "border-strong", bg: "surface", min: AA_LARGE },
];

const palettes = readPalettes();

describe("contraste de los tokens de cada skin", () => {
  it("lee una paleta por cada skin y tema", () => {
    expect(Object.keys(palettes).sort()).toEqual(
      ALL_COMBOS.map((c) => c.id).sort(),
    );
  });

  describe.each(ALL_COMBOS)("$id", ({ id }) => {
    const palette = palettes[id] ?? {};

    it.each(PAIRS)("$fg sobre $bg ≥ $min:1", ({ fg, bg, min }) => {
      const a = palette[fg];
      const b = palette[bg];
      expect(a, `falta --skin-${fg}`).toBeDefined();
      expect(b, `falta --skin-${bg}`).toBeDefined();
      const ratio = contrastRatio(hexToRgb(a!), hexToRgb(b!));
      expect(
        ratio,
        `${id}: ${fg} (${a}) sobre ${bg} (${b}) da ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(min);
    });
  });
});
