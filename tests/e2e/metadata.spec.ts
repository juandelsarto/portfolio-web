import { expect, test } from "@playwright/test";

test("la Home tiene metadatos, Open Graph y favicons", async ({
  page,
  request,
}) => {
  const res = await page.goto("/es");
  expect(res?.headers()["x-robots-tag"]).toBe("noindex, nofollow");

  const meta = (selector: string) => page.locator(selector).first();
  await expect(meta('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(meta('link[rel="canonical"]')).toHaveAttribute("href", /\/es$/);
  await expect(meta('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(meta('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "es_AR",
  );
  await expect(meta('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(meta('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    /Juan Cruz/,
  );

  // La imagen OG existe y mide 1200 × 630.
  const ogUrl = new URL(
    (await meta('meta[property="og:image"]').getAttribute("content"))!,
  );
  const og = await request.get(ogUrl.pathname + ogUrl.search);
  expect(og.ok()).toBe(true);
  expect(og.headers()["content-type"]).toBe("image/png");
  await expect(meta('meta[property="og:image:width"]')).toHaveAttribute(
    "content",
    "1200",
  );

  // Favicons: 16 y 32 en claro y oscuro, el de Apple y favicon.ico.
  for (const href of [
    "/icons/favicon-16.png",
    "/icons/favicon-16-dark.png",
    "/icons/favicon-32.png",
    "/icons/favicon-32-dark.png",
    "/icons/apple-icon.png",
  ]) {
    await expect(page.locator(`link[href="${href}"]`)).toHaveCount(1);
    expect((await request.get(href)).ok()).toBe(true);
  }
  expect((await request.get("/favicon.ico")).ok()).toBe(true);
});
