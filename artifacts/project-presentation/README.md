# Visibilidad y etiquetas de información del proyecto

Implementación por proyecto, integrada en el administrador existente. No se cambiaron registros reales ni se ejecutó un despliegue.

## Uso

1. Abre **Admin → Proyectos** y selecciona el proyecto.
2. Dentro de **Autoría, participación y créditos**, busca **Presentación en la ficha pública**.
3. Para quitar únicamente el encabezado «Sobre el proyecto», desmarca **Mostrar el título principal del bloque**. La información continúa visible y el espacio del título desaparece.
4. Para ocultar toda esa sección, desmarca **Mostrar el bloque de información del proyecto**. Se ocultan descripción, participación, información, autoría y créditos adicionales. Los datos siguen guardados y editables; galería, video y colaboradores permanecen disponibles.
5. Abre **Personalizar títulos y etiquetas** para cambiar en ES/EN: Sobre el proyecto, Autoría artística, Participación de monkmonkeykey, Créditos adicionales, Lugar y Cliente / institución.
6. Pulsa **Guardar**. Para recuperar los nombres originales de una etiqueta, vacía sus dos versiones y guarda.

Los ajustes son independientes para cada proyecto. Los encabezados de autoría, participación y créditos dentro del editor también reflejan la etiqueta española personalizada. Las etiquetas de metadatos adicionales siguen editándose desde **Campos adicionales → Etiqueta (ES)/(EN)**.

## Comportamiento y persistencia

- Sin configuración guardada, se conserva la presentación actual: bloque y título visibles, con las etiquetas predeterminadas.
- La propiedad opcional `editorialPresentation` contiene `visible`, `showHeading` y las etiquetas bilingües de este proyecto. Se conserva a través del flujo existente de validación, MongoDB y Markdown.
- Cambiar visibilidad o etiquetas no cambia descripción, autores, funciones, créditos o relaciones. Las solicitudes antiguas que omiten esta propiedad conservan la configuración almacenada.
- Cada etiqueta personalizada requiere ES y EN; los errores aparecen junto a sus campos. Ambas versiones vacías restauran el nombre predeterminado y no guardan entradas `null`.
- Al ocultar solo el encabezado, la sección mantiene un nombre accesible para lectores de pantalla. No reserva un espacio vacío para ese título.

## Archivos

- `src/domain/project-presentation.ts`: tipos, etiquetas predeterminadas y resolución de etiquetas visibles.
- `src/domain/project-credits.ts`: configuración opcional, validación y normalización compartidas con la persistencia existente.
- `src/lib/project-credit-form.ts`: carga, valores iniciales y serialización de los ajustes del editor.
- `src/components/admin/ProjectCreditsEditor.tsx`: controles de visibilidad y personalización ES/EN.
- `src/components/projects/project-detail.tsx` y su módulo CSS: aplicación de visibilidad y etiquetas, conservando la composición de la fase 6.3.
- `tests/project-credits.test.mjs`: persistencia, retrocompatibilidad, validación, Markdown y presentación pública.

Los cambios pendientes de la fase 6.3 se conservaron. No hay dependencias nuevas ni migraciones masivas.

## Verificación

- Lint, TypeScript y build correctos. Permanece el aviso existente de antigüedad de `baseline-browser-mapping`.
- **33 pruebas automatizadas correctas**: 17 de proyectos, 11 de Home y 5 de servicios.
- [browser-validation.json](browser-validation.json): seis comprobaciones en Chrome con el administrador, componente, esquemas y handlers reales, usando MongoDB en memoria y solicitudes interceptadas. Incluyen ocultar el título, cambiar las seis etiquetas, error de traducción incompleta, guardado, reapertura, cambio de proyecto, ocultar todo, conservar datos y restaurar valores predeterminados.
- La vista pública aislada utiliza el componente real renderizado con la configuración guardada por el formulario. Se comprueban las etiquetas, ocultación, nombre accesible, eliminación del espacio del título y conservación de la galería.
- Revisión del panel a 375 y 1440 px, sin desbordamiento horizontal. Sin errores JavaScript de página.

## Capturas del panel aislado

- [Escritorio](settings-1440.png)
- [Móvil](settings-375.png)
