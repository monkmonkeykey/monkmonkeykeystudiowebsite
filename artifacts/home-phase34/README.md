# Fase 3.4 — Galería editorial en Nuestra práctica

## Implementación

La galería utiliza fotografías ya presentes en `siteContent.services[].gallery` de los servicios `audio`, `arte-nuevos-medios` e `impresion3d`, en ese orden. Se revisaron las primeras fotos: documentación de concierto, instalación museográfica y piezas de fabricación. No se generaron imágenes ni se incorporaron stock, archivos nuevos o contenido de relleno. Los recursos se sirven desde la biblioteca existente de Cloudinary.

En escritorio conserva introducción y galería a la izquierda y servicios a la derecha. La primera fotografía es horizontal y de mayor formato; las otras dos comparten la fila inferior. En móvil, el orden del documento es introducción, servicios y fotografías. Con dos fotos, ambas ocupan el ancho de la galería; con una, solo aparece la principal. Sin fotografías no se monta el grupo visual. Se usa Next Image con carga diferida, `sizes`, proporciones reservadas, recorte `cover`, alt bilingüe, sin enlaces, filtros, bordes decorativos, sombras, carrusel o lightbox.

## Administración y persistencia

1. Abrir `/admin` → **Contenido del sitio** → **Lista de servicios**.
2. En cada servicio, localizar **Imagen destacada en el Home**.
3. Elegir una foto de la galería o **Elegir destacada de biblioteca**, que reutiliza el selector existente de Cloudinary. Si la referencia ya está en la galería no se añade otra; si falta, se agrega una referencia al archivo existente, sin volver a subirlo.
4. Editar el alt en la galería del servicio cuando corresponda. Se conserva el texto alternativo descriptivo existente; los valores automáticos genéricos tienen una descripción bilingüe del área como respaldo solo en la presentación del Home.
5. Pulsar **Guardar cambios** en el editor del contenido del sitio.

Se añadió únicamente `Service.homeFeaturedImageSrc?: string`: una referencia URL opcional a un elemento de su galería. No duplica la imagen ni su alt y no cambia el orden de la galería de `/servicios`. El campo se transporta por el formulario, esquema Zod, endpoint autenticado de sitio y normalización ya existentes. La validación comprueba que sea una fotografía compatible con los hosts de Next Image y que pertenezca a la galería del mismo servicio. No se añadieron endpoints, dependencias ni migraciones; las entradas antiguas funcionan sin el campo.

Al cambiar la URL de una imagen destacada en la galería se actualiza su referencia; al eliminarla se vuelve al respaldo automático. Si no se elige una destacada o su referencia ya no está disponible, se usa la primera foto válida de la galería. Si una imagen falla al cargar, el cliente prueba las siguientes; si todas fallan, omite ese servicio de la composición. Se excluyen las ilustraciones SVG de respaldo y fuentes incompatibles. La selección de proyectos del Hero es independiente y permanece intacta.

## Archivos

- `src/components/site/PracticeGallery.tsx`: composición, alt y respaldo ante fallos de carga.
- `src/domain/service-photos.ts`: fuentes compatibles, candidatos y orden editorial de las tres áreas; incluye los slugs anteriores del contenido estático.
- `src/app/page.client.tsx`: inserción del componente únicamente dentro de Nuestra práctica.
- `src/app/home.module.css`: áreas responsive y proporciones de las fotografías.
- `src/components/admin/ServiceHomeImagePicker.tsx`: selector, vista previa y acceso al explorador multimedia existente.
- `src/app/admin/page.client.tsx`: integración con el editor y serialización, sin cambiar la administración del Hero.
- `src/content/services.ts`, `src/server/site.ts` y `src/server/validation.ts`: campo opcional, persistencia y validación.
- `tests/service-photos.test.mjs` y `package.json`: comprobaciones aisladas y comando `test:services`.
- `README.md` y este directorio: instrucciones, evidencias y capturas.

## Validación

- `npm run test:services`: cinco pruebas con selección, orden, referencia ausente o eliminada, compatibilidad con servicios antiguos, validación de URL y pertenencia, permisos del endpoint existente, guardado/lectura posterior/cambio/restablecimiento y renderizado con cero, una, dos y tres imágenes en ambos idiomas.
- `npm run test:home`: once pruebas de portada y permisos continúan pasando.
- `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check`.
- Los ensayos de persistencia usan almacenamiento aislado en memoria. No se modificaron textos, galerías, fotos ni selecciones de la base real durante las pruebas.
- Chrome con datos reales, español e inglés a 375, 768, 1024 y 1440 px: tres fotos cargadas, alt descriptivo, carga diferida, sin filtros ni desbordamiento horizontal. En móvil los servicios preceden a la galería; en escritorio la galería está bajo la introducción de la columna izquierda.
- Comparación antes/después: HTML del Hero, introducción, servicios, Colaboraciones y Más proyectos idénticos. SHA de header, footer, SiteShell, logotipo, estilos globales y lógica del Hero sin cambios.
- Navegador: cambio y restablecimiento de las tres selecciones, confirmación de guardado, reutilización desde el selector de Cloudinary sin añadir una referencia duplicada. Los guardados exitosos del navegador fueron simulados; su persistencia real por la capa de servidor se ejerció con almacenamiento aislado.
- Fallos de carga simulados en navegador: reemplazo por la siguiente foto del servicio y composición con dos, una o ninguna fotografía, sin elementos de imagen rotos restantes.
- Evidencias: `validation.json`, `practice-375.png`, `practice-1440.png` y `admin-desktop.png`.
- El build conserva el aviso preexistente sobre antigüedad de `baseline-browser-mapping`; no se añadieron dependencias.
