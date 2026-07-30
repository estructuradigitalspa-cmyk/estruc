# Flujo de datos

## Sitio público

Visitante → formulario → validación Zod → Route Handler → Resend configurado → correo corporativo. Sin clave, producción devuelve un error honesto.

## SaaS

Usuario → Supabase Auth → sesión segura → membresía de organización → consultas PostgreSQL con RLS → módulos del panel.

## WhatsApp futuro

Cliente → Embedded Signup → Meta → callback servidor → credencial protegida → `integration_accounts` → webhook firmado → `webhook_events` → procesamiento diferido → conversaciones y mensajes de la organización.

## Eliminación

Solicitud pública o callback Meta → verificación → `data_deletion_requests` → identificación de organización/datos → eliminación o anonimización → confirmación. Pueden mantenerse registros mínimos por obligaciones legales o seguridad.
