import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Componentes (desarrollo)",
};

// Página interna para revisar componentes con los tokens. No se publica en
// producción (VERCEL_ENV=production); sí se ve en local y en los previews.
export default function DevUiPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <h1 className="text-2xl font-semibold">Componentes</h1>
      <section aria-labelledby="buttons" className="flex flex-col gap-4">
        <h2 id="buttons" className="text-lg font-medium">
          Button
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="link">Enlace</Button>
          <Button variant="destructive">Destructivo</Button>
          <Button disabled>Deshabilitado</Button>
        </div>
      </section>
    </main>
  );
}
