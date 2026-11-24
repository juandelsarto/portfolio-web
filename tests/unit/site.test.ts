import { describe, expect, it } from "vitest";

import { ENGLISH_ENABLED, routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

describe("siteConfig", () => {
  it("usa español como idioma por defecto, con /es y /en", () => {
    expect(routing.defaultLocale).toBe("es");
    expect(routing.locales).toEqual(["es", "en"]);
  });

  it("no publica el inglés antes de la Etapa 5", () => {
    expect(ENGLISH_ENABLED).toBe(false);
  });

  it("no se indexa antes del lanzamiento", () => {
    expect(siteConfig.indexable).toBe(false);
  });
});
