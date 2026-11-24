import { defineRouting } from "next-intl/routing";

/**
 * Idiomas del sitio. Español por defecto (`/es`); inglés (`/en`) completo
 * antes del lanzamiento, en la Etapa 5.
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  // Hasta la Etapa 5 no se detecta el idioma del navegador ni se anuncian
  // versiones alternativas: el sitio solo existe en español.
  localeDetection: false,
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * Hasta la Etapa 5, `/en` redirige a `/es` (decidido el 24 nov): la ruta y
 * `messages/en.json` existen, con las mismas claves, pero sin texto publicado.
 * Pasar a `true` cuando el copy en inglés esté aprobado.
 */
export const ENGLISH_ENABLED = false;
