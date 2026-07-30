# Auditoría independiente de aplicaciones Meta

Fecha de observación directa: 2026-07-30
Sitio canónico: `https://estructuradigital.cl`
Portfolio comercial observado: Estructura Digital (`2547382349033802`)
Alcance: lectura directa en Meta Developers, contraste con el repositorio y validaciones locales. No se publicó, no se envió App Review, no se solicitaron permisos, no se modificó Business Verification, no se registraron números, no se crearon WABA y no se cambiaron secretos ni IDs.

## Dictamen

Las dos apps **no están listas para producción**. El código separa razonablemente las credenciales y responsabilidades, pero la configuración real de Meta contiene bloqueos y discrepancias.

Hallazgos críticos:

1. El App ID real de Login queda confirmado como `1048232064232330` en Meta Developers y en el proveedor Facebook de Supabase. El valor anterior `1048230264232330` era incorrecto y queda solo como antecedente histórico.
2. La app Login está sin publicar y Meta la declara no elegible para envío: faltan ícono 1024×1024, Privacy URL, Data Deletion válida y categoría.
3. En Login, Terms URL y Data Deletion apuntan a `https://www.facebook.com/`; son valores incorrectos.
4. Login no tiene App Domains ni dominio avanzado, aunque el OAuth de Supabase está correctamente limitado al callback `https://ocmcyhimhndlxlicojrs.supabase.co/auth/v1/callback`.
5. La app Business está sin publicar. Sus permisos `whatsapp_business_management` y `whatsapp_business_messaging` están solo “Listo para la prueba”; no hay evidencia de Advanced Access aprobado.
6. Business muestra el producto “Inicio de sesión con Facebook para empresas”. Este producto es coherente únicamente si se usa como soporte de Embedded Signup; no debe utilizarse como login de usuarios del SaaS.
7. Business tiene en Administrador de dominios `http://estructuradigital.cl/`, incompatible con el sitio canónico HTTPS.
8. Business tiene `www.estructuradigital.cl` y el dominio Supabase, pero no el dominio raíz `estructuradigital.cl` en App Domains.
9. Las páginas de Meta observadas no exponen una Configuration ID cargada; el repositorio documenta `2608678896249332`, pero no pudo confirmarse directamente en la pantalla por un estado de carga incompleto de Meta.
10. Business muestra tareas de onboarding para webhook, número, pago y mensaje. La revalidación confirma callback, verify token y `messages` suscrito; la tarjeta de webhook es un recordatorio visual.

## Inventario

### App Login

- Nombre observado: Estructura Digital Login
- ID observado en Meta: `1048232064232330`
- ID indicado en la orden: `1048230264232330`
- Estado: Sin publicar
- Caso de uso instalado: Inicio de sesión de Facebook
- Permisos agregados: `email`, `public_profile`
- Webhook de objeto User: superficie disponible, sin callback ni verify token configurados; innecesario
- WhatsApp: no instalado
- Business Manager: Estructura Digital (`2547382349033802`)
- Rol visible: Sebastian Alejandro — Administrador
- Usuarios de prueba: 0

### App Business

- Nombre observado: Estructura Digital
- ID: `2487731658317049`
- Estado: Sin publicar
- Caso de uso instalado: WhatsApp Business Messaging
- Producto visible: Inicio de sesión con Facebook para empresas (debe limitarse a Embedded Signup)
- Permisos agregados: `public_profile`, `whatsapp_business_management`, `whatsapp_business_messaging`
- Permisos disponibles pero no agregados: `business_management`, `email`, `manage_app_solution`, `whatsapp_business_manage_events`
- Business Manager: Estructura Digital (`2547382349033802`)
- Rol visible: Sebastian Alejandro — Administrador
- Usuarios de prueba: 0

## Matriz completa de verificaciones

Estados: **OK**, **Error**, **Riesgo**, **Pendiente**, **N/A**, **No verificable**.

