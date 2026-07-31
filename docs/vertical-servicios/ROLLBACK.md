# Rollback Elytsa

1. Aplicación: identificar el último commit estable y revertir commits Elytsa con `git revert`; no usar reset destructivo. Ejecutar todas las validaciones antes de desplegar.
2. Vercel: promover el deployment estable anterior y retirar únicamente `staging.elytsa.com` si el problema es DNS.
3. Cloudflare: desactivar reglas nuevas; restaurar registros desde la exportación previa. Retirar DNSSEC en Namecheap antes de cambiar nameservers.
4. Supabase: detener tráfico, respaldar, ejecutar el rollback asociado a la migración afectada y validar RLS. Nunca ejecutar contra producción por suposición.
5. Correo: desactivar routing/remitente y retirar sólo MX/TXT documentados, restaurando la exportación DNS.

Criterios de activación: exposición de secretos, mezcla de tenants, mensajes reales no autorizados, pérdida de datos, autenticación rota o dominio apuntando al proyecto incorrecto. Responsable de declarar incidente: propietario técnico. Registrar hora, alcance, cambios, evidencias sanitizadas y resultado.
