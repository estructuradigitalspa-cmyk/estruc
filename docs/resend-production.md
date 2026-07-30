# Resend en producción

Estado: `waiting_user`. El proyecto correcto de Vercel no contiene `RESEND_API_KEY`. El panel de Resend requiere login, por lo que no se han inventado ni agregado registros DNS.

## Configuración esperada

- Dominio remitente: `estructuradigital.cl` o el subdominio de envío que Resend asigne al crear el dominio.
- From: `Estructura Digital <contacto@estructuradigital.cl>`.
- Reply-To de contacto: correo validado enviado por el visitante.
- Reply-To de invitaciones: `CONTACT_REPLY_TO_EMAIL`, por defecto `contacto@estructuradigital.cl`.
- Destino del formulario: `CONTACT_TO_EMAIL`.

Flujos: formulario de contacto e invitaciones de organización. Supabase administra sus propios correos de confirmación y recuperación.

Sin `RESEND_API_KEY`, el formulario responde 503 en producción; las invitaciones eliminan la fila recién creada y responden 503. No se afirma entrega.

## Acción manual exacta

1. Iniciar sesión en `https://resend.com/domains` desde la pestaña abierta.
2. Crear el dominio de envío.
3. Copiar literalmente los registros que muestre Resend: tipo, host, valor y TTL. Usar DNS only en Cloudflare salvo que Resend indique otra cosa.
4. No reemplazar el SPF existente sin combinar de forma válida todos los emisores autorizados; no puede haber dos SPF en el mismo host.
5. Esperar estado Verified para DKIM/SPF/return-path.
6. Crear una API key limitada a Sending Access y, si Resend permite ámbito de dominio, restringida al dominio verificado.
7. Guardar únicamente en Vercel Production como `RESEND_API_KEY`. No usar Preview hasta contar con un remitente de pruebas separado.
8. Redeploy y enviar una prueba controlada a una dirección autorizada; verificar ID de entrega en Resend sin copiarlo a logs de aplicación.

No se deben modificar los MX de Cloudflare Email Routing para configurar Resend como servicio de envío.