// Textos de la Home, del Copy v6 aprobado el 23 nov
// (https://claude.ai/artifact/TaNJXopPqnBiyP17KXAxEB). Pasan a los mensajes
// de next-intl con la tarjeta de i18n.

export const hero = {
  location: "Buenos Aires, Argentina",
  lead: "Descubro problemas, exploro soluciones y construyo experiencias.",
  proposal:
    "Del wireframe a production: productos que se ven como se pensaron y funcionan como se prometieron.",
  ctaWork: "Ver trabajo ↓",
  ctaCv: "Descargar CV",
} as const;

export const about = {
  label: "Sobre mí",
  bio: [
    "Soy Design Engineer y diseñador multimedial de formación. Disfruto estar entre dos mundos: pensar cómo se ve y se siente algo, y después construirlo hasta que funcione de verdad. Que algo funcione bien y que se vea bien es el mismo trabajo.",
    "La producción audiovisual dejó una idea que sigue vigente: una experiencia se construye con ritmo, narrativa y detalle. En una interfaz eso se traduce en jerarquía, transiciones y respuestas que acompañan a quien la usa.",
  ],
  areas: ["Diseño", "Experiencia", "Ingeniería"],
  howTitle: "Cómo trabajo",
  principles: [
    {
      title: "Entender antes de abrir Figma",
      body: "Qué se resuelve, para quién y por qué.",
      practice:
        "el problema se escribe en una oración antes de diseñar; si no se puede, todavía no está entendido.",
    },
    {
      title: "Diseño y código a la par",
      body: "Diseñar sabiendo cómo se construye evita retrabajo; construir entendiendo el diseño cuida los detalles.",
      practice:
        "componentes y tokens se definen una sola vez y se usan igual en Figma y en código.",
    },
    {
      title: "Accesibilidad desde el inicio",
      body: "Contraste, jerarquía, HTML semántico y teclado como criterios de diseño, no como chequeo final.",
      practice:
        "contraste y teclado se revisan en el diseño, y axe corre en el CI antes de cada merge.",
    },
    {
      title: "Terminado y por versiones",
      body: "Priorizar la entrega continua y la iteración por sobre el producto completo.",
      practice:
        "cada versión se publica cuando funciona de punta a punta; lo que falta va a la siguiente.",
    },
    {
      title: "Spec primero, revisión siempre",
      body: "La AI forma parte del flujo diario (Claude Code, Codex, MCP servers y Figma), con Spec-Driven Development: comportamiento, estados y criterios se definen antes de generar código. Las tareas que se repiten todos los días se automatizan con skills propias.",
      practice:
        "lo que genera la AI se revisa, se prueba y se entiende antes de integrarse.",
    },
  ],
  practiceLabel: "En la práctica:",
  closing: "La AI acelera. El criterio no se delega.",
  toolsTitle: "Herramientas",
  tools: [
    { area: "Diseño", items: ["Figma"] },
    {
      area: "Frontend",
      items: [
        "React",
        "TypeScript",
        "Next.js",
        "React Native",
        "Tailwind CSS",
        "shadcn/ui",
      ],
    },
    { area: "Calidad", items: ["Vitest", "Playwright", "Cypress", "axe"] },
    {
      area: "Tooling y entrega",
      items: [
        "Git",
        "pnpm",
        "Vite",
        "CI/CD con GitHub Actions y GitLab",
        "Vercel",
      ],
    },
    {
      area: "Con AI",
      items: ["Claude Code", "Codex", "MCP servers", "skills propias"],
    },
  ],
} as const;

export const notFound = {
  title: "Esta página no existe.",
  back: "Volver al inicio",
} as const;
