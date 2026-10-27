# Fase 3.2 — Administración de proyectos destacados

## Auditoría y decisiones

- El panel existente es `/admin`, protegido por `requireAdminSession`; usa componentes React, estilos Tailwind y operaciones JSON con una cookie de sesión firmada. Solo existe un rol administrativo.
- MongoDB almacena los proyectos en `projects`. `src/data/projects.ts` recupera y ordena las entradas; usa Markdown como respaldo según el comportamiento existente.
- El identificador público y clave única existente es `slug`. Se conserva como referencia estable: no se añaden campos, no se cambian slugs ni rutas y no se duplican datos de las entradas.
- La publicación existente se representa con `isPrivate`: las entradas con valor falso o ausente son públicas. No existe un estado separado de borrador/publicado.
- No existe un sistema de proyectos fijados o destacados. Hay un campo `order` en el almacenamiento y el formulario; la consulta de MongoDB lo utiliza junto con `name.es`, mientras el archivo público aplica su orden cronológico descendente y desempata por slug. Ninguna de esas funciones se modifica.
- Antes de esta fase, el Home consultaba adicionalmente MongoDB y entregaba los primeros **tres** proyectos públicos por `order` y título. La nueva configuración entrega las **dos posiciones** iniciales y, tras la ampliación solicitada, una **tercera opcional**. Se conserva íntegramente el JSX y CSS del Home, incluidas proporciones, tipografía, animaciones y textos; no se editan header ni footer.
- Los dos identificadores iniciales, presentes en los artefactos previos, se verificaron además mediante lectura de MongoDB: `otro_dia_otro_dolar` y `luminico_urtext_2025`. Ambos son públicos y tienen portada. Sus rutas `/proyectos/otro_dia_otro_dolar` y `/proyectos/luminico_urtext_2025` respondieron HTTP 200.

## Administración

1. Iniciar sesión y abrir **Configuración del inicio**, al principio del panel o desde su navegación.
2. Dentro de **Proyectos destacados en portada**, abrir **Cambiar selección** en cada posición.
3. Buscar por título o año. Los resultados muestran título, miniatura disponible, año y estado. Las entradas privadas, sin portada válida o elegidas en otra posición están deshabilitadas.
4. Elegir dos entradas distintas. **Orden automático** permite completar las primeras dos posiciones con proyectos públicos disponibles. Opcionalmente, elegir un **Proyecto destacado 3**; **Sin tercer proyecto** lo desactiva.
5. Usar **Intercambiar posiciones** si se desea. Con un tercer proyecto aparecen **Intercambiar 1 y 2** e **Intercambiar 2 y 3**, que permiten ordenar las tres entradas. Revisar la vista previa del orden efectivo.
6. Pulsar **Guardar configuración**. Se muestra confirmación o un mensaje de error; los cambios no guardados solo afectan la vista previa. Al recargar se recupera la configuración persistida.

## Persistencia, compatibilidad y respaldo

Se reutiliza la colección `siteContent` con un documento global independiente:

```json
{
  "_id": "home",
  "featuredProjectSlugs": ["otro_dia_otro_dolar", "luminico_urtext_2025"],
  "updatedAt": "fecha ISO del guardado"
}
```

El documento se crea mediante `upsert` al guardar por primera vez. Sin documento, se resuelven las dos referencias iniciales solo cuando existen y son aptas. Las primeras dos posiciones admiten `null` para orden automático. El array admite una tercera referencia opcional; si está ausente o vale `null`, solo se muestran dos proyectos. Si contiene un slug, se muestra el tercero con las mismas validaciones y respaldo. Se aceptan las configuraciones anteriores de dos referencias sin migrarlas. No se necesitan migraciones, índices nuevos, dependencias ni cambios en Prisma. El documento `global`, utilizado por el editor de textos, permanece independiente: guardar textos no sobrescribe la selección ni viceversa.

La portada obtiene los objetos actuales desde `getProjects()` y resuelve las referencias en el servidor en cada carga dinámica. Título, portada, año, categorías, video y enlace proceden de las entradas existentes. El cliente público y el archivo general conservan sus componentes y lógica anteriores.

Si una referencia desaparece, es privada o pierde una URL de portada válida, se reserva primero cualquier otra selección válida y se completa el hueco siguiendo el orden público existente. Nunca se repite una entrada. El administrador muestra una advertencia y permite reemplazarla o elegir orden automático. Si no hay suficientes entradas aptas para las posiciones activas, solo se muestran las disponibles; no se inventan proyectos o imágenes. La validación de portada comprueba la referencia de imagen configurada y su protocolo/ruta; no descarga cada imagen ni garantiza la disponibilidad futura del proveedor externo.

