// Genera src/components/site/logo/logo-markup.ts a partir de logo.svg.
// logo.svg es la fuente única del logo: editar ese archivo y correr `pnpm logo:build`.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = new URL("../src/components/site/logo/", import.meta.url);
const svg = readFileSync(new URL("logo.svg", dir), "utf8").trim();

const out = `// Archivo generado por scripts/build-logo.mjs a partir de logo.svg. No editar a mano.
export const LOGO_SVG = ${JSON.stringify(svg)};
`;

writeFileSync(new URL("logo-markup.ts", dir), out);
console.log(
  `logo-markup.ts actualizado (${svg.length} caracteres) en ${fileURLToPath(dir)}`,
);
