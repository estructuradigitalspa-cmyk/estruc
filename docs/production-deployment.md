# Despliegue de producción

## Variables (solo nombres)

`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `META_LOGIN_APP_ID`, `META_LOGIN_APP_SECRET`, `META_BUSINESS_APP_ID`, `META_BUSINESS_APP_SECRET`, `META_BUSINESS_CONFIG_ID`, `META_GRAPH_API_VERSION`, `META_VERIFY_TOKEN`, `META_OAUTH_STATE_SECRET`, `META_TOKEN_ENCRYPTION_KEY_V1`, `META_TOKEN_ENCRYPTION_KEY_V2`, `META_TOKEN_ENCRYPTION_ACTIVE_VERSION`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `CRON_SECRET`, `WEBHOOK_WORKER_BATCH_SIZE` y variables `RATE_LIMIT_*`.

`META_APP_ID`, `META_APP_SECRET`, `META_CONFIG_ID` y `META_TOKEN_ENCRYPTION_KEY` son variables heredadas de migración. Solo deben mantenerse mientras se copian de forma segura los secretos separados y se completa la rotación; después deben retirarse.

No configurar `ENABLE_GLOBAL_WHATSAPP_FALLBACK` en producción. Antes de desplegar: respaldo verificable, revisión/aplicación de migración, lint, typecheck, tests, cobertura, build, smoke test y rollback al deployment anterior. Vercel: proyecto `estruct`, dominio `https://estructuradigital.cl`.

El cron diario de recuperación llama `/api/internal/webhook-worker`. En Vercel Pro puede aumentarse la frecuencia; en Hobby el mínimo permitido es diario. `CRON_SECRET` debe ser aleatorio y sensible.
