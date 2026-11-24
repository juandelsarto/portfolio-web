export const siteConfig = {
  name: "Juan Cruz Del Sarto",
  role: "Design Engineer · Front-End y UI",
  locale: "es",
  title: "Juan Cruz Del Sarto — Design Engineer · Front-End y UI",
  description:
    "Design Engineer en Buenos Aires. Apps, componentes y experimentos propios, con demo en vivo y el código a la vista: de Figma a React, con atención al detalle.",
  url: "https://juancruzdelsarto.com",
  email: "delsarto01@gmail.com",
  location: "Buenos Aires, Argentina",
  links: {
    linkedin: "https://linkedin.com/in/juancruzdelsarto",
    github: "https://github.com/juandelsarto",
    repo: "https://github.com/juandelsarto/portfolio-web",
  },
  // El PDF se suma en la Etapa 6; hasta entonces el link existe pero no el archivo.
  cvUrl: "/cv/juan-cruz-del-sarto-cv.pdf",
  // Hasta el lanzamiento (Etapa 6) el sitio no se indexa.
  indexable: false,
} as const;

/** Anclas de la Home, en el orden en que aparecen. */
export const homeSections = [
  { id: "trabajo", label: "Trabajo" },
  { id: "trayectoria", label: "Trayectoria" },
  { id: "sobre-mi", label: "Sobre mí" },
] as const;
