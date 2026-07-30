# WhatsApp Embedded Signup

Flujo canónico: `/app/integraciones/whatsapp` carga el SDK oficial, abre `FB.login` con `META_CONFIG_ID` y escucha `WA_EMBEDDED_SIGNUP`. El navegador entrega solo código temporal, IDs de negocio/WABA/número, sesión, state y nonce. El backend valida sesión, Owner/Admin, organización activa, Origin/Host, HMAC, expiración y nonce de un uso; luego canjea el código, valida `/{waba_id}`, `/{phone_number_id}`, `/{waba_id}/phone_numbers`, suscribe `/{waba_id}/subscribed_apps`, cifra el token y hace upsert por organización+WABA+número.

Estados: `not_connected`, `connecting`, `connected`, `action_required`, `token_expired`, `disconnected`, `error`. `/me/businesses` no se utiliza.