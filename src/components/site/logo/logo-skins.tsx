"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Logo, type LogoProps } from "./Logo";

/** Cada cuánto cambia de skin mientras el puntero está encima. */
export const SKIN_INTERVAL_MS = 700;

// Logos de las skins archivadas (Figma: "Archivo · Logo (skins)"). Y2K no
// tiene versión oscura: se usa la clara en los dos temas.
export const LOGO_SKINS = {
  light: [
    "cassette-light",
    "y2k-light",
    "neon-light",
    "brutal-light",
    "editorial-light",
  ],
  dark: [
    "cassette-dark",
    "y2k-light",
    "neon-dark",
    "brutal-dark",
    "editorial-dark",
  ],
} as const;

type Theme = keyof typeof LOGO_SKINS;

/**
 * El Logo, con un guiño: mientras el puntero está encima recorre los logos
 * de las skins archivadas, uno cada 0,7 s (el primero también a los 0,7 s), y
 * al salir vuelve al logo actual. Muestra las del tema activo. Con movimiento
 * reducido no cambia. Las imágenes se cargan recién en el primer hover.
 */
export function LogoSkins({ className, ...logoProps }: LogoProps) {
  const [armed, setArmed] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [index, setIndex] = useState(-1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setIndex(-1);
  }

  function start() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
    // El primer cambio llega a los 0,7 s: da tiempo a cargar las imágenes.
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % LOGO_SKINS.light.length),
      SKIN_INTERVAL_MS,
    );
  }

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const skins = LOGO_SKINS[theme];

  return (
    <span
      // Caja cuadrada y de tamaño fijo: las skins (lienzo de 440 × 440) no se deforman.
      className={cn(
        "relative block aspect-square shrink-0 overflow-hidden",
        className,
      )}
      onPointerEnter={(e) => e.pointerType === "mouse" && start()}
      onPointerLeave={stop}
      data-skins=""
      data-skin={index >= 0 ? skins[index] : undefined}
    >
      <Logo
        {...logoProps}
        className={cn("size-full", index >= 0 && "invisible")}
      />
      {armed &&
        skins.map((name, i) => (
          <Image
            key={`${theme}-${name}`}
            src={`/logo/skins/${name}.webp`}
            alt=""
            aria-hidden="true"
            width={192}
            height={192}
            unoptimized
            className={cn(
              "absolute inset-0 size-full",
              i === index ? "visible" : "invisible",
            )}
          />
        ))}
    </span>
  );
}
