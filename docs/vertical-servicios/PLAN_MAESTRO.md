# Plan maestro — vertical empresas de servicios

## 1. Diagnóstico del repositorio (30-07-2026)

Aplicación Next.js 16/React 19 desplegable en Vercel, con Supabase Auth/Postgres, RLS y roles `owner`, `admin`, `agent`, `viewer`. El tenant activo se resuelve en servidor mediante cookie y membresía; las rutas API repiten autorización y las mutaciones validan origen. Existen contactos, conversaciones, mensajes, CRM genérico, tareas, auditoría e integraciones.

WhatsApp Cloud API ya dispone de Embedded Signup, OAuth firmado, credenciales AES-256-GCM versionadas, catálogo de plantillas, firma de webhooks, deduplicación, cola persistida, `SKIP LOCKED`, reintentos y dead letter. Hay rate limiting persistente, logs estructurados sin secretos, Resend para contacto, cron Vercel y verificadores de entorno/esquema. La suite inicial tiene 124 pruebas declaradas por la orden; el conteo real se comprobará en cada validación.

Reutilizable: identidad, tenancy, RLS, membresías, contactos, conversaciones, mensajes, auditoría, WhatsApp, cifrado, rate limiting, Supabase SSR/admin, Vercel y Vitest. Brechas comprobadas: dashboard principalmente vacío, CRM no modela el ciclo del servicio, no hay catálogo/precios/solicitudes/cotizaciones/agenda/agentes, no hay proveedor LLM, almacenamiento documental ni worker de automatizaciones, y el cron de webhook diario no ofrece latencia operacional suficiente.

## 2. Flujo operativo

`WhatsApp → contacto/conversación → identificar servicio → calificar → recopilar ubicación/cantidad/fotos → precio determinista o revisión humana → cotización → seguimiento → disponibilidad → reserva/asignación → recordatorio → ejecución → pago confirmado → postventa/reseña → reactivación`.

Las ramas controladas son: fijo, cantidad, base más extras, recargo por zona/porcentaje/fijo y manual. Urgencia, visita, condición incierta, descuento, reclamo, pago o baja confianza transfieren a humano. Reprogramación y cancelación preservan historial. Nunca se infiere pago, disponibilidad ni garantía.

## 3. MVP vendible

P0: perfil operativo; catálogo, variantes, extras y reglas acotadas; solicitud central y pipeline; agente recepcionista versionado; contexto por capas; salida IA validada; cotización preliminar/revisión; agenda interna; pausa y transferencia humana; simulador; métricas básicas y trazabilidad. La primera iteración de este branch entrega el cimiento de perfil/catálogo/solicitudes, reglas deterministas, contratos, API y vistas.

P1 comercial: cotizaciones aprobables y enlace público, agenda/asignación, automatizaciones idempotentes compatibles con ventana WhatsApp, base estructurada, observabilidad/costos y onboarding de rubro. P2: documentos con pgvector sólo si medición de recuperación lo justifica, Google Calendar por adaptador, capacidad/rutas y analítica avanzada. P3: constructor visual, omnicanal y voz sobre `ConversationChannelAdapter`.

## 4. Arquitectura propuesta

```text
domain/ (reglas puras, sin WhatsApp ni Supabase)
  agents/ services/ service-requests/ quotations/ scheduling/
  automations/ knowledge/ conversations/ analytics/
app/api/ (auth, CSRF, rate limit, validación, orquestación)
lib/supabase/ (persistencia tenant-scoped)
adapters/ (WhatsApp primero; webchat/email/calendar/voz después)
app/app/ (interfaz del dueño: clientes, servicios, ventas y equipo)
```

Entidades del núcleo: `organization_service_profiles 1—1 organizations`; `service_catalog 1—N variants/extras/pricing_rules`; `service_requests N—1 organization/contact/conversation/service/assignee`; luego `quotations 1—N quotation_items`, `appointments`, `agents/agent_versions/agent_runs/tool_calls`, `automations/runs`, `knowledge_documents/versions/chunks`.

Migración inicial `202607300007_service_vertical_core.sql`, sólo aditiva, con índices, constraints, RLS y privilegios explícitos. Rollback documentado en `supabase/rollbacks`; requiere respaldo porque elimina datos nuevos.

