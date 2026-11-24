import type { Metadata } from "next";

import { getBaseUrl } from "@/lib/site";

// Base para URLs absolutas de los metadatos que cuelgan de la raíz (favicon.ico).
export const metadata: Metadata = { metadataBase: getBaseUrl() };

// El layout con <html> está en app/[locale]/layout.tsx (lang según el idioma).
// Este solo existe para que app/not-found.tsx tenga dónde montarse.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
