import { cn } from "@/lib/utils";

/** Monograma JC (Afacad Flux, color acento, sin fondo): marca del header y favicon. */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center font-display text-2xl leading-none font-bold tracking-tight text-brand",
        className,
      )}
    >
      JC
    </span>
  );
}
