# portfolio-web

Portfolio de Juan Cruz Del Sarto, Design Engineer · UI y Design Systems. Repo público, sin licencia de reutilización ("Todos los derechos reservados").

## Fuentes de verdad

- **Roadmap (Claude Doc):** https://claude.ai/artifact/ChiVWNeRbjRBAhy9EbgEFB. Si una tarjeta y el roadmap no coinciden, manda el roadmap.
- **Copy aprobado (Claude Doc "Copy del portfolio v6", 23 nov):** https://claude.ai/artifact/TaNJXopPqnBiyP17KXAxEB. Reemplaza al v5, que queda como archivo.
- **Tareas:** Trello, tablero "Roadmap v1". Leer antes la tarjeta "[E0] Guía AI-first: contexto, enlaces y reglas". Si el tablero y el roadmap no coinciden, manda el roadmap.
- **Figma:** https://www.figma.com/design/97wrwaLaTwCkXsBu5HErRg/Portfolio-JCDS-%E2%80%94-Wireframes-v2 (fileKey `97wrwaLaTwCkXsBu5HErRg`). Usar el MCP de Figma con create_session y la skill figma-use antes de editar.

## Proyecto

Roadmap reescrito el 22 nov: piezas propias, cortas y terminadas; la experiencia en empresas va como hitos. Objetivo: abrir oportunidades laborales en Argentina y LatAm, con Contacto como CTA principal y el CV como apoyo.

- **Home:** Hero · 01 Trabajo · 02 Trayectoria · 03 Sobre mí (con Cómo trabajo) · Contacto. Cada pieza tiene su página.
- **Trabajo:** una sola sección que junta apps chicas, componentes y experimentos (reemplaza a Proyectos y Lab). Filtros: Todo · Apps · Componentes · Experimentos. Las apps van como filas destacadas y las piezas chicas en una grilla de cards compactas; la demo se activa en hover.
- **Piezas del lanzamiento (Etapa 6):** Boarding RSVP (app, Etapa 3), Calendario familiar, Extractor de paleta y Cuotas o contado (Etapa 4). Después, de a una: Combinador tipográfico, Asesor de raquetas y Editor de SVG.
- **Trayectoria:** un puesto por fila con empresa, rol, años y un resumen breve de la labor; el detalle se despliega. Se cuenta qué se hizo y en qué tipo de producto, sin nombrar clientes ni usar código de las empresas.
- **Página de pieza (plantilla única):** Ficha (tipo, rol, versión, stack, links) · Demo embebida · Por qué lo hice · Decisiones (2 a 4) · Cómo funciona (opcional en piezas chicas) · Números (solo reales y medidos) · Qué aprendí y qué sigue. Cierre con anterior y siguiente, también con teclado. El Asesor de raquetas suma en Cómo funciona el diagrama del agente y el video del modo con LLM local.
- **Identidad visual:** una sola identidad (Core) con tema claro y oscuro, elegido con `data-theme` en `<html>`, sin parpadeo al cargar. Paleta Core: fondo `#f8f8fa` / navy `#041020`, texto navy / `#f8f8fa`, acento naranja `#c03b16` / `#e7552e`. Tipografía: títulos en Afacad Flux (Bold desde 36 px, SemiBold debajo), cuerpo en Nunito Sans y mono en JetBrains Mono. Tokens en Figma: colecciones `Primitivos` y `Semánticos` (modos Claro y Oscuro), con la sintaxis CSS en cada variable (`var(--color-bg-page)`, etc.). Favicon: monograma JC en Afacad Flux, sin fondo, color acento. Ya no hay skins: el código que todavía las menciona (`data-skin`, logo por skin, `docs/motion.md`) se simplifica en la Etapa 2.
- **Idiomas:** `/es` por defecto; `/en` completo antes del lanzamiento (Etapa 5).
- **Contenido:** cada pieza es un MDX con su ficha en el frontmatter validado con Zod y su demo. En producción solo se ven las piezas publicadas; nunca un estado vacío ni "Próximamente".
- **Reglas de cada pieza:** entra en 1 a 3 fines de semana (si no, se recorta), se publica terminada y crece por versiones. Demos sin backend: datos ficticios en un adaptador local.

## Stack

Next.js (App Router) · TypeScript estricto · pnpm · Tailwind v4 + shadcn/ui (Radix) · tokens como CSS custom properties (primitivos → semánticos), `@layer` y container queries · MDX · next-intl · Vitest · Playwright + axe · Vercel. Dominio: juancruzdelsarto.com (con `noindex` hasta el lanzamiento, Etapa 6).

