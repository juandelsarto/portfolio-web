import { readFileSync } from "node:fs";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BackgroundSection } from "@/components/site/backgrounds/BackgroundSection";

import {
  COLOR_KEYS,
  SCENES,
  isDark,
  rgba,
  smooth,
} from "@/components/site/backgrounds/scenes";
import {
  SKINS,
  SKIN_IDS,
  defaultTheme,
  isSkin,
  oppositeTheme,
  resolveTheme,
} from "@/components/site/backgrounds/skins";

const palettes = readFileSync(
  new URL(
    "../../src/components/site/backgrounds/palettes.css",
    import.meta.url,
  ),
  "utf8",
);

/** Variables declaradas en el bloque cuyo selector incluye `selector`. */
function varsFor(selector: string): string[] {
  const block = palettes
    .split("}")
    .find((chunk) => (chunk.split("{")[0] ?? "").includes(selector));
  const body = block?.split("{")[1] ?? "";
  return [...body.matchAll(/--skin-([\w-]+):/g)].map((m) => m[1] ?? "");
}

describe("skins de los fondos", () => {
  it("cada skin tiene dos temas y una escena", () => {
    for (const id of SKIN_IDS) {
      expect(SKINS[id].themes).toHaveLength(2);
      expect(typeof SCENES[id]).toBe("function");
    }
  });

  it("el contraste carga el tema opuesto de la misma skin", () => {
    expect(oppositeTheme("core", "light")).toBe("dark");
    expect(oppositeTheme("core", "dark")).toBe("light");
    expect(oppositeTheme("neon", "neon")).toBe("fosforo");
    expect(oppositeTheme("neon", "fosforo")).toBe("neon");
  });

  it("un tema que no es de la skin cae en el primero", () => {
    expect(resolveTheme("neon", "light")).toBe("neon");
    expect(resolveTheme("core", undefined)).toBe(defaultTheme("core"));
    expect(oppositeTheme("neon", "dark")).toBe("fosforo");
  });

  it("reconoce solo ids de skin válidos", () => {
    expect(isSkin("core")).toBe(true);
    expect(isSkin("scrapbook")).toBe(false);
    expect(isSkin(undefined)).toBe(false);
  });
});

describe("palettes.css", () => {
  it("define todos los colores de las escenas en cada skin y tema", () => {
    for (const id of SKIN_IDS) {
      for (const theme of SKINS[id].themes) {
        const vars = varsFor(`:root[data-skin="${id}"][data-theme="${theme}"]`);
        for (const key of COLOR_KEYS)
          expect(vars, `${id} · ${theme}`).toContain(key);
      }
    }
  });

  it("cada tema también se carga como contraste dentro del opuesto", () => {
    for (const id of SKIN_IDS) {
      for (const theme of SKINS[id].themes) {
        const opposite = oppositeTheme(id, theme);
        const selector = `:root[data-skin="${id}"][data-theme="${opposite}"] .skin-section--contrast`;
        expect(varsFor(selector).length, selector).toBeGreaterThan(0);
      }
    }
  });
});

describe("utilidades de las escenas", () => {
  it("smooth queda entre 0 y 1", () => {
    expect(smooth(-1)).toBe(0);
    expect(smooth(0.5)).toBe(0.5);
    expect(smooth(2)).toBe(1);
  });

  it("rgba limita la opacidad", () => {
    expect(rgba([1, 2, 3], 2)).toBe("rgba(1, 2, 3, 1)");
    expect(rgba([1, 2, 3], -1)).toBe("rgba(1, 2, 3, 0)");
  });

  it("isDark distingue fondos claros y oscuros", () => {
    expect(isDark([4, 16, 32])).toBe(true);
    expect(isDark([248, 248, 250])).toBe(false);
  });
});

describe("BackgroundSection", () => {
  it("conserva la clase base junto a la variante y las utilidades", () => {
    for (const variant of ["hero", "tonal", "contrast"] as const) {
      const html = renderToStaticMarkup(
        <BackgroundSection variant={variant} className="py-24">
          hola
        </BackgroundSection>,
      );
      expect(html).toContain(
        `class="skin-section skin-section--${variant} py-24"`,
      );
    }
  });

  it("solo el hero lleva el canvas, oculto para lectores de pantalla", () => {
    const hero = renderToStaticMarkup(<BackgroundSection variant="hero" />);
    expect(hero).toContain("<canvas");
    expect(hero).toContain('aria-hidden="true"');
    expect(
      renderToStaticMarkup(<BackgroundSection variant="tonal" />),
    ).not.toContain("<canvas");
  });
});
