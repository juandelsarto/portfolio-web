export const siteConfig = {
  name: "Juan Cruz Del Sarto",
  url: "https://juancruzdelsarto.com",
  email: "delsarto01@gmail.com",
  links: {
    linkedin: "https://linkedin.com/in/juancruzdelsarto",
    github: "https://github.com/juandelsarto",
    repo: "https://github.com/juandelsarto/portfolio-web",
  },
  // El texto del sitio (rol, metadatos, ubicación…) está en messages/<idioma>.json.
  // El PDF se suma en la Etapa 6; hasta entonces el link existe pero no el archivo.
  cvUrl: "/cv/juan-cruz-del-sarto-cv.pdf",
  // Hasta el lanzamiento (Etapa 6) el sitio no se indexa. Se habilita con la
  // variable de entorno NEXT_PUBLIC_INDEXABLE=true, y solo en producción: los
  // previews de Vercel nunca se indexan.
  indexable:
    process.env.NEXT_PUBLIC_INDEXABLE === "true" &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production"),
} as const;

/** Anclas de la Home, en el orden en que aparecen. */
export const homeSections = [
  { id: "trabajo", key: "work" },
  { id: "trayectoria", key: "trajectory" },
  { id: "sobre-mi", key: "about" },
] as const;

/**
 * URL base para metadatos y URLs absolutas (Open Graph). En Vercel usa la URL
 * del deploy: la del preview, o la de producción (el dominio propio cuando se
 * configure en la Etapa 6; hasta entonces, la de vercel.app). Fuera de Vercel,
 * el dominio del sitio.
 */
export function getBaseUrl(): URL {
  const { VERCEL_ENV, VERCEL_URL, VERCEL_PROJECT_PRODUCTION_URL } = process.env;
  if (VERCEL_ENV === "preview" && VERCEL_URL)
    return new URL(`https://${VERCEL_URL}`);
  if (VERCEL_PROJECT_PRODUCTION_URL)
    return new URL(`https://${VERCEL_PROJECT_PRODUCTION_URL}`);
  return new URL(siteConfig.url);
}
