// Tipos de pieza sin dependencias: los usan también los componentes de cliente.

/** Tipos de pieza: definen los filtros de Trabajo. */
export const PIECE_TYPES = ["app", "componente", "experimento"] as const;
export type PieceType = (typeof PIECE_TYPES)[number];
