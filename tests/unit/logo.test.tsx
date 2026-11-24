import { existsSync, readFileSync } from "node:fs";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Logo } from "@/components/site/logo/Logo";
import { LOGO_SKINS } from "@/components/site/logo/logo-skins";
import {
  LOGO_DARK_SVG,
  LOGO_LIGHT_SVG,
} from "@/components/site/logo/logo-markup";

const read = (name: string) =>
  readFileSync(
    new URL(`../../src/components/site/logo/${name}`, import.meta.url),
    "utf8",
  )
    .trim()
    .replace(/\n/g, "");

describe("Logo", () => {
  it("logo-markup.ts está sincronizado con los SVG (correr pnpm logo:build)", () => {
    expect(LOGO_LIGHT_SVG).toBe(read("logo-light.svg"));
    expect(LOGO_DARK_SVG).toBe(read("logo-dark.svg"));
  });

  it("tiene una versión por tema y muestra solo la del tema activo", () => {
    const html = renderToStaticMarkup(<Logo />);
    expect(html).toContain("dark:hidden");
    expect(html).toContain("hidden size-full dark:block");
    expect(LOGO_LIGHT_SVG).not.toBe(LOGO_DARK_SVG);
  });

  it("tiene nombre accesible", () => {
    const html = renderToStaticMarkup(<Logo />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Juan Cruz Del Sarto"');
  });

  it("se oculta a lectores de pantalla cuando es decorativo", () => {
    const html = renderToStaticMarkup(<Logo decorative />);
    expect(html).toMatch(/^<span[^>]*aria-hidden="true"/);
    expect(html).not.toContain('role="img"');
  });

  it("no tiene colores fijos: el color sale del token de acento", () => {
    for (const svg of [LOGO_LIGHT_SVG, LOGO_DARK_SVG]) {
      expect(svg).not.toMatch(/#[0-9a-f]{3,6}\b/i);
      expect(svg).toContain('fill="currentColor"');
    }
    expect(renderToStaticMarkup(<Logo />)).toContain("text-brand");
  });

  it("cada skin archivada tiene su imagen", () => {
    for (const name of new Set([...LOGO_SKINS.light, ...LOGO_SKINS.dark])) {
      expect(
        existsSync(
          new URL(`../../public/logo/skins/${name}.webp`, import.meta.url),
        ),
      ).toBe(true);
    }
    expect(LOGO_SKINS.light).toHaveLength(LOGO_SKINS.dark.length);
  });
});
