import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { allPieces as pieces } from "./pieces";

// Corre contra `pnpm dev` (proyecto "borradores"): ahí se ven todas las piezas,
// borradores incluidos. Lo esperado sale del contenido (./pieces).
test.describe.configure({ timeout: 60_000 });

const axe = (page: import("@playwright/test").Page) =>
  new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude("nextjs-portal")
    .analyze();

const count = (type: string) => pieces.filter((p) => p.type === type).length;

test("Trabajo filtra por tipo y anuncia la cantidad", async ({ page }) => {
  await page.goto("/es");
  const work = page.locator("#trabajo");
  const group = work.getByRole("group", { name: "Filtrar por tipo" });
  const filters = [
    `Todo · ${pieces.length}`,
    ...[
      ["app", "Apps"],
      ["componente", "Componentes"],
      ["experimento", "Experimentos"],
    ]
      .filter(([type]) => count(type!) > 0)
      .map(([type, label]) => `${label} · ${count(type!)}`),
  ];
  await expect(group.getByRole("button")).toHaveText(filters);
  await expect(work.getByRole("heading", { level: 3 })).toHaveCount(
    pieces.length,
  );

  const components = pieces.filter((p) => p.type === "componente");
  test.skip(components.length === 0, "sin componentes para filtrar");
  await group.getByRole("button", { name: /Componentes/ }).click();
  await expect(
    group.getByRole("button", { name: /Componentes/ }),
  ).toHaveAttribute("aria-pressed", "true");
  // Primero las destacadas (filas) y después las cards, cada grupo en orden.
  const expected = [
    ...components.filter((p) => p.featured),
    ...components.filter((p) => !p.featured),
  ].map((p) => p.title);
  await expect(work.getByRole("heading", { level: 3 })).toHaveText(expected);
  await expect(work.getByRole("status")).toHaveText(
    components.length === 1 ? "1 pieza" : `${components.length} piezas`,
  );
});

test("las destacadas van primero, como filas", async ({ page }) => {
  await page.goto("/es");
  const featured = pieces.filter((p) => p.featured).map((p) => p.title);
  test.skip(featured.length === 0, "sin piezas destacadas");
  const rows = page
    .locator("#trabajo ul")
    .first()
    .getByRole("heading", { level: 3 });
  await expect(rows).toHaveText(featured);
});

test("cada pieza abre su página y se navega con las flechas", async ({
  page,
}) => {
  test.skip(pieces.length < 3, "hacen falta al menos 3 piezas");
  const [first, second, third] = pieces as [
    (typeof pieces)[0],
    (typeof pieces)[0],
    (typeof pieces)[0],
  ];
  await page.goto("/es");
  await page.getByRole("link", { name: second.title, exact: true }).click();
  await expect(page).toHaveURL(`/es/work/${second.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    second.title,
  );
  await expect(page.getByText(`Pieza 2 de ${pieces.length}`)).toBeAttached();

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(`/es/work/${third.slug}`);
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(`/es/work/${second.slug}`);
  await page.getByRole("link", { name: new RegExp(first.title) }).click();
  await expect(page).toHaveURL(`/es/work/${first.slug}`);
});

test("una pieza con repo privado lo dice en la ficha", async ({ page }) => {
  const priv = pieces.find((p) => p.repoPrivate && !p.repoUrl);
  test.skip(!priv, "ninguna pieza con repo privado");
  await page.goto(`/es/work/${priv!.slug}`);
  await expect(page.getByText("Repo privado, acceso a pedido")).toBeVisible();
});

for (const theme of ["light", "dark"] as const) {
  test(`Trabajo y la página de pieza no tienen errores de axe (tema ${theme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto("/es");
    await page.locator("#trabajo").scrollIntoViewIfNeeded();
    expect(
      (await axe(page)).violations.map((v) => `${v.id}: ${v.nodes.length}`),
    ).toEqual([]);
    await page.goto(`/es/work/${pieces[0]!.slug}`);
    expect(
      (await axe(page)).violations.map((v) => `${v.id}: ${v.nodes.length}`),
    ).toEqual([]);
  });
}
