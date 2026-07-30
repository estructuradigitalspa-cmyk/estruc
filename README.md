# Estructura Digital SaaS

SaaS multiempresa en Next.js 16, Supabase y Vercel. La autenticación usa Supabase Auth; Facebook Login retorna por `/auth/callback`. WhatsApp usa como flujo canónico Embedded Signup con el SDK oficial de Meta, intercambio de código exclusivamente servidor y credenciales cifradas con AES-256-GCM.

## Validación local

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run test:coverage
npm run build
```

La configuración se documenta en `docs/production-deployment.md`. Nunca copies secretos a archivos, capturas o logs.