| # | Configuración | Login | Business | Estado / recomendación |
|---:|---|---|---|---|
| 1 | Identidad de app | Estructura Digital Login | Estructura Digital | OK |
| 2 | App ID indicado vs Meta | No coincide | Coincide | Error crítico: confirmar Login |
| 3 | App ID en código público | Variable de entorno | Variable de entorno | OK |
| 4 | Display Name | Correcto | Correcto | OK |
| 5 | Contact Email | contacto@estructuradigital.cl | contacto@estructuradigital.cl | OK |
| 6 | Privacy Policy URL | Vacía | `/privacy` | Error Login; Business válida pero estandarizar a `/privacidad` |
| 7 | Terms URL | facebook.com | `/terms` | Error Login; Business válida pero estandarizar a `/terminos` |
| 8 | Data Deletion modalidad | Instrucciones | Callback | Login debe usar URL propia; Business correcta |
| 9 | Data Deletion URL | facebook.com | `/api/meta/data-deletion` | Error Login |
| 10 | App Icon | Ausente | Presente | Error Login |
| 11 | Icon 1024×1024 | Ausente | No se verificó dimensión | Pendiente |
| 12 | Namespace | Vacío | Vacío | Aceptable si no se usa |
| 13 | Category | Vacía | Negocios y páginas | Error Login |
| 14 | Business asociado | Estructura Digital | Estructura Digital | OK |
| 15 | Business ID | 2547382349033802 | 2547382349033802 | OK |
| 16 | Owner visible | Business Manager | Business Manager | OK |
| 17 | Organización | Estructura Digital | Estructura Digital | OK |
| 18 | Región | No expuesta | No expuesta | No verificable |
| 19 | Idioma de consola | Español | Español | Informativo |
| 20 | Tipo de app | Caso Facebook Login | Caso Business/WhatsApp | Coherente |
| 21 | Estado publicación | Sin publicar | Sin publicar | Bloqueo producción |
| 22 | Elegibilidad de envío | No elegible | No confirmada | Error Login |
| 23 | App Domains raíz | Ausente | Ausente | Error |
| 24 | App Domains www | Ausente | Presente | Login falta |
| 25 | App Domains Supabase | Ausente | Presente | Sobra en Business salvo necesidad demostrada |
| 26 | Dominio canónico | No configurado | Parcial | Error |
| 27 | Plataforma Website | No observada | No observada | Pendiente |
| 28 | Site URL | No observada | No observada | Pendiente |
| 29 | Redirect www→raíz en código | Sí | Sí | OK |
| 30 | Contacto DPO | Vacío | Vacío | Evaluar legalmente |
| 31 | País DPO | United States por defecto | United States por defecto | Riesgo de valor por defecto incoherente con Chile |
| 32 | Dirección DPO | Vacía | Vacía | Pendiente legal |
| 33 | Client Token | Presente, no documentado | Presente, no documentado | OK; no rotar |
| 34 | App Secret | Oculto | Oculto | OK; no revelar/rotar |
| 35 | Secret separado en repo | `META_LOGIN_APP_SECRET` | `META_BUSINESS_APP_SECRET` | OK |
| 36 | Fallback secreto heredado | No | Sí, `META_APP_SECRET` | Riesgo: retirar tras migración |
| 37 | API Version app roles | v26.0 | v26.0 | OK |
| 38 | API Version all calls | v26.0 | v26.0 | OK |
| 39 | API Version repositorio | v26.0 | v26.0 | OK |
| 40 | Upgrade API settings | Sin upgrades pendientes visibles | Sin upgrades pendientes visibles | No concluyente |
| 41 | Native/Desktop app | Desactivado | Desactivado | OK |
| 42 | Authorization callback advanced | Vacío | Vacío | OK si no es app nativa |
| 43 | Client OAuth Login | Activado | No aplica al login SaaS | OK Login |
| 44 | Web OAuth Login | Activado | No debe usarse para login SaaS | OK Login |
| 45 | Force HTTPS | Activado y bloqueado | No observado en producto WA | OK Login |
| 46 | Force Web Reauth | Desactivado | N/A | OK |
| 47 | Embedded Browser Login | Desactivado | N/A | OK Login |
| 48 | Strict Redirect Matching | Activado | N/A | OK Login |
| 49 | Device OAuth Login | Desactivado | N/A | OK |
| 50 | JavaScript SDK Login | Desactivado | SDK usado solo para Embedded Signup | OK separación |
| 51 | JS SDK allowed domains | Vacío | No observado | OK si SDK Login no se usa |
| 52 | Supabase redirect URI | Callback exacto presente | N/A | OK |
| 53 | Redirect URI raíz app | No agregado | N/A | Correcto: Supabase recibe OAuth |
| 54 | Redirect URI localhost | No agregado | N/A | Correcto para producción |
| 55 | Logout URL Meta | No expuesta | N/A | No verificable |
| 56 | Deauthorization callback | `/iniciar-sesion` | N/A | Riesgo: no procesa revocación; usar endpoint dedicado si se necesita |
| 57 | OAuth state app | Gestionado por Supabase | HMAC+nonce propio | OK |
| 58 | OAuth next/returnTo | Ruta interna sanitizada | N/A | OK |
| 59 | OAuth code exchange | Supabase server | Backend Business | OK |
| 60 | OAuth secrets en cliente | No | No | OK |
| 61 | Alcohol restriction | Desactivada | Desactivada | OK |
| 62 | Social discovery | Activada | Activada | Riesgo/innecesaria para ambas |
| 63 | Age restriction | 13+ | 13+ | Revisar política de producto |
| 64 | GDPR age restriction | Desactivada | Desactivada | Evaluar legalmente |
| 65 | Country restriction | Desactivada | Desactivada | OK si servicio global |
| 66 | Server IP allow list | Vacía | Vacía | Riesgo; Vercel no ofrece egress fijo por defecto |
| 67 | Settings update IP allow list | Vacía | Vacía | Riesgo |
| 68 | Security notification email | Vacío | contacto@estructuradigital.cl | Error Login |
| 69 | Require App Secret Proof | Desactivado | Desactivado | Recomendado activar donde SDK/Graph lo soporte |
| 70 | Require 2FA for settings | Desactivado | Desactivado | Riesgo alto |
| 71 | API access to app settings | Desactivado/no marcado | Desactivado/no marcado | OK, mantener |
| 72 | Advanced domain manager | Sin dominios | `http://estructuradigital.cl/` | Error Business |
| 73 | HTTPS domain manager | Ausente | Ausente | Pendiente |
| 74 | App Facebook Page | No asociada | Estructura Digital asociada | Login N/A; Business OK |
| 75 | Ad accounts allow list | 0 | 0 | OK |
| 76 | Cross-domain share redirects | Desactivado | Desactivado | OK |
| 77 | Security headers app | CSP presente | CSP presente | OK |
| 78 | HSTS | No configurado en repo | No configurado en repo | Riesgo |
| 79 | X-Content-Type-Options | `nosniff` | `nosniff` | OK |
| 80 | Referrer-Policy | strict-origin-when-cross-origin | Igual | OK |
| 81 | Permissions-Policy | Restrictiva | Restrictiva | OK |
| 82 | Frame ancestors | self | self | OK |
| 83 | CSP Facebook scripts | Permitidos | Permitidos | Necesario Embedded Signup |
| 84 | CSP Graph connect | Permitido | Permitido | OK |
| 85 | CSP Supabase connect | Permitido | Permitido | OK |
| 86 | CORS global | No abierto | No abierto | OK |
| 87 | Allowed mutation origins | raíz + www | raíz + www | OK |
| 88 | Localhost en producción | No | No | OK |
| 89 | Webhook callback repo | N/A | `/api/meta/webhook` | OK |
| 90 | Webhook callback Meta | User vacío | `https://estructuradigital.cl/api/meta/webhook` | OK Business |
| 91 | Verify token repo | N/A | `META_VERIFY_TOKEN` | OK |
| 92 | Verify token Meta | Vacío | Configurado y enmascarado | OK Business |
| 93 | Webhook signature | N/A | X-Hub-Signature-256 | OK código |
| 94 | Webhook secret correcto | N/A | Business secret | OK código |
| 95 | Webhook object | User innecesario | WhatsApp Business Account esperado | Login sobra superficie |
| 96 | Webhook fields | Ninguno | `messages` suscrito v26.0 | OK Business |
| 97 | Webhook response | N/A | Respuesta rápida 200 | OK código |
| 98 | Webhook idempotencia | N/A | event_key + upsert | OK |
| 99 | Webhook worker | N/A | Cron diario 03:17 | Riesgo: frecuencia insuficiente para tiempo real/reintentos |
| 100 | Webhook rate limits | No aplica | Implementados app/usuario | Parcial |
| 101 | Facebook Login instalado | Sí | Login for Business visible | Business solo para Embedded Signup |
| 102 | WhatsApp instalado | No | Sí | OK |
| 103 | Webhooks instalado | Superficie User | Integrado en WhatsApp | Login innecesario |
| 104 | Marketing API | No observado | No observado | No instalar |
| 105 | Messenger | No observado | No observado | No instalar |
| 106 | Instagram | No observado | No observado | No instalar |
| 107 | Conversions API | No observado | No observado | No instalar |
| 108 | `public_profile` | Agregado, necesario | Agregado automáticamente | Login necesario; Business tolerado por plataforma |
| 109 | `email` | Agregado, necesario | No agregado | OK |
| 110 | `whatsapp_business_management` | No | Agregado, prueba | Necesario; falta Advanced Access |
| 111 | `whatsapp_business_messaging` | No | Agregado, prueba | Necesario; falta Advanced Access |
| 112 | `business_management` | No | No agregado | No solicitar salvo requisito demostrable |
| 113 | `manage_app_solution` | No | No agregado | Innecesario |
| 114 | `whatsapp_business_manage_events` | No | No agregado | Innecesario para alcance actual |
| 115 | Otros user permissions | Disponibles, no agregados | N/A | OK |
| 116 | App Review enviado | No | No | Correcto |
| 117 | Advanced Access | No necesario para básicos | No aprobado visible | Bloqueo |
| 118 | Business Verification | Portfolio asociado | En revisión; información enviada | Depende de Meta; no modificar |
| 119 | Technology Provider | N/A | Bloqueado según docs previos | Pendiente |
| 120 | Embedded Signup Config ID | N/A | Repo: `2608678896249332` | No verificado en Meta |
| 121 | Config ID usa Business App | N/A | Sí en código | OK |
| 122 | Embedded Signup response type | N/A | `code` | OK |
| 123 | Embedded Signup state | N/A | HMAC + nonce | OK |
| 124 | Embedded Signup origin parsing | N/A | Validado | OK |
| 125 | WABA ID | N/A | Dinámico por organización | Correcto diseño |
| 126 | Phone Number ID | N/A | Dinámico por organización | Correcto diseño |
| 127 | Business ID | N/A | Devuelto/validado parcialmente | Riesgo: no se consulta relación business↔WABA |
| 128 | WABA subscription | N/A | POST `subscribed_apps` | OK código |
| 129 | Phone belongs to WABA | N/A | Validado por Graph | OK |
| 130 | Access token storage | N/A | AES-256-GCM versionado | OK |
| 131 | Token fallback global | N/A | Desactivable, default false | OK |
| 132 | Disconnect/revoke | N/A | Rutas presentes | Revalidar contra Meta real |
| 133 | Templates | N/A | Producto visible | No auditable sin assets reales |
| 134 | Número registrado | N/A | Meta lo marca pendiente | Bloqueo esperado |
| 135 | WABA creada | N/A | No confirmada | No crear |
| 136 | Pago configurado | N/A | Meta lo marca pendiente | No requerido para auditoría |
| 137 | Mensaje real probado | N/A | Meta lo marca pendiente | No validar como exitoso |
| 138 | Roles administradores | 1 visible | 1 visible | OK si único owner autorizado |
| 139 | Roles desarrolladores | 0 visibles | 0 visibles | OK |
| 140 | Roles testers | 0 visibles | 0 visibles | OK |
| 141 | Usuarios de prueba | 0 | 0 | Faltarán para App Review reproducible |
| 142 | Usuarios BM no listados | Posibles | Posibles | Auditar en Business Settings manualmente |
| 143 | Usuarios innecesarios | Ninguno visible | Ninguno visible | No concluyente por BM |
| 144 | Producción Facebook Login | No validada end-to-end | N/A | Bloqueada por app sin publicar |
| 145 | Producción Supabase OAuth | Callback coherente | N/A | Configuración compatible; prueba real no ejecutada |
| 146 | Producción webhooks | N/A | Callback, token y `messages` confirmados | OK configuración; falta evento real |
| 147 | Producción Embedded Signup | N/A | Código preparado | Bloqueado por Meta/aprobaciones |
| 148 | Códigos y textos UTF-8 | Mojibake visible en archivos | Mojibake visible | Error de calidad, no corregido por cambios ajenos |
| 149 | URLs legales duplicadas | `/privacy` y `/privacidad` | `/terms` y `/terminos` | Riesgo de consistencia; elegir canónicas |
| 150 | Documentación vs Meta | Declara login funcionando | Declara webhook/config completa | Discrepancia: Meta muestra pendientes |
| 151 | Fallback env legacy | N/A | `META_APP_ID`, `META_CONFIG_ID` | Retirar después de migración segura |
| 152 | Secretos en documentación | No | No | OK |
| 153 | IDs sensibles en documentación | Solo IDs públicos | Solo IDs públicos | OK |
| 154 | Rate limit Graph API | Supabase gestiona login | Sin backoff global explícito | Riesgo |
| 155 | Retry Graph API | Supabase | Worker reintenta eventos, no todas llamadas | Parcial |
| 156 | Graph error sanitization | Supabase | Implementada | OK |
| 157 | CSP allowed origins Meta | No JS login | SDK Business permitido | OK separación |
| 158 | Callback Data Deletion firmado | No configurado | Implementado | Login debe apuntar a endpoint compatible con su secret |
| 159 | Data deletion por app secret | Prueba Login secret | Prueba Business secret | OK: exige coincidencia única y registra `app_type` |
| 160 | Checklist final | Incompleto | Incompleto | No publicar |

