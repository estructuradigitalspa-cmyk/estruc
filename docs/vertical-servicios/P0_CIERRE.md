# Cierre funcional P0 — vertical de servicios

## Alcance operativo

El P0 permite configurar el perfil y horario del tenant, editar servicios y reglas acotadas, versionar empleados IA, simular conversaciones persistentes, gestionar solicitudes y handoffs, emitir cotizaciones, registrar decisiones mediante enlace público y reservar capacidad interna.

No se envían mensajes, correos ni pagos. El proveedor LLM y todo envío son simulados.

## Decisiones conservadoras

- Las notas internas no entran al contexto IA por defecto (`internal_notes_in_ai=false`).
- Los precios se calculan en servidor con `calculateServicePrice` o `calculateQuotation`.
- El token público sólo se conserva como SHA-256; el valor original se entrega una vez al creador.
- Una decisión pública usa actualización condicional para impedir doble aceptación/rechazo.
- Las reservas usan `pg_advisory_xact_lock` por tenant/recurso y vuelven a comprobar la capacidad dentro de la transacción.
- El handoff abierto o tomado pausa al agente; se vuelve a comprobar antes de publicar el resultado simulado.
- Las versiones de empleados IA y cotizaciones son append-only.

## Migraciones locales

- `202607300007_service_vertical_core.sql`
- `202607300008_service_vertical_p0.sql`
- `202607300009_service_vertical_p0_ui.sql`
- `202607300010_service_p0_workflows.sql`
- `202607300011_service_appointment_reschedule.sql`

Se validaron desde cero con Supabase CLI local. El rollback de `010` eliminó sólo sus objetos y preservó `service_requests`; después se reaplicó el esquema completo.

## Seguridad verificada

`supabase/tests/service_p0_rls.sql` comprueba aislamiento A/B, manipulación de `organization_id` y escritura de viewer. `service_p0_concurrent_booking.sql` ejecutado en dos sesiones produjo una reserva confirmada y un rechazo `capacity exceeded`.

## Riesgos residuales

- Los advisories npm del árbol de desarrollo dependen de Babel/ESLint/minimatch. Producción continúa con cero vulnerabilidades; no se usa `audit fix --force`.
- El canal real y un proveedor LLM real quedan fuera del P0.
- Las vistas de conocimiento y métricas son marcadores “Próximamente”.
