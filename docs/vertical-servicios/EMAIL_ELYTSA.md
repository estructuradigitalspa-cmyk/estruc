# Correo Elytsa

Estado: no operativo; falta casilla destino y verificación DNS.

## Opción A — lanzamiento económico
Cloudflare Email Routing: `contacto@elytsa.com` → casilla existente que debe entregar el propietario. Es reenvío, no una bandeja completa. Separar envíos transaccionales (`notificaciones@` o `no-reply@`) mediante Resend sólo tras verificar dominio y credencial de staging.

## Opción B — casilla profesional
Google Workspace, Microsoft 365, Zoho, Namecheap Private Email u otro proveedor aprobado. Requiere contratación explícita.

## Pasos
1. Propietario entrega el correo destino sin publicarlo en el repositorio.
2. Cloudflare > Email > Email Routing > Get started; copiar exactamente los MX/TXT propuestos y verificar destino.
3. Para envíos, agregar dominio en el proveedor autorizado y copiar sus SPF/DKIM exactos. No crear un segundo SPF: combinar según su documentación.
4. Crear DMARC gradual con el valor generado y revisado por el propietario; comenzar monitoreando (`p=none`) y endurecer después de validar todos los emisores.
5. Probar recepción, respuesta autenticada y entrega a Gmail/Outlook. Registrar resultados, no contenido personal.

Faltan: destino, proveedor transaccional, DNS real y autorización. Rollback: deshabilitar routing y retirar únicamente los registros documentados de esta configuración.
