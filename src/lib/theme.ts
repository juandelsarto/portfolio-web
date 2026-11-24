export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Script que corre en <head> antes del primer pintado: pone `data-theme` en
 * <html> con la preferencia guardada o, si no hay, la del sistema. Así no hay
 * parpadeo entre temas al cargar.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;

/** Aplica y guarda un tema. Lo usa el selector de tema del header. */
export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sin almacenamiento (modo privado, permisos): el tema vale para esta visita.
  }
}

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
