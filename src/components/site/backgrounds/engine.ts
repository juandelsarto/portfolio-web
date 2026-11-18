import {
  COLOR_KEYS,
  SCENES,
  type Palette,
  type Rgb,
  type Scene,
} from "./scenes";
import { isSkin, type Skin } from "./skins";

export interface HeroEngine {
  destroy: () => void;
}

/** Tope de píxeles por punto: más no se nota y cuesta el doble o el triple. */
const MAX_DPR = 2;
/** Suavizado del seguimiento del puntero (0 a 1 por cuadro). */
const FOLLOW = 0.08;

/**
 * Motor del fondo animado del hero: un solo canvas que dibuja la escena de la
 * skin activa con los colores de las variables `--skin-*`.
 *
 * - Cambia de escena y de colores cuando cambian `data-skin` o `data-theme` en `<html>`.
 * - Se pausa fuera de pantalla y con la pestaña oculta.
 * - Con `prefers-reduced-motion: reduce` dibuja un único cuadro y no sigue al puntero.
 * - Sin puntero (touch o puntero afuera), el foco deriva solo.
 */
export function createHeroEngine(
  canvas: HTMLCanvasElement,
  /** Elemento que escucha el puntero (la sección del hero). */
  pointerTarget: HTMLElement,
): HeroEngine {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };

  const root = document.documentElement;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const probe = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  });

  let w = 0;
  let h = 0;
  let t = 0;
  let last = 0;
  let raf = 0;
  let onScreen = true;
  let reduced = motionQuery.matches;
  let skin: Skin = "core";
  let scene: Scene = SCENES.core();
  let colors = {} as Palette;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, active: false };

  /** Pasa cualquier color CSS (hex, rgb, oklch…) a RGB dibujándolo en 1 px. */
  function toRgb(value: string): Rgb {
    if (!probe) return [0, 0, 0];
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "transparent";
    probe.fillStyle = value || "transparent";
    probe.fillRect(0, 0, 1, 1);
    const d = probe.getImageData(0, 0, 1, 1).data;
    return [d[0] ?? 0, d[1] ?? 0, d[2] ?? 0];
  }

  function readColors() {
    const cs = getComputedStyle(canvas);
    const next = {} as Record<(typeof COLOR_KEYS)[number], Rgb>;
    for (const key of COLOR_KEYS)
      next[key] = toRgb(cs.getPropertyValue(`--skin-${key}`).trim());
    colors = next;
  }

  function readSkin() {
    const value = root.dataset.skin;
    const nextSkin: Skin = isSkin(value) ? value : "core";
    if (nextSkin !== skin) {
      skin = nextSkin;
      scene = SCENES[skin]();
      scene.init?.({ w, h });
    }
    readColors();
  }

  function centerPointer() {
    pointer.x = pointer.tx = w * 0.68;
    pointer.y = pointer.ty = h * 0.5;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!pointer.active) centerPointer();
    scene.init?.({ w, h });
    if (!raf) frame(performance.now(), true);
  }

  function frame(now: number, once = false) {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    if (!reduced) {
      t += dt;
      if (!pointer.active) {
        pointer.tx = w * (0.66 + 0.18 * Math.sin(t * 0.23));
        pointer.ty = h * (0.5 + 0.22 * Math.sin(t * 0.31 + 1));
      }
    }
    const px = pointer.x;
    const py = pointer.y;
    pointer.x += (pointer.tx - pointer.x) * FOLLOW;
    pointer.y += (pointer.ty - pointer.y) * FOLLOW;
    pointer.vx = pointer.x - px;
    pointer.vy = pointer.y - py;

    ctx!.clearRect(0, 0, w, h);
    scene.draw(ctx!, { w, h, t, pointer, colors, reduced });

    raf =
      !once && !reduced && onScreen && !document.hidden
        ? requestAnimationFrame(frame)
        : 0;
  }

  function start() {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    if (reduced) {
      // Un cuadro estático y representativo.
      t = 6;
      pointer.active = false;
      centerPointer();
      frame(performance.now(), true);
    } else if (onScreen && !document.hidden) {
      raf = requestAnimationFrame(frame);
    }
  }

  function onPointerMove(e: PointerEvent) {
    if (reduced) return;
    const rect = canvas.getBoundingClientRect();
    pointer.tx = e.clientX - rect.left;
    pointer.ty = e.clientY - rect.top;
    pointer.active = true;
  }
  function onPointerLeave() {
    pointer.active = false;
  }
  function onMotionChange() {
    reduced = motionQuery.matches;
    start();
  }
  function onVisibility() {
    start();
  }

  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? true;
    start();
  });
  const attrObserver = new MutationObserver(() => {
    readSkin();
    if (!raf) frame(performance.now(), true);
  });

  readSkin();
  resizeObserver.observe(canvas);
  intersectionObserver.observe(canvas);
  attrObserver.observe(root, {
    attributes: true,
    attributeFilter: ["data-skin", "data-theme"],
  });
  pointerTarget.addEventListener("pointermove", onPointerMove);
  pointerTarget.addEventListener("pointerleave", onPointerLeave);
  motionQuery.addEventListener("change", onMotionChange);
  document.addEventListener("visibilitychange", onVisibility);
  start();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      attrObserver.disconnect();
      pointerTarget.removeEventListener("pointermove", onPointerMove);
      pointerTarget.removeEventListener("pointerleave", onPointerLeave);
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
