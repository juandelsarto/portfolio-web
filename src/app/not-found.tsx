import Link from "next/link";

import "@/styles/globals.css";

// 404 fuera de un idioma (por ejemplo, un archivo que no existe). Las rutas
// de páginas pasan por /es y usan app/[locale]/not-found.tsx.
export default function RootNotFound() {
  return (
    <html lang="es">
      <body className="flex min-h-dvh flex-col items-start justify-center gap-6 p-8 font-sans">
        <h1 className="text-4xl font-bold">Esta página no existe.</h1>
        <Link href="/es" className="underline underline-offset-4">
          Volver al inicio
        </Link>
      </body>
    </html>
  );
}