## Errores, configuraciones antiguas y riesgos

### Críticos

- El ID Login vigente está confirmado; el ID transpuesto anterior queda solo como antecedente histórico.
- Metadatos legales inválidos o ausentes en Login.
- App Domains ausentes para el dominio raíz.
- Advanced Access no aprobado para WhatsApp.
- Configuration ID de Embedded Signup todavía requiere contraste final antes del onboarding real.

### Altos

- `http://estructuradigital.cl/` heredado en el Administrador de dominios de Business.
- 2FA para cambios de configuración desactivado en ambas apps.
- “Requerir clave secreta de la app/App Secret Proof” desactivado.
- Documentación interna afirma estados más avanzados que la consola real.
- Endpoint de desautorización Login apunta a una página de login, no a un procesador de revocación.
- El endpoint compartido de Data Deletion prueba ambos secretos, exige una única coincidencia y registra `app_type`; mantener pruebas de regresión para este contrato.

### Medios

- Social discovery activado sin necesidad.
- País DPO por defecto United States pese a operación chilena.
- Cron del worker una vez al día no es suficiente como estrategia de recuperación operativa.
- Fallbacks heredados `META_APP_*` y `META_CONFIG_ID` permiten mezclar credenciales.
- Mojibake visible en archivos fuente y documentación.
- Duplicidad de rutas legales en español e inglés sin canonicalización explícita.

