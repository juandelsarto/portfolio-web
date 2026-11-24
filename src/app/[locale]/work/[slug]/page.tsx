import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomeSection } from "@/components/site/home-section";
import { PieceMedia } from "@/components/site/work/piece-media";
import { PieceNav } from "@/components/site/work/piece-nav";
import { PieceTag } from "@/components/site/work/piece-tag";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getVisiblePieces } from "@/lib/work";

// Solo existen las páginas de las piezas visibles en este entorno.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getVisiblePieces(locale).map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const piece = getVisiblePieces(locale).find((p) => p.slug === slug);
  if (!piece) return {};
  const t = await getTranslations({ locale, namespace: "Piece" });
  return {
    title: t("metaTitle", { piece: piece.title }),
    description: piece.line,
  };
}

// Estilos del cuerpo MDX ("Cómo funciona"), con tokens.
const mdxComponents = {
  p: (props: React.ComponentProps<"p">) => (
    <p className="[&:not(:first-child)]:mt-4" {...props} />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="mt-4 overflow-x-auto rounded-sm border border-border bg-muted p-4 font-mono text-sm leading-relaxed text-foreground"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code className="font-mono text-[0.9em]" {...props} />
  ),
  a: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a className="text-brand underline underline-offset-4" {...props}>
      {children}
    </a>
  ),
  img: (props: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element -- diagramas del MDX, con su alt
    <img
      className="mt-4 w-full rounded-sm border border-border"
      alt=""
      {...props}
    />
  ),
};

const prose =
  "max-w-[47.5rem] text-lg leading-relaxed text-foreground-secondary md:text-[1.1875rem]";
const label =
  "font-mono text-[0.6875rem] tracking-wide text-muted-foreground uppercase";

