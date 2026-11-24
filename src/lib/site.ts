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
  // Hasta el lanzamiento (Etapa 6) el sitio no se indexa.
  indexable: false,
} as const;

/**
 * Trabajo se muestra solo si hay piezas para ver. En producción (Vercel
 * production, o `pnpm build` local) solo cuentan las piezas publicadas; en
 * desarrollo y en los previews de Vercel también los borradores. Mientras no
 * haya ninguna publicada, en producción no aparecen ni la sección ni sus links.
 * La cuenta real llega con la tarjeta de Trabajo (piezas en MDX).
 */
const publishedPieces = 0;
const showDrafts = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV !== "production"
  : process.env.NODE_ENV !== "production";
export const showWork = publishedPieces > 0 || showDrafts;

/** Anclas de la Home, en el orden en que aparecen. */
const allHomeSections = [
  { id: "trabajo", key: "work" },
  { id: "trayectoria", key: "trajectory" },
  { id: "sobre-mi", key: "about" },
] as const;

export const homeSections = allHomeSections.filter(
  (s) => s.id !== "trabajo" || showWork,
);
