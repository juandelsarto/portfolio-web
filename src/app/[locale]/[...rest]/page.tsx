import { notFound } from "next/navigation";

// Cualquier ruta que no existe dentro de un idioma muestra la 404 de ese idioma.
export default function CatchAll() {
  notFound();
}
