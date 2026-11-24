// Genera src/styles/tokens/tokens.css a partir de tokens.json.
// tokens.json es la fuente de los tokens de color (exportada de Figma):
// editar ese archivo y correr `pnpm tokens:build`.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = new URL("../src/styles/tokens/", import.meta.url);

/** "color/bg/page" → "--color-bg-page"; "neutral/50" → "--neutral-50" */
export const cssName = (name) => `--${name.replaceAll("/", "-")}`;

const block = (selector, lines) =>
  `  ${selector} {\n${lines.map((l) => `    ${l}`).join("\n")}\n  }`;

export function buildTokensCss(tokens) {
  const primitives = Object.entries(tokens.primitives).map(
    ([name, value]) => `${cssName(name)}: ${value};`,
  );
  const semantic = (mode) =>
    Object.entries(tokens.semantic).map(
      ([name, refs]) => `${cssName(name)}: var(${cssName(refs[mode])});`,
    );

  return [
    "/* Archivo generado por scripts/build-tokens.mjs a partir de tokens.json. No editar a mano. */",
    "",
    "@layer tokens {",
    "  /* Primitivos: valores crudos. Los componentes nunca los usan directo. */",
    block(":root", primitives),
    "",
    "  /* Semánticos, tema claro (por defecto). */",
    block(':root,\n  [data-theme="light"]', [
      "color-scheme: light;",
      ...semantic(0),
    ]),
    "",
    "  /* Semánticos, tema oscuro. */",
    block('[data-theme="dark"]', ["color-scheme: dark;", ...semantic(1)]),
    "}",
    "",
  ].join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const tokens = JSON.parse(readFileSync(new URL("tokens.json", dir), "utf8"));
  writeFileSync(new URL("tokens.css", dir), buildTokensCss(tokens));
  console.log(
    `tokens.css actualizado: ${Object.keys(tokens.primitives).length} primitivos, ${Object.keys(tokens.semantic).length} semánticos`,
  );
}
