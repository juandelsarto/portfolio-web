import { describe, expect, it } from "vitest";

import { siteConfig } from "@/lib/site";

describe("siteConfig", () => {
  it("usa español como idioma del sitio", () => {
    expect(siteConfig.locale).toBe("es");
  });

  it("no se indexa antes del lanzamiento", () => {
    expect(siteConfig.indexable).toBe(false);
  });
});