## Configuración recomendada

### Login

- Confirmar el App ID real antes de tocar variables.
- Mantener solo Facebook Login, `public_profile` y `email`.
- App Domains: `estructuradigital.cl` y `www.estructuradigital.cl`.
- Privacy: `https://estructuradigital.cl/privacidad`.
- Terms: `https://estructuradigital.cl/terminos`.
- Data Deletion: endpoint o instrucciones propios validados con el secret de Login.
- Subir `public/branding/app-icon.png` solo después de verificar 1024×1024 y branding.
- Categoría: Negocios y páginas.
- Mantener Client OAuth, Web OAuth, HTTPS y Strict Mode activados.
- Mantener Embedded Browser, Device OAuth y JS SDK Login desactivados.
- Mantener como única redirect URI de Meta la de Supabase.
- Quitar/ignorar Webhooks User si Meta permite retirarlo sin afectar el caso de uso.

### Business

- Mantener solo WhatsApp Business y las piezas de Facebook Login for Business estrictamente requeridas por Embedded Signup.
- No usar esta app como proveedor OAuth de Supabase ni login del SaaS.
- App Domains: raíz y www; conservar Supabase solo si Meta demuestra que la configuración lo necesita.
- Reemplazar el dominio avanzado HTTP por `https://estructuradigital.cl/` solo con respaldo y validación.
- Mantener únicamente `whatsapp_business_management` y `whatsapp_business_messaging`; agregar `business_management` solo si Meta lo exige y existe función demostrable.
- Completar Business Verification, Technology Provider, Advanced Access y App Review mediante intervención manual posterior.
- Confirmar Configuration ID, callback, verify token, objeto `whatsapp_business_account`, campo `messages`, WABA y suscripción desde la consola real.

