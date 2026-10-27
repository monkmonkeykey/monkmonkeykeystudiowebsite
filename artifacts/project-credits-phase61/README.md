# Autoría, participación y créditos — Fase 6.1

Se incorporaron tres campos editoriales opcionales al administrador y a la lectura/escritura de proyectos. No se añadió presentación pública de créditos ni se escribieron datos de prueba en producción.

## Cómo registrar la información

1. Abre `/admin`, entra en **Proyectos** y selecciona un proyecto o **+ Nuevo proyecto**.
2. Busca **Autoría, participación y créditos**, antes de «Organizaciones asociadas».
3. En **Autoría artística**, usa **Agregar artista**. Introduce un nombre libre de artista o colectivo. Su función es opcional; si la escribes, completa ES y EN.
4. En **Participación de monkmonkeykey**, escribe las tareas realizadas por el estudio en las dos áreas de texto. Admiten saltos de línea. Puedes dejar ambas vacías.
5. En **Créditos adicionales**, usa **Agregar crédito** y completa nombre y función en ES y EN. No hace falta registrar a la persona en el directorio de colaboradores.
6. Usa **Subir**, **Bajar** y **Eliminar** para ordenar las listas o quitar entradas. Pulsa **Guardar** al terminar.

Al cambiar de proyecto o abrir uno nuevo se carga un borrador independiente. Al reabrir el administrador se recuperan los textos guardados y el orden. Para retirar toda la participación del estudio, vacía ambas áreas y guarda. Para retirar autores/créditos, elimina sus entradas y guarda.

## Modelo y validación

Los campos del objeto `Project` son:

```ts
artisticAuthorship?: { name: string; role?: LocaleText }[];
studioContribution?: LocaleText;
additionalCredits?: { name: string; role: LocaleText }[];
// LocaleText = { es: string; en: string }
```

Los nombres propios no se duplican por idioma. Las funciones son texto libre, sin listas cerradas. No se asigna autoría al estudio ni se infiere participación a partir de categorías, servicios, cliente, descripción o entidades.

El formulario y la API comparten el mismo esquema de validación. Rechazan nombres vacíos, créditos adicionales sin función y textos localizados incompletos. La función de un autor puede quedar completamente vacía; la participación también. Se recortan espacios exteriores sin alterar saltos de línea interiores. Los errores se muestran junto a sus campos y conservan la ruta de la entrada correspondiente.

Los identificadores de las filas sirven únicamente para edición y foco al reordenar: no se envían ni se guardan. Las listas conservan su orden de colección y no incorporan registros vacíos.

## Persistencia y compatibilidad

MongoDB utiliza la colección existente y la operación de guardado por slug. No se necesitan migraciones, índices nuevos ni escrituras masivas.

- Los campos omitidos en una solicitud conservan los valores almacenados. No se añaden valores por defecto a documentos antiguos durante la lectura.
- Las listas enviadas sustituyen únicamente su lista correspondiente; `[]` las vacía.
- En la API, `studioContribution: null` borra el campo mediante `$unset`; un objeto con ambos idiomas vacíos tiene el mismo efecto. El formulario envía esa eliminación explícita cuando se vacían ambas áreas.
- La función vacía de un autor se omite, sin guardar `null`, valores artificiales o identificadores.
- El orden general y la privacidad existentes se conservan cuando una solicitud omite `order` o `isPrivate`. El administrador sigue enviando explícitamente la privacidad elegida.
- Se conservan `client`, `entities`, `meta`, descripción, imágenes, galerías y video. Los campos nuevos quedan disponibles al leer el objeto del proyecto y en la API, preparando la fase 6.2.

El lector de Markdown admite las mismas estructuras opcionales dentro del frontmatter JSON que ya utiliza el repositorio. Los archivos antiguos siguen funcionando sin modificaciones. No cambian el orden de carga, las consultas ni la selección entre MongoDB y respaldo local. No se modificó ningún archivo de contenido.

