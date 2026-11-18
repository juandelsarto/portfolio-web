import { expect, test } from "@playwright/test";

test.describe("/dev/fondos", () => {
  test("dibuja el hero y carga el tema opuesto en la sección de contraste", async ({
    page,
  }) => {
    await page.goto("/dev/fondos");

    const canvas = page.locator(".skin-hero-canvas");
    await expect(canvas).toBeVisible();
    expect(
      await canvas.evaluate((c: HTMLCanvasElement) => c.width),
    ).toBeGreaterThan(0);

    const bg = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--skin-bg").trim(),
        );

    await page.getByRole("button", { name: "Core" }).click();
    await page.getByRole("button", { name: "Light" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const light = await bg(".skin-section--hero");
    const contrast = await bg(".skin-section--contrast");
    expect(contrast).not.toBe(light);

    await page.getByRole("button", { name: "Dark" }).click();
    expect(await bg(".skin-section--contrast")).toBe(light);
  });

  test("el canvas está oculto para lectores de pantalla", async ({ page }) => {
    await page.goto("/dev/fondos");
    await expect(page.locator(".skin-hero-layer")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
