"use client";

import { useEffect, useState } from "react";

import { EmailCopy } from "@/components/site/email-copy";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Email copiable y CV en el header, solo cuando el hero ya no se ve (estado
 * "Tras hero" de Figma). En páginas sin hero (#inicio) se muestran siempre.
 */
export function HeaderAfterHero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) {
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry?.isIntersecting),
      {
        rootMargin: "-72px 0px 0px 0px",
      },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "hidden items-center gap-3 transition-opacity duration-200 motion-reduce:transition-none lg:flex",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      // Mientras está oculto no se puede enfocar ni lo lee el lector de pantalla.
      inert={!visible}
    >
      <EmailCopy />
      <Button variant="outline" asChild>
        <a href={siteConfig.cvUrl} download>
          CV ↓<span className="sr-only"> (descargar, PDF)</span>
        </a>
      </Button>
    </div>
  );
}
