# Checklist final de producción Meta

Fecha de corte: 2026-07-30

Apps confirmadas:

- Login — Estructura Digital Login — `1048232064232330`.
- Business — Estructura Digital — `2487731658317049`.
- Portfolio — Estructura Digital — `2547382349033802`.
- Supabase — Estructura Digital SaaS — `ocmcyhimhndlxlicojrs`.
- Configuration ID documentada — `2608678896249332`.

Leyenda: ✅ Codex puede resolverlo en el repositorio. ⚠️ Requiere autorización antes de cambiar un servicio externo. ❌ Solo propietario/Meta/cliente.

## Pendientes priorizados

| Prioridad | Área | Problema | Estado actual | Acción | Manual / Automática | Bloquea producción | Tiempo |
| --------- | ---- | -------- | ------------- | ------ | ------------------- | ------------------ | ------ |
| CRÍTICO | Login / elegibilidad | App no elegible para envío | Meta exige icono, Privacy, Data Deletion y categoría | Completar campos sin publicar | ⚠️ Autorización | Sí | 20–40 min |
| CRÍTICO | Login / Privacy | URL vacía | Sin URL en Meta | Usar `https://estructuradigital.cl/privacidad` | ⚠️ Autorización | Sí | 3 min |
| CRÍTICO | Login / Terms | Apunta a Facebook | `https://www.facebook.com/` | Usar `https://estructuradigital.cl/terminos` | ⚠️ Autorización | Sí | 3 min |
| CRÍTICO | Login / Data Deletion | URL pública no normalizada | Rutas duplicadas | Usar https://estructuradigital.cl/eliminacion-de-datos | ⚠️ Autorización | Sí | 3 min |
| CRÍTICO | Login / Data Deletion | Apunta a Facebook | Instrucciones incorrectas | Usar endpoint/instrucciones propios y probar firma Login | ⚠️ Autorización | Sí | 15–30 min |
| CRÍTICO | Login / Domains | App Domains vacíos | Sin dominio raíz ni www | Agregar raíz y www | ⚠️ Autorización | Sí | 5 min |
| CRÍTICO | Login / Site URL | Website/Site URL no confirmado | No visible | Configurar sitio HTTPS canónico | ⚠️ Autorización | Sí | 5 min |
| CRÍTICO | Vercel / proyecto | Proyecto enlazado no lista variables | `estruct`, ID `prj_791LY1sMQRo2cR4ZFYhBDFjO9HA8`, cero variables | Confirmar que es el proyecto productivo correcto | ❌ Propietario Vercel | Sí | 20–60 min |
| CRÍTICO | Vercel / Meta IDs | IDs no verificables en entorno | Docs afirman que existen, CLI lista cero | Configurar/confirmar ambos App IDs y Config ID | ❌ Propietario Vercel | Sí | 10 min |
| CRÍTICO | Vercel / secrets | Secrets separados no confirmados | Docs previas dicen que faltan | Configurar Login y Business secret separados | ❌ Propietario Vercel | Sí | 10 min |
| CRÍTICO | Vercel / Supabase | Variables Supabase no aparecen | Cero variables listadas | Confirmar URL, anon key y service role | ❌ Propietario Vercel | Sí | 10–20 min |
| CRÍTICO | Business Verification | Aún no aprobada | En revisión; información enviada | Esperar resolución; no modificar | ❌ Meta | Sí para acceso avanzado | 2+ días laborables |
| CRÍTICO | Permisos | `whatsapp_business_management` sin Advanced Access visible | Listo para prueba | Solicitar tras cumplir requisitos | ❌ Propietario Meta | Sí | Preparación 1–5 días + revisión |
| CRÍTICO | Permisos | `whatsapp_business_messaging` sin Advanced Access visible | Listo para prueba | Solicitar tras cumplir requisitos | ❌ Propietario Meta | Sí | Preparación 1–5 días + revisión |
| CRÍTICO | App Review | Sin aprobación productiva | No enviada | Preparar evidencia y enviar cuando sea reproducible | ❌ Propietario Meta | Sí | 1–3 días + revisión |
| CRÍTICO | Embedded Signup | Config ID no contrastada en Meta | Repo documenta `2608678896249332` | Confirmar pertenencia a app Business y permisos | ❌ Propietario Meta | Sí | 10–20 min |
| CRÍTICO | WhatsApp / onboarding | Ninguna empresa real conectada | Código preparado | Ejecutar Embedded Signup después de aprobaciones | ❌ Cliente + propietario | Sí | 20–45 min |
| CRÍTICO | WhatsApp / WABA | WABA real no confirmada | Sin activo cliente | Seleccionar/crear WABA controlada por cliente | ❌ Cliente | Sí | 15–45 min |
| CRÍTICO | WhatsApp / número | Número no registrado | Meta: “No registrado” | Registrar número elegible del cliente | ❌ Cliente | Sí | 15–60 min |
| CRÍTICO | WhatsApp / pago | Método no agregado | Meta: “No agregado” | Agregar método válido | ❌ Cliente/propietario | Sí para mensajes iniciados | 10–20 min |
| CRÍTICO | WhatsApp / prueba | Sin prueba real completa | No hay número conectado | Probar outbound, inbound y sent/delivered/read | ❌ Cliente + propietario | Sí | 30–60 min |
| CRÍTICO | Login / prueba | No validado end-to-end en esta revisión | Supabase habilitado; IDs coinciden | Probar usuario no admin, callback, sesión y logout | ⚠️ Autorización de prueba | Sí | 15–30 min |
| CRÍTICO | Supabase OAuth | Flujo productivo no ejecutado | Facebook Enabled; ID/callback correctos | Prueba controlada con evidencia | ⚠️ Autorización de prueba | Sí | 15–30 min |
| ALTO | Login / icono | Icono 1024×1024 ausente | Obligatorio en Meta | Verificar branding y subir | ⚠️ Autorización | Sí por elegibilidad | 10 min |
| ALTO | Login / categoría | Categoría vacía | Obligatoria | Seleccionar “Negocios y páginas” | ⚠️ Autorización | Sí por elegibilidad | 2 min |
| ALTO | Business / Domains | Falta dominio raíz | Solo www y Supabase | Agregar raíz; justificar Supabase | ⚠️ Autorización | Antes de publicar | 5–10 min |
| ALTO | Business / dominio heredado | Dominio avanzado HTTP | `http://estructuradigital.cl/` | Respaldar y reemplazar por HTTPS | ⚠️ Autorización | Antes de publicar | 10 min |
| ALTO | Business / producto | Login for Business puede confundirse con login SaaS | Visible junto a WhatsApp | Documentar uso exclusivo para Embedded Signup | ✅ Docs | Antes de publicar | 10 min |
| ALTO | Meta / 2FA apps | Reautorización 2FA desactivada | Ambas apps | Activar con admins de respaldo | ❌ Propietario Meta | Antes de publicar | 10–20 min |
| ALTO | Business Manager / 2FA | Portfolio exige 2FA a nadie | Security Center: “Nadie” | Exigirla al menos a administradores | ❌ Propietario Meta | Antes de publicar | 15–30 min |
| ALTO | Business Manager / dominios | Sin dominios de confianza | Acción requerida en Security Center | Agregar tras validar uso publicitario | ❌ Propietario Meta | No para API | 10–20 min |
| ALTO | Meta / App Secret Proof | Desactivado | Ambas apps | Evaluar compatibilidad, activar y probar | ⚠️ Autorización | Antes de publicar | 1–3 h |
| ALTO | Roles | Roles de app no muestran necesariamente accesos BM | Un administrador visible por app | Auditar Personas, Socios y System Users | ❌ Propietario Meta | Antes de publicar | 20–40 min |
| ALTO | App Review / tester | Sin testers/usuarios de prueba | 0 en ambas | Crear mínimo necesario cuando corresponda | ❌ Propietario Meta | Para App Review | 15–30 min |
| ALTO | App Review / evidencia | Sin video real | Guion existe; faltan activos | Grabar flujo sin datos reales/simulaciones | ❌ Propietario | Para App Review | 1–2 h |
| ALTO | WhatsApp / plantilla | Sin plantilla aprobada | Meta: “No creada” | Crear plantilla mínima de utilidad | ❌ Cliente/propietario | Para primer mensaje iniciado | 20 min + revisión |
| ALTO | Webhook / evento real | Configurado pero sin evento real comprobado | Callback/token/`messages` OK | Probar payload firmado con número conectado | ❌ Cliente + propietario | Para operación confiable | 30–60 min |
| ALTO | Webhook / worker | Recuperación una vez al día | Cron `17 3 * * *` | Definir frecuencia operativa adecuada | ✅ Código; ⚠️ despliegue | Antes de escala | 30–60 min |
| ALTO | Variables heredadas | Fallback permite mezcla de apps | `META_APP_*`/`META_CONFIG_ID` presentes en helpers | Retirar después de confirmar producción | ✅ Código; ⚠️ producción | Antes de publicar | 30–60 min |
| ALTO | Documentación / Vercel | Docs contradicen CLI | Docs: IDs agregados; CLI: cero variables | Corregir docs y confirmar entorno | ✅ Docs; ❌ Vercel | Sí por incertidumbre | 20–40 min |
| ALTO | Dominio / DNS | Vercel ve nameservers Cloudflare | Dominio existe; asociación productiva no demostrada | Confirmar DNS y proyecto destino sin cambiar | ❌ Propietario DNS | Sí si apunta mal | 20–60 min |
| ALTO | Headers | HSTS ausente | CSP y otros headers presentes | Agregar tras confirmar HTTPS/subdominios | ✅ Código; ⚠️ despliegue | Antes de endurecimiento | 30 min |
| ALTO | Login / deauthorization | Callback es `/iniciar-sesion` | No procesa revocación | Crear endpoint correcto o justificar diseño | ✅ Código; ⚠️ Meta | Antes de publicar | 1–3 h |
| MEDIO | Namespace | Vacío en ambas | No se usa | Mantener y documentar | ✅ Docs | No | 5 min |
| MEDIO | Social Discovery | Activado sin uso claro | Ambas apps | Evaluar y desactivar | ⚠️ Autorización | No | 10 min |
| MEDIO | Restricción de edad | 13+ por defecto | Ambas apps | Alinear con términos/mercado | ❌ Legal/propietario | No inmediato | 30–60 min |
| MEDIO | Restricción GDPR | Desactivada | Ambas apps | Revisar legalmente | ❌ Legal/propietario | No inmediato | Variable |
| MEDIO | Country Restrictions | Ninguna | Ambas apps | Documentar decisión | ✅ Docs | No | 10 min |
| MEDIO | Server IP | Allow list vacía | Ambas apps | Mantener mientras Vercel no tenga egress fijo; documentar | ✅ Docs | No | 15 min |
| MEDIO | Correo seguridad | Login vacío | Business correcto | Configurar correo corporativo | ⚠️ Autorización | No inmediato | 3 min |
| MEDIO | DPO | Campos vacíos; país por defecto EE. UU. | Ambas apps | Determinar aplicabilidad legal | ❌ Legal/propietario | No inmediato | Variable |
| MEDIO | URLs legales | Rutas inglés/español duplicadas | Ambas accesibles | Elegir canónicas y redirects | ✅ Codex | No | 30–60 min |
| MEDIO | Graph API | Sin backoff global explícito | Errores sanitizados | Definir retry transitorio | ✅ Codex | No para piloto | 1–2 h |
| MEDIO | Monitoring | Alertas operativas no demostradas | Logging estructurado existe | Configurar alertas/runbook | ✅ Docs/código; ⚠️ servicios | No para piloto | 2–4 h |
| MEDIO | Business / Supabase domain | Dominio Supabase agregado | Necesidad no demostrada | Confirmar requisito o retirar tras prueba | ⚠️ Autorización | No inmediato | 15 min |
| BAJO | App Page | Login sin página asociada | Business sí | Mantener si no se necesita | ✅ Docs | No | 5 min |
| BAJO | Ads allow list | Cero cuentas | Ambas apps | Mantener si no hay anuncios | ✅ Docs | No | 5 min |
| BAJO | Branding | Dimensión de icono Business no auditada | Icono presente | Revisar visualmente | ❌ Branding | No inmediato | 15 min |
| BAJO | Idioma | UI Meta mezcla idiomas | Propio de Meta | Sin acción | N/A | No | 0 min |

