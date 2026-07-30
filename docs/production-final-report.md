# Informe técnico final de producción — Estructura Digital SaaS

Fecha de corte: 2026-07-30

## Estado ejecutivo

El proyecto canónico es `estructuradigitalspa-cmyks-projects/estruct`. Vercel muestra `estructuradigital.cl` y `www.estructuradigital.cl` asociados a Production; `www` tiene configuración válida y el apex funciona con el registro A legacy admitido por Vercel, aunque recomienda migrarlo al CNAME nuevo. No se tocó Business Verification, no se publicó la app, no se registró un número, no se agregó un medio de pago y no se envió ninguna plantilla.

## Arquitectura

Next.js 16 en Vercel usa Supabase Auth/Postgres. La sesión y organización activa limitan cada operación; RLS y roles Owner/Admin/Agent/Viewer refuerzan el aislamiento. Facebook Login se configura en Supabase con la app Login. WhatsApp usa la app Business, Embedded Signup, Graph API y webhook firmado. Tokens Meta se cifran con AES-256-GCM versionado.

## Variables utilizadas — solo nombres

`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `META_LOGIN_APP_ID`, `META_LOGIN_APP_SECRET`, `META_BUSINESS_APP_ID`, `META_BUSINESS_APP_SECRET`, `META_BUSINESS_CONFIG_ID`, `META_GRAPH_API_VERSION`, `META_VERIFY_TOKEN`, `META_OAUTH_STATE_SECRET`, `META_TOKEN_ENCRYPTION_KEY_V1`, `META_TOKEN_ENCRYPTION_KEY_V2`, `META_TOKEN_ENCRYPTION_ACTIVE_VERSION`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `CONTACT_REPLY_TO_EMAIL`, `CRON_SECRET`, `WEBHOOK_WORKER_BATCH_SIZE` y `RATE_LIMIT_*`.

Variables heredadas, solo durante transición: `META_APP_ID`, `META_APP_SECRET`, `META_CONFIG_ID`, `META_TOKEN_ENCRYPTION_KEY`. El fallback global WhatsApp está bloqueado en producción por código.

## Estado de infraestructura

- Team correcto comprobado en Vercel: `estructuradigitalspa-cmyks-projects`.
- Proyecto correcto: `estruct`.
- Se detectó un segundo proyecto `estruc`; no tiene el dominio canónico.
- El Vercel CLI local está autenticado en otra cuenta/equipo y no debe utilizarse para desplegar este proyecto hasta cambiar su sesión.
- El deployment del commit `e0e6fa6` aparece en el proyecto correcto y el dominio canónico está asociado a él.
- DNS Cloudflare: apex `A 76.76.21.21`, DNS only, TTL Auto; `www CNAME 01d0cd82ae83a0c8.vercel-dns-017.com`, DNS only, TTL Auto.
- Vercel confirma que el A legacy sigue funcionando; recomienda apex `CNAME 01d0cd82ae83a0c8.vercel-dns-017.com`, DNS only. No se cambió automáticamente porque Cloudflare exige reemplazar el registro productivo y no era necesario para disponibilidad.

## Separación Meta

El código concentra el fallback heredado en `lib/meta-env.ts`. OAuth/Embedded Signup/Graph/webhook usan helpers Business. Facebook Login es administrado por Supabase con las credenciales de la app Login; `META_LOGIN_APP_SECRET` se usa adicionalmente para validar solicitudes de eliminación de esa app.

En Vercel Production se agregaron los tres identificadores no secretos separados. Faltan `META_LOGIN_APP_SECRET` y `META_BUSINESS_APP_SECRET`. No se retiraron variables heredadas.

## Resend

El panel requiere login y Vercel no contiene `RESEND_API_KEY`. From esperado: `Estructura Digital <contacto@estructuradigital.cl>`. Contacto usa Reply-To del visitante; invitaciones usan `CONTACT_REPLY_TO_EMAIL`. Sin key, ambos flujos fallan cerrado y no afirman entrega. Los valores DNS deben copiarse literalmente desde Resend después del login; ver `docs/resend-production.md`.

## AES v2

Código compatible con ciphertext v1/v2, versión activa configurable, backup tenant-account, compare-and-swap, reintentos transitorios y dry-run por defecto. La migración `202607300005_credential_rotation.sql` y su rollback están preparados, no aplicados. No existe clave v2 productiva y no se rotaron credenciales.

## WhatsApp

La base conserva Business/WABA/Phone Number ID, número visible, nombre verificado, calidad/registro, token cifrado y organización. El envío obtiene exclusivamente la cuenta conectada del tenant. Se corrigió el envío para que no vuelva a marcar una integración conectada como `test`.

La plantilla Utility `confirmacion_solicitud` tiene payload Graph API tipado y probado. La migración `202607300006_whatsapp_templates.sql` prepara catálogo tenant-scoped y no fue aplicada. Procedimientos de número, OTP, pago, plantilla y estados están en `docs/whatsapp-production-onboarding.md`.

## Vulnerabilidades

Next.js 16.2.12 es la última versión estable. Su dependencia opcional declara `sharp ^0.34.5`; el lockfile instalaba 0.34.5, afectado por avisos altos. Se probó `sharp 0.35.3` mediante override sin downgrade: `npm ls` resuelve 0.35.3 y `npm audit --omit=dev` informa cero vulnerabilidades. La promoción queda condicionada a la suite completa final.

## Validación ejecutada

- Instalación limpia: `npm ci`, aprobada.
- Lint: aprobado.
- Typecheck: aprobado.
- Tests: 121/121 en 23 archivos.
- Cobertura: 91.26% statements, 78.98% branches, 83.78% functions y 98.96% lines.
- Build local Next.js: aprobado, 38 páginas/rutas generadas.
- `npm audit --omit=dev`: cero vulnerabilidades.
- Supabase local desde cero: seis migraciones aplicadas.
- DB lint: sin errores.
- RLS multiempresa, ciphertext y catálogo de plantillas: aprobado y transacción revertida.
- Escaneo de secretos: solo fixtures explícitos de prueba; no se agregaron valores reales.
## Migraciones

Preparadas y no aplicadas:

- `202607300005_credential_rotation.sql`.
- `202607300006_whatsapp_templates.sql`.

Ambas tienen scripts de rollback manual. No hubo cambios ni borrados en producción.

## Meta y lanzamiento público

Business Verification permanece en proceso según Meta. Technology Provider, Advanced Access, App Review y publicación siguen bloqueados o pendientes. Se mantienen los permisos mínimos `whatsapp_business_management` y `whatsapp_business_messaging`; `business_management` solo se solicitará si Meta demuestra que es indispensable.

## Pendientes manuales

1. Iniciar sesión en Resend, crear/verificar dominio, crear key mínima y guardarla en Vercel Production.
2. Copiar de forma segura los secretos separados Login/Business a Vercel y redeploy.
3. Decidir si reemplazar el A apex legacy por el CNAME recomendado; no es un incidente de disponibilidad.
4. Esperar la verificación Meta antes de registrar número, agregar pago o enviar plantilla.
5. Autorizar respaldo, aplicación de migraciones y rotación AES v2.
6. Crear usuario/activos de prueba y video final cuando Embedded Signup real esté habilitado.