# Meta Production Readiness

Última actualización: 2026-07-30. App Business: `2487731658317049`. Configuración Embedded Signup: `2608678896249332`. Portafolio esperado: Estructura Digital (`2547382349033802`).

## Seguimiento

| Etapa | Estado | Acción automática completada | Acción manual pendiente | Evidencia | Fecha | Bloqueo | Próximo paso |
|---|---|---|---|---|---|---|---|
| Resend | waiting_user | Código de contacto, invitaciones, errores y rate limit verificados | Crear key Production mínima y validar dominio remitente | Vercel no tiene `RESEND_API_KEY` | 2026-07-30 | Falta credencial y validación DNS | Validar dominio en Resend y entregar key sin publicarla |
| Separación apps Meta | in_progress | Código usa helpers Login/Business y `META_BUSINESS_CONFIG_ID`; fallback heredado aislado | Copiar secretos específicos a Vercel | Auditoría `rg`; tests | 2026-07-30 | Faltan secretos separados confirmados | Configurar nuevas variables, redeploy y retirar fallback |
| Rotación AES | completed | Keyring v1/v2, active version, decrypt legado, backup/RPC CAS y script dry-run | Proporcionar/confirmar clave v2 antes de rotación | Tests y migración `202607300005` | 2026-07-30 | Rotación real no autorizada | Aplicar migración segura; ejecutar dry-run; autorizar rotación |
| Business Verification | waiting_user | Portafolio y app correctos identificados; matriz preparada; revisión de solo lectura completada | Confirmar datos y documentos oficiales y autorizar el inicio | Meta Security Center muestra `Iniciar verificación` | 2026-07-30 | Verificación aún no iniciada; documentos no revisados | Completar matriz; el usuario inicia/revisa el formulario sin enviarlo |
| Technology Provider | blocked | Descripción y alcance real preparados | Esperar Business Verification Approved y revisar solicitud | Bloqueo mostrado por Embedded Signup | 2026-07-30 | Business Verification | Preparar formulario; no enviar |
| Advanced Access | blocked | Permisos mínimos definidos | Esperar requisitos y crear cuenta/video de prueba | Configuración usa solo 2 permisos | 2026-07-30 | Technology Provider/App Review | Preparar evidencia reproducible |
| App Review | blocked | Guion, URLs legales y arquitectura disponibles | Crear usuario temporal y video cuando Embedded Signup funcione | `docs/meta-app-review.md` | 2026-07-30 | Flujo real bloqueado | Grabar partes funcionales sin simular conexión |
| Publicación | blocked | Preflight técnico base completado | Autorización expresa después de todas las aprobaciones | App permanece Sin publicar | 2026-07-30 | Aprobaciones regulatorias | No pulsar Publicar |
| Embedded Signup real | blocked | SDK, configuración y recuperación de popup funcionando | Completar tras habilitación Meta | Meta: no puede registrar clientes | 2026-07-30 | Technology Provider/publicación | Repetir y validar FINISH/IDs/token |
| Mensajería real | blocked | Webhook, worker, cifrado y persistencia preparados | Número real conectado y destinatario autorizado | Handshake webhook 200 | 2026-07-30 | Embedded Signup | Probar sent/delivered/read/inbound |

## Matriz Business Verification — completar antes de enviar

| Campo | Valor confirmado | Fuente requerida | Estado |
|---|---|---|---|
| Razón social | Pendiente del representante | Escritura/SII | waiting_user |
| Nombre comercial | Estructura Digital | Sitio y app | in_progress |
| RUT | Pendiente | SII/documento oficial | waiting_user |
| Dirección legal | Pendiente | Documento oficial y comprobante | waiting_user |
| Teléfono corporativo | Pendiente | Sitio/factura/registro | waiting_user |
| Correo corporativo | `contacto@estructuradigital.cl` | Dominio y sitio | in_progress |
| Dominio | `estructuradigital.cl` | DNS/sitio | completed |
| Representante legal | Pendiente | Escritura/certificado | waiting_user |
| Documento empresa | Pendiente de selección | SII/escritura/certificado | waiting_user |
| Documento dirección/teléfono | Pendiente de selección | Cuenta/estado/registro aceptado por Meta | waiting_user |

