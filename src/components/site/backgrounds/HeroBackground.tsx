"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { createHeroEngine } from "./engine";

export interface HeroBackgroundProps {
  className?: string;
}

/**
 * Fondo animado del hero. Va como primer hijo de una sección con
 * `position: relative` (por ejemplo `<BackgroundSection variant="hero">`):
 * ocupa toda la sección, queda detrás del contenido y escucha el puntero
 * sobre ella. Es decorativo: se oculta a lectores de pantalla.
 */
export function HeroBackground({ className }: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement?.parentElement;
    if (!canvas || !section) return;
    const engine = createHeroEngine(canvas, section);
    return () => engine.destroy();
  }, []);

  return (
    <div aria-hidden="true" className={cn("skin-hero-layer", className)}>
      <canvas ref={canvasRef} className="skin-hero-canvas" />
      <div className="skin-hero-scrim" />
    </div>
  );
}
