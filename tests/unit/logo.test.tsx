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

  it("aplica el preset pedido", () => {
    expect(renderToStaticMarkup(<Logo />)).toContain('data-preset="auto"');
    expect(renderToStaticMarkup(<Logo preset="neubrutalista-b" />)).toContain(
      'data-preset="neubrutalista-b"',
    );
  });

  it("tiene todas las partes y una variante de cada parte para Core", () => {
    for (const part of [
      "brows",
      "hair",
      "glasses",
      "mustache",
      "beard",
      "extra",
    ]) {
      expect(svgFile).toContain(`data-part="${part}"`);
    }
    const coreParts = [...svgFile.matchAll(/<(?:g|path)\b[^>]*>/g)]
      .map((m) => m[0])
      .filter((tag) => /data-in="[^"]*\bcore\b/.test(tag))
      .map((tag) => /data-part="(\w+)"/.exec(tag)?.[1]);
    expect(new Set(coreParts)).toEqual(
      new Set(["hair", "glasses", "mustache", "beard"]),
    );
  });

  it("no tiene colores fijos: todo sale de variables CSS", () => {
    expect(svgFile).not.toMatch(/fill="#|stroke="#|#[0-9a-f]{6}\b/i);
  });
});
