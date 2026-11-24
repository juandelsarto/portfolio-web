import Image from "next/image";

import type { Piece } from "@/lib/work-schema";
import { cn } from "@/lib/utils";

/**
 * Captura de la pieza. Las piezas publicadas siempre tienen `cover` (lo exige
 * la ficha); los borradores sin captura muestran un marco con el nombre.
 */
export function PieceMedia({
  piece,
  sizes,
  className,
}: {
  piece: Pick<Piece, "title" | "cover">;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm border border-border bg-muted",
        className,
      )}
    >
      {piece.cover ? (
        <Image
          src={piece.cover}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center font-mono text-xs tracking-wide text-muted-foreground uppercase"
        >
          {piece.title}
        </span>
      )}
    </div>
  );
}
