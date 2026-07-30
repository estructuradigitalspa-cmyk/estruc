# Respaldo y rollback de la migración 202607300004

Antes de aplicar producción:

1. Confirmar que Supabase PITR o backups diarios estén activos y anotar el recovery point.
2. Generar un dump lógico cifrado fuera del repositorio (esquema y datos) usando credenciales obtenidas directamente del vault; nunca escribirlas en terminal, archivos del proyecto o logs.
3. Ejecutar `supabase/preflight/202607300004_preflight.sql` en modo read-only. Cualquier fila de duplicados bloquea la migración; no eliminar automáticamente.
4. Aplicar la migración en transacción y verificar funciones, policies, vista y restricciones.
5. Desplegar la misma revisión de código solo después de que la migración termine.

Rollback de objetos: `supabase/rollback_202607300004.sql`. Las columnas se conservan deliberadamente para evitar pérdida. Para rollback de datos o desastre, restaurar al recovery point documentado. La eliminación de duplicados o datos reales requiere autorización separada.