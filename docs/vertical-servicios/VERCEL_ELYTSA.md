# Vercel Elytsa

Estado: preparado en código; proyecto externo pendiente.

Crear dentro del Team de Estructura Digital un proyecto independiente **elytsa-staging** conectado a este repositorio. No reutilizar el proyecto público actual.

## Configuración
- Framework: Next.js; build `npm run build`; Node según `package.json`.
- Environment: Preview/Staging, no Production.
- Variables mínimas: `APP_ENV=staging`, `NEXT_PUBLIC_APP_ENV=staging`, `ALLOW_EXTERNAL_MESSAGES=false`, `ALLOW_REAL_WHATSAPP=false`, `LLM_PROVIDER=simulated`.
- Agregar Supabase y otros secretos sólo desde proyectos exclusivos de staging. Nunca copiar producción.
- Activar Deployment Protection si el plan lo permite.
- Esperar `elytsa-staging.vercel.app`; luego agregar `staging.elytsa.com` y copiar exactamente la instrucción DNS de Vercel.

## Validación
Build verde; `/robots.txt` devuelve `Disallow: /`; cabeceras y HTTPS correctos; login usa Supabase staging; diagnóstico informa efectos externos desactivados. No agregar `elytsa.com` hasta aprobación.

Costo: sujeto al plan Vercel y protección elegida. Rollback: promover el deployment anterior o desconectar sólo el dominio staging. Responsable: tecnología.
