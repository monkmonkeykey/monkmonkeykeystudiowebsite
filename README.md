# MonkMonkeyKey Website

Sitio institucional construido con Next.js 16 y el App Router. Carga contenido bilingüe (español/inglés) para servicios, clientes y proyectos, y puede funcionar únicamente con los archivos Markdown del repositorio o con un backend opcional en MongoDB + Cloudinary para gestión desde un panel administrativo.

## Requisitos
- Node.js 18+
- npm 10+

## Puesta en marcha local
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Copia el archivo de ejemplo de variables de entorno y complétalo con tus credenciales:
   ```bash
   cp .env.example .env.local
   ```
3. Lanza el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) para ver el sitio público.

## Variables de entorno
| Variable | Descripción |
| --- | --- |
| `MONGODB_URI` | Cadena de conexión a tu clúster de MongoDB Atlas o instancia propia. |
| `MONGODB_DB` | Nombre de la base de datos donde se guardarán clientes y proyectos. |
| `MONGODB_CLIENTS_COLLECTION` | (Opcional) Nombre de la colección donde se almacenan los clientes; por defecto `clients`. |
| `ADMIN_PASSWORD` | Contraseña que usarás para acceder al panel administrativo. |
| `ADMIN_SESSION_SECRET` | Cadena aleatoria larga para firmar las sesiones del panel. |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de tu cuenta de Cloudinary. |
| `CLOUDINARY_API_KEY` | API key con permisos de subida. |
| `CLOUDINARY_API_SECRET` | API secret asociado a la key. |

Si no configuras MongoDB, el sitio seguirá leyendo los archivos Markdown de `content/`. Si no configuras Cloudinary, podrás seguir pegando URLs manualmente para las imágenes y videos.

## Panel administrativo
1. Arranca la aplicación (en modo desarrollo o producción) y ve a [`/admin/login`](http://localhost:3000/admin/login).
2. Introduce la contraseña definida en `ADMIN_PASSWORD`. Se creará una sesión firmada con `ADMIN_SESSION_SECRET`.
3. Una vez dentro, podrás:
   - Crear, actualizar y eliminar clientes, instituciones o aliados.
   - Crear, actualizar y eliminar proyectos, incluidas galerías de imágenes, metadatos y videos opcionales de YouTube/Vimeo.
   - Subir medios a Cloudinary directamente desde los formularios (si las credenciales están presentes).
   - Elegir imágenes existentes de tu biblioteca de Cloudinary gracias al explorador integrado con búsqueda por carpeta.
   - Abrir la biblioteca de Cloudinary desde la pantalla de login para copiar URLs seguras aun antes de autenticarse.
4. Los cambios se guardan en MongoDB; el sitio público los mostrará tras recargar o al reconstruir.

> **Nota:** sin MongoDB el panel sólo mostrará el contenido existente en los Markdown, pero no permitirá guardar cambios.

Para cerrar sesión usa el botón “Cerrar sesión” dentro del panel o borra la cookie `mmk_admin_session`.

## Depuración rápida de MongoDB
- Ejecuta un smoke test directo contra tu clúster para comprobar que las credenciales y la red funcionan:
  ```bash
  MONGODB_URI="mongodb+srv://..." MONGODB_DB="monkmonkeykeydata" \\
    node scripts/mongodb-smoke-test.mjs
  ```
  El script insertará un registro temporal en la colección definida por `MONGODB_CLIENTS_COLLECTION` (o `clients` si no lo cambiaste),
  lo leerá, lo actualizará y finalmente lo borrará. Si ves errores de `querySrv` o SSL aquí, debes resolverlos en Atlas/VPC antes de volver a usar el panel.
  Cuando el servidor detecta este mismo error en tiempo de ejecución intentará automáticamente convertir tu URI `mongodb+srv://` a
  una conexión directa `mongodb://` (forzando `directConnection=true` y `tls=true`). Si el fallback logra conectarse verás un único
  aviso en consola y el panel quedará funcional sin tocar las credenciales.
- Tras iniciar sesión en `/admin/login`, puedes probar manualmente el endpoint de creación desde la terminal copiando la cookie `mmk_admin_session` del navegador:
  ```bash
  curl -X POST http://localhost:3000/api/clients \
    -H "Content-Type: application/json" \
    -H "Cookie: mmk_admin_session=PEGA_AQUI_TU_COOKIE" \
    -d '{
      "slug": "cliente-demo",
      "name": "Cliente demo",
      "kind": "client",
      "sector": { "es": "Tecnología", "en": "Technology" },
      "summary": { "es": "Ejemplo cargado desde curl", "en": "Example created via curl" },
      "website": "https://example.org"
    }'
  ```
  La respuesta debe devolverte el mismo JSON con estado `200`. Si ves un `401` revisa la cookie; si aparece un mensaje sobre MongoDB,
  significa que el servidor no consigue abrir la conexión y el administrador mostrará el mismo error legible en pantalla en lugar de `[object Object]`.

## Scripts disponibles
- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera el build de producción.
- `npm run start`: arranca el servidor en modo producción (requiere `npm run build` previo).
- `npm run lint`: ejecuta ESLint sobre el proyecto.

## Estructura relevante
- `content/` – Entradas Markdown usadas como respaldo estático.
- `src/app/` – Rutas públicas y del panel (App Router).
- `src/components/` – Componentes compartidos del sitio.
- `src/server/` – Integraciones con MongoDB, Cloudinary y utilidades de autenticación.
- `src/data/` – Capa de lectura que prioriza MongoDB y recurre a Markdown si no hay base de datos.

## Despliegue
El proyecto es compatible con Vercel y cualquier entorno que soporte aplicaciones Next.js 16. Asegúrate de definir las mismas variables de entorno usadas en local.
