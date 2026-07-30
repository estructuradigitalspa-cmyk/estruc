# Incorporación de WhatsApp en producción

Estado Meta observado por el propietario: verificación del negocio en proceso, número no registrado, método de pago no agregado y plantilla no creada. Este procedimiento no ejecuta ninguno de esos pasos.

## Número telefónico

La base soporta por tenant `business_id`, `waba_id`, `phone_number_id`, número visible, nombre verificado, moneda, calidad/estado en metadata, estado de conexión, expiración y token cifrado. La unicidad efectiva es organización + WABA + número. En producción no existe fallback global: solo se habilita en desarrollo cuando `ENABLE_GLOBAL_WHATSAPP_FALLBACK=true`.

Antes de registrar:

- Elegir el Business Portfolio Estructura Digital y la WABA definitiva.
- Confirmar que el número puede recibir OTP por SMS o llamada.
- El número no debe continuar registrado en una app WhatsApp personal/Business tradicional, salvo que el flujo de Meta ofrezca explícitamente coexistencia o migración para esa cuenta. No desregistrarlo antes de respaldar chats y acordar la ventana.
- Confirmar nombre para mostrar y documentos comerciales consistentes.
- No usar un número personal.

Procedimiento posterior a la aprobación:

1. Iniciar Embedded Signup desde el tenant Owner/Admin correcto.
2. Seleccionar el Business Portfolio, WABA y número acordados.
3. Completar OTP dentro del popup oficial de Meta.
4. Esperar evento `FINISH`; verificar que Business, WABA y Phone Number ID correspondan a los activos elegidos.
5. Confirmar estado `connected` en la plataforma y ejecutar revalidación.
6. Enviar primero una plantilla aprobada a un destinatario autorizado.
7. Confirmar webhook entrante y estados `sent`, `delivered`, `read`; validar también un `failed` controlado sin exponer detalle sensible.
8. Probar desconexión/reconexión y aislamiento con una segunda organización ficticia.

## Método de pago

Se agrega en WhatsApp Manager/Meta Business Suite sobre la WABA que facturará las conversaciones, dentro del Business Portfolio Estructura Digital. La plataforma no captura ni almacena titular, PAN, vencimiento, CVV ni otros datos de tarjeta.

Checklist manual:

- [ ] Business Portfolio: Estructura Digital.
- [ ] WABA: la misma seleccionada en Embedded Signup.
- [ ] Titular autorizado.
- [ ] Dirección de facturación coincidente.
- [ ] País y moneda confirmados antes de guardar.
- [ ] Método agregado directamente en Meta.
- [ ] Facturación visible en la WABA correcta.

## Plantilla Utility propuesta

- Nombre: `confirmacion_solicitud`.
- Idioma: español (`es`).
- Categoría: Utility.
- Cuerpo: `Hola {{1}}, recibimos tu solicitud en {{2}}. Te contactaremos por este medio para continuar con la atención.`
- Ejemplo `{{1}}`: `Sebastián`.
- Ejemplo `{{2}}`: `Estructura Digital`.

El texto confirma una acción previa, no ofrece promociones ni descuentos. Debe enviarse a aprobación manualmente después de confirmar la WABA y el número. La migración `202607300006_whatsapp_templates.sql` prepara almacenamiento tenant-scoped de nombre, idioma, namespace opcional, estado, categoría, componentes e ID Meta. El payload Graph API está implementado y probado; no se envió ninguna plantilla real.