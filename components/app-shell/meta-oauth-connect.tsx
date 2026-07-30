export function MetaOAuthConnect({
  configured,
  status,
}: {
  configured: boolean;
  status?: string;
}) {
  const messages: Record<string, string> = {
    connected: "WhatsApp quedó conectado y suscrito a mensajes.",
    cancelled: "La autorización fue cancelada.",
    invalid_state: "La autorización expiró o no superó la validación de seguridad.",
    no_assets: "Meta no devolvió una WABA con números disponibles.",
    error: "No fue posible completar la conexión con Meta.",
    forbidden: "Solo propietarios y administradores pueden conectar WhatsApp.",
    missing: "La configuración de Embedded Signup aún no está completa.",
  };
  return (
    <section className="integration-detail">
      <h2>Conectar WhatsApp</h2>
      <p>Autoriza, selecciona o crea una WABA y registra un número dentro del flujo seguro de Meta.</p>
      <a
        className={`button button-primary${configured ? "" : " is-disabled"}`}
        href={configured ? "/api/meta/oauth/start" : undefined}
        aria-disabled={!configured}
      >
        Conectar WhatsApp
      </a>
      {!configured && <p className="form-status">Falta configurar el identificador de Embedded Signup.</p>}
      {status && messages[status] && <p className="form-status" aria-live="polite">{messages[status]}</p>}
    </section>
  );
}
