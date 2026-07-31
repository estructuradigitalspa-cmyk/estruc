# Staging Elytsa

Estado: contrato local listo; servicios externos pendientes.

Staging debe usar Vercel `elytsa-staging`, Supabase `elytsa-staging`, datos sintéticos y proveedor LLM simulado. Variables base están en `.env.staging.example`.

## Supabase
Crear un proyecto exclusivo, copiar URL/anon/service role a secretos de staging, aplicar migraciones en orden, ejecutar `supabase/seed.sql` o fixtures sintéticos y las pruebas SQL de RLS/aislamiento/concurrencia. Verificar Auth, Storage, RLS y rollback. No crear producción ni cargar clientes reales.

## Controles obligatorios
`ALLOW_EXTERNAL_MESSAGES=false`, `ALLOW_REAL_WHATSAPP=false`, `LLM_PROVIDER=simulated`; noindex/nofollow; cero credenciales de producción; correo no operativo sin Resend; canales externos desconectados.

## Validación
Ejecutar lint, typecheck, tests, build y auditoría. Completar flujo: onboarding → servicio → empleado inactivo → simulación → cotización → reserva → handoff → métricas. Revisar logs redactados y separación entre dos organizaciones sintéticas.

Responsable: tecnología. Costo: Supabase/Vercel según planes seleccionados. Rollback: restaurar deployment anterior y ejecutar rollback de la última migración sólo tras preflight y respaldo.
