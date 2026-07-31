# Dominio Elytsa

Estado: comprado en Namecheap; DNS y hosting no verificados por Codex.

Arquitectura: Namecheap (registrador) → Cloudflare (DNS/seguridad) → Vercel (hosting). Producción futura: `elytsa.com`, `www.elytsa.com` → `elytsa.com`, y `app.elytsa.com`. Staging: `staging.elytsa.com` o `elytsa-staging.vercel.app`.

## Procedimiento del propietario
1. En Cloudflare, **Websites > Add a domain**, ingresar `elytsa.com`, elegir Free y revisar la importación sin confirmar registros dudosos.
2. Copiar exactamente los dos nameservers asignados.
3. En Namecheap, **Domain List > Manage elytsa.com > Nameservers > Custom DNS**, pegar ambos valores y guardar.
4. Esperar estado Active en Cloudflare. No eliminar parking hasta comparar cada registro importado.
5. En Vercel `elytsa-staging`, **Settings > Domains**, agregar primero `staging.elytsa.com`; copiar el registro que Vercel indique y crearlo idéntico en Cloudflare.
6. Validar resolución con `nslookup`, certificado HTTPS y respuesta del proyecto correcto.

No se inventan registros A/CNAME/TXT. `www` y apex se conectarán sólo tras aprobar staging. Costo esperado: dominio ya comprado; Cloudflare Free y dominio Vercel pueden ser sin costo, sujetos a planes vigentes.

Rollback: restaurar en Namecheap los nameservers anteriores anotados antes del paso 3. Riesgo: propagación de hasta 48 horas y corte de correo si se omiten MX/TXT existentes.
