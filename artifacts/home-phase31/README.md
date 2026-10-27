# Hero editorial — Fase 3.1

## Archivos de implementación

- `src/app/page.tsx`: entrega al Hero tres proyectos públicos en el orden editorial de la consulta existente (`order`, seguido de `name.es`). La consulta normal del archivo público se conserva; no se modifican CMS, API, esquemas ni rutas.
- `src/app/page.client.tsx`: introducción compacta, tres portadas enlazadas con título y periodo, archivo completo y video opcional bajo demanda. La sección siguiente conserva su presentación y orden, excluyendo los trabajos del Hero cuando hay otras entradas disponibles.
- `src/app/home.module.css`: cambios limitados a las reglas del Hero. Retícula 2:1 desde 768 px y composición vertical en móvil, con proporciones reservadas para los medios, sin alturas fijas.

El resto del JSX del Home coincide con el previo a esta fase. Header, footer, SiteShell y estilos globales se verificaron mediante SHA y permanecen intactos.

## Verificación

- ESLint, `tsc --noEmit`, build y `git diff --check`: correctos.
- Chrome en español e inglés: 375×812, 768×1024, 1024×768, 1366×768 y 1440×900. Sin overflow horizontal. Un proyecto principal de dos tercios y dos secundarios apilados en escritorio.
- Composición completa desde el inicio de la página hasta aproximadamente 762 px a 1366 px de ancho, y 768 px a 1440 px de ancho en español. En móvil se permite el desplazamiento vertical natural.
- Tres destinos individuales con HTTP 200, portadas y textos procedentes de cada entrada. Sin repeticiones en la siguiente sección con los datos actuales.
- Imágenes con `object-fit: cover`, tamaños responsive y proporción reservada. Solo la principal tiene prioridad. Las otras usan carga diferida.
- Video: iframe montado únicamente al solicitarlo, sin permiso de autoplay ni audio automático, con portada recuperable y controles del proveedor. Sin reproducción al cargar ni al reducir movimiento. Los tres proyectos editoriales actuales no incluyen video; la reproducción no se pudo ejercer con esta selección real y no se alteraron datos para simularla.
- Capturas: `hero-1440.png`, `hero-375.png`. Mediciones y enlaces: `validation.json`.

No se avanza al rediseño del portafolio ni se intervienen incidencias previas de otras páginas.
