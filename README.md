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
| `RESEND_API_KEY` | (Opcional) API key de Resend para enviar los correos del formulario de contacto. |
| `EMAIL_PROVIDER` | (Opcional) Fuerza el proveedor de correo: `auto` (por defecto), `resend` o `gmail`. |
| `CONTACT_FROM` | (Opcional recomendado) Remitente para los correos de contacto (ej. `contacto@tudominio.com` o tu Gmail). |
| `CONTACT_RECIPIENT` | (Opcional) Email destino para los mensajes; por defecto usa `CONTACT_FROM`. |
| `GMAIL_USER` | (Opcional) Usuario de Gmail para enviar correos vía SMTP. |
| `GMAIL_APP_PASSWORD` | (Opcional) App password de Gmail (16 caracteres) para SMTP seguro. |
| `GMAIL_HOST` | (Opcional) Host SMTP de Gmail, por defecto `smtp.gmail.com`. |
| `GMAIL_PORT` | (Opcional) Puerto SMTP, por defecto `465`. |
| `NEXT_PUBLIC_SITE_URL` | (Opcional) URL pública del sitio (ej. `https://monkmonkeykey.com`) para generar metadatos absolutos de Open Graph/Twitter al compartir enlaces. |

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

## Configurar el envío de correos del formulario de contacto
El formulario de contacto enviará los mensajes por **Resend** o por **Gmail SMTP**. La app elige automáticamente el proveedor:
- En modo `auto` (por defecto): usa **Resend** si existe `RESEND_API_KEY`; si no, usa **Gmail** si existen `GMAIL_USER` y `GMAIL_APP_PASSWORD`.
- Puedes forzarlo con `EMAIL_PROVIDER=gmail` o `EMAIL_PROVIDER=resend`.

### ¿Dónde agrego mi correo y/o la automatización?
- **Correo visible en la página de contacto:** se toma de `contact.email` en `src/content/site.ts` (o desde MongoDB si ya editas el sitio desde `/admin`).
- **Correo destino real de los formularios (automatización):** define `CONTACT_RECIPIENT` en `.env.local`.
- **Remitente del correo automático:** define `CONTACT_FROM` en `.env.local` (recomendado para producción).
- **Regla de fallback importante:** si no defines `CONTACT_RECIPIENT`, la API usa `contact.email` del contenido del sitio; si tampoco existe, devuelve error de configuración.

Ejemplo mínimo en `.env.local`:

```bash
CONTACT_FROM="tuusuario@gmail.com"
CONTACT_RECIPIENT="tuusuario@gmail.com"
```

> Si usas Resend sin `CONTACT_FROM`, la app usará `onboarding@resend.dev` (modo pruebas). Para producción se recomienda siempre un remitente de dominio verificado en Resend.

### Opción A: Resend (recomendado)
Guía paso a paso para vincular el formulario con Resend:

