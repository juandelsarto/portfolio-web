import { cn } from "@/lib/utils";

/** Tag de pieza (Figma: Tag): borde y texto en acento, mono en mayúsculas. */
export function PieceTag({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  /** Para estados internos, como "Borrador" (solo en desarrollo y previews). */
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border px-2 py-1 font-mono text-[0.6875rem] leading-none font-medium tracking-wide uppercase",
        muted
          ? "border-line-strong text-muted-foreground"
          : "border-brand text-brand",
      )}
    >
      {children}
    </span>
  );
}
