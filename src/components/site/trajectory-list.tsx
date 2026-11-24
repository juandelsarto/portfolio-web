"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface Job {
  years: string;
  company: string;
  role: string;
  summary: string;
  detail: string;
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

function JobRow({ job, defaultOpen }: { job: Job; defaultOpen: boolean }) {
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
            <span className="font-display text-lg font-semibold">
              {job.company} · {job.role}
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
      <div id={detailId} hidden={!open} className="pb-5 md:pl-48">
        <p className="max-w-[51rem] text-[0.9375rem] leading-relaxed text-foreground-secondary">
          {job.detail}
        </p>
      </div>
    </li>
  );
}

/**
 * Trayectoria: un puesto por fila con años, empresa, rol y resumen; el detalle
 * se despliega con un botón (aria-expanded). El primero empieza abierto, como
 * en Figma.
 */
export function TrajectoryList({ jobs }: { jobs: Job[] }) {
  return (
    <ol className="border-b border-border">
      {jobs.map((job, i) => (
        <JobRow
          key={`${job.company}-${job.years}`}
          job={job}
          defaultOpen={i === 0}
        />
      ))}
    </ol>
  );
}
