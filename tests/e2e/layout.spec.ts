import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`la Home no tiene errores de axe (tema ${theme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test("el primer Tab lleva al salto al contenido", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Ir al contenido principal" }),
  ).toBeFocused();
});

test("el header muestra email y CV recién después del hero", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  // Mientras se ve el hero, el bloque queda inerte (ni foco ni lector de pantalla).
  const afterHero = page.getByRole("banner").locator("[inert]");
  await expect(afterHero).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, 800));
  await expect(afterHero).toHaveCount(0);
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: "delsarto01@gmail.com" }),
  ).toBeVisible();
});

test("el email de Contacto se copia y se anuncia", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const contacto = page.locator("#contacto");
  await contacto.getByRole("button", { name: "Copiar email" }).click();
  await expect(contacto.getByRole("status")).toHaveText("Email copiado");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "delsarto01@gmail.com",
  );
});

test("el logo del header cambia de dibujo con el tema", async ({ page }) => {
  await page.goto("/");
  const logo = page.getByRole("banner").locator("[data-skins] > span").first();
  const visibleSvg = () =>
    logo.evaluate((el) =>
      [...el.querySelectorAll("svg")].findIndex(
        (svg) => svg.getBoundingClientRect().width > 0,
      ),
    );
  await page.evaluate(() => (document.documentElement.dataset.theme = "light"));
  expect(await visibleSvg()).toBe(0);
  await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
  expect(await visibleSvg()).toBe(1);
});

test("con el puntero encima, el logo recorre las skins cada 0,7 s", async ({
  page,
}) => {
  await page.goto("/");
  const skins = page.getByRole("banner").locator("[data-skins]");
  await skins.hover();
  await expect(skins).not.toHaveAttribute("data-skin");
  await expect(skins).toHaveAttribute("data-skin", "cassette-light", {
    timeout: 1500,
  });
  await expect(skins).toHaveAttribute("data-skin", "y2k-light", {
    timeout: 1500,
  });
  await page.mouse.move(700, 600);
  await expect(skins).not.toHaveAttribute("data-skin");
});

test("el footer es igual en los dos temas: fondo oscuro y texto claro", async ({
  page,
}) => {
  await page.goto("/");
  const colors = () =>
    page.locator("#contacto").evaluate((el) => {
      const s = getComputedStyle(el);
      return [s.backgroundColor, s.color];
    });
  await page.evaluate(() => (document.documentElement.dataset.theme = "light"));
  const light = await colors();
  await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
  expect(await colors()).toEqual(light);
  expect(light).toEqual(["rgb(4, 16, 32)", "rgb(248, 248, 250)"]);
});