## Archivos de esta fase

- `src/domain/project-credits.ts`: tipos, esquema bilingüe, normalización y errores por campo.
- `src/domain/projects.ts`: incorpora los campos opcionales al tipo `Project`.
- `src/lib/project-credit-form.ts`: conversión entre proyecto y borrador, validación y reordenación inmutable.
- `src/components/admin/ProjectCreditsEditor.tsx`: nueva sección del formulario con listas ordenadas y áreas de texto.
- `src/app/admin/page.client.tsx`: estado, carga, guardado y errores de la sección dentro del editor existente.
- `src/server/projects.ts`: tipos de documento/solicitud, lectura, persistencia y eliminación explícita.
- `src/server/validation.ts`: extiende la validación de proyectos con los campos nuevos.
- `src/content/projects.ts`: lectura opcional del frontmatter; exporta el lector de un archivo para verificarlo con copias temporales.
- `src/app/api/projects/route.ts` y `src/app/api/projects/[slug]/route.ts`: conservan sus rutas y autenticación; añaden errores detallados para los campos nuevos en respuestas de validación.
- `tests/project-credits.test.mjs`: pruebas específicas aisladas de modelo, formulario, API y persistencia.
- `package.json`: añade `npm run test:projects`. Sin dependencias nuevas.

El estado inicial ya contenía cambios pendientes de la fase 5.3. Se conservaron intactos; no forman parte de esta intervención.

## Resultado de las pruebas

- `npm run lint`: correcto.
- `npx tsc --noEmit`: correcto.
- `npm run build`: correcto. Permanece el aviso existente de antigüedad de `baseline-browser-mapping`.
- `npm run test:projects`: **14 pruebas correctas**. Alta con/sin autores; participación bilingüe; créditos; orden, edición y eliminación; recarga; documento antiguo; omisión y borrado explícito; conservación de contenido/privacidad; validación, autenticación y fallos de base de datos; Markdown antiguo/nuevo; HTML público idéntico con/sin los campos en ES y EN.
- `npm run test:home` y `npm run test:services`: **16 pruebas existentes correctas**.
- [browser-validation.json](browser-validation.json): **15 comprobaciones** con el administrador, componente, validación y handlers reales. Creación sin créditos, errores junto a campos, carga, ordenación con teclado, edición, eliminación, guardado, cambio de proyecto, reapertura y vaciado. Incluye 375, 768, 1024 y 1440 px, sin desbordamiento horizontal y con controles de ordenación/eliminación de 44 px. Sin errores JavaScript de página.
- [public-validation.json](public-validation.json): cinco páginas públicas responden correctamente y conservan los slugs y orden actuales. La lectura reconoce los campos nuevos presentes en un registro del CMS, sin crear una sección pública de autoría.
- [scope-validation.json](scope-validation.json): comparación de archivos públicos protegidos, contenido Markdown y código administrativo ajeno al editor de proyectos.

Las pruebas de escritura utilizaron un doble de MongoDB en memoria; no se ejecutaron contra una instancia real. En navegador se interceptaron todas las solicitudes y se conectaron las acciones del formulario con los handlers reales y ese almacenamiento aislado. Se adaptaron Next Image y el router para el entorno de prueba. Las consultas al sitio público fueron de solo lectura.

El snapshot histórico de la fase 5.3 difiere del contenido actual de un proyecto en categorías y campos editoriales. La validación pública registra esa diferencia y utiliza el contenido actual; no afirma igualdad total con ese snapshot. No se realizaron escrituras sobre ese registro.

## Capturas del entorno aislado

- [Editor a 1440 px](editor-1440.png)
- [Editor a 375 px](editor-375.png)

No se modificaron Home, Nuestra práctica, archivo de proyectos, fichas públicas, galerías, lightbox, video, colaboradores, tarjetas, Header, Footer, logotipo, identidad gráfica ni autenticación. La integración visual de créditos queda para la fase 6.2.
