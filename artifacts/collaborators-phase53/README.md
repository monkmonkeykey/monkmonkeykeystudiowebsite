# Tarjetas editoriales de colaboradores — Fase 5.3

Cambio local limitado a `/clientes`, la sección «Colaboraciones» de las fichas y el componente compartido. No se publicó ni se escribieron datos en el CMS.

## Archivos

- `src/components/site/CollaboratorCard.tsx`: nuevos `CollaboratorCard` y `CollaboratorGrid`. Reutilizan los campos existentes de `Client`, compatibles con las entidades de proyecto, sin cambiar modelos.
- `src/components/site/collaborator-card.module.css`: presentación editorial, retículas, estado compacto, expansión y foco.
- `src/app/clientes/page.client.tsx`: reemplaza las tarjetas anteriores por el componente compartido; conserva encabezado, introducción, orden y colección completa.
- `src/components/projects/project-detail.tsx`: integra las tarjetas únicamente en «Colaboraciones».
- `src/components/projects/project-detail.module.css`: elimina exclusivamente los estilos antiguos de entidades sustituidos por el componente.

## Alturas y composición

La tarjeta organiza identidad visual, nombre, disciplina, descripción y acciones en vertical. La retícula utiliza filas `1fr` para igualar la altura inicial de toda la colección, sin alturas máximas que corten contenido. Cada tarjeta tiene una altura mínima de 22 rem; el nombre reserva un mínimo de dos líneas y puede crecer libremente. Categorías y controles tampoco se recortan.

Cuando alguna descripción está abierta, las filas pasan a altura automática y las tarjetas se alinean arriba. Se pueden ampliar varias de forma independiente. Al contraerlas todas, vuelve la altura inicial uniforme. No hay animaciones de altura ni efectos decorativos.

El directorio utiliza una columna en móvil, dos desde 768 px y tres desde 1024 px. Las fichas usan una columna en móvil y dos desde 768 px. Con un único colaborador se conserva una sola tarjeta en su posición, sin crear contenido de relleno. Los encabezados de las tarjetas son `h2` en el directorio y `h3` bajo el título «Colaboraciones» en la ficha.

## Descripciones ampliables

Se conserva el texto completo, inicialmente limitado visualmente a dos líneas. Una copia de medición sin límite, con el mismo ancho y tipografía, determina si el texto realmente excede ese espacio. Esa copia está oculta visualmente y para tecnologías de asistencia, y su contenedor impide que añada desplazamiento vacío a la página.

`ResizeObserver`, la disponibilidad/carga de fuentes y los cambios de contenido e idioma actualizan la medición. «Leer más» aparece únicamente cuando hace falta; cambia a «Leer menos» al expandir el texto dentro de la tarjeta. El contenido completo permanece en el párrafo accesible. El botón conserva `aria-expanded`, `aria-controls`, foco visible y activación con teclado.

Los controles usan los textos solicitados en español e inglés. «Visitar sitio» / «Visit website» es una acción independiente con `target="_blank"` y `rel="noopener noreferrer"`. No se convierte toda la tarjeta en enlace. No hay controles de expansión sin descripción ni enlace sin URL.

## Identidad visual

El área de logotipo tiene una altura de 5,5 rem y un ancho máximo de 12 rem. Next Image mantiene optimización y carga diferida, con `object-fit: contain`, sin filtros, transparencias o ampliación. Se conservan los colores originales. Sin imagen se reserva el mismo espacio, sin iniciales ni iconos inventados. El directorio conserva los pies de imagen registrados; las fichas mantienen su comportamiento anterior respecto a esos pies.

Se reutilizan las variables aprobadas para fondo, texto principal/secundario, verde bosque y separadores. Bordes de un píxel, controles de al menos 44 px y subrayado discreto. Se respeta movimiento reducido.

## Validación

- `npm run lint`, `npx tsc --noEmit` y `npm run build`: correctos. Permanece el aviso existente de antigüedad de `baseline-browser-mapping`.
- `npm run test:home` y `npm run test:services`: 16 pruebas correctas.
- [validation.json](validation.json): 40 combinaciones de contexto, idioma y ancho en Chrome. Directorio con los 12 colaboradores públicos y cuatro proyectos reales; español/inglés a 375, 768, 1024 y 1440 px. Se comprobaron alturas uniformes, orden, textos íntegros, detección de desbordamiento, expansión/contracción con Enter y Espacio, controles, enlaces seguros, logotipos y ausencia de desbordamiento horizontal. Incluye expansión completa de la biografía de Oswaldo Ruíz, de 3.424 caracteres. Sin errores JavaScript de página.
- [isolated-validation.json](isolated-validation.json): ocho combinaciones de idioma/ancho con el componente y CSS reales compilados en un entorno aislado, más cuatro casos de retícula de proyectos con varios colaboradores. Incluye texto breve, ausencia de descripción/imagen/URL, nombre largo, logotipo horizontal, cuadrado y retrato vertical; expansión simultánea independiente, cambio de fuente/tamaño, idioma con descripción abierta y actualización de propiedades sin modificar datos. En esta prueba Next Image se sustituye por un `img` nativo con variantes optimizadas existentes; la integración real de Next Image está cubierta en las páginas anteriores.
- [scope-validation.json](scope-validation.json): comparación de código y archivos protegidos.

Los proyectos publicados actualmente tienen una sola entidad vinculada cada uno, y todos los colaboradores del directorio tienen imagen y descripción. Por eso las situaciones ausentes y la retícula de proyectos con varias tarjetas se comprobaron con copias aisladas de datos públicos; no se asignaron colaboradores nuevos a proyectos ni se modificaron registros.

Las respuestas públicas de clientes, proyectos y sitio resultaron idénticas antes y después. Se conservaron las consultas y el filtrado. El encabezado del directorio y las secciones ajenas a colaboradores de cuatro fichas se compararon con el estado anterior. El JSX y CSS de la ficha fuera de colaboradores permanecen idénticos, salvo la importación compartida y la retirada de su etiqueta de enlace duplicada. Se comprobó también que el visor de la galería conserva apertura, contador, flechas y Escape.

No se modificaron Home, Header, Footer, archivo de proyectos, servicios, administración, modelos, APIs, rutas, slugs, base de datos ni dependencias.

## Capturas

- [Directorio a 1440 px](directory-1440.png)
- [Directorio a 375 px](directory-375.png)
- [Directorio con descripción ampliada](directory-expanded-1440.png)
- [Colaboraciones de proyecto a 1440 px](project-1440.png)
- [Colaboraciones de proyecto a 375 px](project-375.png)
- [Casos aislados](isolated-cases-1440.png)