Rutas iniciales: `GET/POST /api/services`, `GET/POST /api/service-requests`, `PATCH /api/service-requests/:id/status`. Próximas: perfil, variantes/reglas, agentes, simulación, cotizaciones, disponibilidad/reservas, handoffs y métricas. Toda mutación: sesión, tenant del servidor, rol, origen, Zod, límite e idempotencia cuando origine efectos externos.

Pantallas: Inicio, Conversaciones, Solicitudes, Pipeline, Agenda, Cotizaciones, Agentes, Servicios, Conocimiento, Automatizaciones, Métricas, Configuración. Se priorizan tablas/botones explícitos; drag-and-drop no es dependencia.

## 5. IA y WhatsApp

El contexto se ensambla por capas inmutables: política del sistema; perfil; agente/version; catálogo/reglas; contacto; solicitud; resumen; mensajes recientes; conocimiento recuperado; herramientas y resultados. Texto del cliente y documentos se delimitan como datos no confiables. Secretos, prompts internos de otros tenants y PII innecesaria nunca ingresan.

El proveedor debe producir JSON bajo `agentResponseSchema`; sólo herramientas tipadas pueden cambiar estado. Precios salen del motor determinista y disponibilidad del motor de agenda. Cada ejecución registra modelo, versión, latencia, tokens entrada/salida, costo estimado, resultado, errores y tool calls, nunca razonamiento privado. WhatsApp sigue siendo adaptador: el webhook persiste primero y encola la orquestación del dominio.

Costo estimado por conversación: `tokens_in × tarifa_in + tokens_out × tarifa_out + almacenamiento/worker`, calculado con tabla versionada de tarifas y mostrado como estimación, no valor fijo. Presupuestar 4–10 turnos y medir antes de elegir modelo; usar resumen incremental y contexto estructurado para contener tokens.

## 6. Seguridad, privacidad y observabilidad

RLS y `organization_id` obligatorio; autorización de servidor; URLs firmadas cortas para archivos; allowlist MIME/tamaño; antivirus asíncrono; retención configurable; borrado en cascada del tenant; logs sin cuerpos/secretos; auditoría de cambios; claves cifradas; CSRF; límites por usuario/organización/canal; jobs con claves idempotentes. Alertas: webhook dead letters, tasa de error IA, handoffs, latencia, cola atrasada, envíos fallidos y gasto estimado. La migración se valida primero en entorno local/staging, nunca directamente en producción.

## 7. Pruebas y aceptación

Unitarias: precios, estados, esquema IA, prompt injection, selección de herramientas. Contrato: migración/RLS/rollback, APIs y adaptadores. Integración: aislamiento A/B, conversación→solicitud→cotización→agenda, reintentos/idempotencia. E2E: diez escenarios demo sin datos reales. Por bloque: lint, typecheck, tests, build, audit y `env:check` sólo con entorno productivo completo.

Aceptación P0: dos tenants no pueden leer/escribir entre sí; servicio y regla configurables; solicitud trazable; precio nunca inventado; salida IA inválida no ejecuta; handoff pausa agente; agenda consultada antes de prometer; simulación completa visible; suite previa sigue verde.

## 8. Fases y orden

1. Dominio operativo, migración/RLS, API, catálogo, solicitudes y pipeline.
2. Perfil y editor de servicios/reglas/fixtures.
3. Agente versionado, capas de prompt, proveedor simulado y tool gateway.
4. Cotizaciones y revisión humana.
5. Agenda interna y disponibilidad.
6. Handoff, automatizaciones y worker.
7. conocimiento estructurado/documentos; métricas; piloto y hardening.

Riesgos: esquema productivo puede divergir (preflight obligatorio); cron actual insuficiente; políticas genéricas duplican SELECT/ALL pero no rompen aislamiento; costos/modelo no están definidos; mensajes fuera de ventana exigen plantilla; archivos incrementan superficie; TypeScript no usa tipos generados de Supabase. Dependencias externas sólo en fases posteriores: proveedor LLM, storage y opcional Calendar. No se necesita dependencia grande para P0.

