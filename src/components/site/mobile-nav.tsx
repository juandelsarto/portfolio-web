import Link from "next/link";

import { siteConfig } from "@/lib/site";

const item =
  "inline-flex items-center rounded-full px-5 py-3 text-sm font-medium focus-visible:outline-offset-0";

/** Barra flotante de mobile (Nav/Mobile en Figma): Trabajo, CV y Contacto. */
export function MobileNav() {
  return (
    <nav
      aria-label="Navegación rápida"
      className="fixed inset-x-4 bottom-4 z-40 md:hidden"
    >
      <ul className="flex items-center justify-between rounded-full bg-inverse px-1.5 py-1.5 text-inverse-foreground shadow-lg ring-1 ring-inverse-border">
        <li>
          <Link href="/#trabajo" className={item}>
            Trabajo
          </Link>
        </li>
        <li>
          <a href={siteConfig.cvUrl} download className={item}>
            CV ↓<span className="sr-only"> (descargar, PDF)</span>
          </a>
        </li>
        <li>
          <Link
            href="/#contacto"
            className={`${item} bg-primary text-primary-foreground`}
          >
            Contacto
          </Link>
        </li>
      </ul>
    </nav>
  );
}
