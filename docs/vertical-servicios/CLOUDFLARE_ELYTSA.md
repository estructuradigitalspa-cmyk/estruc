# Cloudflare Elytsa

Estado: intervención humana requerida; no verificado.

Usar la misma cuenta de Estructura Digital y una zona independiente `elytsa.com`. No copiar reglas ni registros de `estructuradigital.cl` sin auditoría.

## Orden seguro
- Activar zona y validar nameservers.
- Auditar DNS; mantener DNS-only cuando Vercel o el proveedor de correo lo exijan.
- SSL/TLS: comenzar con **Full (strict)** sólo cuando el origen tenga certificado válido. Activar Always Use HTTPS después de validar HTTPS.
- Cache: no cachear `/app/*`, `/api/*`, callbacks, webhooks ni rutas autenticadas. No crear reglas agresivas de WAF durante el piloto.
- Email Routing: agregar `contacto@elytsa.com` únicamente cuando el propietario entregue y verifique la casilla destino.
- DNSSEC: activar al final; copiar el DS generado por Cloudflare en Namecheap y comprobar estado Active.

## Validación
`elytsa.com` debe figurar Active; DNS apunta al valor entregado por Vercel; HTTPS no presenta bucles; login, Supabase y webhooks no se cachean. Documentar cada valor real en el registro operativo, nunca secretos.

Rollback: desactivar reglas nuevas, poner registros en DNS-only y retirar DS antes de cambiar nameservers. Responsable: propietario de dominio + tecnología.
