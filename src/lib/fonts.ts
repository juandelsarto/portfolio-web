import localFont from "next/font/local";

// Fuentes variables autoalojadas (Fontsource): no dependen de Google Fonts al
// compilar ni piden nada a terceros en el navegador. Solo el subset latin, que
// cubre el español.

/** Títulos (display y headings): Afacad Flux. */
export const afacadFlux = localFont({
  src: "../../node_modules/@fontsource-variable/afacad-flux/files/afacad-flux-latin-wght-normal.woff2",
  variable: "--font-afacad-flux",
  weight: "100 1000",
  display: "swap",
});

/** Cuerpo: Nunito Sans. */
export const nunitoSans = localFont({
  src: "../../node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2",
  variable: "--font-nunito-sans",
  weight: "200 1000",
  display: "swap",
});

/** Mono (etiquetas, metadatos): JetBrains Mono. */
export const jetbrainsMono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "swap",
});

export const fontVariables = [
  afacadFlux.variable,
  nunitoSans.variable,
  jetbrainsMono.variable,
].join(" ");
