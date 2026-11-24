import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { parsePiece } from "@/lib/work-schema";

const dir = path.join(process.cwd(), "src/content/work");
const slugs = readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const pieces = slugs.map((slug) =>
  parsePiece(slug, readFileSync(path.join(dir, slug, "es.mdx"), "utf8")),
);

const published = `---
title: "Pieza"
line: "Una línea."
type: "componente"
order: 99
status: "publicada"
---
`;

describe("piezas de Trabajo", () => {
  it("cada MDX tiene una ficha válida", () => {
    expect(pieces).toHaveLength(slugs.length);
  });

  it("los slugs son kebab-case y el orden no se repite", () => {
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    const orders = pieces.map((p) => p.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("una pieza publicada sin demo, captura ni nota rompe el build", () => {
    expect(() => parsePiece("pieza", published)).toThrow(
      /demoUrl[\s\S]*cover[\s\S]*why[\s\S]*decisions[\s\S]*stack[\s\S]*repoUrl/,
    );
  });

  it("los placeholders (comentarios MDX y YAML) no cuentan como contenido", () => {
    const draft = published
      .replace('"publicada"', '"borrador"')
      .replace(/---\n$/, '# why: "Por completar"\n---\n');
    const piece = parsePiece(
      "pieza",
      `${draft}\n{/* Cómo funciona: por completar */}\n`,
    );
    expect(piece.why).toBeUndefined();
    expect(piece.body).toBe("");
  });

  it("un tipo desconocido rompe el build con el archivo en el mensaje", () => {
    expect(() =>
      parsePiece(
        "x",
        published.replace('"componente"', '"juego"'),
        "src/content/work/x/es.mdx",
      ),
    ).toThrow(/src\/content\/work\/x\/es\.mdx[\s\S]*type/);
  });
});
