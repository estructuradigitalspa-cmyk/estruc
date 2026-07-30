# Seguridad

Aislamiento por `organization_id` y RLS; organización activa en cookie HttpOnly validada contra membresía en cada request. Service role solo servidor. Tokens Meta cifrados AES-256-GCM y excluidos de la vista segura. Operaciones administrativas validan Origin/Host, rol y rate limit distribuido en Supabase. OAuth usa state HMAC y nonce atómico de un uso. CSP, nosniff, Referrer-Policy y Permissions-Policy están activos.

No registrar tokens, secretos, signed_request, códigos OAuth, ciphertext ni payloads completos. Evidencias compartibles solo en `evidence/sanitized`.