Las selecciones no escriben `order`, fechas, categorías, estado, contenido ni otros campos de proyectos. No había proyectos fijados que migrar y el campo de orden existente se conserva. La siguiente sección del Home conserva su lógica previa de omitir los proyectos presentes en el Hero cuando existen alternativas.

Para volver a la selección inicial basta eliminar exclusivamente el documento `_id: "home"` de `siteContent`; no hay migración que revertir. Revertir el código de esta fase deja ese documento sin uso y no requiere modificar proyectos.

## Seguridad

`POST /api/site/home` exige una sesión firmada, vigente y con `subject: "admin"` antes de consultar MongoDB. Rechaza un `Origin` explícito distinto del origen de la solicitud y conserva la protección de cookie `SameSite=Lax` existente. Valida JSON, dos posiciones y una tercera opcional, tipos, longitud y formato de identificadores y ausencia de duplicados con Zod. Antes de escribir, verifica existencia, visibilidad pública y portada contra el catálogo real de MongoDB, sin aceptar el respaldo Markdown cuando falla la conexión. Los errores de lectura/escritura devuelven un mensaje claro y nunca una confirmación falsa.

## Archivos de esta fase

- `src/domain/home.ts`: tipos, selección inicial, elegibilidad, resolución de dos o tres posiciones y mensajes de validación.
- `src/server/home.ts`: lectura y guardado del documento global independiente.
- `src/server/validation.ts`: esquema Zod para dos referencias y una tercera opcional.
- `src/app/api/site/home/route.ts`: operación de guardado autenticada y validación de referencias.
- `src/components/admin/HomeSettingsManager.tsx`: selectores buscables, miniaturas, estados, vista previa, intercambio y guardado.
- `src/app/admin/page.tsx`: carga de la configuración después de autenticar.
- `src/app/admin/page.client.tsx`: integración de la sección y su acceso en la navegación existente.
- `src/app/page.tsx`: sustitución de la consulta editorial adicional por la selección de configuración; mantiene las demás fuentes.
- `tests/home-settings.test.mjs` y `package.json`: pruebas aisladas y comando `test:home`.
- `README.md` y este directorio: documentación, capturas y resultados.

Los cambios del rediseño que ya estaban presentes en el workspace se conservaron.

## Validación

- `npm run test:home`: once pruebas aprobadas, incluidas la compatibilidad de configuraciones anteriores, la selección, persistencia, intercambio y eliminación del tercer proyecto y sus validaciones de duplicados, privacidad y portada. Cubren selección y guardado, lectura posterior, cambio de cada posición, intercambio, duplicados, referencias privadas/eliminadas/sin portada, huecos automáticos, catálogo insuficiente, actualización de datos, orden del archivo y textos globales sin cambios, sesiones ausentes/inválidas/caducadas/de otro rol, origen incorrecto, JSON/identificadores inválidos y fallos de escritura/conexión.
- Las pruebas de persistencia y despublicación/eliminación usan almacenamiento en memoria y copias de entradas reales del repositorio. No despublican ni borran proyectos del usuario.
- `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check`: aprobados. La herramienta de build informa que su base `baseline-browser-mapping` tiene más de dos meses; es un aviso de dependencia preexistente.
- Chrome con el build de producción y datos reales: Home HTTP 200, exactamente dos proyectos iniciales y destinos HTTP 200; sin desbordamiento horizontal a 375, 768 y 1440 px. Panel a 375 y 1440 px sin desbordamiento de la sección.
- Navegador: búsqueda, cambio de ambas posiciones, bloqueo de repetidos, intercambio, payload de guardado ordenado, confirmación y error visibles. Las respuestas de guardado exitoso y error se simularon en el navegador; la persistencia se comprobó con el almacenamiento aislado. No se escribió configuración en la base real durante la validación.
- API real: solicitudes anónimas HTTP 401 y selecciones repetidas, inexistentes o privadas HTTP 400. Catálogo público idéntico antes y después de las comprobaciones, sin errores JavaScript.
- Evidencia: `browser-validation.json`, `admin-375.png` y `admin-1440.png`.

### Comprobación de la tercera posición opcional

Chrome: añadir el tercer proyecto mediante búsqueda, impedir duplicados, intercambiar 1/2 y 2/3, guardar tres referencias en el orden correcto y retirar el tercero con **Sin tercer proyecto**. Vista previa de tres o dos entradas según la selección, sin errores JavaScript ni desbordamiento a 375 y 1440 px. La API real rechaza una tercera referencia repetida con HTTP 400. Guardados del navegador simulados, sin escrituras en MongoDB; lectura posterior y compatibilidad del formato anterior verificadas en las once pruebas aisladas. Evidencia adicional: `third-project-validation.json`, `admin-third-375.png` y `admin-third-1440.png`.
