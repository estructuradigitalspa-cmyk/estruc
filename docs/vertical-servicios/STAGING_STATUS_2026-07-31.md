# Estado real de Elytsa staging — 31-07-2026

## Cloudflare / Namecheap
- Zona `elytsa.com` creada en la cuenta Cloudflare de Estructura Digital, plan Free.
- Activación y cambio de nameservers: **pendientes**.
- Motivo: el escaneo importó parking y cinco MX `eforward*.registrar-servers.com` más SPF de Namecheap. La orden prohíbe configurar correo; no se activó la zona con esos registros ni se tocó Namecheap.
- DNS de staging: no creado; Vercel todavía no ha entregado el valor para `staging.elytsa.com`.
- DNSSEC, reglas agresivas y correo: no configurados.

## Vercel
- Team: `estructuradigitalspa-cmyks-projects`.
- Proyecto independiente: `elytsa-staging` (`prj_1sCDgHQhI5HVXNymOVgKW9F0YWFk`).
- Repositorio: `estructuradigitalspa-cmyk/estruc`.
- Rama: `codex/vertical-empresas-servicios`.
- Commit: `ca88abd`.
- Deployment Preview Ready: `dpl_CWBBFJQGTbt1kN8EreTLJ2jMdaky`.
- URL privada: `https://elytsa-staging-7r9dvgdj3-estructuradigitalspa-cmyks-projects.vercel.app`.
- Deployment Protection verificada: solicita autenticación Vercel.
- Variables configuradas para esta rama Preview: `APP_ENV`, `NEXT_PUBLIC_APP_ENV`, `ALLOW_EXTERNAL_MESSAGES`, `ALLOW_REAL_WHATSAPP`, `LLM_PROVIDER`. Valores no expuestos; bloqueos externos falsos y proveedor mock.
- Variables Supabase: pendientes hasta que el proyecto complete aprovisionamiento.

## Supabase
- Proyecto exclusivo creado: `elytsa-staging` (`mthrnohgswdgjhoquztf`).
- Organización Free existente; región Americas.
- `Automatically expose new tables`: desactivado.
- `Enable automatic RLS`: activado.
- Estado observado: `Checking... / Compute Unknown`; migraciones, fixture, RLS A/B y rollback pendientes hasta que Compute esté operativo.
- No se copiaron secretos a Vercel ni se cargaron datos productivos.

## Validaciones locales
- `npm run lint`: aprobado.
- `npm run typecheck`: aprobado.
- `npm test`: 161/161.
- `npm run build`: aprobado, 51 páginas generadas.
- `npm audit --omit=dev`: 0 vulnerabilidades.
- `git diff --check`: aprobado.

## Límites verificados
Correo Elytsa, Email Routing, Resend, LLM real, WhatsApp real, Meta, pagos, producción, `main` y dominios de producción permanecen sin cambios.