## Configuración básica comparada

| Campo | Login | Business |
|---|---|---|
| Nombre / Display Name | Correcto | Correcto |
| Contact Email | Correcto | Correcto |
| Privacy | Falta configurar | Correcto; estandarización opcional |
| Terms | Incorrecto | Correcto; estandarización opcional |
| Data Deletion | Incorrecto | Correcto |
| Category | Falta configurar | Correcto |
| Icon | Falta configurar | Presente; dimensión pendiente |
| Namespace | Vacío, correcto si no se usa | Vacío, correcto si no se usa |
| Site URL | Falta confirmar | Falta confirmar |
| App Domains | Falta configurar | Parcial; falta raíz |
| Business asociado | Correcto: `2547382349033802` | Correcto: `2547382349033802` |
| Tipo de app | Correcto: Facebook Login | Correcto: Business/WhatsApp |

## Configuración avanzada comparada

| Control | Login | Business |
|---|---|---|
| Client OAuth | Activado, correcto | No usar para login SaaS |
| Web OAuth | Activado, correcto | No usar para login SaaS |
| Strict Mode | Activado | No aplica al login SaaS |
| Embedded Browser Login | Desactivado | Embedded Signup usa Login for Business |
| JavaScript SDK Login | Desactivado | SDK solo para Embedded Signup |
| API Version | v26.0 | v26.0 |
| Country Restrictions | Ninguna | Ninguna |
| Age Restrictions | 13+ | 13+ |
| Server IP Allow List | Vacía | Vacía |
| App Secret Proof | Desactivado | Desactivado |
| 2FA settings | Desactivado | Desactivado |
| Webhook callback | N/A/User vacío | Correcto |
| Verify Token | N/A | Configurado/enmascarado |
| Campo `messages` | N/A | Suscrito v26.0 |
| CSP | Compatible | Compatible con SDK/Graph |
| CORS/origin checks | Restringido | Restringido |