1. **Crea tu cuenta en Resend**
   - Entra a [https://resend.com](https://resend.com) y crea tu cuenta.

2. **Verifica el dominio del remitente (recomendado)**
   - En el panel de Resend abre **Domains** y agrega tu dominio (ej. `tudominio.com`).
   - Copia los registros DNS (SPF/DKIM) que Resend te muestra y pégalos en tu proveedor DNS.
   - Espera a que el estado del dominio aparezca como **Verified**.

3. **(Alternativa rápida) usa un remitente de pruebas**
   - Si todavía no verificas dominio, puedes probar con un remitente sandbox de Resend (según lo permitido en tu cuenta).
   - Para producción, usa siempre un dominio verificado.

4. **Genera una API Key en Resend**
   - Ve a **API Keys** → **Create API Key**.
   - Ponle nombre (ej. `monkmonkeykey-web`) y copia el valor.

5. **Configura variables en tu `.env.local`**
   ```bash
   RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"
   CONTACT_FROM="contacto@tudominio.com"
   CONTACT_RECIPIENT="tu-correo@tudominio.com" # opcional
   ```
   - `CONTACT_FROM`: remitente que verá el receptor.
   - `CONTACT_RECIPIENT`: buzón que recibirá los mensajes del formulario.
   - Si omites `CONTACT_RECIPIENT`, la app usa fallback (`contact.email` del contenido del sitio).

6. **Reinicia tu servidor local**
   - Si `npm run dev` ya estaba corriendo, detenlo y vuelve a iniciarlo para cargar variables nuevas.

7. **Prueba el envío desde el formulario web**
   - Abre `/contacto`, llena el formulario y envía.

8. **Prueba técnica por API (opcional)**
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name":"Prueba Resend",
       "email":"tuusuario@gmail.com",
       "message":"Mensaje de prueba con Resend"
     }'
   ```
   - Si todo está bien, recibirás `{"ok":true}`.

9. **Confirma en el dashboard de Resend**
   - Revisa **Logs** para verificar que el correo se envió sin errores.

Errores comunes en Resend:
- `401/403`: API key inválida o con permisos insuficientes.
- Error de remitente: `CONTACT_FROM` no corresponde a un dominio verificado.
- `500 No contact recipient configured`: define `CONTACT_RECIPIENT` o asegúrate de tener `contact.email` configurado en el contenido del sitio.

### Opción B: Gmail SMTP (paso a paso)
Si vas a usar Gmail (y no dominio con Resend), te recomiendo forzarlo con `EMAIL_PROVIDER=gmail`.

1. **Activa verificación en dos pasos** en tu cuenta Google.
2. Ve a **Cuenta de Google → Seguridad → Contraseñas de aplicaciones**.
3. Crea una contraseña de aplicación para “Correo” y copia los 16 caracteres.
4. Configura `.env.local` así:
   ```bash
   EMAIL_PROVIDER="gmail"
   GMAIL_USER="tuusuario@gmail.com"
   GMAIL_APP_PASSWORD="tu_app_password_de_16_chars"
   CONTACT_FROM="tuusuario@gmail.com"
   CONTACT_RECIPIENT="tuusuario@gmail.com" # o el correo destino real
   ```
5. (Opcional) host/puerto SMTP:
   ```bash
   GMAIL_HOST="smtp.gmail.com"
   GMAIL_PORT="465"
   ```
6. **Importante:** si tienes `RESEND_API_KEY` cargada y no defines `EMAIL_PROVIDER=gmail`, en modo `auto` la app podría intentar Resend primero.
7. Reinicia `npm run dev` para recargar variables.
8. Prueba por terminal:
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name":"Prueba Gmail",
       "email":"tuusuario@gmail.com",
       "message":"Mensaje de prueba desde curl"
     }'
   ```

Checklist rápida para Gmail:
- Si ves errores `535 Authentication failed`, regenera el App Password y verifica que no haya espacios.
- Si ves `SMTP error 534 ... Application-specific password required`, significa que Gmail no acepta tu contraseña normal: debes usar App Password (16 caracteres) con 2FA activa.
- Usa `CONTACT_FROM` igual a `GMAIL_USER` para evitar rechazos del servidor SMTP.
- Si responde `{"ok":true}`, el envío ya quedó funcionando.

> **Nota:** el destinatario final usa `CONTACT_RECIPIENT` si está definido; de lo contrario, se enviará a `CONTACT_FROM`.

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

## Personalizar el ícono del sitio (favicon)
- El favicon actual está en `public/favicon.svg`.
- Next.js lo carga desde `src/app/layout.tsx` en `metadata.icons`.
- Para usar tu propio ícono, reemplaza `public/favicon.svg` por tu archivo (idealmente SVG o PNG cuadrado) y conserva el mismo nombre, o cambia la ruta en `metadata.icons`.
- Si quieres soportar un ícono específico para iPhone/iPad, puedes agregar otro archivo (por ejemplo `public/apple-touch-icon.png`) y actualizar la propiedad `apple` en `metadata.icons`.

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
