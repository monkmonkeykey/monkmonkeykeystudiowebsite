# Fase 5.1 — Fichas editoriales de proyectos

## Auditoría

La ficha ya reunía portada, texto bilingüe, categorías, fechas, lugar, metadatos libres, video YouTube/Vimeo, fotografías con pies y entidades vinculadas. Se reutilizan los mismos datos, lectura y sistema de traducciones. Antes de esta fase, la portada precedía al título, la información secundaria usaba una tarjeta sticky y todas las entidades aparecían bajo «Cliente». La galería utilizaba columnas tipo masonry, recortes, zoom y overlays. El visor disponía de navegación y Escape, pero no gestionaba el foco ni bloqueaba la página de fondo.

## Archivos de aplicación modificados

- `src/components/projects/project-detail.tsx`: jerarquía editorial, secciones condicionales, fotografías ampliables sin recorte, preservación de pies, supresión visual de portada duplicada, ficha secundaria sobria, entidades bajo «Colaboraciones», navegación al archivo y visor accesible.
- `src/components/projects/project-detail.module.css`: estilos exclusivos de las fichas, imágenes con `object-fit: contain`, retícula de dos columnas desde 768 px, contexto y ficha en dos columnas desde 1024 px, visor limitado al viewport y respeto de movimiento reducido.
- `src/app/proyectos/[slug]/page.tsx`: metadatos derivados de contenido real y validación sintáctica de la portada social; se conserva la ruta y la lectura existente. La clave del componente sigue la identidad del proyecto para reiniciar correctamente el visor al cambiar de ficha.

No se modificaron consultas, datos del CMS, APIs, modelos, slugs, administrador, Home, galería de práctica, archivo de proyectos, header o footer. Los cambios de la fase anterior que estaban presentes en el workspace se preservaron.

## Composición

1. Enlace «Volver a proyectos», H1, subtítulo disponible, periodo y disciplinas.
2. Portada amplia con su pie. Las imágenes utilizan sus proporciones naturales, altura máxima de viewport y ajuste `contain`; no se recortan ni distorsionan. Los valores `width`/`height` proporcionan una reserva inicial para Next Image y el navegador resuelve la proporción intrínseca al cargar el recurso. La portada tiene prioridad; la galería utiliza carga diferida y `sizes` responsive.
3. Descripción completa y datos existentes. Se muestran lugar y el campo registrado de cliente/institución, más los metadatos libres con sus etiquetas originales. Los campos vacíos se omiten. El año está en el encabezado; no se agrega una segunda fila automática para repetirlo. Los intervalos con años idénticos se presentan una sola vez, sin alterar fechas.
4. Video solo si existe: proporción 16:9, carga diferida, pantalla completa, título y enlace al proveedor. No se conceden permisos de autoplay ni se añade reproducción automática.
5. Galería en orden del CMS, una columna móvil y dos desde tableta, sin masonry, gradientes, overlays o zoom al pasar el cursor. La comparación de identidad reconoce versiones y transformaciones de Cloudinary para evitar repetir la portada. Si un duplicado incluye un pie diferente, ese texto se conserva junto a la portada y en el visor. Sin fotos adicionales no aparece encabezado o espacio de galería.
6. Colaboraciones con nombres, logotipos, sector, descripción y enlaces existentes. Solo se muestra contenido registrado; no se asignan autorías, producción ni responsabilidades nuevas. Cuando el campo de cliente guarda exactamente el slug de una entidad ya vinculada, se presenta su nombre registrado en lugar del identificador.
7. Enlace «Volver a todos los proyectos» y footer global existente.

## Visor y accesibilidad

Se conserva el visor dentro del componente, sin una biblioteca nueva. Usa un diálogo modal nativo para que el resto del documento quede inerte mientras está abierto. La portada también puede ampliarse y forma parte de la secuencia de fotografías, sin duplicarse en la galería.

- Foco inicial en Cerrar, ciclo explícito de Tab/Mayús+Tab y devolución al botón exacto de apertura.
- Escape o botón Cerrar; navegación con Anterior/Siguiente y flechas izquierda/derecha, con vuelta al principio/final.
- Bloqueo del desplazamiento del fondo y restauración de sus estilos al cerrar; compensación del ancho de scrollbar cuando procede.
- Imagen completa mediante `contain`, pies de imagen y contador anunciado; controles con tamaño mínimo de 44 px.
- Controles de navegación omitidos cuando solo hay una fotografía.
- Diálogo desplazable internamente si los pies son largos, sin desbordamiento horizontal.
- Un solo H1; los encabezados que puedan estar incluidos en texto enriquecido se presentan como párrafos sin modificar el contenido almacenado. El idioma del artículo se actualiza con el selector ES/EN. Estados de foco visibles y movimiento reducido respetado. Los alt existentes se conservan cuando contienen texto; ante valores vacíos o de solo puntuación, se utiliza el pie ya registrado o el nombre del proyecto, sin inventar una descripción visual. La imagen activa del visor se solicita de inmediato al abrirla.

## SEO

