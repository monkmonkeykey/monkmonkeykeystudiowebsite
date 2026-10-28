# B. Créditos públicos — Fase 6.2

Se añadió «Autoría y producción» a las fichas individuales, inmediatamente después de la descripción/contexto y antes del video y la galería. Conserva separada la sección «Colaboraciones».

## Datos y presentación

La sección utiliza directamente los campos opcionales de `Project` que la fase 6.1 ya recupera mediante `getProjectBySlug` y sus lectores de MongoDB/Markdown. No se añadieron consultas, modelos ni escrituras.

- **Autoría artística:** nombres de artistas/colectivos y función cuando está registrada.
- **Participación de monkmonkeykey:** texto del estudio en el idioma seleccionado.
- **Créditos adicionales:** nombres y funciones, respetando el orden guardado.

Solo se muestran los apartados con información. Cuando los tres campos están vacíos o ausentes, no se renderiza la sección, incluido su título y separador. No se interpreta el cliente o las entidades como autores ni se generan créditos. La ficha técnica conserva su contenido; los nuevos datos se presentan una sola vez en su sección.

Los textos utilizan el sistema ES/EN existente y su política de respaldo de idioma. Se preservan los saltos de línea de funciones y participación. Las listas mantienen su orden, con nombres destacados y funciones en texto secundario.

La composición usa columnas que se adaptan al ancho y al número de apartados, y se apila en móvil. Reutiliza tipografía, colores y separadores aprobados. No contiene tarjetas, sombras, iconos ni efectos nuevos.

## Archivos modificados

- `src/components/projects/project-detail.tsx`: etiquetas bilingües, lectura de los campos existentes y sección condicional.
- `src/components/projects/project-detail.module.css`: siete reglas específicas para la retícula y tipografía de créditos.
- `tests/project-credits.test.mjs`: actualiza la prueba de presentación pública para la fase 6.2; comprueba casos completos, parciales, vacíos y ambos idiomas, conservando el resto del HTML.

El JSX y CSS ajenos a créditos dentro de la ficha permanecen idénticos. Los archivos de administración, modelos, lectores, APIs, Home, archivo, colaboradores, Header, Footer y contenido local se compararon con el estado inicial y permanecen intactos. No se modificaron rutas, slugs, datos del CMS o dependencias.

## Validación local

- `npm run lint`, `npx tsc --noEmit` y `npm run build`: correctos. Permanece el aviso existente de antigüedad de `baseline-browser-mapping`.
- `npm run test:projects`, `npm run test:home` y `npm run test:services`: **30 pruebas correctas**.
- [validation.json](validation.json): **32 casos de aplicación compilada** y **96 casos aislados** en Chromium y WebKit, en ES/EN y a 375, 768, 1024 y 1440 px.
- Aplicación compilada: fichas con datos existentes y proyecto antiguo sin créditos, posición de la sección, contenido e idioma, galería/lightbox con flechas/Escape y retorno de foco, expansión de colaboradores y ausencia de desbordamientos.
- Casos aislados: componente y CSS reales con copias de datos públicos para mostrar todos los apartados, solo autoría, solo participación, solo créditos adicionales, campos vacíos y campos ausentes. Next Image y Link se adaptan únicamente en este entorno. No se escriben registros para generar los casos.
- Sin errores de hidratación o JavaScript de página. Se verifica `white-space: pre-line`; la prueba de render conserva un texto bilingüe con saltos de línea.

## Verificación publicada

Durante el trabajo se actualizó el despliegue que incluye esta sección. Se comprobó su HTML en `https://www.monkmonkeykey.com/proyectos/otro_dia_otro_dolar` y en la URL equivalente de Vercel; ambas presentan `project-credits-title` y la nueva hoja de estilos de ficha.

La comprobación posterior en navegador completó **24 casos correctos** en `www` y el dominio de Vercel: Chromium/WebKit, 375/1440 px, ES/EN, proyecto con créditos y proyecto antiguo sin campos. Se verificaron el contenido de la API, recursos CSS/JS con sus tipos correctos, galería/lightbox y colaboradores. Sin errores de hidratación ni JavaScript de página. Queda registrada en [published-validation.json](published-validation.json), con capturas `published-*`.

Esta verificación publicada debe distinguirse del problema pendiente de DNS/TLS del dominio sin `www`, documentado en el [diagnóstico de producción](../production-phase62/README.md).

## Capturas

- [Aplicación compilada a 1440 px](chromium-credits-1440.png)
- [Aplicación compilada en WebKit a 375 px](webkit-credits-375.png)
- [Tres apartados con copia aislada de datos públicos a 1440 px](isolated-full-1440.png)
- [Tres apartados con copia aislada de datos públicos a 375 px](isolated-full-375.png)

Las capturas usan la información existente en cada entorno al consultar. No se editaron nombres, traducciones o registros para prepararlas.
