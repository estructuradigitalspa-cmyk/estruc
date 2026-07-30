# Eliminación de datos

`POST /api/meta/data-deletion` valida el `signed_request` contra exactamente una app Meta, crea una solicitud y devuelve URL/código. Estados: `processing`, `completed`, `failed`. La consulta pública es `GET /data-deletion/status/[code]` y solo expone estado/fechas/código de error.

Si no se resuelve identidad, la solicitud falla. Un Owner único con otros miembros debe transferir propiedad; una organización de un solo miembro puede eliminarse por cascada. El despliegue de esta función destructiva requiere respaldo y autorización explícita.