## Permisos

| Permiso | App | Estado | Necesario | Advanced Access | App Review | Acción |
|---|---|---|---|---|---|---|
| `public_profile` | Login | Listo para prueba/automático | Sí | No normalmente | Básico | Mantener |
| `email` | Login | Listo para prueba | Sí | No normalmente | Básico | Mantener |
| `public_profile` | Business | Automático | No funcionalmente | No | No específico | No ampliar uso |
| `whatsapp_business_management` | Business | Listo para prueba | Sí | Sí para terceros | Sí | Solicitar tras verificación |
| `whatsapp_business_messaging` | Business | Listo para prueba | Sí | Sí para terceros | Sí | Solicitar tras verificación |
| `business_management` | Business | No agregado | No salvo requisito probado | Sí si se pide | Sí | No solicitar ahora |
| `manage_app_solution` | Business | No agregado | No | N/A | N/A | No solicitar |
| `whatsapp_business_manage_events` | Business | No agregado | No | N/A | N/A | No solicitar |
| Otros `user_*` | Login | No agregados | No | N/A | N/A | No solicitar |

## Webhooks

Meta muestra “Configurar webhooks — Se necesitan aproximadamente 3 minutos”, pero la comprobación dentro de esa tarjeta confirma:

- Callback `https://estructuradigital.cl/api/meta/webhook`.
- Verify token presente y enmascarado.
- Campo `messages` en v26.0 y estado **Suscritos**.
- Otros campos observados en **No suscritos**, coherente con mínimo privilegio.

