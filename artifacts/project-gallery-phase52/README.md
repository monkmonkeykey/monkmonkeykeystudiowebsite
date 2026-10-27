# Galería de proyectos — Fase 5.2

Implementación local de la galería editorial y su visor en `/proyectos/[slug]`. No se publicó ni se escribió en el CMS.

## Archivos de aplicación

- `src/components/projects/project-detail.tsx`: composición secuencial, lectura de proporciones al cargar las imágenes optimizadas y ajustes de accesibilidad del visor.
- `src/components/projects/project-detail.module.css`: filas editoriales, imágenes con proporción intrínseca y visor carbón a pantalla completa.

La galería ya estaba situada fuera del grid de descripción y ficha técnica. Conserva su posición, el ancho máximo y los márgenes aprobados.

## Composición

La secuencia es una fotografía amplia, dos en pareja, otra amplia y otras dos en pareja. Continúa en ese orden sin alterar la colección del CMS. Una fotografía ocupa el ancho disponible; dos forman una pareja cuando sus formatos lo permiten. Cualquier fotografía que quede sin compañera ocupa una fila completa. Con cero imágenes no aparece la sección.

A partir de 768 px, las parejas usan dos columnas. Se apilan cuando una imagen es vertical (proporción menor de 0,85) y otra horizontal (mayor de 1,15), cuando la relación entre sus proporciones supera 1,8 o cuando alguna supera 2,4 de ancho/alto. En móvil todas las imágenes se apilan. Las dos verticales de formato similar pueden formar una pareja.

El modelo existente no almacena dimensiones. Se obtiene ancho/alto de la imagen optimizada ya decodificada, sin peticiones adicionales de metadatos. Next Image conserva sus variantes, `sizes` y carga diferida. Las imágenes vuelven al flujo normal mediante CSS y no reciben atributos ficticios de ancho/alto. Se reserva espacio durante la carga; el tamaño y la composición definitivos se ajustan cuando se conoce la proporción real. Sin dimensiones almacenadas no se puede garantizar ausencia absoluta de movimiento inicial.

Los pies registrados aparecen debajo de cada fotografía; su ausencia no se sustituye por el texto alternativo. Se conserva la localización, el orden y la exclusión existente de la portada cuando identifica el mismo archivo.

## Visor

Fondo carbón `#101410`, imagen completa mediante `contain`, controles fuera de la fotografía y contador de dos dígitos. Se conserva la portada como primera imagen del visor: un proyecto con seis imágenes de galería tiene siete imágenes navegables.

Permite botones, activación por teclado, flechas, navegación circular, Escape y cierre visible. Bloquea el desplazamiento de fondo, mantiene el foco dentro del diálogo y lo devuelve al botón de apertura. Los pies extensos tienen desplazamiento y foco de teclado; al navegar desde ellos el foco vuelve a Cerrar para evitar perderlo si el siguiente pie desaparece. Respeta movimiento reducido y no precarga toda la colección para el visor.

## Validación

- `npm run lint`, `npx tsc --noEmit` y `npm run build`: correctos. El aviso existente de antigüedad de `baseline-browser-mapping` permanece.
- `npm run test:home` y `npm run test:services`: 16 pruebas correctas.
- [validation.json](validation.json): 32 casos en Chrome, con ocho proyectos reales a 375, 768, 1024 y 1440 px. Casos de 0, 1, 2, 3, 4 y 6 imágenes; con y sin pies; video y fotografías. Orden, ancho editorial, ausencia de desbordamiento, proporciones, controles táctiles de 44 px, contador, navegación, ciclo de foco, cierre y retorno del foco. Controles ES/EN comprobados. Sin errores JavaScript de página.
- [render-validation.json](render-validation.json): 23 comprobaciones de render con copias de datos públicos existentes: cantidades de 0 a 8 en ambos idiomas, alta/baja/reordenación, datos de entrada intactos, portada duplicada y pie ausente.
- [loading-validation.json](loading-validation.json): recorrido real con scroll y carga diferida nativa de las seis imágenes de NIME; visor ausente hasta abrirlo y movimiento reducido.
- [image-proportions.json](image-proportions.json): inspección de variantes pequeñas de las 36 imágenes de galerías públicas y dos imágenes existentes de entidades. Las galerías publicadas contienen horizontales y una cuadrada; no incluyen verticales ni panorámicas.
- [orientation-validation.json](orientation-validation.json): ocho casos aislados a los cuatro anchos. Sustitución de respuesta exclusivamente en el navegador con el retrato existente de Luz María Sánchez para comprobar pareja vertical–vertical y apilado vertical–horizontal. No se asignó ese retrato a ningún proyecto ni se guardaron cambios. La captura correspondiente documenta solamente esa prueba aislada.

Las respuestas públicas de proyectos y sitio resultaron idénticas a las obtenidas antes de la intervención. Se comparó el HTML de las secciones conservadas en seis proyectos y las sumas de 16 archivos protegidos, incluidos Home, archivo de proyectos, administración, rutas, modelo, servidor, Header y Footer. El resto de la ficha y el CMS permanecen intactos.

Al ampliar la inspección a REA, algunas variantes remotas grandes agotaron el tiempo de espera. Su proporción se pudo inspeccionar con variantes pequeñas; ese proyecto no forma parte de los 32 casos completos de navegador. Las comprobaciones de orientación vertical son aisladas porque no hay un proyecto publicado con ese formato. La regla de panorámicas está implementada, pero no había una fotografía panorámica publicada para validarla visualmente.

## Capturas

- [Galería a 1440 px](gallery-1440.png)
- [Galería a 375 px](gallery-375.png)
- [Visor a 1440 px](lightbox-1440.png)
- [Visor a 375 px](lightbox-375.png)
- [Prueba aislada de orientación a 1440 px](orientation-isolated-1440.png)
