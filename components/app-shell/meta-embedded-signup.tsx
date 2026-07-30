"use client";

import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    FB?: {
      init(options: { appId: string; cookie: boolean; xfbml: boolean; version: string }): void;
      login(callback: (response: { authResponse?: { code?: string } }) => void, options: Record<string, unknown>): void;
    };
  }
}

export function MetaEmbeddedSignup({ appId, configId, graphVersion }: { appId?: string; configId?: string; graphVersion: string }) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const configured = Boolean(appId && configId);
  function initialize() {
    if (!appId || !window.FB) return;
    window.FB.init({ appId, cookie: true, xfbml: false, version: graphVersion });
    setReady(true);
  }
  function connect() {
    if (!window.FB || !configId) return;
    setStatus("Esperando autorización de Meta…");
    window.FB.login(async (response) => {
      const code = response.authResponse?.code;
      if (!code) return setStatus("La autorización fue cancelada o no se completó.");
      const result = await fetch("/api/meta/embedded-signup/session", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }),
      });
      const body = (await result.json()) as { message?: string; error?: string };
      setStatus(body.message || body.error || "No fue posible completar la conexión.");
    }, { config_id: configId, response_type: "code", override_default_response_type: true });
  }
  return <section className="integration-detail">
    <Script src="https://connect.facebook.net/es_LA/sdk.js" strategy="afterInteractive" onLoad={initialize} />
    <h2>Conectar cuenta empresarial</h2>
    <p>Autoriza tus propios activos de Meta. Estructura Digital nunca solicita tu contraseña de Facebook.</p>
    <button className="button button-primary" type="button" onClick={connect} disabled={!configured || !ready}>Conectar con Facebook</button>
    {!configured && <p className="form-status">La configuración empresarial de Meta aún no está activa.</p>}
    {status && <p className="form-status" aria-live="polite">{status}</p>}
  </section>;
}
