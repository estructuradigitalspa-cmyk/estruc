# Checklist de lanzamiento Elytsa

Estado al 31-07-2026. `[x]` verificado en código; `[ ]` requiere acceso, credencial o aprobación.

## Branding
- [x] Identidad central Elytsa y relación legal
- [x] Landing, precios y onboarding por empleado
- [ ] Aprobación comercial y revisión legal

## Infraestructura
- [ ] GitHub: decidir renombre, revisar branch protection/checks/Dependabot
- [ ] Crear Vercel `elytsa-staging` y validar protección
- [ ] Crear Supabase `elytsa-staging`, migrar, seed y probar RLS
- [ ] Activar zona Cloudflare, nameservers, dominio y SSL

## Correo
- [ ] Propietario entrega destino de `contacto@elytsa.com`
- [ ] Verificar recepción, remitente, MX, SPF, DKIM y DMARC

## IA y seguridad
- [x] Proveedor simulado predeterminado
- [x] Mensajes externos y WhatsApp real desactivados en ejemplos
- [x] Staging no indexable por configuración
- [ ] Credencial LLM exclusiva, presupuesto y prueba autorizada
- [ ] Ejecutar pruebas SQL de RLS/tenant en Supabase staging

## Piloto
- [ ] Organización sintética y onboarding
- [ ] Conversación, cotización, agenda, handoff y métricas

## Gate final
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm audit --omit=dev`
- [ ] Repositorio limpio y revisión de secretos

No se ha afirmado ningún cambio externo. Responsable de pasos manuales: propietario de cuentas; responsable de verificación técnica: tecnología.
