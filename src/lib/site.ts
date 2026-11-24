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

/** Anclas de la Home, en el orden en que aparecen. */
export const homeSections = [
  { id: "trabajo", key: "work" },
  { id: "trayectoria", key: "trajectory" },
  { id: "sobre-mi", key: "about" },
] as const;
