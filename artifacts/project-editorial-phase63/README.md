# Información, autoría y créditos — Fase 6.3

La ficha integra ahora descripción, participación del estudio, información y autoría bajo **Sobre el proyecto**. El caso principal se revisó primero en [la versión pública de «Otro día, otro dólar»](https://www.monkmonkeykey.com/proyectos/otro_dia_otro_dolar), a 375 y 1440 px, y se consultaron sus datos actuales mediante la API pública. Las capturas «Después» corresponden a la compilación local validada; no se ejecutó un despliegue desde esta intervención.

## Composición

- Desde 1024 px se utiliza una retícula asimétrica de `1.6fr / 1fr`: aproximadamente 62 % para contexto y participación y 38 % para información y autoría, descontando el espacio entre columnas.
- La descripción completa abre la columna izquierda. Debajo aparece la participación de monkmonkeykey con subtítulo propio y un separador discreto cuando ambos contenidos existen. Los textos conservan párrafos, formato y saltos de línea.
- La columna derecha reúne lugar, cliente/institución, metadatos existentes y autoría. Las etiquetas son secundarias, los valores permanecen legibles y los nombres tienen más jerarquía que las funciones. No se envuelve la columna en tarjetas o fondos contrastantes.
- Los créditos adicionales aparecen debajo de la retícula, separados mediante una línea. Sus registros alinean nombre y función desde 768 px y se apilan en móvil. Todos permanecen visibles y en su orden original.
- A 375 y 768 px la información principal utiliza una columna, con el orden: título, descripción, participación, datos, autoría y créditos adicionales.

La jerarquía concede prioridad a la lectura de la descripción y utiliza subtítulos discretos para identificar responsabilidades. Las líneas de texto mantienen longitudes cómodas; no hay alturas fijas, expansión de créditos o espacios reservados para columnas ausentes.

Si solo existe contexto o información, la retícula tiene una columna. Si falta participación, autoría o créditos, se omiten su subtítulo y su bloque completo. Si toda la información está vacía, se omite también **Sobre el proyecto**.

La coincidencia entre cliente y autora se conserva: son funciones distintas y la presentación no las fusiona. La descripción no se reescribió ni se generó una sinopsis.

## Archivos modificados

- `src/components/projects/project-detail.tsx`: integra los bloques existentes bajo el nuevo encabezado y condiciona columnas/apartados según el contenido disponible.
- `src/components/projects/project-detail.module.css`: composición 60/40, espaciado, etiquetas, autoría y registros alineados de créditos.
- `tests/project-credits.test.mjs`: adapta la prueba de presentación a la estructura integrada y comprueba contenido, orden, campos vacíos, columnas únicas y conservación de valores coincidentes.

No se modificaron modelos, esquemas, validaciones, consultas, endpoints, base de datos, administrador, traducciones del sistema, rutas ni SEO. El título principal, subtítulo, portada, video, galería, lightbox y colaboradores conservan su implementación. La revisión de alcance compara todo el resto del directorio `src`, archivos de contenido y configuración con el estado inicial.

## Pruebas

- `npm run lint`, `npx tsc --noEmit` y `npm run build`: correctos. Se mantiene el aviso existente de antigüedad de `baseline-browser-mapping`.
- `npm run test:projects`, `npm run test:home` y `npm run test:services`: **30 pruebas correctas**. Las pruebas de persistencia siguen utilizando un doble de MongoDB en memoria; no realizan escrituras reales.
- [validation.json](validation.json): **48 comprobaciones de aplicación compilada** en Chromium y WebKit, con **Otro día, otro dólar**, **NIME 2023** y **LEAM 2025**, ES/EN y anchos de 375, 768, 1024 y 1440 px. Se verifican descripción íntegra, datos, autoría, proporciones de columnas, orden móvil, ausencia de encabezados vacíos/desbordamientos y funcionamiento de galería/lightbox y colaboradores.
- El mismo informe contiene **144 casos aislados de presentación** generados con el componente real: descripción breve, textos extensos con párrafos, solo descripción, solo autoría, solo participación, numerosos créditos, proyecto antiguo, datos totalmente vacíos y solo créditos. Se verifican columnas únicas sin espacios reservados, registros alineados y orden de lectura. Los nombres de prueba de estos casos existen únicamente en archivos HTML temporales; no se guardaron en ningún proyecto.
- Sin errores de hidratación/JavaScript de página ni errores HTTP de CSS/JavaScript durante la revisión de la aplicación.
- [scope-validation.json](scope-validation.json): conservación de los archivos ajenos al alcance y del JSX de portada, video, galería, visor y colaboradores.

## Observaciones editoriales del CMS actual

Los valores se consultaron antes de cambiar código. La autora figura actualmente como **Karen Aixa** y los créditos adicionales están vacíos. **No se encontraron «Karen Aixaa» ni registros con «a»** en esos campos del caso principal. No se corrigió ni eliminó información.

| Campo | Valor actual observado | Observación | Recomendación manual |
| --- | --- | --- | --- |
| Descripción ES | `Detalle de instalación y ensamblaje` | Es una frase breve de documentación técnica; puede resultar insuficiente para explicar la obra. | Valorar ampliar el contexto artístico desde el CMS, sin sustituirlo por una sinopsis inventada. |
| Descripción EN | `Detalle de instalación y ensamblaje` | Conserva el mismo texto español de ES. | Revisar la versión inglesa. |
| Cliente / institución y autoría | Ambos muestran `Karen Aixa`; el cliente se relaciona mediante `karen-aixa`. | La coincidencia puede ser legítima: una persona puede ser cliente y autora. | Confirmar esas dos funciones si se considera necesario; se mantienen ambas. |
| Función de autoría EN | `Artista` | El texto coincide con ES y parece pendiente de revisión de idioma. | Confirmar la formulación deseada en inglés. |
| Participación EN | `Producción de sistema interactivo.` | La versión EN contiene el mismo texto español que ES. | Revisar su traducción desde el CMS. |

El lugar registrado es **SOMA México**, no hay metadatos adicionales en este proyecto y la participación ES conserva **Producción de sistema interactivo.** El inventario exacto y el momento de observación se guardan en [editorial-observations.json](editorial-observations.json).

## Capturas

- [Antes: ficha publicada, escritorio](before-1440.png)
- [Después: compilación local, escritorio](chromium-after-1440.png)
- [Antes: ficha publicada, móvil](before-375.png)
- [Después: compilación local, móvil WebKit](webkit-after-375.png)
- [Después: móvil Chromium](chromium-after-375.png)

Las capturas posteriores utilizan el contenido leído por la aplicación local. Las observaciones editoriales se basan en la consulta de la ficha y API públicas, sin asumir que sus datos o compilación deban coincidir con el entorno local en todo momento.
