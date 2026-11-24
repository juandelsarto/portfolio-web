"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Link, useRouter } from "@/i18n/navigation";

interface Neighbor {
  slug: string;
  title: string;
}

/** Ignora las flechas mientras se escribe o se usa un control que las necesita. */
function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return (
    el.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT", "IFRAME"].includes(el.tagName) ||
    el.closest("[role=slider],[role=listbox],[role=menu],[role=tablist]") !==
      null
  );
}

/** Pieza anterior y siguiente, en el orden de la Home; también con ← y →. */
export function PieceNav({
  current,
  prev,
  next,
}: {
  current: string;
  prev?: Neighbor;
  next?: Neighbor;
}) {
  const t = useTranslations("Piece");
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        isTypingTarget(e.target)
      )
        return;
      if (e.key === "ArrowLeft" && prev) router.push(`/work/${prev.slug}`);
      if (e.key === "ArrowRight" && next) router.push(`/work/${next.slug}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, prev, next, router]);

  return (
    <nav
      aria-label={t("navLabel")}
      className="flex flex-col gap-6 border-t border-border py-10 md:flex-row md:items-center md:justify-between"
    >
      <div className="md:min-w-48">
        {prev && (
          <Link
            href={`/work/${prev.slug}`}
            rel="prev"
            className="group flex flex-col gap-1.5"
          >
            <span className="font-mono text-[0.6875rem] tracking-wide text-muted-foreground uppercase">
              {t("prev")}
            </span>
            <span className="font-display text-xl font-semibold underline-offset-4 group-hover:underline">
              <span aria-hidden="true">← </span>
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <p className="order-last font-mono text-[0.6875rem] font-medium tracking-wide text-brand uppercase md:order-none">
        {t("keyboardHint")}
      </p>
      <div className="md:min-w-48 md:text-right">
        {next && (
          <Link
            href={`/work/${next.slug}`}
            rel="next"
            className="group flex flex-col gap-1.5 md:items-end"
          >
            <span className="font-mono text-[0.6875rem] tracking-wide text-muted-foreground uppercase">
              {t("next")}
            </span>
            <span className="font-display text-xl font-semibold underline-offset-4 group-hover:underline">
              {next.title}
              <span aria-hidden="true"> →</span>
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
