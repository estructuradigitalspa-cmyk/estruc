# Branding Elytsa

Estado: implementado en código; revisión comercial pendiente.

## Decisión
Elytsa es el nombre visible del SaaS. Estructura Digital SpA conserva la propiedad legal y los identificadores técnicos compatibles. La fuente única está en `lib/site-config.ts`: nombre, entidad legal, dominio, correo, seguridad y planes.

Mensaje seleccionado: **“Tu equipo crece. Tu atención también.”** Explica el resultado con el apoyo: “empleados de IA que atienden, cotizan, agendan y hacen seguimiento”. Evita prometer autonomía total o ausencia de errores.

## Validación
Revisar `/`, header, footer, metadatos, manifest y `/onboarding`. Confirmar que precios y relación legal provienen de configuración. La imagen social es `public/og.png`.

## Pendientes y responsables
- Propietario: aprobar identidad, precios y textos.
- Legal: aprobar términos y privacidad; hoy se presentan como borradores.
- Tecnología: no renombrar tablas, migraciones ni namespaces sin un plan de compatibilidad.

Rollback: revertir el commit de branding; no requiere migración de base de datos.
