# Arquitectura Meta

## Componentes

- `/app/integraciones/whatsapp`: consentimiento e inicio futuro de Embedded Signup.
- `/api/meta/oauth/callback`: recepción controlada del retorno OAuth.
- `/api/meta/embedded-signup/session`: intercambio futuro de sesión; hoy responde sin simular éxito.
- `/api/meta/webhook`: verificación GET, validación `X-Hub-Signature-256`, registro idempotente y respuesta rápida.
- `/api/meta/data-deletion`: validación de `signed_request`, confirmación y registro de eliminación.

## Principios

Cada cliente conserva sus activos. Los tokens se almacenarán cifrados o en un gestor de secretos, nunca en logs ni código. El Service Role de Supabase solo se usa en servidor. Los eventos se deduplican por `event_key` y se procesarán de forma diferida.

## Flujo futuro Embedded Signup

Cliente autenticado → organización autorizada → explicación → SDK de Meta → autorización del cliente → código de sesión → intercambio en servidor → almacenamiento seguro → alta de `integration` e `integration_account` → auditoría.
