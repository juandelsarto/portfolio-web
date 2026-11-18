import type { Skin } from "./skins";

/** Colores que leen las escenas, desde las variables `--skin-*`. */
export const COLOR_KEYS = [
  "bg",
  "surface",
  "surface-raised",
  "border",
  "border-strong",
  "text-primary",
  "text-secondary",
  "text-muted",
  "accent",
  "accent-fill",
  "secondary",
  "secondary-fill",
  "alt-1",
  "alt-2",
  "alt-3",
] as const;

export type ColorKey = (typeof COLOR_KEYS)[number];
export type Rgb = readonly [number, number, number];
export type Palette = Record<ColorKey, Rgb>;

export interface Pointer {
  x: number;
  y: number;
  /** Velocidad del último cuadro, en px. */
  vx: number;
  vy: number;
}

export interface FrameInput {
  w: number;
  h: number;
  /** Segundos de animación acumulados (quieto con movimiento reducido). */
  t: number;
  pointer: Pointer;
  colors: Palette;
  reduced: boolean;
}

export interface Scene {
  init?: (input: { w: number; h: number }) => void;
  draw: (ctx: CanvasRenderingContext2D, input: FrameInput) => void;
}

const TAU = Math.PI * 2;

/** Color con opacidad para el canvas. */
export function rgba([r, g, b]: Rgb, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a))})`;
}

/** Interpolación suave entre 0 y 1 (smoothstep). */
export function smooth(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return x * x * (3 - 2 * x);
}

/** Luminancia relativa aproximada (0 a 1), para saber si el fondo es oscuro. */
export function isDark([r, g, b]: Rgb): boolean {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110;
}

/** Core · grilla de puntos que se aparta del puntero y toma el acento. */
function core(): Scene {
  return {
    draw(c, { w, h, t, pointer: p, colors }) {
      const sp = 26;
      const R = 180;
      for (let y = sp / 2; y < h + sp; y += sp) {
        for (let x = sp / 2; x < w + sp; x += sp) {
          const wy = y + Math.sin(t * 0.7 + x * 0.012) * 2.5;
          const dx = x - p.x;
          const dy = wy - p.y;
          const d = Math.hypot(dx, dy) || 1;
          const f = smooth(1 - d / R);
          c.fillStyle =
            f > 0.04
              ? rgba(colors.accent, 0.28 + f * 0.72)
              : rgba(colors["text-muted"], 0.38);
          c.beginPath();
          c.arc(
            x + (dx / d) * f * 20,
            wy + (dy / d) * f * 20,
            1.25 + f * 3,
            0,
            TAU,
          );
          c.fill();
        }
      }
    },
  };
}

/** Editorial · renglones de papel que ondulan; el puntero los levanta. */
function editorial(): Scene {
  return {
    draw(c, { w, h, t, pointer: p, colors }) {
      const gap = 22;
      const step = 10;
      let i = 0;
      for (let y0 = gap; y0 < h; y0 += gap, i++) {
        const accent = i % 8 === 5;
        c.strokeStyle = accent
          ? rgba(colors.accent, 0.5)
          : rgba(colors["text-primary"], 0.17);
        c.lineWidth = accent ? 1.2 : 1;
        const gy = Math.exp(-((y0 - p.y) ** 2) / (2 * 110 * 110));
        c.beginPath();
        for (let x = 0; x <= w + step; x += step) {
          const gx = Math.exp(-((x - p.x) ** 2) / (2 * 140 * 140));
          const y =
            y0 +
            Math.sin(x * 0.0045 + t * 0.35 + i * 0.21) * 3.5 +
            Math.sin(x * 0.011 - t * 0.2) * 1.2 -
            gx * gy * 26;
          if (x === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();
      }
    },
  };
}

/** Brutal · semitono de impresión con una capa de acento desregistrada. */
function neubrutalista(): Scene {
  return {
    draw(c, { w, h, t, pointer: p, colors }) {
      const cell = 18;
      const R = 220;
      for (let pass = 0; pass < 2; pass++) {
        c.fillStyle = rgba(
          pass ? colors["text-primary"] : colors["accent-fill"],
          1,
        );
        for (let y = cell / 2; y < h + cell; y += cell) {
          for (let x = cell / 2; x < w + cell; x += cell) {
            const v =
              0.5 +
              0.5 *
                Math.sin(x * 0.007 + t * 0.5) *
                Math.cos(y * 0.009 - t * 0.35 + x * 0.002);
            const f = smooth(1 - Math.hypot(x - p.x, y - p.y) / R);
            // Menos densidad del lado del texto (izquierda).
            const fade = 0.25 + 0.75 * smooth((x / w - 0.12) / 0.5);
            let r = cell * 0.5 * ((0.1 + 0.5 * v * v) * fade + 0.55 * f);
            if (pass === 0) {
              if (f < 0.02 && v < 0.82) continue;
              r *= 1.05;
            }
            r = Math.min(r, cell * 0.62);
            const o = pass ? 0 : 4 + f * 4;
            c.beginPath();
            c.arc(x + o, y + o, r, 0, TAU);
            c.fill();
          }
        }
      }
    },
  };
}

/** Neon · grilla synthwave con sol rayado; el punto de fuga sigue al puntero. */
function neon(): Scene {
  let stars: { x: number; y: number; p: number; s: number }[] = [];
  return {
    init() {
      stars = Array.from({ length: 110 }, () => ({
        x: Math.random(),
        y: Math.random(),
        p: Math.random() * TAU,
        s: Math.random() * 1.2 + 0.3,
      }));
    },
    draw(c, { w, h, t, pointer: p, colors }) {
      const hz = h * 0.6;
      const vx = w * 0.62 + (p.x - w * 0.62) * 0.35;
      const sunX = w * 0.8 + (p.x - w * 0.62) * 0.12;

      let g = c.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, rgba(colors.bg, 0));
      g.addColorStop(1, rgba(colors.secondary, 0.16));
      c.fillStyle = g;
      c.fillRect(0, 0, w, hz);

      for (const s of stars) {
        c.fillStyle = rgba(
          colors["text-primary"],
          0.25 + 0.35 * Math.sin(t * 1.4 + s.p),
        );
        c.fillRect(s.x * w, s.y * hz * 0.9, s.s, s.s);
      }

      const sr = Math.min(w, h) * 0.18;
      c.save();
      c.beginPath();
      c.arc(sunX, hz, sr, Math.PI, 0);
      c.closePath();
      c.clip();
      g = c.createLinearGradient(0, hz - sr, 0, hz);
      g.addColorStop(0, rgba(colors["alt-3"], 0.95));
      g.addColorStop(1, rgba(colors.secondary, 0.95));
      c.fillStyle = g;
      c.fillRect(sunX - sr, hz - sr, sr * 2, sr);
      c.fillStyle = rgba(colors.bg, 1);
      const band = sr * 0.075;
      for (let k = 0; k < 7; k++) {
        const th = 1.5 + k * 1.6;
        const yy = hz - sr * 0.45 + k * band + ((t * 8) % band);
        c.fillRect(sunX - sr, yy - th / 2, sr * 2, th);
      }
      c.restore();

      c.fillStyle = rgba(colors.bg, 1);
      c.fillRect(0, hz, w, h - hz);
      c.save();
      c.shadowColor = rgba(colors.accent, 1);
      c.shadowBlur = 10;
      c.strokeStyle = rgba(colors.accent, 0.75);
      c.lineWidth = 1.2;
      const N = 18;
      const ph = (t * 0.35) % 1;
      for (let i = 0; i < N; i++) {
        const s = (i + ph) / N;
        const y = hz + (h - hz) * s * s;
        c.globalAlpha = Math.min(1, s * 1.6);
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(w, y);
        c.stroke();
      }
      c.globalAlpha = 1;
      for (let j = -24; j <= 24; j++) {
        c.beginPath();
        c.moveTo(vx + j * 6, hz);
        c.lineTo(vx + j * (w / 9), h + 40);
        c.stroke();
      }
      c.restore();

      c.save();
      c.shadowColor = rgba(colors.secondary, 1);
      c.shadowBlur = 18;
      c.strokeStyle = rgba(colors.secondary, 0.9);
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(0, hz);
      c.lineTo(w, hz);
      c.stroke();
      c.restore();

      g = c.createLinearGradient(0, hz - 40, 0, hz + 60);
      g.addColorStop(0, rgba(colors.bg, 0));
      g.addColorStop(1, rgba(colors.bg, 0.55));
      c.fillStyle = g;
      c.fillRect(0, hz - 40, w, 100);
    },
  };
}

function star4(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  rot: number,
) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.beginPath();
  c.moveTo(0, -r);
  c.quadraticCurveTo(r * 0.12, -r * 0.12, r, 0);
  c.quadraticCurveTo(r * 0.12, r * 0.12, 0, r);
  c.quadraticCurveTo(-r * 0.12, r * 0.12, -r, 0);
  c.quadraticCurveTo(-r * 0.12, -r * 0.12, 0, -r);
  c.fill();
  c.restore();
}

/** Y2K · blobs holográficos; uno sigue al puntero y deja una estela de destellos. */
function y2k(): Scene {
  let ambient: { x: number; y: number; p: number; s: number }[] = [];
  let trail: { x: number; y: number; l: number; s: number; r: number }[] = [];
  return {
    init() {
      trail = [];
      ambient = Array.from({ length: 14 }, () => ({
        x: Math.random(),
        y: Math.random(),
        p: Math.random() * TAU,
        s: 6 + Math.random() * 10,
      }));
    },
    draw(c, { w, h, t, pointer: p, colors, reduced }) {
      const m = Math.min(w, h);
      const dark = isDark(colors.bg);
      const blobs: [Rgb, number, number, number][] = [
        [
          colors["accent-fill"],
          0.62 + 0.16 * Math.sin(t * 0.21),
          0.35 + 0.2 * Math.cos(t * 0.17),
          0.42,
        ],
        [
          colors["secondary-fill"],
          0.82 + 0.1 * Math.cos(t * 0.19 + 1),
          0.62 + 0.18 * Math.sin(t * 0.23),
          0.36,
        ],
        [
          colors["alt-2"],
          0.55 + 0.18 * Math.sin(t * 0.15 + 2),
          0.78 + 0.12 * Math.cos(t * 0.2),
          0.4,
        ],
        [
          colors["alt-1"],
          0.92 + 0.06 * Math.sin(t * 0.27 + 3),
          0.2 + 0.14 * Math.sin(t * 0.18),
          0.26,
        ],
        [colors["alt-3"], p.x / w, p.y / h, 0.28],
      ];
      c.globalCompositeOperation = dark ? "lighter" : "source-over";
      for (const [col, bx, by, br] of blobs) {
        const x = bx * w;
        const y = by * h;
        const r = br * m * 1.15;
        const g = c.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rgba(col, dark ? 0.42 : 0.6));
        g.addColorStop(1, rgba(col, 0));
        c.fillStyle = g;
        c.fillRect(x - r, y - r, r * 2, r * 2);
      }
      c.globalCompositeOperation = "source-over";

      // Brillo cromado: blanco de luz, no un color de marca.
      const sheen = c.createLinearGradient(0, 0, w, h);
      const white: Rgb = [255, 255, 255];
      sheen.addColorStop(0.35, rgba(white, 0));
      sheen.addColorStop(0.5, rgba(white, dark ? 0.05 : 0.22));
      sheen.addColorStop(0.65, rgba(white, 0));
      c.fillStyle = sheen;
      c.fillRect(0, 0, w, h);

      c.fillStyle = rgba(dark ? colors["text-primary"] : colors.surface, 1);
      for (const s of ambient) {
        const k = Math.max(0, Math.sin(t * 1.1 + s.p));
        if (k > 0.05) star4(c, s.x * w, s.y * h, s.s * k, 0);
      }

      if (!reduced && Math.hypot(p.vx, p.vy) > 1.2 && trail.length < 80) {
        trail.push({
          x: p.x + (Math.random() - 0.5) * 30,
          y: p.y + (Math.random() - 0.5) * 30,
          l: 1,
          s: 5 + Math.random() * 9,
          r: Math.random(),
        });
      }
      for (const s of trail) {
        s.l -= 0.022;
        s.y -= 0.3;
        c.fillStyle = rgba(dark ? colors["alt-3"] : colors.accent, s.l);
        star4(c, s.x, s.y, s.s * (0.4 + s.l * 0.6), s.r);
      }
      trail = trail.filter((s) => s.l > 0);
    },
  };
}

/** Cassette · franjas setentosas que suben en diagonal y ondulan. */
function cassette(): Scene {
  return {
    draw(c, { w, h, t, pointer: p, colors }) {
      const cols = [
        colors["alt-1"],
        colors["accent-fill"],
        colors["alt-3"],
        colors["alt-2"],
      ];
      const bt = Math.max(16, Math.min(34, h * 0.042));
      const step = 8;
      const y0 = h * 1.02;
      const yAt = (x: number, k: number) => {
        const base = y0 - (x / w) * h * 0.55;
        const g =
          Math.exp(-((x - p.x) ** 2) / (2 * 170 * 170)) *
          smooth(1 - Math.abs(p.y - base) / (h * 0.6));
        return (
          base +
          k * bt +
          Math.sin(x * 0.0055 - t * 0.6 + k * 0.22) * 14 +
          Math.sin(x * 0.013 + t * 0.4) * 4 -
          g * 38
        );
      };
      cols.forEach((col, k) => {
        c.fillStyle = rgba(col, 1);
        c.beginPath();
        for (let x = -step; x <= w + step; x += step) {
          const y = yAt(x, k);
          if (x < 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        for (let x = w + step; x >= -step; x -= step)
          c.lineTo(x, yAt(x, k) + bt + 0.6);
        c.closePath();
        c.fill();
      });
    },
  };
}

export const SCENES: Record<Skin, () => Scene> = {
  core,
  neubrutalista,
  editorial,
  neon,
  y2k,
  cassette,
};
