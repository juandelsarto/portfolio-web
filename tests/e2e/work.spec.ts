import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Corre contra `pnpm dev` (proyecto "borradores"): ahí se ven las 7 piezas en borrador.
test.describe.configure({ timeout: 60_000 });

const axe = (page: import("@playwright/test").Page) =>
  new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude("nextjs-portal")
    .analyze();

test("Trabajo filtra por tipo y anuncia la cantidad", async ({ page }) => {
  await page.goto("/es");
  const work = page.locator("#trabajo");
  const group = work.getByRole("group", { name: "Filtrar por tipo" });
  await expect(group.getByRole("button")).toHaveText([
    "Todo · 7",
    "Apps · 4",
    "Componentes · 2",
    "Experimentos · 1",
  ]);
  await expect(work.getByRole("heading", { level: 3 })).toHaveCount(7);

  await group.getByRole("button", { name: /Componentes/ }).click();
  await expect(
    group.getByRole("button", { name: /Componentes/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(work.getByRole("heading", { level: 3 })).toHaveText([
    "Extractor de paleta",
    "Combinador tipográfico",
  ]);
  await expect(work.getByRole("status")).toHaveText("2 piezas");
});

test("las apps destacadas van primero, como filas", async ({ page }) => {
  await page.goto("/es");
  const rows = page
    .locator("#trabajo ul")
    .first()
    .getByRole("heading", { level: 3 });
  await expect(rows).toHaveText([
    "Boarding RSVP",
    "Calendario familiar",
    "Asesor de raquetas",
  ]);
});

test("cada pieza abre su página y se navega con las flechas", async ({
  page,
}) => {
  await page.goto("/es");
  await page.getByRole("link", { name: "Calendario familiar" }).click();
  await expect(page).toHaveURL("/es/work/calendario-familiar");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Calendario familiar",
  );
  await expect(page.getByText("Pieza 2 de 7")).toBeAttached();

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL("/es/work/extractor-de-paleta");
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL("/es/work/calendario-familiar");
  await page.getByRole("link", { name: /Boarding RSVP/ }).click();
  await expect(page).toHaveURL("/es/work/boarding-rsvp");
  await expect(page.getByText("Repo privado, acceso a pedido")).toBeVisible();
});

for (const theme of ["light", "dark"] as const) {
  test(`Trabajo y la página de pieza no tienen errores de axe (tema ${theme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/es");
    await page.locator("#trabajo").scrollIntoViewIfNeeded();
    expect(
      (await axe(page)).violations.map((v) => `${v.id}: ${v.nodes.length}`),
    ).toEqual([]);
    await page.goto("/es/work/asesor-de-raquetas");
    expect(
      (await axe(page)).violations.map((v) => `${v.id}: ${v.nodes.length}`),
    ).toEqual([]);
  });
}
