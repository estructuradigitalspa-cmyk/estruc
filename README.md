# Estructura Digital — sitio corporativo

Sitio institucional y comercial de **Estructura Digital SPA**, preparado para Vercel, dominio propio y futuros procesos de verificación e integración con Meta. No contiene credenciales ni simula servicios externos activos.

## Stack

Next.js (App Router), TypeScript, React, Tailwind CSS, ESLint, Lucide y Resend opcional.

## Desarrollo local

Requiere Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Variables de entorno

- `CONTACT_TO_EMAIL`: destino del formulario; por defecto `contacto@estructuradigital.cl`.
- `CONTACT_FROM_EMAIL`: remitente verificado en Resend.
- `RESEND_API_KEY`: habilita el envío real. Sin clave, desarrollo registra solo metadatos sanitizados; producción responde con error y no muestra un éxito falso.
- `NEXT_PUBLIC_SITE_URL`: URL canónica, `https://estructuradigital.cl` en producción.
- `META_VERIFY_TOKEN`: token futuro para verificar el webhook.
- `META_APP_SECRET`: secreto futuro para validar firmas. No configurarlo hasta crear la app.

El formulario incluye validación cliente/servidor, honeypot, límite básico por instancia y mensajes reales. Para producción distribuida se recomienda un rate limit persistente (Vercel KV/Upstash). Verifica el dominio remitente en Resend antes de cambiar `CONTACT_FROM_EMAIL`.

## Contenido y datos comerciales

- Datos corporativos y navegación: `lib/site-config.ts`.
- Servicios, método y soluciones: `content/site-content.ts`.
- Textos legales: páginas dentro de `app/privacidad`, `app/terminos` y `app/eliminacion-de-datos`.

Las políticas son una base informativa coherente con el servicio descrito, no asesoría jurídica. Deben revisarse por un profesional antes de producción, especialmente tras definir domicilio, proveedores, contratos, retención y flujos reales de datos.

## Rutas Meta preparadas

- `/api/auth/meta/callback`: responde `501` hasta implementar OAuth.
- `/api/meta/webhook`: permite verificación GET solo con token; POST responde `503` sin secreto y queda pendiente validar `X-Hub-Signature-256` antes de producción.
- `/api/meta/data-deletion`: informa estado no configurado y remite a la página pública.

No hay integración activa ni tokens reales.

## GitHub

```bash
git init
git add .
git commit -m "Initial Estructura Digital website"
git branch -M main
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

Crea antes un repositorio vacío en GitHub. No subas `.env.local`.

## Vercel y dominio

1. En Vercel, selecciona **Add New → Project** e importa el repositorio.
2. Conserva el framework detectado como Next.js y agrega las variables de entorno.
3. Despliega y verifica navegación, formulario y rutas legales.
4. En **Settings → Domains**, agrega `estructuradigital.cl` y `www.estructuradigital.cl`.
5. Copia exactamente los registros DNS que indique Vercel en el proveedor del dominio.
6. Espera la propagación, confirma el certificado HTTPS y define la redirección entre `www` y el dominio raíz.
7. Establece `NEXT_PUBLIC_SITE_URL=https://estructuradigital.cl` y vuelve a desplegar.

## Checklist de producción

- Revisión jurídica de privacidad y términos.
- Confirmar domicilio o zona comercial que se desea publicar.
- Verificar dominio remitente y `RESEND_API_KEY`.
- Añadir rate limiting persistente y política de retención del formulario.
- Configurar analítica/cookies solo con aviso y consentimiento cuando aplique.
- Crear la app de Meta por separado; luego validar firmas, OAuth, callbacks y permisos mínimos.
- Verificar URLs legales en Meta, DNS, HTTPS, favicon, Open Graph, sitemap y robots.
- Ejecutar `npm run lint`, `npm run typecheck` y `npm run build`.

## MVP SaaS y Supabase

Las rutas `/app/*` requieren Supabase Auth. Sin variables configuradas, el sistema muestra un estado de configuración y no simula sesiones.

### Crear el proyecto Supabase

1. Crea un proyecto exclusivo para Estructura Digital.
2. En **SQL Editor**, ejecuta `supabase/migrations/202607290001_initial_multitenant.sql`.
3. Configura la URL del sitio y redirects permitidos para `/auth/callback`.
4. Copia URL, Anon Key y Service Role a variables locales y de Vercel. La Service Role nunca debe usar el prefijo `NEXT_PUBLIC_`.
5. Habilita confirmación por correo antes de producción y personaliza las plantillas.

La migración crea tablas, índices, trigger de perfil, función transaccional de onboarding, roles y políticas RLS. `supabase/seed.sql` no contiene datos ficticios.

### Rutas SaaS

- Autenticación: `/registro`, `/iniciar-sesion`, `/recuperar-contrasena`, `/auth/callback`.
- Onboarding: `/onboarding`.
- Panel: `/app/inicio`, contactos, conversaciones, CRM, tareas, automatizaciones, integraciones, equipo y configuración.
- WhatsApp: `/app/integraciones/whatsapp`, preparada sin simular Embedded Signup.

### Meta

Documentación en `docs/meta-app-review.md`, `docs/meta-architecture.md`, `docs/security-model.md` y `docs/data-flow.md`.

El webhook POST requiere `META_APP_SECRET` para validar `X-Hub-Signature-256` y `SUPABASE_SERVICE_ROLE_KEY` para persistir eventos idempotentes. No se deben reutilizar credenciales de otras aplicaciones.

### Pruebas

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Las pruebas sin una instancia Supabase validan contratos de esquema, RLS, idempotencia, seguridad Meta, formulario y presencia de rutas. Antes de producción se deben agregar pruebas de integración contra un proyecto Supabase aislado.

### Checklist adicional de producción

- [ ] Proyecto Supabase exclusivo y migración aplicada.
- [ ] Redirects de Auth y correo transaccional configurados.
- [ ] Variables Supabase y Resend cargadas en Vercel.
- [ ] Rate limiting distribuido para contacto y endpoints sensibles.
- [ ] Revisión jurídica de políticas.
- [ ] Pruebas de aislamiento con usuarios reales en dos organizaciones de ensayo.
- [ ] App de Meta propia, Embedded Signup y permisos mínimos.
- [ ] Rotación, cifrado y retención de tokens definidos.
