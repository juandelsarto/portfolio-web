// El layout con <html> está en app/[locale]/layout.tsx (lang según el idioma).
// Este solo existe para que app/not-found.tsx tenga dónde montarse.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
