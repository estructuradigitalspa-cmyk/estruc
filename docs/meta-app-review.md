# Arquitectura para Meta App Review

Estado: preparación técnica. Ningún permiso está aprobado ni solicitado todavía.

## Permisos futuros iniciales

| Permiso | Uso previsto | Pantalla | Datos | Revocación |
|---|---|---|---|---|
| `whatsapp_business_management` | Consultar y administrar activos de WhatsApp autorizados por el cliente | `/app/integraciones/whatsapp` | WABA, números, plantillas y estados técnicos necesarios | Desconexión en la plataforma y revocación en Meta |
| `whatsapp_business_messaging` | Enviar y recibir mensajes solicitados por el cliente | Conversaciones y WhatsApp | Mensajes, destinatarios y estados de entrega | Desconexión, revocación y eliminación conforme a política |
| `business_management` | Solo si Embedded Signup requiere administrar la relación con activos empresariales | Onboarding de WhatsApp | Identificadores y relación del negocio con activos | Revocación en Meta y cierre de integración |

`business_management` no debe solicitarse si el flujo técnico puede operar sin él.

## Flujo que verá el revisor

1. Ingreso con una cuenta de prueba propia de Estructura Digital.
2. Selección de la organización de prueba.
3. Apertura de Integraciones → WhatsApp Business.
4. Explicación de permisos, propiedad y tratamiento.
5. Inicio de Embedded Signup cuando esté habilitado.
6. Autorización de activos de prueba.
7. Visualización del estado conectado y prueba de la función solicitada.
8. Desconexión, revocación y solicitud de eliminación.

## Evidencia requerida

- Video continuo, sin datos de clientes reales.
- Cuenta de prueba con instrucciones y segundo factor coordinado.
- Activos de prueba controlados por Estructura Digital.
- Evidencia visible de la función correspondiente a cada permiso.
- URLs públicas de privacidad, términos y eliminación.
- Explicación de almacenamiento, retención y acceso mínimo.

## Checklist

- [ ] App propia de Estructura Digital creada con caso de uso WhatsApp.
- [ ] Negocio confirmado y datos legales consistentes.
- [ ] Embedded Signup configurado con Config ID propio.
- [ ] Webhook firmado y probado.
- [ ] Cuenta, WABA y número de prueba.
- [ ] Video y pasos reproducibles.
- [ ] Política de privacidad revisada profesionalmente.
- [ ] Eliminación y revocación verificadas.
- [ ] Solicitar solo permisos estrictamente necesarios.
