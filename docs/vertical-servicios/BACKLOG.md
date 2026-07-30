# Backlog ejecutable

Formato: prioridad · complejidad · riesgo. Cada historia incluye objetivo, usuario, comportamiento, dependencias, aceptación y pruebas.

## Épica A — Operación base

### A1 Perfil operativo — P0 · M · medio
Objetivo/usuario: owner configura cobertura, horarios y políticas una vez por tenant. Comportamiento: lectura para miembros; escritura owner/admin. Dependencias: organización/RLS. Aceptación: valores validados, timezone/moneda explícitas, aislamiento A/B. Pruebas: constraints, roles, RLS y API.

### A2 Catálogo y precio acotado — P0 · M · alto
Objetivo/usuario: owner define servicios, variantes, extras y precio sin reglas libres. Comportamiento: fijo, cantidad, recargo fijo/porcentaje/zona o manual. Dependencias: A1. Aceptación: motor determinista; faltantes/manual devuelven revisión; nunca negativos. Pruebas: bordes, combinaciones, comunas, tenant. Estado: núcleo implementado; editor/variantes pendiente.

### A3 Solicitud y pipeline — P0 · M · medio
Objetivo/usuario: agente/equipo trazan cada oportunidad. Comportamiento: crear vinculada a contacto/conversación y transicionar sólo por aristas válidas. Dependencias: A2. Aceptación: estados, responsable, notas, prioridad, handoff con motivo; vistas lista/pipeline. Pruebas: transiciones, roles, RLS, API. Estado: núcleo/API/vistas implementados; edición/notas pendiente.

## Épica B — Empleado IA

### B1 Agente versionado — P0 · M · alto
Owner activa “Recepcionista y vendedor” con tono, límites, servicios, horarios y acciones. Dependencias: A1/A2. Aceptación: prompt versionado, activo/inactivo, allowlist de tools. Pruebas: roles, versiones y límites.

### B2 Orquestación segura — P0 · L · alto
Cliente recibe preguntas útiles; sistema ensambla capas y valida JSON estricto. Dependencias: B1/A3/proveedor. Aceptación: datos del cliente no alteran sistema; JSON inválido no ejecuta; precio/agenda sólo vía tools; telemetría sin razonamiento privado. Pruebas: injection, schema, tool calls, timeouts/retry. Estado: schema y contrato de canal implementados.

### B3 Simulador — P0 · M · medio
Owner prueba diez conversaciones sin enviar WhatsApp. Dependencias: B2/fixtures. Aceptación: reiniciable, sin contactos reales, muestra solicitud/decisiones/handoff. Pruebas: escenarios piloto.

## Épica C — Cotización y agenda

### C1 Cotización preliminar — P0 · L · alto
Vendedor crea items/totales/versiones desde solicitud. Dependencias: A2/A3. Aceptación: folio tenant, decimal seguro, vigencia/estados; automática sólo si completa; revisión en otro caso. Pruebas: totales, permisos, concurrencia.

### C2 Agenda interna — P0 · L · alto
Equipo ofrece slots reales por duración, horario, capacidad, zona, traslado y anticipación. Dependencias: A1/A2/A3. Aceptación: no solapamiento sobre capacidad; reprogramar/cancelar auditable. Pruebas: timezone/DST, concurrencia, capacidad.

### C3 Envío controlado — P1 · M · alto
Owner aprueba envío WhatsApp/email/enlace. Dependencias: C1/plantillas. Aceptación: flag explícito, ventana WhatsApp, idempotencia, sin envío en simulación. Pruebas: duplicados, templates y fallos.

## Épica D — Handoff y automatización

### D1 Transferencia humana — P0 · M · alto
Cliente o agente solicita humano; operador siempre toma control. Dependencias: A3/B2. Aceptación: pausa, motivo, prioridad, resumen/datos/preguntas, reactivación explícita. Pruebas: carrera humano/IA, roles y errores.

### D2 Seguimientos — P1 · L · alto
Owner activa recetas predefinidas. Dependencias: C1/C2/D1/worker. Aceptación: condiciones, cancelación, historial, idempotencia, límites y plantillas fuera de ventana. Pruebas: reloj falso, reintento, doble worker.

## Épica E — Conocimiento y analítica

### E1 Conocimiento estructurado — P0 · M · medio
Owner mantiene FAQ/políticas/exclusiones exactas. Dependencias: A1. Aceptación: versionado, tenant, fuente citada internamente. Pruebas: permisos y recuperación.

### E2 Documentos — P1 · L · alto
Owner carga PDF/DOCX/text/web. Dependencias: Storage. Aceptación: MIME/tamaño, URL firmada, estados/versiones/borrado; pgvector sólo tras evaluación. Pruebas: archivo hostil, tenant, borrado.

### E3 Métricas — P1 · M · medio
Dueño ve volumen, tiempos, funnel, handoff y costo estimado. Dependencias: eventos A–D. Aceptación: fórmulas documentadas; no atribuye ingresos sin pago confirmado. Pruebas: agregación y timezone.

## Épica F — Escala futura

F1 Google Calendar por adaptador — P2 · L · alto. F2 constructor visual — P3 · XL · alto. F3 webchat/Instagram/email — P3 · XL · alto. F4 voz sobre `ConversationChannelAdapter` — P3 · XL · alto. Ninguna bloquea el piloto.