## Cambios realizados

No se realizaron cambios en Meta. Razones:

- Las correcciones externas requieren guardar formularios y, por seguridad, confirmación inmediatamente antes del envío.
- El App ID de Login es ambiguo.
- Varias correcciones aparentemente simples pueden afectar OAuth activo o App Review.
- El worktree ya contenía cambios del usuario en `lib/whatsapp.ts`, `lib/whatsapp-template.ts`, `package.json` y `package-lock.json`; se preservaron.

El único cambio local de esta auditoría es este documento.

## Cambios manuales pendientes

1. Confirmar si el ID correcto de Login es `1048232064232330`.
2. Corregir metadatos básicos de Login.
3. Auditar personas con acceso desde Business Settings, no solo Roles de la app.
4. Activar 2FA para cambios de configuración mediante decisión del owner.
5. Resolver dominio HTTP heredado con respaldo.
6. Confirmar Configuration ID y ejecutar un evento webhook real con número conectado.
7. Completar las aprobaciones de Meta sin publicar.
8. Crear posteriormente activos y cuenta de revisión controlados; no usar clientes reales.

## Checklist final de producción

- [x] App ID Login confirmado en Meta y Supabase.
- [ ] Variables de producción coinciden con ambos IDs confirmados.
- [ ] Login tiene ícono 1024×1024, categoría y URLs legales propias.
- [ ] Login tiene App Domains raíz y www.
- [x] Login usa callback exacto de Supabase.
- [x] Login usa solo `email` y `public_profile`.
- [ ] Facebook Login probado con usuario no administrador en modo permitido.
- [ ] Supabase OAuth probado desde inicio hasta sesión y logout.
- [ ] Business no se usa como OAuth de usuarios.
- [ ] Dominio HTTP heredado eliminado/reemplazado con respaldo.
- [ ] Configuration ID confirmado en Meta y Vercel.
- [x] Webhook callback y verify token confirmados en Meta.
- [x] Suscripción `messages` v26.0 confirmada.
- [ ] Handshake GET confirmado contra producción.
- [ ] Firma POST confirmada con evento real.
- [ ] WABA/Phone/Business pertenecen al mismo onboarding.
- [ ] Business Verification aprobada.
- [ ] Technology Provider aprobado si aplica.
- [ ] Advanced Access aprobado para ambos permisos WhatsApp.
- [ ] App Review aprobado.
- [ ] Cuenta y activos de revisión reproducibles.
- [ ] Alertas de Meta resueltas.
- [ ] 2FA de cambios de configuración activado.
- [ ] Secretos separados y fallbacks heredados retirados.
- [ ] No hay secretos en cliente, logs o documentación.
- [ ] Monitoreo y reintentos operativos definidos.
- [ ] Pruebas, typecheck, lint y build pasan en commit limpio.
- [ ] Solo entonces solicitar autorización expresa para publicar.

