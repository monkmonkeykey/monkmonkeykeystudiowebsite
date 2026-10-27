# Fase 3.3 — Consolidación editorial del Home

## Cambios

Los únicos archivos de aplicación modificados son:

- `src/app/page.client.tsx`: orden Hero → Nuestra práctica → Colaboraciones → Más proyectos; una sola introducción de práctica con las tres capacidades existentes; máximo seis colaboradores en su orden original y acceso a `/clientes`; tres trabajos adicionales siguiendo el archivo, excluyendo el Hero y sin respaldo que pueda repetirlo. Si no hay trabajos adicionales se oculta la sección. El enlace al archivo aparece al final del bloque.
- `src/app/home.module.css`: práctica en dos columnas desde 768 px y una en móvil; capacidades integradas con separadores discretos; seis colaboradores distribuidos en tres columnas desde 768 px; tres proyectos con tarjetas editoriales de igual ancho desde 1024 px. Se conservan colores, imágenes y estilos del Hero.

Se retiraron del Home el segundo párrafo de práctica y el encabezado independiente de capacidades. Los títulos, resúmenes y destinos de los servicios proceden de los mismos datos y traducciones de presentación existentes. No se escribieron datos ni se modificaron CMS, API, esquemas, servicios, clientes, archivo, fichas de proyectos, header, footer o logotipo. La configuración de hasta tres destacados sigue intacta.

## Validación

- `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check`: correctos. El build conserva un aviso previo de antigüedad de `baseline-browser-mapping`; no se cambiaron dependencias.
- Chrome, español e inglés, a 375, 768, 1024 y 1440 px: orden de cuatro secciones correcto, tres capacidades, seis colaboradores, tres trabajos adicionales y ausencia de desbordamiento horizontal.
- Los colaboradores coinciden con los primeros seis de la fuente pública, sin filtros de color en logotipos. Los proyectos adicionales coinciden con los primeros tres del archivo después de excluir los destacados. Las fichas, `/proyectos` y `/clientes` responden HTTP 200.
- El JSX del Hero y sus reglas CSS coinciden con los originales. Comparación en navegador antes/después a los cuatro tamaños: HTML, geometría y estilos computados del Hero idénticos. La selección real conserva sus tres proyectos y orden. Header, footer, SiteShell, logotipo, estilos globales, página de servidor y lógica de configuración se comprobaron con SHA sin cambios.
- Menú móvil: apertura y cierre mediante Escape correctos. Sin errores JavaScript. El footer sigue al contenido principal y permanece como último elemento; no hay hueco adicional entre el final de Más proyectos y el footer.
- Renderizado aislado del componente con entradas reales del repositorio: en ambos idiomas, casos con cero, uno, dos y tres trabajos adicionales. Se oculta el bloque cuando no hay alternativas; nunca se recuperan duplicados del Hero. Estas comprobaciones no escriben en la base de datos.
- Evidencias: `validation.json`, `render-validation.json`, `home-1440.png` y `home-375.png`.

## Limitación preexistente de los enlaces de servicios

Los enlaces existentes `/servicios#audio`, `/servicios#arte-nuevos-medios` y `/servicios#impresion3d` abren `/servicios` correctamente, pero esa página no publica elementos con los identificadores correspondientes ni maneja el fragmento para seleccionar un servicio. Se conservaron sus destinos; no se modificó `/servicios`, de acuerdo con las restricciones de esta fase. La comprobación registra esta diferencia entre navegación a la página y navegación directa al área.
