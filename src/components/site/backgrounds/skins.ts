/**
 * Skins y temas que conocen los fondos. Los ids siguen `data-skin` y
 * `data-theme` en `<html>` (los mismos que usa el logo).
 *
 * Nota: el contrato de skin definitivo (ids, temas por skin) sale de la tarjeta
 * "[E1] Pasar la fuente de tokens a DTCG…". Si cambia, se ajusta solo este archivo
 * y `palettes.css`.
 */
export const SKINS = {
  core: { label: "Core", themes: ["light", "dark"] },
  neubrutalista: { label: "Brutal", themes: ["light", "dark"] },
  editorial: { label: "Editorial", themes: ["light", "dark"] },
  neon: { label: "Neon", themes: ["neon", "fosforo"] },
  y2k: { label: "Y2K", themes: ["light", "dark"] },
  cassette: { label: "Cassette", themes: ["light", "dark"] },
} as const satisfies Record<
  string,
  { label: string; themes: readonly [string, string] }
>;

export type Skin = keyof typeof SKINS;
export type Theme = (typeof SKINS)[Skin]["themes"][number];

export const SKIN_IDS = Object.keys(SKINS) as Skin[];

export const THEME_LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  neon: "Neon",
  fosforo: "Fósforo",
};

/** Temas que Figma no define y son una propuesta para validar. */
export const PROPOSED_THEMES: Partial<Record<Skin, Theme>> = { y2k: "dark" };

export function isSkin(value: string | null | undefined): value is Skin {
  return !!value && value in SKINS;
}

/** Primer tema de la skin: el que se usa sin `data-theme`. */
export function defaultTheme(skin: Skin): Theme {
  return SKINS[skin].themes[0];
}

/** Tema válido para la skin: si no le pertenece, el primero. */
export function resolveTheme(
  skin: Skin,
  theme: string | null | undefined,
): Theme {
  const themes: readonly Theme[] = SKINS[skin].themes;
  return themes.find((t) => t === theme) ?? defaultTheme(skin);
}

/**
 * Tema que carga la sección de contraste: el opuesto de la misma skin.
 * En Neon, que solo tiene modos oscuros, es el otro preset (Neon ↔ Fósforo).
 */
export function oppositeTheme(
  skin: Skin,
  theme: string | null | undefined,
): Theme {
  const [a, b] = SKINS[skin].themes;
  return resolveTheme(skin, theme) === a ? b : a;
}
