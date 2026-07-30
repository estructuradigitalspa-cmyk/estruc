# Meta Production Readiness

Última actualización: 2026-07-30. App Business `2487731658317049`; configuración Embedded Signup `2608678896249332`; portafolio Estructura Digital `2547382349033802`.

No modificar la Business Verification mientras aparezca `En proceso`. No publicar, registrar número, agregar tarjeta, enviar plantilla ni rotar credenciales reales sin autorización.

## Seguimiento

| Etapa | Estado | Completado | Pendiente manual | Bloqueo / siguiente paso |
|---|---|---|---|---|
| Dominio Vercel | completed | Team/proyecto correctos identificados; apex y www asociados a Production; DNS y ownership auditados | Opcional: cambiar apex A legacy por CNAME recomendado | No bloquea disponibilidad; ambos dominios responden |
| Resend | waiting_user | From/Reply-To y fallos cerrados auditados; guía preparada | Login, copiar DNS literal, validar dominio, crear key mínima | No existe `RESEND_API_KEY` |
| Separación apps Meta | in_progress | Código separado; IDs no secretos agregados a Vercel Production | Copiar ambos secretos separados y redeploy | Mantener fallback heredado hasta probar |
| AES v2 | waiting_user | Keyring v1/v2, backup, CAS, retries, dry-run, rollback y tests | Crear key v2 y autorizar migración/rotación | No ejecutar con datos reales todavía |
| Business Verification | in_progress | Paquete técnico y datos públicos preparados | Meta/representante completa la revisión | No intervenir mientras esté en proceso |
| Technology Provider | blocked | Descripción técnica y alcance preparados | Enviar después de Business Verification | Aprobación Meta |
| Advanced Access | blocked | Dos permisos mínimos justificados | Crear activos/cuenta/video de prueba | Technology Provider/App Review |
| App Review | blocked | Guion y URLs preparados | Grabar flujo real, no simulado | Embedded Signup real |
| Número WhatsApp | blocked | Esquema, tenant isolation, OTP/runbook y mocks preparados | Elegir número empresarial y registrarlo | Business Verification/WABA definitiva |
| Método de pago | blocked | Checklist y WABA correcta documentados | Agregar directamente en Meta | No almacenar tarjeta localmente |
| Plantilla Utility | prepared | Nombre, texto, ejemplos, almacenamiento y payload probados | Crear/enviar manualmente en WABA definitiva | Esperar WABA/número claros |
| Publicación | blocked | Preflight técnico en curso | Autorización expresa final | Todas las aprobaciones anteriores |
| Mensajería real | blocked | Webhook, worker, cifrado y estados preparados | Prueba real sent/delivered/read/failed/inbound | Número conectado y plantilla aprobada |

## Permisos mínimos

### `whatsapp_business_management`

Validar WABA/número autorizados, leer metadatos operativos, administrar la suscripción del webhook y mantener el estado de la integración.

### `whatsapp_business_messaging`

Enviar mensajes solicitados por Owner/Admin y recibir mensajes/estados mediante el webhook para la organización activa.

No solicitar `business_management` salvo que el flujo oficial lo exija y exista una función demostrable.

## Guion del revisor

1. Abrir `https://estructuradigital.cl`.
2. Iniciar sesión con usuario temporal no productivo.
3. Confirmar tenant y rol Owner.
4. Ir a Integraciones → WhatsApp.
5. Ejecutar Embedded Signup con activos de prueba.
6. Mostrar estado conectado y metadatos del número.
7. Enviar `confirmacion_solicitud` a destinatario autorizado.
8. Mostrar `sent`, `delivered`, `read` y una respuesta entrante.
9. Desconectar y mostrar revocación.
10. Mostrar privacidad, términos y eliminación de datos.

No grabar FINISH, token, mensaje ni aprobación simulados.

## URLs públicas

- Inicio: `https://estructuradigital.cl`
- Login: `https://estructuradigital.cl/iniciar-sesion`
- Privacidad: `https://estructuradigital.cl/privacidad`
- Términos: `https://estructuradigital.cl/terminos`
- Eliminación: `https://estructuradigital.cl/eliminacion-de-datos`
- Soporte: `contacto@estructuradigital.cl`

## Preflight antes de publicar

- [ ] Business Verification aprobada.
- [ ] Technology Provider aprobado.
- [ ] Advanced Access aprobado.
- [ ] App Review aprobado.
- [x] Dominio y callbacks técnicos asociados al proyecto correcto.
- [x] Webhook firmado y endpoint activo.
- [x] Embedded Signup configurado técnicamente.
- [x] URLs legales públicas.
- [ ] Resend verificado y probado.
- [ ] Secretos Meta separados sin fallback.
- [ ] Número empresarial registrado.
- [ ] Método de pago agregado a la WABA correcta.
- [ ] Plantilla Utility aprobada.
- [ ] Rotación AES v2 autorizada y verificada.
- [ ] Pruebas reales con activos controlados.

Detenerse siempre antes de pulsar Publicar.