**Animación:** primero CSS (scroll-driven animations, view transitions, transiciones). Motion (motion.dev) solo como diferencial donde CSS no alcanza, con `LazyMotion` y solo en los componentes que lo necesitan. Siempre respetar `prefers-reduced-motion`.

## Comandos

Node 22 y pnpm (versión fijada en `packageManager`; activar con `corepack enable`).

- `pnpm install`: instala dependencias.
- `pnpm dev`: servidor local en http://localhost:3000.
- `pnpm build` / `pnpm start`: build de producción y servidor.
- `pnpm lint`: ESLint (Next, TypeScript y jsx-a11y recomendado).
- `pnpm format` / `pnpm format:check`: Prettier (ordena las clases de Tailwind).
- `pnpm typecheck`: genera los tipos de rutas de Next (`next typegen`) y corre `tsc --noEmit`.
- `pnpm test`: tests unitarios con Vitest (`tests/unit/` y `src/**/*.test.ts`).
- `pnpm test:e2e`: tests end-to-end con Playwright (`tests/e2e/`); la primera vez, `pnpm exec playwright install chromium`.

El CI (`.github/workflows/ci.yml`) corre install, lint, formato, typecheck, test y build en cada PR. Husky + lint-staged corren ESLint y Prettier sobre los archivos del commit.

## Estructura

- `src/app`: rutas (App Router).
- `src/components/ui`: componentes de shadcn/ui.
- `src/components/site`: componentes propios del sitio.
- `src/styles/globals.css`: Tailwind v4 (CSS-first), `@theme inline` que conecta las variables con las utilidades y la variante `dark` ligada a `data-theme="dark"`.
- `src/styles/tokens`: tokens de diseño. Hoy hay solo `placeholder.css` (temporal) hasta la tarjeta de tokens de la Etapa 1.
- `src/content`: piezas en MDX.
- `src/lib`: utilidades y configuración (`site.ts`: nombre, metadatos, `indexable`).
- `tests/unit` y `tests/e2e`.
- `/dev/ui`: página interna para revisar componentes; da 404 en producción.

Next.js 16 tiene cambios respecto de versiones anteriores: leer `AGENTS.md` y la guía en `node_modules/next/dist/docs/` antes de usar una API que no conozcas.

## Estilos y componentes

- **Regla:** nunca colores, radios, sombras ni tipografías sueltos (hex, `rgb()`, `bg-white`, `bg-zinc-500`, `rounded-[6px]`…). Siempre utilidades que salen de tokens (`bg-primary`, `text-muted-foreground`, `rounded-lg`).
- **Agregar un componente de shadcn/ui:** `pnpm dlx shadcn@latest add <componente>` (usa `components.json`: estilo new-york, base neutral, `src/components/ui`). Después revisar el archivo generado y reemplazar cualquier color fijo por su token (por ejemplo, `text-white` → `text-destructive-foreground`), agregarlo a `/dev/ui` y correr `pnpm lint` y `pnpm test`.
- Componentes propios del sitio en `src/components/site`, construidos sobre los de `ui`.

## Flujo de trabajo

- `main` está protegida: todo entra por PR y el check de CI tiene que pasar.
- Ramas: `e<etapa>/<slug-de-tarjeta>`, con el número de etapa del roadmap (ej. `e1/tokens`, `e4/extractor-paleta`).
- Commits convencionales: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Un PR por tarjeta, con el link de la tarjeta y la plantilla completa (capturas en tema claro y oscuro y checklist de accesibilidad).
- Al terminar una tarjeta: comentar en Trello qué se hizo, con links y decisiones.

## Reglas

- Copy en español rioplatense profesional; en inglés solo los términos del glosario. Sin métricas inventadas: los números son solo medidos y reales (performance, tests, uso propio); si una pieza no tiene, la sección no aparece.
- Datos de todos los proyectos ficticios. Nunca usar código, marcas ni datos de Around, Mercado Libre u otras empresas.
- Asesor de raquetas: tienda ficticia y propia; sin LLM ni tokens en producción, y la pieza lo dice; sin formularios que capturen datos y sin cobro real.
- Nunca publicar código, pantallas ni clientes de Around, Mercado Libre u otra empresa. Figma se comparte en solo lectura.
- Sin teléfono, dirección ni indicador de disponibilidad en el sitio.
- Accesibilidad WCAG 2.2 AA como piso, en los dos temas.
- Ante una decisión que el roadmap no define: proponer 2 o 3 opciones en la tarjeta y esperar la respuesta de Juan.
