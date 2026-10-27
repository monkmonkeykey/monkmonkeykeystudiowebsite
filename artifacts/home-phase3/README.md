# Home — Fase 3

Cambios de código limitados a `src/app/page.client.tsx` y `src/app/home.module.css`.

## Composición

- Hero con H1 editorial, descripción breve, enlace al archivo e imagen del primer proyecto publicado disponible. Sin video automático ni imagen detrás del texto. Si solo hay ilustraciones SVG de respaldo, se presenta un Hero tipográfico.
- Cinco proyectos obtenidos del origen existente, sin reordenar ni modificar consultas. En escritorio, el primero ocupa dos columnas y los demás forman una retícula de tres columnas. En móvil, lectura vertical.
- Tarjetas con portada, nombre, periodo y disciplinas, sin descripciones extensas ni filtros cromáticos. Periodos con años inicial y final iguales se muestran como un solo año.
- Práctica breve, servicios tipográficos y colaboradores con imágenes en sus proporciones originales y enlaces existentes.
- Nuevos textos ES/EN mediante `LocaleText`, `translate` y el contexto de idioma existente. Presentación inglesa de las tres capacidades y las dos categorías actuales dentro del Home, sin escribir al CMS.
- Imágenes con `next/image`, espacios reservados por proporción, tamaños responsive, prioridad para el Hero y carga diferida para las secundarias. Sin nuevas dependencias.

## Validación

- ESLint, TypeScript (`tsc --noEmit`), build de producción y `git diff --check`: correctos.
- Chrome: 375, 768, 1024 y 1440 px, en español e inglés. Un único H1 y sin desbordamiento horizontal.
- Cinco fichas individuales con respuesta HTTP 200. Orden y portadas iguales a los primeros cinco proyectos del archivo público existente.
- Todas las imágenes cargadas. Alternativa accesible basada en el nombre del proyecto cuando el CMS contiene únicamente puntuación.
- Tabulador desde la acción del Hero al enlace del archivo, con contorno visible y separación de 6 px.
- Texto principal, secundario y enlaces sobre blanco niebla: contrastes 17.12:1, 6.08:1 y 8.84:1 respectivamente, superiores a AA.
- Header, footer, SiteShell y estilos globales comparados mediante SHA antes y después: intactos. Metadatos conservados.
- Capturas: `home-1440.png` y `home-375.png`. Mediciones en `validation.json` y comprobaciones adicionales en `additional-validation.json`.

## Incidencias fuera del alcance

- Los enlaces existentes `/servicios#audio`, `/servicios#arte-nuevos-medios` y `/servicios#impresion3d` apuntan a una página que no define esas anclas. Se conservaron las URLs; no se modificó la página de servicios.
- Algunos registros del CMS tienen textos alternativos como «.» o traducciones inglesas copiadas del español. El Home ofrece alternativas de presentación para los casos observados; los registros y las demás páginas permanecen intactos. Los títulos propios de obras e instituciones conservan sus nombres originales.
- El layout global mantiene `lang="es"` al cambiar el selector a inglés. No se alteró el sistema global de idiomas en esta fase.
- Las fichas de los maratones 2023 y 2022 tenían desbordamiento a 375 px detectado en la fase anterior; sus plantillas no forman parte de esta intervención.
- El proyecto avisa que `baseline-browser-mapping` está desactualizado. No afecta al resultado de lint/build y no se actualizaron dependencias.
