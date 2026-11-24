import { EmailCopy } from "@/components/site/email-copy";
import { siteConfig } from "@/lib/site";

const socials = [
  { label: "LinkedIn", short: "in", href: siteConfig.links.linkedin },
  { label: "GitHub", short: "GH", href: siteConfig.links.github },
] as const;

const mono = "font-mono text-xs tracking-wide uppercase";

/**
 * Contacto y footer (Footer en Figma). Contacto es el CTA principal del sitio:
 * el email va grande y copiable. Fondo inverso en los dos temas.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contacto"
      className="bg-inverse text-inverse-foreground"
      aria-labelledby="contacto-titulo"
    >
      <div className="mx-auto flex max-w-[90rem] flex-col gap-9 px-4 pt-16 pb-28 md:px-8 md:pt-24 md:pb-10 xl:px-16">
        <p className={`${mono} text-inverse-muted`}>Contacto</p>

        <div className="flex flex-col gap-4">
          <h2 id="contacto-titulo" className="text-3xl font-bold">
            Hablemos
          </h2>
          <p className="max-w-xl text-inverse-foreground">
            ¿Un equipo, un producto o un proyecto donde diseño y código van
            juntos? La forma más directa es por email.
          </p>
        </div>

        <EmailCopy size="grande" />

        <div className="flex flex-wrap items-center gap-5">
          <ul className="flex items-center gap-3">
            {socials.map(({ label, short, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-inverse-border font-mono text-xs font-medium hover:bg-inverse-fill"
                >
                  {/* El nombre accesible empieza con el texto visible (WCAG 2.5.3). */}
                  {short}
                  <span className="sr-only">
                    {" "}
                    ({label}, se abre en otra pestaña)
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="h-6 w-px bg-inverse-fill" />
          <a
            href={siteConfig.cvUrl}
            download
            className="font-medium underline-offset-4 hover:underline"
          >
            Descargar CV ↓<span className="sr-only"> (PDF)</span>
          </a>
        </div>

        <div className="flex flex-col gap-2 border-t border-inverse-fill pt-5 md:flex-row md:items-center md:justify-between">
          <p className={`${mono} text-inverse-muted`}>
            © {year} · {siteConfig.name} · Design Engineer ·{" "}
            {siteConfig.location}
          </p>
          <p className={`${mono} flex flex-wrap gap-x-2 text-inverse-muted`}>
            <span>
              Diseñado y desarrollado con Next.js, Tailwind y shadcn/ui ·
            </span>
            <a
              href={siteConfig.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-inverse-foreground hover:underline"
            >
              Código del sitio ↗
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