export default async function PiecePage({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const pieces = getVisiblePieces(locale);
  const index = pieces.findIndex((p) => p.slug === slug);
  const piece = pieces[index];
  if (!piece) notFound();

  const t = await getTranslations({ locale, namespace: "Piece" });
  const w = await getTranslations({ locale, namespace: "Work" });
  const how = piece.body
    ? (await compileMDX({ source: piece.body, components: mdxComponents }))
        .content
    : null;

  // Secciones de la plantilla: solo las que tienen contenido, numeradas en orden.
  const sections = [
    piece.why && {
      id: "por-que",
      key: "why",
      body: <p className={prose}>{piece.why}</p>,
    },
    piece.decisions.length > 0 && {
      id: "decisiones",
      key: "decisions",
      body: (
        <ol className="border-t border-border">
          {piece.decisions.map((d, i) => (
            <li
              key={d.title}
              className="flex gap-6 border-b border-border py-6"
            >
              <span
                aria-hidden="true"
                className="pt-1 font-mono text-xs font-medium text-brand"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-semibold">{d.title}</h3>
                <p className="text-foreground-secondary">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
      ),
    },
    how && {
      id: "como-funciona",
      key: "how",
      body: <div className={prose}>{how}</div>,
    },
    piece.metrics.length > 0 && {
      id: "numeros",
      key: "numbers",
      body: (
        <dl className="grid gap-6 md:grid-cols-3">
          {piece.metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col-reverse gap-1.5 border-t border-border pt-5"
            >
              <dt className={label}>{m.label}</dt>
              <dd className="font-display text-[2.75rem] leading-none font-bold">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      ),
    },
    piece.learned && {
      id: "que-sigue",
      key: "learned",
      body: <p className={prose}>{piece.learned}</p>,
    },
  ].filter(Boolean) as { id: string; key: string; body: React.ReactNode }[];

  const ficha = [
    { key: "type", value: w(`types.${piece.type}`) },
    piece.role && { key: "role", value: piece.role },
    piece.version && {
      key: "version",
      value: [`v${piece.version}`, piece.years].filter(Boolean).join(" · "),
    },
  ].filter(Boolean) as { key: string; value: string }[];

  return (
    <main className="mx-auto max-w-[90rem] px-4 md:px-8 xl:px-16">
      <div className="flex items-center justify-between pt-6">
        <Link
          href="/#trabajo"
          className="text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          {t("back")}
        </Link>
        <p className="font-mono text-xs text-muted-foreground">
          <span aria-hidden="true">
            {t("position", { n: index + 1, total: pieces.length })}
          </span>
          <span className="sr-only">
            {t("positionSr", { n: index + 1, total: pieces.length })}
          </span>
        </p>
      </div>

      <header className="flex flex-col gap-5 pt-12 pb-10 md:pt-16">
        <div className="flex flex-wrap gap-2">
          <PieceTag>
            {w(`types.${piece.type}`)}
            {piece.simulated && ` · ${w("simulated")}`}
          </PieceTag>
          {piece.status === "borrador" && (
            <PieceTag muted>{w("draft")}</PieceTag>
          )}
        </div>
        <h1 className="text-[2.5rem] leading-none font-bold tracking-tight md:text-7xl">
          {piece.title}
        </h1>
        <p className="max-w-[47.5rem] text-lg leading-snug text-foreground-secondary md:text-[1.375rem]">
          {piece.line}
        </p>
      </header>

      <section
        aria-labelledby="ficha-titulo"
        className="flex flex-col gap-3 pb-14"
      >
        <h2
          id="ficha-titulo"
          className="font-mono text-[0.6875rem] font-medium tracking-wide text-brand uppercase"
        >
          {t("ficha")}
        </h2>
        <dl className="grid gap-x-6 md:grid-cols-6">
          {ficha.map((f) => (
            <div
              key={f.key}
              className="flex flex-col gap-2 border-t border-border py-5 md:col-span-2"
            >
              <dt className={label}>{t(f.key)}</dt>
              <dd className="text-[1.0625rem] font-medium">{f.value}</dd>
            </div>
          ))}
          {piece.stack.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-border py-5 md:col-span-3">
              <dt className={label}>{t("stack")}</dt>
              <dd className="text-[1.0625rem] font-medium">
                {piece.stack.join(" · ")}
              </dd>
            </div>
          )}
          {(piece.demoUrl || piece.repoUrl || piece.repoPrivate) && (
            <div className="flex flex-col gap-2 border-t border-border py-5 md:col-span-3">
              <dt className={label}>{t("links")}</dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-1 text-[1.0625rem] font-medium">
                {piece.demoUrl && (
                  <a
                    href={piece.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline-offset-4 hover:underline"
                  >
                    {t("openDemo")}
                    <span className="sr-only">{t("newTabSr")}</span>
                  </a>
                )}
                {piece.repoUrl ? (
                  <a
                    href={piece.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline-offset-4 hover:underline"
                  >
                    {t("code")}
                    <span className="sr-only">{t("newTabSr")}</span>
                  </a>
                ) : (
                  piece.repoPrivate && (
                    <span className="text-muted-foreground">
                      {t("repoPrivate")}
                    </span>
                  )
                )}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <figure className="flex flex-col gap-3 pb-20">
        {piece.demoUrl ? (
          <iframe
            src={piece.demoUrl}
            title={t("demoTitle", { piece: piece.title })}
            loading="lazy"
            className="aspect-[41/20] w-full rounded-sm border border-border bg-background"
          />
        ) : (
          <PieceMedia
            piece={{
              title: piece.cover ? piece.title : t("demoPending"),
              cover: piece.cover,
            }}
            sizes="(min-width: 1440px) 1312px, 100vw"
            className="aspect-[41/20]"
          />
        )}
        {piece.demoNote && (
          <figcaption className={label}>{piece.demoNote}</figcaption>
        )}
      </figure>

      {sections.map((s, i) => (
        <HomeSection
          key={s.id}
          id={s.id}
          number={String(i + 1).padStart(2, "0")}
          label={t(`sections.${s.key}`)}
        >
          {s.body}
        </HomeSection>
      ))}

      <PieceNav
        prev={
          pieces[index - 1] && {
            slug: pieces[index - 1]!.slug,
            title: pieces[index - 1]!.title,
          }
        }
        next={
          pieces[index + 1] && {
            slug: pieces[index + 1]!.slug,
            title: pieces[index + 1]!.title,
          }
        }
      />
    </main>
  );
}
