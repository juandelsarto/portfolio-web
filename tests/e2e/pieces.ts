import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { parsePiece } from "../../src/lib/work-schema";

/**
 * Las piezas de src/content/work, en el orden de la Home. Los tests leen de
 * acá lo que esperan, así agregar o publicar una pieza no los rompe.
 */
const dir = path.join(process.cwd(), "src/content/work");
export const allPieces = readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) =>
    parsePiece(d.name, readFileSync(path.join(dir, d.name, "es.mdx"), "utf8")),
  )
  .sort((a, b) => a.order - b.order);

/** Las que se ven en producción (el build que usan los tests salvo work.spec.ts). */
export const publishedPieces = allPieces.filter(
  (p) => p.status === "publicada",
);