Conclusión: es un recordatorio visual del onboarding, no un webhook roto. Falta una prueba real firmada cuando exista un número conectado.

## Business Verification

- Estado: **En revisión**.
- Meta confirma recepción de la información de Estructura Digital SpA y estima aproximadamente dos días laborables.
- No modificar ni reenviar.
- Su aprobación permite avanzar en Technology Provider, Advanced Access y App Review según los requisitos que Meta habilite.
- Dependen de ella los permisos para terceros, onboarding de clientes externos y publicación productiva.

## Embedded Signup

El código está preparado: SDK oficial, `config_id`, code flow, state/nonce, validación de activos, suscripción WABA, cifrado de token y separación por organización.

Después de aprobarse la empresa todavía faltan: confirmar Config ID; completar Advanced Access/App Review si Meta los exige; conectar empresa; WABA; número; pago; plantilla; y prueba outbound/inbound/estados. La aprobación de Business Verification por sí sola no reduce automáticamente el resto a cinco pasos.

## Roadmap final

## Fase 1

Lo que podemos hacer hoy.

1. Confirmar proyecto Vercel productivo y cargar variables faltantes.
2. Completar metadatos obligatorios de Login con autorización.
3. Corregir App Domains/Site URL con autorización.
4. Preparar icono y categoría.
5. Auditar roles y activar 2FA.
6. Confirmar Configuration ID.
7. Preparar usuario, activos y guion de revisión sin enviarlo.
8. Ejecutar prueba controlada Facebook Login/Supabase OAuth.

