import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { ENGLISH_ENABLED, routing } from "@/i18n/routing";

const intl = createMiddleware(routing);

/**
 * Rutas por idioma (next-intl): `/` → `/es`. Hasta la Etapa 5, `/en` y todo
 * lo que cuelga de `/en` redirigen a la misma ruta en `/es`.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!ENGLISH_ENABLED && (pathname === "/en" || pathname.startsWith("/en/"))) {
    const url = request.nextUrl.clone();
    url.pathname = `/es${pathname.slice(3)}`;
    return NextResponse.redirect(url);
  }
  return intl(request);
}

export const config = {
  // Todo menos las rutas internas de Next y Vercel y los archivos (con punto).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
