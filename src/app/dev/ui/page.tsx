import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmailCopy } from "@/components/site/email-copy";
import { Logo } from "@/components/site/logo/Logo";
import { LogoSkins } from "@/components/site/logo/logo-skins";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import tokens from "@/styles/tokens/tokens.json";

const logoSizes = ["w-4", "w-6", "w-8", "w-12", "w-24", "w-48"];
const semanticTokens = Object.keys(tokens.semantic);
const cssVar = (name: string) => `--${name.replaceAll("/", "-")}`;

export const metadata: Metadata = {
  title: "Componentes (desarrollo)",
};

// Página interna para revisar tokens y componentes en los dos temas. No se
// publica en producción (VERCEL_ENV=production); sí se ve en local y en los previews.
export default function DevUiPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 p-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">Componentes</h1>
        <ThemeToggle />
      </header>

      <section aria-labelledby="type" className="flex flex-col gap-3">
        <h2 id="type" className="text-2xl font-semibold">
          Tipografía
        </h2>
        <p className="font-display text-6xl font-bold">Juan Cruz Del Sarto</p>
        <p className="font-display text-xl font-semibold">
          Afacad Flux · títulos
        </p>
        <p className="text-base">
          Nunito Sans · cuerpo. Del wireframe a production.
        </p>
        <p className="font-mono text-xs tracking-wide uppercase">
          JetBrains Mono · etiquetas
        </p>
      </section>

      <section aria-labelledby="colors" className="flex flex-col gap-4">
        <h2 id="colors" className="text-2xl font-semibold">
          Tokens semánticos
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {semanticTokens.map((name) => (
            <li key={name} className="flex items-center gap-3">
              <span
                className="size-8 shrink-0 rounded-md border border-line-strong"
                style={{ background: `var(${cssVar(name)})` }}
              />
              <code className="font-mono text-xs">{cssVar(name)}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="buttons" className="flex flex-col gap-4">
        <h2 id="buttons" className="text-2xl font-semibold">
          Button
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="outline">Contorno (secundario de Figma)</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="link">Enlace</Button>
          <Button variant="destructive">Destructivo</Button>
          <Button disabled>Deshabilitado</Button>
        </div>
      </section>

      <section aria-labelledby="email" className="flex flex-col gap-4">
        <h2 id="email" className="text-2xl font-semibold">
          Email copiable
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <EmailCopy />
        </div>
        <div
          data-theme="dark"
          className="rounded-lg bg-background p-8 text-foreground"
        >
          <EmailCopy size="grande" />
        </div>
      </section>

      <section aria-labelledby="logo" className="flex flex-col gap-4">
        <h2 id="logo" className="text-2xl font-semibold">
          Logo
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          {logoSizes.map((size) => (
            <Logo key={size} className={size} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Con el puntero encima recorre las skins archivadas (una cada 0,7 s):
        </p>
        <LogoSkins className="w-32" />
      </section>
    </main>
  );
}
