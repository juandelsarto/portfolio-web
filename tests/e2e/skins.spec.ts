import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { PNG } from "pngjs";

import {
  AA_LARGE,
  AA_TEXT,
  contrastRatio,
  isLargeText,
  type Rgb,
} from "../support/contrast";
import { ALL_COMBOS, LAUNCH_COMBOS, type SkinCombo } from "../support/skins";

/**
 * CI de skins: cada página se revisa una vez por combinación de skin y tema.
 * - axe (WCAG 2.2 A y AA) sin violaciones.
 * - Texto sobre los fondos: contraste AA contra el color promedio que queda
 *   detrás de cada texto (patrones, canvas del hero y velo incluidos).
 * - Regresión visual en 390 y 1440 px (proyectos skins-mobile y skins-desktop).
 *
 * Corre con movimiento reducido: el hero dibuja un único cuadro fijo, así las
 * capturas son estables.
 */

const PAGES: { path: string; name: string; combos: SkinCombo[] }[] = [
  { path: "/", name: "home", combos: LAUNCH_COMBOS },
  { path: "/dev/ui", name: "dev-ui", combos: LAUNCH_COMBOS },
  { path: "/dev/fondos", name: "dev-fondos", combos: ALL_COMBOS },
];

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.use({ reducedMotion: "reduce" });

/** Abre la página y aplica la skin y el tema en `<html>`, como el selector real. */
async function openWithSkin(page: Page, path: string, combo: SkinCombo) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  // /dev/fondos tiene su propio selector: esperar a que escriba sus valores
  // iniciales para no pisarlos después.
  if (path === "/dev/fondos") {
    await expect(page.locator("html")).toHaveAttribute("data-skin", "core");
  }
  await page.evaluate(({ skin, theme }) => {
    document.documentElement.dataset.skin = skin;
    document.documentElement.dataset.theme = theme;
  }, combo);
  await expect(page.locator("html")).toHaveAttribute("data-skin", combo.skin);
  // Un cuadro para que el canvas redibuje con los colores nuevos.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

/** Color de texto computado, pasado a RGB con un canvas (sirve para cualquier formato). */
async function textColor(locator: Locator): Promise<Rgb> {
  return locator.evaluate((el) => {
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.fillStyle = getComputedStyle(el).color;
    ctx.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b] as const;
  });
}

/** Color promedio detrás de un texto: se oculta el texto y se mide su caja. */
async function backgroundBehind(locator: Locator): Promise<Rgb> {
  await locator.evaluate((el) => {
    (el as HTMLElement).dataset.ciHidden = (el as HTMLElement).style.color;
    (el as HTMLElement).style.setProperty("color", "transparent", "important");
  });
  const shot = await locator.screenshot({ animations: "disabled" });
  await locator.evaluate((el) => {
    (el as HTMLElement).style.color =
      (el as HTMLElement).dataset.ciHidden ?? "";
  });
  const png = PNG.sync.read(shot);
  let r = 0;
  let g = 0;
  let b = 0;
  const n = png.width * png.height;
  for (let i = 0; i < png.data.length; i += 4) {
    r += png.data[i]!;
    g += png.data[i + 1]!;
    b += png.data[i + 2]!;
  }
  return [r / n, g / n, b / n];
}

for (const { path, name, combos } of PAGES) {
  for (const combo of combos) {
    test.describe(`${name} · ${combo.id}`, () => {
      test("axe sin violaciones", async ({ page }) => {
        await openWithSkin(page, path, combo);
        const results = await new AxeBuilder({ page })
          .withTags(WCAG_TAGS)
          .analyze();
        const summary = results.violations.map(
          (v) =>
            `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
        );
        expect(summary, summary.join("\n")).toEqual([]);
      });

      test("regresión visual", async ({ page }) => {
        await openWithSkin(page, path, combo);
        await expect(page).toHaveScreenshot(`${name}-${combo.id}.png`, {
          fullPage: true,
          animations: "disabled",
          maxDiffPixelRatio: 0.01,
          stylePath: "tests/e2e/screenshot.css",
        });
      });
    });
  }
}

for (const combo of ALL_COMBOS) {
  test(`dev-fondos · ${combo.id} · el texto se lee sobre cada fondo`, async ({
    page,
  }) => {
    await openWithSkin(page, "/dev/fondos", combo);
    const texts = page
      .locator(".skin-section :is(h1, h2, p)")
      .filter({ visible: true });
    const count = await texts.count();
    expect(count).toBeGreaterThan(0);
    const failures: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = texts.nth(i);
      // El texto dentro de una tarjeta se mide contra la tarjeta (lo cubre axe).
      if (await text.evaluate((el) => !!el.closest("li"))) continue;
      const [size, weight] = await text.evaluate((el) => {
        const cs = getComputedStyle(el);
        return [
          Number.parseFloat(cs.fontSize),
          Number.parseInt(cs.fontWeight, 10),
        ];
      });
      const min = isLargeText(size, weight) ? AA_LARGE : AA_TEXT;
      const ratio = contrastRatio(
        await textColor(text),
        await backgroundBehind(text),
      );
      if (ratio < min) {
        const label = (await text.textContent())?.slice(0, 40);
        failures.push(`"${label}": ${ratio.toFixed(2)}:1 (mínimo ${min}:1)`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
}
