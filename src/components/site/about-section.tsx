import { HomeSection } from "@/components/site/home-section";
import { about } from "@/content/home";

const subLabel =
  "font-mono text-xs font-medium tracking-wide text-brand uppercase";
const row =
  "grid gap-2 border-b border-border py-4 md:grid-cols-[17.5rem_1fr] md:gap-8";
const rowTitle = "font-display text-lg font-semibold";

/** 03 Sobre mí: bio, Cómo trabajo (cinco principios) y herramientas. */
export function AboutSection() {
  return (
    <HomeSection id="sobre-mi" number="03" label={about.label}>
      <div className="flex flex-col gap-12">
        <div className="flex max-w-[43rem] flex-col gap-5 text-base leading-[1.55] text-foreground-secondary md:text-lg">
          {about.bio.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            {about.areas.join(" · ")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className={subLabel}>{about.howTitle}</h3>
          <ol className="border-t border-border">
            {about.principles.map((p, i) => (
              <li key={p.title} className={row}>
                <p className="flex items-baseline gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs font-medium text-brand"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={rowTitle}>{p.title}</span>
                </p>
                <p className="text-[0.9375rem] leading-normal text-muted-foreground">
                  {p.body} <em>{about.practiceLabel}</em> {p.practice}
                </p>
              </li>
            ))}
          </ol>
          {/* Disclaimer sobre el uso de AI: recuadro tipo nota, no un renglón más. */}
          <aside
            role="note"
            aria-label={about.noteLabel}
            className="mt-4 flex items-start rounded-sm border border-l-4 border-border border-l-brand bg-muted p-6"
          >
            <div className="flex flex-col gap-1">
              <p className="font-display text-2xl font-semibold">
                {about.closing}
              </p>
            </div>
          </aside>

          <h3 className={`${subLabel} pt-10`}>{about.toolsTitle}</h3>
          <dl className="border-t border-border">
            {about.tools.map((t) => (
              <div key={t.area} className={row}>
                <dt className={rowTitle}>{t.area}</dt>
                <dd className="text-[0.9375rem] leading-normal text-muted-foreground">
                  {t.items.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </HomeSection>
  );
}
