# Modelo de seguridad

- Supabase Auth identifica al usuario.
- `organization_members` relaciona usuarios y organizaciones con roles `owner`, `admin`, `agent`, `viewer`.
- RLS consulta funciones `is_org_member` y `has_org_role`; el aislamiento no depende del frontend.
- Las claves Service Role, Meta App Secret y tokens permanecen en servidor.
- TLS protege datos en tránsito.
- Los webhooks validan firma cuando existe secreto y no registran contenido sensible completo.
- `audit_logs` mantiene trazabilidad por organización.
- Se aplican minimización, retención limitada, eliminación y rotación de credenciales según riesgo.
- Los incidentes requieren identificación, contención, recuperación, comunicación y revisión posterior.

No se declaran certificaciones inexistentes.
