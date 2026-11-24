"use client";

import { useEffect, useState } from "react";

import { CheckIcon, CopyIcon } from "@/components/site/icons";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface EmailCopyProps {
  /** `grande`: el email protagonista de Contacto (Afacad Flux). */
  size?: "normal" | "grande";
  className?: string;
}

/**
 * Email con link `mailto:` y un botón aparte para copiarlo. Al copiar muestra
 * "Copiado" unos segundos y lo anuncia al lector de pantalla.
 */
export function EmailCopy({ size = "normal", className }: EmailCopyProps) {
  const [copied, setCopied] = useState(false);
  const grande = size === "grande";
  const [user, domain] = siteConfig.email.split("@");

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
    } catch {
      // Sin permiso de portapapeles: queda el link mailto.
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center",
        grande ? "gap-4" : "gap-2",
        className,
      )}
    >
      <a
        href={`mailto:${siteConfig.email}`}
        className={cn(
          "underline-offset-4 hover:underline",
          grande
            ? "font-display text-[2rem] leading-tight font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
            : "font-medium text-foreground underline",
        )}
      >
        {/* Corte de línea permitido después de la @ en pantallas angostas. */}
        {user}@
        <wbr />
        {domain}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copiado" : "Copiar email"}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-sm p-1 transition-colors",
          grande
            ? "text-muted-foreground hover:text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {copied ? (
          <>
            <CheckIcon
              className={cn("text-brand", grande ? "size-6" : "size-4")}
            />
            <span
              className={cn(
                "font-mono tracking-wide text-brand uppercase",
                grande ? "text-sm" : "text-xs",
              )}
            >
              Copiado
            </span>
          </>
        ) : (
          <CopyIcon className={grande ? "size-6" : "size-4"} />
        )}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email copiado" : ""}
      </span>
    </div>
  );
}
