"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface Job {
  years: string;
  company: string;
  role: string;
  summary: string;
  /** Hitos del puesto: qué se hizo y en qué tipo de producto, uno por ítem. */
  milestones: string[];
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "size-4 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
        open && "rotate-180",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

function JobRow({
  job,
  defaultOpen,
  milestonesLabel,
}: {
  job: Job;
  defaultOpen: boolean;
  milestonesLabel: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const detailId = useId();

  return (
    <li className="border-t border-border">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen((v) => !v)}
          className="grid w-full grid-cols-[1fr_auto] items-start gap-x-8 gap-y-2 rounded-sm py-5 text-left md:grid-cols-[10rem_1fr_auto]"
        >
          <span className="col-span-2 font-mono text-xs text-muted-foreground md:col-span-1 md:pt-1.5">
            {job.years}
          </span>
          <span className="flex flex-col gap-1">
            {/* Empresa en Afacad Flux y rol en el acento, para distinguirlos. */}
            <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <span className="font-display text-lg font-semibold">
                {job.company}
              </span>
              <span className="text-[0.9375rem] font-medium text-brand">
                {job.role}
              </span>
            </span>
            <span className="text-[0.9375rem] leading-normal font-normal text-muted-foreground">
              {job.summary}
            </span>
          </span>
          <span className="pt-1.5">
            <Chevron open={open} />
          </span>
        </button>
      </h3>
      {/* Despliegue animado: la fila crece de 0fr a 1fr (CSS). Cerrado queda inerte,
          fuera del foco y del lector de pantalla. */}
      <div
        id={detailId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none",
          open
            ? "visible grid-rows-[1fr] opacity-100"
            : "invisible grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pb-6 md:pl-48">
            <p className="font-mono text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase">
              {milestonesLabel}
            </p>
            <ul className="flex max-w-[51rem] flex-col gap-2.5">
              {job.milestones.map((m) => (
                <li
                  key={m}
                  className="relative pl-6 text-[0.9375rem] leading-relaxed text-foreground-secondary"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 text-brand"
                  >
                    —
                  </span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Trayectoria: un puesto por fila con años, empresa, rol y resumen; los hitos
 * se despliegan con un botón (aria-expanded) y una transición CSS. El primero
 * empieza abierto, como en Figma.
 */
export function TrajectoryList({
  jobs,
  milestonesLabel,
}: {
  jobs: Job[];
  milestonesLabel: string;
}) {
  return (
    <ol className="border-b border-border">
      {jobs.map((job, i) => (
        <JobRow
          key={`${job.company}-${job.years}`}
          job={job}
          defaultOpen={i === 0}
          milestonesLabel={milestonesLabel}
        />
      ))}
    </ol>
  );
}
