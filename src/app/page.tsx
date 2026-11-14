import { siteConfig } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <h1>{siteConfig.name}</h1>
      <p>{siteConfig.role}</p>
    </main>
  );
}
