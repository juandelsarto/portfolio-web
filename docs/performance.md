# Presupuesto de performance

Aprobado el 24 nov (Etapa 2). Lo controla el job "Presupuesto de performance" del CI (`.github/workflows/performance.yml`) con Lighthouse CI: perfil mobile por defecto de Lighthouse (CPU y red simuladas), 3 corridas sobre el build de producción y se toma la mediana. Los límites están en `lighthouserc.json`.

## Límites que hacen fallar el CI

| Métrica                    | Límite   | Qué mide                                                                    |
| -------------------------- | -------- | --------------------------------------------------------------------------- |
| Performance (Lighthouse)   | ≥ 90     | Puntaje general                                                             |
| Accesibilidad (Lighthouse) | 100      | Complementa a axe en los tests end-to-end                                   |
| LCP                        | ≤ 2,5 s  | Carga del contenido principal                                               |
| CLS                        | ≤ 0,1    | Saltos de layout                                                            |
| TBT                        | ≤ 400 ms | Bloqueo del hilo principal; es la medida de laboratorio que anticipa el INP |
| JS de la página            | ≤ 200 KB | Transferido (comprimido), todos los scripts de la ruta                      |

Advertencia (no falla): Best Practices ≥ 95. SEO no se mide hasta la Etapa 6, porque el sitio está en `noindex` a propósito.

## Meta para la auditoría de la Etapa 6

- TBT ≤ 200 ms (INP < 200 ms en campo).
- JS ≤ 150 KB.

## Línea base (24 nov, Home `/es`)

| Medición                                    | Performance | Accesibilidad | LCP    | TBT        | CLS | JS     |
| ------------------------------------------- | ----------- | ------------- | ------ | ---------- | --- | ------ |
| Lighthouse mobile local, 3 corridas         | 94–96       | 100           | 0,9 s  | 230–280 ms | 0   | 186 KB |
| Producción en Vercel (desktop, sin simular) | —           | —             | 0,74 s | —          | 0   | 186 KB |

Fuentes: 110 KB (tres fuentes variables). El JS que más bloquea es el runtime de React y Next.

## Cuando una pieza nueva sube el peso

Las demos de las piezas van en un iframe (deploy propio), así que no suman JS al portfolio. Si un PR supera un límite, el reporte de Lighthouse queda como artifact del job ("lighthouse").
