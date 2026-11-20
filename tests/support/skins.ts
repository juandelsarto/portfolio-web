import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  SKINS,
  SKIN_IDS,
  type Skin,
  type Theme,
} from "../../src/components/site/backgrounds/skins";

export interface SkinCombo {
  skin: Skin;
  theme: Theme;
  /** Nombre corto para tests y capturas: `core-light`. */
  id: string;
}

/** Todas las combinaciones de skin y tema. */
export const ALL_COMBOS: SkinCombo[] = SKIN_IDS.flatMap((skin) =>
  SKINS[skin].themes.map((theme) => ({ skin, theme, id: `${skin}-${theme}` })),
);

/** Combinaciones del lanzamiento: las que el CI revisa en todas las páginas. */
export const LAUNCH_COMBOS: SkinCombo[] = ALL_COMBOS.filter((c) =>
  ["core-light", "core-dark", "neubrutalista-light"].includes(c.id),
);

/**
 * Paletas de `palettes.css`: el bloque de cada skin y tema en `<html>`
 * (`:root[data-skin="x"][data-theme="y"]`), sin las variantes de contraste.
 */
export function readPalettes(): Record<string, Record<string, string>> {
  // Desde la raíz del repo: Vitest y Playwright corren ahí (Playwright no
  // admite import.meta en sus tests).
  const css = readFileSync(
    join(process.cwd(), "src/components/site/backgrounds/palettes.css"),
    "utf8",
  ).replace(/\/\*[\s\S]*?\*\//g, "");
  const result: Record<string, Record<string, string>> = {};
  for (const [, selectors = "", body = ""] of css.matchAll(
    /([^{}]+)\{([^}]*)\}/g,
  )) {
    const first = selectors.split(",")[0]?.trim() ?? "";
    const match = first.match(
      /^:root\[data-skin="([\w-]+)"\]\[data-theme="([\w-]+)"\]$/,
    );
    if (!match) continue;
    const vars: Record<string, string> = {};
    for (const [, name = "", value = ""] of body.matchAll(
      /--skin-([\w-]+):\s*([^;]+);/g,
    )) {
      vars[name] = value.trim();
    }
    result[`${match[1]}-${match[2]}`] = vars;
  }
  return result;
}