Título, descripción y portada social siguen siendo dinámicos. Se usa el subtítulo real; si está vacío, el primer párrafo real y, en última instancia, el nombre del proyecto. Se retira el antiguo texto genérico sobre equipos de producto. El HTML de edición no se imprime en metadatos. Las portadas vacías o con URL inválida no se incluyen en Open Graph/Twitter; sin portada social se utiliza tarjeta de texto. Las referencias inexistentes o privadas conservan HTTP 404 y el comportamiento de no indexación de Next.js.

## Limitaciones del contenido

- `entities` no contiene un rol específico por vínculo. El sector describe la entidad y no prueba su responsabilidad en una obra; por eso el título es neutral «Colaboraciones». Una futura fase podría modelar roles de crédito, pero aquí no se añaden campos ni se reinterpretan responsabilidades.
- Los 18 proyectos públicos actuales tienen descripciones de entre 12 y 136 caracteres en español y no contienen metadatos libres. No se ampliaron ni inventaron descripciones, créditos o detalles. La entrada estática real de Museo Banco de México permite probar además una descripción de 642 caracteres, varios párrafos y metadatos existentes mediante renderizado aislado, sin publicarla ni modificar la base.
- El título inglés de NIME 2023 contiene un párrafo extenso en lugar de un nombre breve. Se preserva íntegro y se utiliza una escala tipográfica más contenida para títulos de más de 160 caracteres; no se corrige el campo durante esta fase.
- Algunas traducciones y pies en inglés conservan el texto español almacenado. Se mantiene el sistema de traducción/fallback y el texto registrado, sin generar traducciones de contenido.
- El modelo de imágenes no almacena dimensiones intrínsecas. Se usa Next Image y el navegador para mostrar la proporción del archivo, sin añadir campos ni consultas de metadatos de imagen.

## Validación

- Proyectos reales: `otro_dia_otro_dolar` (cuatro fotografías adicionales y pies), `nime2023` (video YouTube y seis fotos) y `leam2025` (una portada, sin galería ni video).
- Renderizado aislado en ambos idiomas con esos tres proyectos y `museo-banco-mexico`, además de campos opcionales vacíos, referencia de portada repetida con otra versión de Cloudinary, encabezados en texto enriquecido y metadatos sociales inválidos. Datos de entrada sin modificaciones. Evidencia: `render-validation.json`.
- `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check`. Las 11 pruebas de destacados y 5 de fotografías de servicios continúan pasando. No se añadieron dependencias.
- El build conserva el aviso previo de antigüedad de `baseline-browser-mapping`.
- Chrome: 24 combinaciones (tres fichas × dos idiomas × cuatro tamaños: 375, 768, 1024 y 1440 px), sin desbordamiento horizontal, un H1 y secciones opcionales correctas. Fotografías y logotipos cargados correctamente, sin filtros ni transformaciones de hover.
- Visor: seis combinaciones de proyecto/tamaño (375 y 1440 px), apertura y reapertura, Tab/Mayús+Tab contenidos, Escape y cierre por botón, anterior/siguiente mediante botones y flechas, foco devuelto y fondo bloqueado. También se probó movimiento reducido y la ausencia de controles anterior/siguiente para una sola foto. La contención del iframe mantiene la interacción de las fotografías al cambiar el ancho de pantalla.
- Video real de NIME: fuente y título registrados, carga diferida, pantalla completa y ausencia de autoplay. La prueba verifica la integración del reproductor; no inicia la reproducción del proveedor.
- SEO real: título, descripción e imagen social del proyecto. Referencias inexistentes y privadas HTTP 404. Catálogo y contenido de sitio idénticos a la lectura inicial; no se escribieron datos.
- Evidencias: `validation.json`, `render-validation.json`, `nime-1440.png`, `nime-375.png`, las primeras pantallas `nime-fold-1440.png` / `nime-fold-375.png` y `lightbox-375.png`.

Los subtítulos de algunas entradas contienen textos descriptivos extensos. Se muestran completos en la posición solicitada, de modo que la altura del encabezado depende de ese contenido. No se truncan ni se trasladan o reescriben campos del CMS durante esta fase.

## Edición enriquecida del subtítulo

El editor de proyectos incorpora ahora los editores enriquecidos existentes para **Subtítulo (ES)** y **Subtítulo (EN)**. Permite cursiva, negrita, subrayado, tamaño y color. Enter crea un bloque nuevo y Mayús+Enter un salto de línea. La selección del texto se conserva al utilizar los controles de formato con ratón o teclado; los editores y botones tienen etiquetas accesibles.

La ficha renderiza el formato mediante `RichText`, incluidos párrafos y saltos. Se mantiene el mismo campo `subtitle` y la persistencia existente; no hay migración ni cambios de esquema. Los metadatos eliminan HTML conservando separaciones entre palabras.

Se comprobó en navegador la selección en cursiva, saltos de línea, serialización al guardar y presentación en ambos idiomas a 375 y 1440 px. Guardado y lectura posterior mediante almacenamiento aislado, sin modificar entradas reales del CMS.
