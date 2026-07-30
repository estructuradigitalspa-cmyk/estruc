# WhatsApp Embedded Signup

## URLs exactas

- Callback OAuth: `https://estructuradigital.cl/api/meta/oauth/callback`
- Regreso al SaaS: `https://estructuradigital.cl/app/integraciones/whatsapp`
- Webhook: `https://estructuradigital.cl/api/meta/webhook`
- Dominio de aplicación: `estructuradigital.cl`
- Dominio alternativo público: `www.estructuradigital.cl`

En Meta debe activarse el modo estricto para URI de redireccionamiento. No se
registran URLs de preview, localhost ni comodines.

## Configuración de Facebook Login for Business

Configuración oficial creada desde la plantilla de WhatsApp Embedded Signup (token de usuario del sistema con caducidad de 60 días): `2608678896249332`. Guardar este valor como `META_CONFIG_ID`. La configuración debe permitir al cliente:

1. autenticar su cuenta Meta;
2. elegir su negocio;
3. seleccionar o crear una WABA;
4. seleccionar o registrar un número;
5. otorgar acceso a Estructura Digital;
6. volver al callback canónico.

## Permisos

- `whatsapp_business_management`
- `whatsapp_business_messaging`

En modo desarrollo solo pueden completar el flujo personas con rol en la app y
activos de prueba. No solicitar Advanced Access ni publicar la app en esta fase.

## Seguridad

- `state` está firmado con HMAC-SHA256, expira en diez minutos y contiene
  organización, usuario y un nonce aleatorio.
- El nonce se conserva en una cookie `HttpOnly`, `Secure`, `SameSite=Lax`,
  restringida al callback.
- El callback verifica sesión, usuario, organización, expiración, nonce y firma.
- El código se intercambia exclusivamente en el servidor y usando el mismo
  `redirect_uri` canónico.
- Los tokens se cifran con AES-256-GCM antes de guardarse.
- Los logs no contienen códigos, tokens, firmas ni payloads completos.

## Persistencia multiempresa

Cada `integration_account` conserva:

- `organization_id`
- `business_id`
- `waba_id`
- `phone_number_id`
- `display_name`
- `status`
- `encrypted_credentials`
- `connected_at`
- metadatos no secretos del activo

Los índices incluyen `organization_id`; RLS limita la lectura a miembros y la
administración a propietarios/administradores.

## Flujo posterior al callback

1. Intercambiar el código por token.
2. Consultar negocios autorizados.
3. Consultar WABAs propias y sus números.
4. Cifrar el token.
5. Persistir activos por organización.
6. Ejecutar `POST /{WABA_ID}/subscribed_apps` para `messages`.
7. Mostrar los activos conectados en el SaaS.
8. Los envíos posteriores resuelven el número y token de la organización en el
   servidor; el navegador nunca recibe credenciales.

## Checklist futuro: Technology Provider y App Review

- [ ] Razón social, sitio, privacidad, términos y eliminación de datos públicos.
- [ ] Business Verification de Estructura Digital.
- [ ] Registro como Technology Provider.
- [ ] Video de revisión mostrando conexión, envío, recepción y desconexión.
- [ ] Instrucciones reproducibles para revisores y credenciales de prueba.
- [ ] Justificación de cada permiso y uso mínimo de datos.
- [ ] Advanced Access para los permisos aprobados.
- [ ] Política de retención, revocación y eliminación probada.
- [ ] Monitoreo de errores, rotación de secretos y respuesta a incidentes.
- [ ] App publicada solo después de completar las revisiones.
