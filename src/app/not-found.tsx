import Link from "next/link";

import { Button } from "@/components/ui/button";
import { notFound } from "@/content/home";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-[90rem] flex-col items-start gap-6 px-4 py-24 md:px-8 md:py-32 xl:px-16">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        Error 404
      </p>
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
        {notFound.title}
      </h1>
      <Button asChild>
        <Link href="/">{notFound.back}</Link>
      </Button>
    </main>
  );
}
