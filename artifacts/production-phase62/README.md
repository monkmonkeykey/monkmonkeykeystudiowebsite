# A. Diagnóstico del sitio publicado

Revisión del 27 de octubre de 2026. Consultas públicas de solo lectura; no se modificaron DNS, certificados, caché, configuración de Vercel ni datos del CMS.

## Resultado

No se reprodujo una página sin estilos en `https://www.monkmonkeykey.com` ni en `https://monkmonkeykeystudiowebsite.vercel.app`. Ambos cargaron correctamente en Chromium y WebKit a 375 y 1440 px. Se utilizó emulación móvil, sin acceso al teléfono específico reportado. Sí se reprodujo un fallo de acceso a `https://monkmonkeykey.com`, antes de poder cargar su HTML y CSS.

La auditoría inicial incluyó Home, archivo de proyectos, ficha de «Otro día, otro dólar» y colaboradores: 32 cargas normales correctas entre ambos dominios, navegadores y anchos. Se comprobaron 64 respuestas CSS `200 text/css` y 256 respuestas JavaScript `200 application/javascript`, sin respuestas HTML en su lugar, errores HTTP de imágenes, errores de hidratación ni desbordamiento horizontal. Las imágenes cargadas tenían dimensiones válidas. Las cancelaciones registradas corresponden a peticiones de prefetch RSC al finalizar páginas, no a CSS, JavaScript o imágenes.

Los hashes SHA-256 y rutas de los CSS y JavaScript coincidieron entre `www` y el dominio de Vercel, en ambas resoluciones y navegadores. No se encontraron referencias rotas a recursos de un despliegue anterior. Esto comprueba que ambos servían la misma compilación de frontend durante la auditoría; no sustituye la comprobación de asociación del dominio dentro de la cuenta de Vercel.

## Problema confirmado en el dominio sin www

Los dos DNS autoritativos, `dns3.hostgator.com.br` y `dns4.hostgator.com.br`, devuelven simultáneamente estos registros A para `monkmonkeykey.com`:

| Registro | Destino | Resultado observado |
| --- | --- | --- |
| A de `@` | `216.198.79.1` | Responde como Vercel y redirige a `https://www.monkmonkeykey.com/`, pero presenta un certificado que solo incluye `DNS:www.monkmonkeykey.com`. |
| A de `@` | `162.240.81.81` | La conexión HTTPS agota el tiempo de espera. También es la IP del servidor DNS `dns3.hostgator.com.br`; no debe confundirse eliminar el registro A del dominio raíz con cambiar los servidores DNS. |

El TTL observado es de 14.400 segundos, cuatro horas. El CNAME de `www` apunta a `15dcad176d8779ce.vercel-dns-017.com` y su certificado valida correctamente.

El certificado recibido en la IP de Vercel tiene CN/SAN `www.monkmonkeykey.com`, sin el nombre raíz. `curl` devuelve error 60 por nombre de certificado incorrecto. WebKit rechaza la navegación por certificado inválido; Chromium aborta la navegación. Ocurre tanto en móvil como en escritorio. La última comprobación normal del dominio raíz mantuvo ese fallo.

La coexistencia de dos destinos puede producir resultados distintos según la red y su caché DNS. Es una explicación posible de diferencias entre teléfono y escritorio, pero no se demostró que el destino que no responde esté sirviendo una página sin estilos. No se identificó un archivo CSS o JavaScript defectuoso en el despliegue accesible.

## Corrección pendiente en HostGator y Vercel

1. En **Project Settings → Domains** del proyecto correcto de Vercel, comprobar que figuren **`monkmonkeykey.com` y `www.monkmonkeykey.com`** y consultar el valor A exacto que Vercel indica para el dominio raíz.
2. En la zona DNS autoritativa de HostGator, eliminar únicamente el **registro A de `@` que apunta a `162.240.81.81`**. Conservar para `@` los destinos indicados por Vercel; el destino que actualmente responde como Vercel es `216.198.79.1`. No se debe adivinar una IP distinta ni sustituir los servidores DNS por ese motivo.
3. Mantener el CNAME de `www` si coincide con el valor indicado por ese proyecto. Puede conservarse `www` como destino principal y la redirección desde el dominio raíz.
4. Validar de nuevo ambos dominios en Vercel y esperar a que el certificado del dominio raíz incluya **`DNS:monkmonkeykey.com`**. La redirección HTTPS también requiere un certificado válido para el dominio de origen.
5. Tras caducar las respuestas DNS anteriores —el TTL observado es de cuatro horas—, repetir las comprobaciones sin omitir validación TLS: dominio raíz, redirección a `www`, CSS y JavaScript `200` con sus tipos correctos.

Vercel documenta que los valores DNS deben tomarse de la configuración de cada proyecto, que los registros antiguos pueden causar conflictos y que el certificado se provisiona tras validar DNS. [Resolución de problemas de dominios](https://vercel.com/docs/domains/troubleshooting), [configuración de un dominio](https://vercel.com/docs/domains/set-up-custom-domain).

El repositorio no dispone de `vercel.json`, `.vercel/project.json` ni una herramienta conectada a esta cuenta de Vercel/HostGator. La corrección externa queda pendiente en sus paneles; no se afirma que el dominio raíz haya quedado corregido.

## Código inspeccionado y decisiones

Se revisaron `layout.tsx`, `globals.css`, módulos de Home/proyectos/ficha, `next.config.ts`, PostCSS, scripts de compilación y referencias estáticas del HTML publicado. La importación global y las referencias de Next son correctas; no hay `assetPrefix` o `basePath` personalizados que requieran corrección. No se reescribieron estilos, optimizaciones o reglas de caché para intentar corregir el dominio.

## Evidencia

- [Resumen de producción](production-summary.json)
- [Auditoría de recursos y navegador](production-validation.json)
- [DNS autoritativos y TTL](authoritative-dns.json)
- [Certificados por IP](dns-tls.json), [certificado recibido](certificate.json)
- [WebKit móvil en www](webkit-www-375.png)
- [Chromium escritorio en Vercel](chromium-vercel-1440.png)

Las capturas `diagnostic-apex` se hicieron omitiendo la validación del certificado únicamente para comprobar su redirección pública. No representan un acceso normal correcto ni una solución; la verificación normal del dominio raíz falló en los dos navegadores.

La auditoría inicial antecede al despliegue de la fase 6.2. La [verificación posterior de créditos publicados](../project-credits-phase62/published-validation.json) documenta los recursos y comportamiento de la versión actualizada.
