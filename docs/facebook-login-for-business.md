# Facebook Login for Business

## URLs canónicas de producción

- Callback de la aplicación (Supabase PKCE): `https://estructuradigital.cl/auth/callback`
- Origen permitido para el SDK JavaScript: `https://estructuradigital.cl`
- Dominio de la aplicación en Meta: `estructuradigital.cl`

## URI que se registra en Meta

Facebook Login usado como proveedor de Supabase no vuelve directamente al
dominio de la aplicación. En “URI de redireccionamiento de OAuth válidos” se
debe registrar la Callback URL que Supabase muestra en
`Authentication → Providers → Facebook`.

Formato exacto:

`https://<PROJECT_REF>.supabase.co/auth/v1/callback`

No se debe registrar `/api/auth/meta/callback`, `/api/meta/oauth/callback`,
localhost ni una URL de preview. El `PROJECT_REF` debe obtenerse del proyecto
Supabase real; no se puede inferir de las claves públicas.

En Supabase, agrega a la allow list:

`https://estructuradigital.cl/auth/callback`

## Separación de flujos

1. `signInWithOAuth({ provider: "facebook" })` autentica al usuario del SaaS.
2. Supabase recibe el retorno de Meta y redirige con PKCE a `/auth/callback`.
3. `/auth/callback` intercambia el código por la sesión Supabase y acepta solo destinos internos.
4. El SDK oficial de Meta inicia por separado Facebook Login for Business con `config_id`.
5. El código empresarial se intercambia en el servidor y el token se cifra con AES-256-GCM.

## Variables necesarias

- `NEXT_PUBLIC_SITE_URL=https://estructuradigital.cl`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `META_APP_ID`
- `META_APP_SECRET`
- `META_CONFIG_ID`
- `META_GRAPH_API_VERSION`
- `META_TOKEN_ENCRYPTION_KEY`: 32 bytes aleatorios codificados en Base64
