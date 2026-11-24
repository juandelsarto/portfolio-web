import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import es from "../../messages/es.json";

/** Rutas de todas las hojas ("About.principles.0.title"). */
function keys(value: unknown, prefix = ""): string[] {
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      keys(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [prefix];
}

describe("mensajes", () => {
  it("es y en tienen exactamente las mismas claves", () => {
    expect(keys(en).sort()).toEqual(keys(es).sort());
  });

  it("el español no tiene textos vacíos", () => {
    const empty = keys(es).filter((k) => {
      const v = k
        .split(".")
        .reduce<unknown>((o, p) => (o as Record<string, unknown>)[p], es);
      return typeof v === "string" && v.trim() === "";
    });
    expect(empty).toEqual([]);
  });
});
