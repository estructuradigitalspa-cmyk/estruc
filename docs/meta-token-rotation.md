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
