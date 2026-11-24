import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { siteConfig } from "./src/lib/site";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hasta el lanzamiento (Etapa 6) nada se indexa: además del meta robots,
  // un header en todas las respuestas (incluidos los previews de Vercel).
  async headers() {
    if (siteConfig.indexable) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
