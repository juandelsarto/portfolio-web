import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { buildTokensCss, cssName } from "../../scripts/build-tokens.mjs";

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const tokens = JSON.parse(read("src/styles/tokens/tokens.json")) as {
  primitives: Record<string, string>;
  semantic: Record<string, [string, string]>;
};

describe("tokens", () => {
  it("tokens.css está sincronizado con tokens.json (correr pnpm tokens:build)", () => {
    expect(read("src/styles/tokens/tokens.css")).toBe(buildTokensCss(tokens));
  });

  it("cada semántico apunta a primitivos que existen, en claro y en oscuro", () => {
    for (const [name, refs] of Object.entries(tokens.semantic)) {
      for (const ref of refs)
        expect(tokens.primitives, name).toHaveProperty([ref]);
    }
  });

  it("el tema de Tailwind no repite nombres de tokens (evita variables circulares)", () => {
    const css = read("src/styles/globals.css");
    const theme = css.slice(css.indexOf("@theme inline"));
    const themeNames = [...theme.matchAll(/^\s*(--[\w-]+):/gm)].flatMap((m) =>
      m[1] ? [m[1]] : [],
    );
    const tokenNames = [
      ...Object.keys(tokens.primitives),
      ...Object.keys(tokens.semantic),
    ].map(cssName);
    expect(themeNames.filter((n) => tokenNames.includes(n))).toEqual([]);
  });
});
