import { expect, test } from "@playwright/test";

// WCAG 2.2 · 1.4.10 Reflow: el contenido se lee sin scroll horizontal desde
// 320 px. Además, la navegación correcta en cada tamaño.
const widths = [320, 375, 768, 1024, 1440];
const pages = ["/es", "/es/no-existe"];

for (const width of widths) {
  test(`sin scroll horizontal a ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${path} a ${width} px`).toBeLessThanOrEqual(0);
    }
  });
}

test("en mobile se ve la barra flotante y no la navegación del header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/es");
  await expect(
    page.getByRole("navigation", { name: "Navegación rápida" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Secciones" }),
  ).toBeHidden();
});

test("en desktop se ve la navegación del header y no la barra flotante", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  await expect(
    page.getByRole("navigation", { name: "Secciones" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navegación rápida" }),
  ).toBeHidden();
});

test("el contenido no queda tapado por la barra flotante al final de la página", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/es");
  // Sin scroll suave: medir con la página ya al final.
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.scrollY + window.innerHeight >= document.body.scrollHeight - 1,
      ),
    )
    .toBe(true);
  const bar = await page
    .getByRole("navigation", { name: "Navegación rápida" })
    .boundingBox();
  const last = await page.locator("#contacto p").last().boundingBox();
  expect(last!.y + last!.height).toBeLessThanOrEqual(bar!.y);
});

test("todo control se puede alcanzar con Tab y muestra el foco", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  const seen = new Set<string>();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        key: `${el.tagName}:${el.textContent?.trim().slice(0, 30)}:${el.getAttribute("href") ?? ""}`,
        outline: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2,
      };
    });
    if (!info) continue;
    expect(info.outline, `foco visible en ${info.key}`).toBe(true);
    seen.add(info.key);
  }
  expect(seen.size).toBeGreaterThan(10);
});
