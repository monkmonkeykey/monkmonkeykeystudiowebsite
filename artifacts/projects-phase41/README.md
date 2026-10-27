# Fase 4.1 — Archivo editorial de proyectos

## Auditoría y alcance

- `/proyectos/page.tsx` entrega `getProjects()` y `siteContent.projectsPage` al componente cliente. Se conserva sin cambios.
- `getProjects()` excluye entradas privadas y mantiene el orden cronológico descendente existente, con desempate por slug. No se modificaron su consulta, orden ni filtros de visibilidad. Los 18 proyectos públicos actuales siguen disponibles, incluidos los del Hero.
- Las categorías se extraen de los proyectos recibidos, en su orden de aparición; se conserva la selección única de categoría, Todos y el filtrado con `includes`. No se añadieron categorías, buscador, ordenamiento ni paginación.
- Título, introducción, etiqueta de Todos y mensaje vacío siguen procediendo del CMS y del sistema de traducciones. Los campos anteriores de subtítulo, descripción y CTA siguen existiendo en los datos aunque ya no aparezcan en las tarjetas o al final del archivo.

## Archivos de aplicación modificados

- `src/app/proyectos/page.client.tsx`: encabezado compacto con H1 administrable, filtros accesibles, tarjetas enlazadas con portada/título/periodo/disciplinas y mensaje vacío existente. Se retiraron de la presentación subtítulos, descripciones, el CTA Ver y el bloque adicional de contacto. Los años idénticos se muestran una sola vez, sin cambiar el formateador compartido ni los datos originales.
- `src/app/proyectos/projects.module.css`: estilos limitados al archivo. Una columna móvil y dos columnas desde 768 px, sin desplazamiento alternado. Fotografías 16:10 a color con `object-fit: cover`, sin filtros ni zoom. Jerarquía tipográfica de la familia existente, metadatos discretos, separadores en filtros y estados de hover/foco. Los filtros se desplazan horizontalmente en móvil y se reorganizan en varias líneas desde tableta. Las transiciones se desactivan con movimiento reducido.

No se editaron Home, su galería, destacados, header, footer, código del panel, modelos, API, rutas, fichas individuales ni otras páginas. Los cambios previos de la Fase 3.4 que ya estaban en el workspace se preservaron. Este directorio agrega únicamente documentación, resultados y capturas.

## Textos del CMS autorizados

El usuario confirmó actualizar únicamente los dos textos del encabezado en el CMS, conservando el mecanismo editable:

| Campo | Español | Inglés |
| --- | --- | --- |
| `projectsPage.title` | Proyectos | Projects |
| `projectsPage.copy` | Obras, experiencias y colaboraciones desarrolladas junto a artistas e instituciones. | Works, experiences, and collaborations developed alongside artists and institutions. |

Se actualizaron exclusivamente esos dos campos del documento global mediante una operación con comprobación de sus valores previos. La lectura posterior confirmó que el resto del documento no cambió. No se modificaron entradas, galerías, categorías, fechas, estados, selección de destacados ni esquemas; no hubo migraciones. El resultado y los textos anteriores están documentados en `cms-text-update.json`.

## Validación

- `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check`: correctos. El build informa del aviso previo de antigüedad de `baseline-browser-mapping`; no se cambiaron dependencias.
- Las 11 pruebas existentes de destacados y las 5 de fotografías de servicios siguen pasando.
- Chrome en español e inglés a 375, 768, 1024 y 1440 px: 18 proyectos en el mismo orden que la API; una columna móvil y dos columnas alineadas desde 768 px; sin desbordamiento horizontal de página. El encabezado no ocupa la pantalla completa y los títulos largos se ajustan sin truncarse.
- Cada categoría devuelve exactamente las entradas correspondientes en el orden original. Todos recupera el catálogo completo. Estados `aria-pressed`, activación mediante Enter/Espacio, foco visible de botones y tarjetas, y desplazamiento automático del filtro enfocado en móvil comprobados.
- Todas las fichas responden HTTP 200. Las portadas se cargan correctamente, mantienen el alt original del idioma y no tienen filtro o transformaciones ni siquiera en hover. Solo la primera tiene prioridad; las demás conservan carga diferida. Las proporciones reservadas evitan cambios de tamaño durante la carga.
- Movimiento reducido comprobado. El bloque de contacto interno desapareció y el footer global se conserva como única invitación final.
- Renderizado aislado con proyectos reales: estado vacío en ambos idiomas, encabezado que refleja cambios de contenido administrable, periodos de un año y varios años, y cadenas 2026–2026/2024-2024. No se alteran los objetos de entrada. Evidencia en `render-validation.json`.
- Comparación de datos antes/después: catálogo público idéntico; contenido de sitio idéntico salvo los dos textos autorizados. Home comparado tras normalizar marcas de hidratación y URLs locales; fuentes y estilos compartidos comprobados por SHA sin cambios.

## Evidencias

- `validation.json`: tamaños, tarjetas, filtros, teclado, enlaces, movimiento reducido y comparaciones de contenido.
- `render-validation.json`: casos de periodos, vacío y edición de copy.
- `cms-text-update.json`: actualización limitada de los textos autorizados.
- `projects-1440.png` y `projects-375.png`: archivo completo.
- `projects-fold-1440.png` y `projects-fold-375.png`: primera pantalla.
