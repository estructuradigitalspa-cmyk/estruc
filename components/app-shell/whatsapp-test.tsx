"use client";

import { useEffect, useState } from "react";

type SendResult = { ok?: boolean; messageId?: string; status?: string; error?: string; code?: number };
type StatusResult = {
  message?: { external_id: string; status: string; sent_at?: string; delivered_at?: string; read_at?: string } | null;
};

export function WhatsAppTest() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("Prueba de integración desde Estructura Digital.");
  const [result, setResult] = useState<SendResult | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!result?.messageId) return;
    const interval = window.setInterval(async () => {
      const response = await fetch(`/api/whatsapp/status?id=${encodeURIComponent(result.messageId!)}`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = (await response.json()) as StatusResult;
      if (data.message?.status) setCurrentStatus(data.message.status);
      if (data.message?.status === "read") window.clearInterval(interval);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [result?.messageId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);
    setCurrentStatus(null);
    const response = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message }),
    });
    const data = (await response.json()) as SendResult;
    setResult(data);
    setCurrentStatus(data.status ?? null);
    setPending(false);
  }

  return (
    <section className="integration-detail">
      <h2>Prueba con número de Meta</h2>
      <p>Ingresa únicamente un destinatario autorizado en la consola de WhatsApp. El token permanece en el servidor.</p>
      <form className="auth-form" onSubmit={submit}>
        <label htmlFor="whatsapp-to">Número autorizado, formato internacional</label>
        <input id="whatsapp-to" inputMode="numeric" autoComplete="tel" placeholder="56912345678" value={to} onChange={(event) => setTo(event.target.value.replace(/\D/g, ""))} required />
        <label htmlFor="whatsapp-message">Mensaje</label>
        <textarea id="whatsapp-message" rows={4} maxLength={4096} value={message} onChange={(event) => setMessage(event.target.value)} required />
        <button className="button button-primary" disabled={pending}>{pending ? "Enviando…" : "Enviar mensaje de prueba"}</button>
      </form>
      {result?.error && <div className="app-alert" role="alert"><strong>No fue posible enviar.</strong> {result.error}{result.code ? ` (Meta ${result.code})` : ""}</div>}
      {result?.messageId && <div className="app-alert" aria-live="polite"><strong>Mensaje aceptado por Meta.</strong><br />ID: <code>{result.messageId}</code><br />Estado persistido: <strong>{currentStatus ?? "sent"}</strong></div>}
    </section>
  );
}
