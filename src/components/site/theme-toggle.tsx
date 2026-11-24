"use client";

import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

function ThemeIcon() {
  // Círculo mitad lleno: el ícono del selector de tema en Figma.
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle
        cx="8"
        cy="8"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5Z" fill="currentColor" />
    </svg>
  );
}

// El tema vive en `data-theme` de <html> (lo pone themeScript antes de hidratar).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** Alterna tema claro y oscuro, lo guarda y anuncia el cambio. */
export function ThemeToggle() {
  const t = useTranslations("Theme");
  const theme = useSyncExternalStore<Theme | null>(
    subscribe,
    getTheme,
    () => null,
  );
  const [announcement, setAnnouncement] = useState("");
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        aria-label={next === "dark" ? t("toDark") : t("toLight")}
        onClick={() => {
          setTheme(next);
          setAnnouncement(next === "dark" ? t("darkOn") : t("lightOn"));
        }}
      >
        <ThemeIcon />
      </Button>
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </>
  );
}