## Validación final

- Facebook Login: **configuración OAuth compatible, no validado end-to-end**. La app está sin publicar y tiene bloqueos de metadatos.
- Supabase OAuth: **callback exacto confirmado**, pero no se ejecutó una autenticación real durante la auditoría.
- Webhooks: **callback, verify token y suscripción `messages` v26.0 confirmados en Meta**; la tarjeta pendiente es un recordatorio del onboarding. Falta una prueba real con número conectado.
- Embedded Signup: **código preparado, Configuration ID documentada pero no confirmada en la consola**.
- Regresión: no se modificó ninguna configuración externa ni código de runtime, por lo que la auditoría no empeoró el estado previo.

Conclusión: no hacer commit/push como “producción lista”. El documento puede commitearse como evidencia de auditoría una vez que las validaciones locales pasen; la publicación y las correcciones Meta continúan bloqueadas.

## Revalidación de producción — 2026-07-30

- App Login confirmada en Meta y Supabase: `1048232064232330`.
- App Business confirmada en Meta: `2487731658317049`.
- Supabase tiene Facebook habilitado, el Client ID correcto y callback `https://ocmcyhimhndlxlicojrs.supabase.co/auth/v1/callback`.
- Business Verification figura **En revisión**; Meta confirma que la información fue enviada.
- Webhook Business: callback productivo presente, verify token configurado/enmascarado y campo `messages` **Suscritos** en v26.0. La tarjeta de tarea es un recordatorio visual, no evidencia de fallo.
- Vercel: el proyecto local enlazado `estruct` (`prj_791LY1sMQRo2cR4ZFYhBDFjO9HA8`) no lista variables. Esto contradice documentación previa y bloquea declarar producción lista hasta confirmar el proyecto/entorno correcto.
- Checklist ejecutable: `docs/meta-production-checklist.md`.
