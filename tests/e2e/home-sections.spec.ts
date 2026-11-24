import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("el rol del Hero ocupa una sola línea desde tablet", async ({ page }) => {
  for (const width of [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const name = await page.locator("#inicio h1 span").first().boundingBox();
    const role = await page.locator("#inicio h1 span").nth(1).boundingBox();
    expect(role!.height).toBeCloseTo(name!.height, 0);
  }
});

test("el Hero tiene los CTAs del copy v6", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#inicio");
  await expect(
    hero.getByRole("link", { name: "Descargar CV (PDF)" }),
  ).toBeVisible();
  await expect(
    hero.getByRole("button", { name: "Copiar email" }),
  ).toBeVisible();
  // En producción, sin piezas publicadas, no hay "Ver trabajo" ni sección Trabajo.
  await expect(hero.getByRole("link", { name: /Ver trabajo/ })).toHaveCount(0);
  await expect(page.locator("#trabajo")).toHaveCount(0);
});

test("Sobre mí tiene los cinco principios y las herramientas", async ({
  page,
}) => {
  await page.goto("/");
  const about = page.locator("#sobre-mi");
  await expect(about.getByRole("heading", { level: 2 })).toHaveText(/Sobre mí/);
  await expect(about.locator("ol > li")).toHaveCount(5);
  await expect(about.locator("dl dt")).toHaveText([
    "Diseño",
    "Frontend",
    "Calidad",
    "Tooling y entrega",
    "Con AI",
  ]);
});

for (const theme of ["light", "dark"] as const) {
  test(`la 404 se ve y no tiene errores de axe (tema ${theme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    const res = await page.goto("/esta-pagina-no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Esta página no existe.",
    );
    await page.getByRole("link", { name: "Volver al inicio" }).click();
    await expect(page).toHaveURL("/es");
    await page.goto("/esta-pagina-no-existe");
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test("Trayectoria despliega el detalle de cada puesto, también con teclado", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#trayectoria");
  const buttons = section.getByRole("button");
  await expect(buttons).toHaveCount(5);
  await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
  await expect(
    section.getByText(/portal de documentación interactivo/),
  ).toBeVisible();

  const around = section.getByRole("button", { name: /Around Media Services/ });
  await expect(around).toHaveAttribute("aria-expanded", "false");
  await expect(section.getByText(/catálogo de media/)).toBeHidden();
  await around.focus();
  await page.keyboard.press("Enter");
  await expect(around).toHaveAttribute("aria-expanded", "true");
  await expect(section.getByText(/catálogo de media/)).toBeVisible();
  await page.keyboard.press("Space");
  await expect(section.getByText(/catálogo de media/)).toBeHidden();

  await expect(section.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://linkedin.com/in/juancruzdelsarto",
  );
});
