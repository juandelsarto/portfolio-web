// Genera src/components/site/logo/logo-markup.ts a partir de logo-light.svg y
// logo-dark.svg (exportados de Figma: componente Logo, Tema=Claro y Tema=Oscuro).
// Editar los .svg y correr `pnpm logo:build`.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = new URL("../src/components/site/logo/", import.meta.url);
const read = (name) =>
  readFileSync(new URL(name, dir), "utf8").trim().replace(/\n/g, "");

const light = read("logo-light.svg");
const dark = read("logo-dark.svg");

const out = `// Archivo generado por scripts/build-logo.mjs a partir de logo-light.svg y logo-dark.svg. No editar a mano.
export const LOGO_LIGHT_SVG = ${JSON.stringify(light)};
export const LOGO_DARK_SVG = ${JSON.stringify(dark)};
`;

writeFileSync(new URL("logo-markup.ts", dir), out);
console.log(
  `logo-markup.ts actualizado (${light.length} + ${dark.length} caracteres) en ${fileURLToPath(dir)}`,
);
