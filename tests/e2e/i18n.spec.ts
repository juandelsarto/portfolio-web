import { expect, test } from "@playwright/test";

import { allPieces, publishedPieces } from "./pieces";

test("la raíz redirige a /es", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("hasta la Etapa 5, /en redirige a la misma ruta en /es", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(page).toHaveURL("/es");
  const res = await page.goto("/en/no-existe");
  await expect(page).toHaveURL("/es/no-existe");
  expect(res?.status()).toBe(404);
});

test("un navegador en inglés también entra en español", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL("/es");
  await context.close();
});

test("los links internos conservan el idioma", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  const banner = page.getByRole("banner");
  await expect(
    banner.getByRole("link", { name: /Juan Cruz Del Sarto/ }),
  ).toHaveAttribute("href", "/es");
  await expect(banner.getByRole("link", { name: "Sobre mí" })).toHaveAttribute(
    "href",
    "/es#sobre-mi",
  );
  await banner.getByRole("link", { name: "Contacto" }).click();
  await expect(page).toHaveURL("/es#contacto");
});

test("en producción, los borradores no tienen página", async ({ page }) => {
  const draft = allPieces.find((p) => p.status === "borrador");
  test.skip(!draft, "no hay borradores");
  const res = await page.goto(`/es/work/${draft!.slug}`);
  expect(res?.status()).toBe(404);
});

test("en producción, cada pieza publicada tiene su página", async ({
  page,
}) => {
  for (const piece of publishedPieces) {
    const res = await page.goto(`/es/work/${piece.slug}`);
    expect(res?.status(), piece.slug).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      piece.title,
    );
  }
});