No usar documentos de Urrea Brothers, Stupendo ni otra empresa. No abreviar la dirección y no sustituir teléfono personal por corporativo sin respaldo documental.

## Paquete Technology Provider — borrador

Estructura Digital ofrece un SaaS multiempresa que permite a organizaciones conectar sus propios activos de WhatsApp Business mediante Embedded Signup. Cada organización conserva la propiedad de sus activos y autoriza explícitamente los permisos. El sistema separa datos mediante `organization_id` y RLS, cifra tokens con AES-256-GCM versionado, valida webhooks firmados, procesa mensajes y estados de forma idempotente, y permite revalidar, desconectar y revocar la integración.

Estado real: Facebook Login y Supabase funcionan; Embedded Signup está técnicamente configurado, pero Meta aún bloquea el registro de clientes. No declarar clientes conectados ni mensajería real hasta completar las aprobaciones.

URLs:
- Producto: `https://estructuradigital.cl`
- Login: `https://estructuradigital.cl/iniciar-sesion`
- Privacidad: `https://estructuradigital.cl/privacidad`
- Términos: `https://estructuradigital.cl/terminos`
- Eliminación: `https://estructuradigital.cl/eliminacion-de-datos`
- Soporte: `contacto@estructuradigital.cl`

## Advanced Access — finalidad mínima

### `whatsapp_business_management`

Usado para validar la WABA y el número seleccionados, leer metadatos operativos, administrar la suscripción del webhook y mantener el estado de la integración autorizada.

### `whatsapp_business_messaging`

Usado para enviar mensajes solicitados por usuarios Owner/Admin y recibir mensajes/estados mediante el webhook. Los datos se limitan a la organización activa.

No solicitar permisos adicionales sin una función real, implementada y demostrable.

## Guion App Review

1. Abrir `https://estructuradigital.cl`.
2. Iniciar sesión con un usuario temporal de revisión.
3. Confirmar organización de prueba y rol Owner.
4. Ir a Integraciones → WhatsApp.
5. Pulsar Conectar con Facebook.
6. Completar Embedded Signup con Business/WABA/número de prueba.
7. Regresar y mostrar estado connected.
8. Enviar un mensaje a un destinatario permitido.
9. Mostrar estados disponibles y respuesta entrante.
10. Desconectar y mostrar revocación.
11. Mostrar privacidad, términos y eliminación de datos.

No grabar un FINISH, token, mensaje o aprobación simulados. El video final queda bloqueado hasta habilitación Meta.

## Preflight antes de Publicar

- [ ] Business Verification Approved.
- [ ] Technology Provider Approved.
- [ ] Advanced Access Approved.
- [ ] App Review Approved.
- [x] App Business y portafolio correctos.
- [x] Dominios y callbacks técnicos configurados.
- [x] Webhook activo y handshake 200.
- [x] Embedded Signup config completa.
- [x] URLs legales accesibles.
- [x] Data deletion accesible.
- [ ] Resend y soporte por correo validados.
- [ ] Secretos separados sin fallback heredado.
- [x] Deployment Ready.
- [ ] Alertas bloqueantes resueltas.

Detenerse siempre antes de pulsar Publicar y solicitar autorización expresa.
## Riesgo de dependencias pendiente

`npm audit --omit=dev --audit-level=high` informa dos vulnerabilidades altas heredadas de `sharp` dentro de Next.js. El arreglo automático propuesto hace un downgrade incompatible a Next 14, por lo que no se aplicó. Mantener seguimiento de una versión estable de Next que actualice la dependencia afectada; no usar `npm audit fix --force`.
