# Rotación de credenciales Meta

El cifrado de tokens usa AES-256-GCM con versión incluida en cada ciphertext. La versión activa se define con `META_TOKEN_ENCRYPTION_ACTIVE_VERSION`; durante la transición el backend puede descifrar `v1` y `v2`.

## Procedimiento seguro

1. Crear un respaldo verificable de la base de datos.
2. Aplicar la migración aditiva `202607300005_credential_rotation.sql`.
3. Configurar `META_TOKEN_ENCRYPTION_KEY_V1` con la clave actual y una nueva `META_TOKEN_ENCRYPTION_KEY_V2`, sin imprimirlas ni guardarlas localmente.
4. Mantener `META_TOKEN_ENCRYPTION_ACTIVE_VERSION=v1` y ejecutar el script en modo dry-run.
5. Cambiar la versión activa a `v2`, redeploy y comprobar que nuevas credenciales se escriben como `v2`.
6. Ejecutar nuevamente el dry-run y revisar cantidad e IDs de registros pendientes.
7. Solo con autorización expresa, ejecutar la rotación mediante `--apply` y la confirmación exigida por el script.
8. Verificar lectura, envío, webhook y reconexión. Mantener la clave v1 durante la ventana de rollback.
9. Después del periodo acordado y un respaldo final, retirar la clave v1 y las variables heredadas.

El script no muestra tokens ni plaintext. Antes de reemplazar cada ciphertext crea un respaldo en `credential_rotation_backups` y usa una actualización compare-and-swap para evitar sobrescribir cambios concurrentes.

## Rollback

- Volver a desplegar con `META_TOKEN_ENCRYPTION_ACTIVE_VERSION=v1`.
- Restaurar únicamente los ciphertext afectados desde `credential_rotation_backups`, después de validar el `rotation_id`.
- No eliminar respaldos ni claves antiguas hasta que el propietario apruebe el cierre de la ventana de rollback.

La rotación real no forma parte de la implementación automática: requiere una clave v2 configurada, respaldo confirmado y autorización explícita.
## Comandos verificados

Ejecutar desde la raíz y autenticarse con la CLI sin escribir tokens en la línea de comandos:

```powershell
npx --yes supabase@latest login
npx --yes supabase@latest link --project-ref ocmcyhimhndlxlicojrs
New-Item -ItemType Directory -Force -Path C:\tmp\estructura-supabase-backup
npx --yes supabase@latest db dump --linked --schema public,auth --file C:\tmp\estructura-supabase-backup\pre-aes-v2.sql
npx --yes supabase@latest db push --linked --dry-run
```

Después de revisar el respaldo y el dry-run, aplicar únicamente con autorización:

```powershell
npx --yes supabase@latest db push --linked
node .\tools\rotate-meta-token-credentials.mjs --limit=100
```

El primer llamado del script es dry-run. La rotación real exige que las variables se inyecten desde un entorno seguro y una confirmación explícita; no pegarlas en el historial del shell:

```powershell
node .\tools\rotate-meta-token-credentials.mjs --apply --limit=100
```

Antes de `--apply`, el entorno seguro debe contener `META_ROTATION_CONFIRM=rotate-to-v2`. Verificación posterior:

```powershell
node .\tools\rotate-meta-token-credentials.mjs --limit=100
npm test -- --run tests/meta-token-versioning.test.ts tests/credential-rotation-contract.test.ts
```

Los errores 429/5xx/red se reintentan hasta tres veces. Un conflicto compare-and-swap se informa como `concurrent_skip`; se debe investigar y repetir en una rotación nueva para que exista un respaldo consistente.

Rollback SQL, solo con autorización y el `rotation_id` confirmado:

```sql
begin;
update public.integration_accounts as account
set encrypted_credentials = backup.encrypted_credentials
from public.credential_rotation_backups as backup
where backup.rotation_id = '<ROTATION_ID>'::uuid
  and backup.integration_account_id = account.id;
commit;
```

El rollback estructural está en `supabase/rollbacks/202607300005_credential_rotation.rollback.sql` y solo puede aplicarse cuando no se necesite ningún respaldo de rotación.