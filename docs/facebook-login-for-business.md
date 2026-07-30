# Facebook Login for Business

Supabase Auth administra Facebook Login. La URI que Meta debe permitir es `https://ocmcyhimhndlxlicojrs.supabase.co/auth/v1/callback`. Supabase debe aceptar `https://estructuradigital.cl/auth/callback`; la ruta canjea el código/verificador y redirige solo a destinos internos validados.

Las apps se separan mediante `META_LOGIN_APP_ID`/`META_LOGIN_APP_SECRET` y `META_BUSINESS_APP_ID`/`META_BUSINESS_APP_SECRET`. No se intercambian secretos entre aplicaciones.