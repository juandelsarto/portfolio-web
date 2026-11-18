"use client";

import { useEffect, useState } from "react";

import {
  PROPOSED_THEMES,
  SKIN_IDS,
  SKINS,
  THEME_LABELS,
  defaultTheme,
  oppositeTheme,
  type Skin,
  type Theme,
} from "@/components/site/backgrounds/skins";

/**
 * Selector temporal de skin y tema para revisar los fondos en /dev/fondos.
 * Escribe `data-skin` y `data-theme` en `<html>`, como hará el selector real
 * (tarjeta "[E1] Implementar las skins y su selector"). Arranca en Core · Light
 * y, al salir de la página, deja `<html>` como estaba.
 */
export function SkinSwitcher() {
  const [skin, setSkin] = useState<Skin>("core");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    const prev = { skin: root.dataset.skin, theme: root.dataset.theme };
    return () => {
      if (prev.skin) root.dataset.skin = prev.skin;
      else delete root.dataset.skin;
      if (prev.theme) root.dataset.theme = prev.theme;
      else delete root.dataset.theme;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.skin = skin;
    document.documentElement.dataset.theme = theme;
  }, [skin, theme]);

  const proposed = PROPOSED_THEMES[skin];

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b bg-background px-6 py-3 font-mono text-xs text-foreground">
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="sr-only">Skin</legend>
        <span aria-hidden="true" className="text-muted-foreground uppercase">
          Skin
        </span>
        {SKIN_IDS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === skin}
            onClick={() => {
              setSkin(id);
              const index = (SKINS[skin].themes as readonly Theme[]).indexOf(
                theme,
              );
              setTheme(
                SKINS[id].themes[Math.max(0, index)] ?? defaultTheme(id),
              );
            }}
            className="rounded-full border px-3 py-1.5 aria-pressed:bg-foreground aria-pressed:text-background"
          >
            {SKINS[id].label}
          </button>
        ))}
      </fieldset>
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="sr-only">Tema</legend>
        <span aria-hidden="true" className="text-muted-foreground uppercase">
          Tema
        </span>
        {SKINS[skin].themes.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === theme}
            onClick={() => setTheme(id)}
            className="rounded-full border px-3 py-1.5 aria-pressed:bg-foreground aria-pressed:text-background"
          >
            {THEME_LABELS[id]}
            {proposed === id && " (propuesta)"}
          </button>
        ))}
      </fieldset>
      <p className="text-muted-foreground" aria-live="polite">
        Contraste: {THEME_LABELS[oppositeTheme(skin, theme)]}
      </p>
    </div>
  );
}
