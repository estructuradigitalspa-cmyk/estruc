# Respuesta a incidentes

1. Contener: desactivar endpoint/integración afectada sin borrar evidencia.
2. Rotar: secreto de app, token, verify token o clave de cifrado según alcance; no imprimir valores.
3. Evaluar: organizaciones, ventanas temporales, eventos y auditoría afectadas.
4. Recuperar: revalidar suscripciones, procesar `pending`, revisar `dead_letter` y restaurar desde respaldo si corresponde.
5. Comunicar y documentar: línea temporal, causa, impacto, acciones y prevención.

Alertas críticas: secretos faltantes, firmas inválidas repetidas, token expirado, fallos de suscripción/envío/descifrado, cola acumulada, dead-letter y rate limit reiterado.