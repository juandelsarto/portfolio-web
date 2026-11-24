import "server-only";

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { type Piece, parsePiece } from "@/lib/work-schema";

/**
 * Piezas de Trabajo: una carpeta por pieza en `src/content/work/<slug>/` con
 * un MDX por idioma (`es.mdx`; `en.mdx` desde la Etapa 5). El frontmatter es la
 * ficha (validada con Zod: un archivo inválido rompe el build) y el cuerpo es
 * "Cómo funciona".
 */
const WORK_DIR = path.join(process.cwd(), "src/content/work");

/**
 * En producción (Vercel production, o `pnpm build` local) solo se ven las
 * piezas publicadas; en desarrollo y en los previews de Vercel, también los
 * borradores.
 */
export const showDrafts = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV !== "production"
  : process.env.NODE_ENV !== "production";

function readPiece(slug: string, locale: string): Piece {
  const dir = path.join(WORK_DIR, slug);
  const file = existsSync(path.join(dir, `${locale}.mdx`))
    ? path.join(dir, `${locale}.mdx`)
    : path.join(dir, "es.mdx");
  return parsePiece(
    slug,
    readFileSync(file, "utf8"),
    path.relative(process.cwd(), file),
  );
}

/** Todas las piezas (incluidos los borradores), en el orden de la Home. */
export function getAllPieces(locale: string): Piece[] {
  if (!existsSync(WORK_DIR)) return [];
  return readdirSync(WORK_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => readPiece(d.name, locale))
    .sort((a, b) => a.order - b.order);
}

/** Las piezas que se muestran en este entorno. */
export function getVisiblePieces(locale: string): Piece[] {
  return getAllPieces(locale).filter(
    (p) => p.status === "publicada" || showDrafts,
  );
}

export function hasVisibleWork(locale = "es"): boolean {
  return getVisiblePieces(locale).length > 0;
}
