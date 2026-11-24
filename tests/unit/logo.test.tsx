import { readFileSync } from "node:fs";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Logo } from "@/components/site/logo/Logo";
import { LOGO_SVG } from "@/components/site/logo/logo-markup";

const svgFile = readFileSync(
  new URL("../../src/components/site/logo/logo.svg", import.meta.url),
  "utf8",
).trim();

describe("Logo", () => {
  it("logo-markup.ts está sincronizado con logo.svg (correr pnpm logo:build)", () => {
    expect(LOGO_SVG).toBe(svgFile);
  });

  it("tiene nombre accesible", () => {
    const html = renderToStaticMarkup(<Logo />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Juan Cruz Del Sarto"');
    expect(html).toContain("<title>Juan Cruz Del Sarto</title>");
  });

  it("se oculta a lectores de pantalla cuando es decorativo", () => {
    const html = renderToStaticMarkup(<Logo decorative />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="img"');
    expect(html).not.toContain("<title>");
  });

  it("tiene una sola variante por parte (Core, sin skins)", () => {
    const parts = [...svgFile.matchAll(/data-part="(\w+)"/g)].map((m) => m[1]);
    expect(parts.sort()).toEqual(
      ["beard", "brows", "glasses", "hair", "mustache"].sort(),
    );
    expect(svgFile).not.toMatch(/data-in=|data-preset=|data-skin/);
  });

  it("no tiene colores fijos: todo sale de variables CSS", () => {
    expect(svgFile).not.toMatch(/fill="#|stroke="#|#[0-9a-f]{6}\b/i);
  });
});
