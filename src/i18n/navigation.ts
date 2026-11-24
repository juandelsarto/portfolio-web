import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Link, redirect y hooks que conservan el idioma en las rutas.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
