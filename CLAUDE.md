# portfolio-web

Portfolio de Juan Cruz Del Sarto, Design Engineer · UI y Design Systems. Repo público, sin licencia de reutilización ("Todos los derechos reservados").

## Fuentes de verdad

- **Roadmap (Claude Doc):** https://claude.ai/artifact/ChiVWNeRbjRBAhy9EbgEFB. Si una tarjeta y el roadmap no coinciden, manda el roadmap.
- **Copy aprobado (Claude Doc "Copy del portfolio v5"):** https://claude.ai/artifact/6zS1BGjAzp3SZfQF1ZtzUP
- **Tareas:** Trello, tablero "Roadmap v1". Leer antes la tarjeta "[E0] Guía AI-first: contexto, enlaces y reglas".
- **Figma:** https://www.figma.com/design/97wrwaLaTwCkXsBu5HErRg/Portfolio-JCDS-%E2%80%94-Wireframes-v2 (fileKey `97wrwaLaTwCkXsBu5HErRg`). Usar el MCP de Figma con create_session y la skill figma-use antes de editar.

## Proyecto

- **Secciones:** Home (resumida, 4 bloques), Sobre mí, Cómo trabajo, Trabajos, Contacto. Lab después del lanzamiento (E8).
- **Trabajos:** Boarding RSVP (E3), Configurador de armarios white-label (E4), reworks de Sushi Pop, Drop Shop Tenis y Ribeiro (E5).
- **Skins:** Core (claro y oscuro) y Neubrutalista para el lanzamiento; Editorial, Neón, Y2K y Scrapbook en E9. Solo Core tiene dos temas.
- **Contrato de skin:** puede cambiar color, tipografía, radios, sombras, texturas, densidad y logo. Nunca cambia la estructura, el foco, el contraste mínimo AA ni el orden de lectura. Se seleccionan con `data-skin` y `data-theme` en `<html>`, sin parpadeo al cargar.
- **Idiomas:** `/es` por defecto; `/en` deshabilitado hasta E6.
- **Contenido:** casos en MDX con frontmatter validado con Zod (`slug`, `kind` project | rework, `title`, `type`, `role`, `year`, `summary`, `cover`, `tags`, `featured`, `status` published | draft, `label`, `links`, `order`). En producción solo se ven los `published`; nunca un estado vacío ni "Próximamente".

## Stack

Next.js (App Router) · TypeScript estricto · pnpm · Tailwind v4 + shadcn/ui (Radix) · tokens como CSS custom properties (primitivos → semánticos → componente) · Motion · MDX · next-intl · Vitest · Playwright + axe · Vercel. Dominio: juancruzdelsarto.com (con `noindex` hasta E7).

## Comandos

Se completan en la Etapa 1, al inicializar el proyecto (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`).

## Flujo de trabajo

- `main` está protegida: todo entra por PR. Los checks de CI se vuelven obligatorios en E1.
- Ramas: `e<etapa>/<slug-de-tarjeta>` (ej. `e1/tokens-css`).
- Commits convencionales: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Un PR por tarjeta, con el link de la tarjeta y la plantilla completa (capturas por skin y checklist de accesibilidad).
- Al terminar una tarjeta: comentar en Trello qué se hizo, con links y decisiones.

## Reglas

- Copy en español rioplatense profesional; en inglés solo los términos del glosario. Sin métricas inventadas: "impacto verificable" es solo lo medido o demostrable.
- Datos de todos los proyectos ficticios. Nunca usar código, marcas ni datos de Around, Mercado Libre u otras empresas.
- Reworks: rediseño no solicitado, diseño y código propios, sin contacto con los dueños y con aviso visible en el caso. No reproducir el contenido de casino inyectado en Drop Shop Tenis.
- Sin teléfono, dirección ni indicador de disponibilidad en el sitio.
- Accesibilidad WCAG 2.2 AA como piso en todas las skins y temas.
- Ante una decisión que el roadmap no define: proponer 2 o 3 opciones en la tarjeta y esperar la respuesta de Juan.
