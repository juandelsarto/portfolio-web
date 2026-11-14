import { expect, test } from "@playwright/test";

test("el Button toma sus colores de las variables del tema", async ({
  page,
}) => {
  await page.goto("/dev/ui");

  const button = page.getByRole("button", { name: "Primario" });
  await expect(button).toBeVisible();

  const { background, primary } = await button.evaluate((el) => {
    const probe = document.createElement("div");
    probe.style.backgroundColor = "var(--primary)";
    document.body.append(probe);
    const primary = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return { background: getComputedStyle(el).backgroundColor, primary };
  });

  expect(primary).not.toBe("rgba(0, 0, 0, 0)");
  expect(background).toBe(primary);
});
