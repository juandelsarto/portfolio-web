import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Button, buttonVariants } from "@/components/ui/button";

describe("Button", () => {
  it("renderiza un botón con las utilidades del tema", () => {
    const html = renderToStaticMarkup(<Button>Ver trabajos</Button>);

    expect(html).toContain("<button");
    expect(html).toContain("bg-primary");
    expect(html).toContain("text-primary-foreground");
  });

  it("no usa colores sueltos en ninguna variante", () => {
    const variants = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ] as const;

    for (const variant of variants) {
      const classes = buttonVariants({ variant });
      expect(classes).not.toMatch(/#[0-9a-f]{3,8}\b|\[(?:rgb|hsl|oklch)\(/i);
      expect(classes).not.toMatch(
        /\b(?:bg|text|border)-(?:white|black|(?:red|blue|green|zinc|gray|neutral|slate)-\d{2,3})\b/,
      );
    }
  });
});
