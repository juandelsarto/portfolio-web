import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Logo, type LogoPreset } from "@/components/site/logo/Logo";
import { Button } from "@/components/ui/button";

const logoPresets: { preset: LogoPreset; label: string }[] = [
  { preset: "auto", label: "Según la skin activa" },
  { preset: "core", label: "Core" },
  { preset: "neubrutalista-a", label: "Neubrutalista · Propuesta A" },
  { preset: "neubrutalista-b", label: "Neubrutalista · Propuesta B" },
];
const logoSizes = ["w-4", "w-6", "w-8", "w-12", "w-24", "w-48"];

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
      <section aria-labelledby="logo" className="flex flex-col gap-6">
        <h2 id="logo" className="text-lg font-medium">
          Logo
        </h2>
        {logoPresets.map(({ preset, label }) => (
          <div key={preset} className="flex flex-col gap-2">
            <h3 className="text-sm text-muted-foreground">{label}</h3>
            <div className="flex flex-wrap items-end gap-4">
              {logoSizes.map((size) => (
                <Logo key={size} preset={preset} className={size} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
