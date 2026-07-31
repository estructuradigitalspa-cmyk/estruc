# Staging seguro del piloto comercial

Staging debe usar un proyecto Supabase independiente, dominio independiente y credenciales exclusivas. Nunca se reutilizan claves, tokens, números ni datos de producción.

Variables mínimas: `APP_ENV=staging`, URL/anon/service-role del Supabase de staging y, sólo para probar IA real, `LLM_API_KEY`. `ALLOW_EXTERNAL_MESSAGES` y `ALLOW_REAL_WHATSAPP` permanecen en `false`.

El proveedor real se habilita además por organización. Tener una clave en el entorno no activa llamadas por sí solo. Los presupuestos se evalúan antes de cada run.

Promoción futura: validar onboarding, conversación, cotización, reserva, handoff, métricas y checklist; rotar credenciales de staging; revisar RLS; crear respaldo; recién entonces preparar un cambio separado para producción.
