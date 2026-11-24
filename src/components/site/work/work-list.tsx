"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { PieceMedia } from "@/components/site/work/piece-media";
import { PieceTag } from "@/components/site/work/piece-tag";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Piece } from "@/lib/work-schema";
import { PIECE_TYPES, type PieceType } from "@/lib/work-types";

export type PieceSummary = Pick<
  Piece,
  | "slug"
  | "title"
  | "line"
  | "type"
  | "status"
  | "featured"
  | "simulated"
  | "version"
  | "stack"
  | "cover"
  | "demoUrl"
>;

type Filter = "all" | PieceType;

/** "V2 · NEXT.JS · TYPESCRIPT": versión y las dos primeras tecnologías. */
function metaLine(p: PieceSummary) {
  return [p.version && `v${p.version}`, ...p.stack.slice(0, 2)]
    .filter(Boolean)
    .join(" · ");
}

function Tags({ piece }: { piece: PieceSummary }) {
  const t = useTranslations("Work");
  return (
    <>
      <PieceTag>
        {t(`types.${piece.type}`)}
        {piece.simulated && ` · ${t("simulated")}`}
      </PieceTag>
      {piece.status === "borrador" && <PieceTag muted>{t("draft")}</PieceTag>}
    </>
  );
}

/**
 * Vista previa en hover: con el puntero encima (y sin movimiento reducido) se
 * carga la demo en vivo sobre la captura. Es decorativa: no se enfoca ni se lee.
 */
function HoverPreview({
  piece,
  children,
}: {
  piece: PieceSummary;
  children: React.ReactNode;
}) {
  const t = useTranslations("Work");
  const [live, setLive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canPreview = Boolean(piece.demoUrl && piece.cover);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <div
      className="relative"
      onPointerEnter={(e) => {
        if (!canPreview || e.pointerType !== "mouse") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          return;
        timer.current = setTimeout(() => setLive(true), 250);
      }}
      onPointerLeave={() => {
        if (timer.current) clearTimeout(timer.current);
        setLive(false);
      }}
    >
      {children}
      {live && piece.demoUrl && (
        <iframe
          src={piece.demoUrl}
          title={t("preview", { piece: piece.title })}
          aria-hidden="true"
          tabIndex={-1}
          loading="lazy"
          className="pointer-events-none absolute inset-0 size-full rounded-sm border border-border bg-background"
        />
      )}
    </div>
  );
}

/** Link que cubre toda la fila o card (un solo link por pieza). */
function PieceLink({
  piece,
  className,
}: {
  piece: PieceSummary;
  className?: string;
}) {
  return (
    <Link
      href={`/work/${piece.slug}`}
      className={cn(
        "rounded-sm underline-offset-4 after:absolute after:inset-0 hover:underline",
        className,
      )}
    >
      {piece.title}
    </Link>
  );
}

function ViewHint() {
  const t = useTranslations("Work");
  return (
    <span aria-hidden="true" className="text-sm font-medium text-brand">
      {t("view")}
    </span>
  );
}

/** Lista de Trabajo: filtros por tipo, apps destacadas como filas y el resto en grilla. */
export function WorkList({ pieces }: { pieces: PieceSummary[] }) {
  const t = useTranslations("Work");
  const [filter, setFilter] = useState<Filter>("all");
  const [announcement, setAnnouncement] = useState("");

  const counts = Object.fromEntries(
    PIECE_TYPES.map((type) => [
      type,
      pieces.filter((p) => p.type === type).length,
    ]),
  ) as Record<PieceType, number>;
  const filters: Filter[] = [
    "all",
    ...PIECE_TYPES.filter((type) => counts[type] > 0),
  ];

  const shown = pieces.filter((p) => filter === "all" || p.type === filter);
  const rows = shown.filter((p) => p.featured);
  const cards = shown.filter((p) => !p.featured);

  function choose(next: Filter) {
    setFilter(next);
    const n = next === "all" ? pieces.length : counts[next];
    setAnnouncement(t("count", { n }));
  }

  return (
    <div className="flex flex-col">
      <div
        role="group"
        aria-label={t("filtersLabel")}
        className="flex flex-wrap gap-2 pb-6"
      >
        {filters.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => choose(f)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide uppercase transition-colors motion-reduce:transition-none",
                active
                  ? "border-selected bg-selected text-selected-foreground"
                  : "border-border hover:border-line-strong",
              )}
            >
              {t(`filters.${f}`)} · {f === "all" ? pieces.length : counts[f]}
            </button>
          );
        })}
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>

      {rows.length > 0 && (
        <ul className="flex flex-col">
          {rows.map((p, i) => (
            <li
              key={p.slug}
              className="group relative grid gap-6 border-t border-border py-8 md:grid-cols-2 md:gap-10"
            >
              <HoverPreview piece={p}>
                <PieceMedia
                  piece={p}
                  sizes="(min-width: 1024px) 504px, 100vw"
                  className="aspect-[8/5]"
                />
              </HoverPreview>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs font-medium text-brand"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Tags piece={p} />
                </div>
                <h3 className="text-[1.875rem] leading-tight font-semibold">
                  <PieceLink piece={p} />
                </h3>
                {metaLine(p) && (
                  <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                    {metaLine(p)}
                  </p>
                )}
                <p className="text-[1.0625rem] leading-normal text-foreground-secondary">
                  {p.line}
                </p>
                <ViewHint />
              </div>
            </li>
          ))}
        </ul>
      )}

      {cards.length > 0 && (
        <ul className="grid gap-x-10 border-t border-border pt-2 md:grid-cols-2">
          {cards.map((p) => (
            <li
              key={p.slug}
              className="group relative flex flex-col gap-3 border-b border-border pt-6 pb-8"
            >
              <HoverPreview piece={p}>
                <PieceMedia
                  piece={p}
                  sizes="(min-width: 1024px) 484px, 100vw"
                  className="aspect-video"
                />
              </HoverPreview>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Tags piece={p} />
                {metaLine(p) && (
                  <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                    {metaLine(p)}
                  </span>
                )}
              </div>
              <h3 className="text-[1.375rem] leading-tight font-semibold">
                <PieceLink piece={p} />
              </h3>
              <p className="text-[1.0625rem] leading-normal text-foreground-secondary">
                {p.line}
              </p>
              <ViewHint />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