---

## Fase 2

Lo que depende de Meta.

1. Business Verification.
2. Technology Provider si corresponde.
3. Advanced Access.
4. App Review.
5. Aprobación de plantilla.

---

## Fase 3

Lo que depende del cliente.

1. Empresa/portfolio elegible y administrador autorizado.
2. WABA propia o autorización para crearla.
3. Número elegible.
4. Método de pago.
5. Texto aprobado para plantilla.
6. Destinatario de prueba con consentimiento.

---

## Fase 4

Go Live.

1. Confirmar aprobaciones.
2. Completar Embedded Signup real.
3. Verificar WABA/número/suscripción.
4. Probar outbound, estados e inbound.
5. Validar logs, reintentos, límites y alertas.
6. Smoke test Facebook Login/Supabase.
7. Congelar IDs/secrets y retirar fallbacks.
8. Solicitar autorización expresa.
9. Publicar solo después de esa autorización.

## Validación

| Componente | Resultado |
|---|---|
| Facebook Login | Configuración correcta y proveedor habilitado; falta prueba end-to-end controlada |
| Supabase OAuth | App ID `1048232064232330` y callback exacto confirmados |
| Embedded Signup | Código preparado; faltan Config ID confirmada y aprobaciones |
| WhatsApp | Backend preparado; faltan WABA/número/pago/plantilla/prueba real |
| Webhooks | Callback, token y `messages` v26.0 confirmados; falta evento real |
| Tests | OK: 23 archivos, 121 tests aprobados |
| Build | OK: Next.js 16.2.12 compiló y generó 38 páginas |

## Respuestas ejecutivas

1. **¿Qué bloquea producción hoy?** Metadatos de Login, variables Vercel no verificadas, Business Verification, Advanced Access/App Review, Config ID no contrastada y ausencia de activos WhatsApp reales.
2. **¿Qué falta antes de publicar?** Resolver CRÍTICOS y ALTOS, completar pruebas reales, endurecer acceso administrativo y obtener autorización expresa.
3. **¿Qué depende únicamente de Meta?** Business Verification, Technology Provider, Advanced Access, App Review y tiempos de aprobación de plantilla.
4. **¿Qué podemos hacer inmediatamente?** Corregir metadatos/domino con autorización, confirmar Vercel, Config ID, roles/2FA y preparar evidencia.
5. **¿Camino más corto al primer cliente real?** Corregir Login y Vercel en paralelo mientras Meta revisa; obtener accesos; onboarding de un piloto con WABA/número/pago; plantilla mínima; prueba real antes de publicar.
