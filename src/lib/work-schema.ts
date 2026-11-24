import matter from "gray-matter";
import { z } from "zod";

import { PIECE_TYPES } from "@/lib/work-types";

export { PIECE_TYPES, type PieceType } from "@/lib/work-types";

const url = z.url({ protocol: /^https$/ });

const decision = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

const metric = z.object({
  /** Valor medido, tal cual se muestra ("98", "1,2 s"). */
  value: z.string().min(1),
  /** Qué se midió y con qué método, en una línea. */
  label: z.string().min(1),
});

/**
 * Ficha de una pieza (frontmatter del MDX). Los borradores pueden estar
 * incompletos; una pieza publicada tiene que tener todo lo que pide la
 * plantilla: demo, captura, por qué, 2 a 4 decisiones y qué sigue.
 */
export const pieceSchema = z
  .object({
    title: z.string().min(1),
    /** La línea de la card (copy v6). */
    line: z.string().min(1),
    type: z.enum(PIECE_TYPES),
    /** Orden en la Home (y en anterior / siguiente). */
    order: z.number().int().positive(),
    status: z.enum(["borrador", "publicada"]),
    /** Las apps destacadas van como filas; el resto, como cards. */
    featured: z.boolean().default(false),
    /** Demo sin backend real (por ejemplo, el Asesor de raquetas). */
    simulated: z.boolean().default(false),
    role: z.string().min(1).optional(),
    version: z.string().min(1).optional(),
    years: z.string().min(1).optional(),
    stack: z.array(z.string().min(1)).default([]),
    /** Deploy público de la demo; se embebe en un iframe. */
    demoUrl: url.optional(),
    /** Nota bajo la demo ("Datos de ejemplo…"). */
    demoNote: z.string().min(1).optional(),
    /** Captura fija (ruta en /public): respaldo de la demo y para movimiento reducido. */
    cover: z
      .string()
      .regex(/^\/work\/.+\.(webp|png|jpg|avif)$/)
      .optional(),
    repoUrl: url.optional(),
    /** Repo privado: se muestra "Repo privado, acceso a pedido". */
    repoPrivate: z.boolean().default(false),
    why: z.string().min(1).optional(),
    decisions: z.array(decision).max(4).default([]),
    metrics: z.array(metric).max(3).default([]),
    learned: z.string().min(1).optional(),
  })
  .superRefine((p, ctx) => {
    if (p.status !== "publicada") return;
    const required = [
      "role",
      "version",
      "demoUrl",
      "cover",
      "why",
      "learned",
    ] as const;
    for (const key of required) {
      if (!p[key]) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: `una pieza publicada necesita "${key}"`,
        });
      }
    }
    if (p.decisions.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["decisions"],
        message: "una pieza publicada necesita de 2 a 4 decisiones",
      });
    }
    if (p.stack.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["stack"],
        message: "falta el stack",
      });
    }
    if (!p.repoUrl && !p.repoPrivate) {
      ctx.addIssue({
        code: "custom",
        path: ["repoUrl"],
        message: 'falta "repoUrl" (o "repoPrivate: true")',
      });
    }
  });

export type PieceMeta = z.output<typeof pieceSchema>;
export interface Piece extends PieceMeta {
  slug: string;
  /** Cuerpo del MDX: la sección "Cómo funciona" (opcional). */
  body: string;
}

/** Lee y valida un MDX de pieza. Un frontmatter inválido rompe el build con el detalle. */
export function parsePiece(slug: string, source: string, file = slug): Piece {
  const { data, content } = matter(source);
  const result = pieceSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Ficha inválida en ${file}:\n${issues}`);
  }
  // Los comentarios MDX ({/* … */}) son placeholders para completar: no cuentan
  // como contenido, así "Cómo funciona" no aparece vacía.
  const body = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").trim();
  return { ...result.data, slug, body };
}
