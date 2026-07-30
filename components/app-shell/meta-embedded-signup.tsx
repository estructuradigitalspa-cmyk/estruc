"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { parseMetaEmbeddedEvent, type EmbeddedAssets } from "@/lib/meta-embedded-event";

declare global {
  interface Window {
    FB?: {
      init(options: { appId: string; cookie: boolean; xfbml: boolean; version: string }): void;
      login(callback: (response: { authResponse?: { code?: string } }) => void, options: Record<string, unknown>): void;
    };
  }
}

type Assets = EmbeddedAssets;
type Session = { state: string; nonce: string; session_id: string };
type Status = "not_connected" | "connecting" | "connected" | "error";

export const META_AUTHORIZATION_TIMEOUT_MS = 90_000;

export function MetaEmbeddedSignup({ appId, configId, graphVersion }: { appId?: string; configId?: string; graphVersion: string }) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<Status>("not_connected");
  const [message, setMessage] = useState("");
  const codeRef = useRef<string | undefined>(undefined);
  const assetsRef = useRef<Assets | undefined>(undefined);
  const sessionRef = useRef<Session | undefined>(undefined);
  const finishingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const attemptRef = useRef(0);
  const configured = Boolean(appId && configId);

  const clearAuthorizationTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const resetAttempt = useCallback(() => {
    clearAuthorizationTimeout();
    codeRef.current = undefined;
    assetsRef.current = undefined;
    sessionRef.current = undefined;
    finishingRef.current = false;
  }, [clearAuthorizationTimeout]);

  const finish = useCallback(async () => {
    const code = codeRef.current;
    const assets = assetsRef.current;
    const session = sessionRef.current;
    if (!code || !assets || !session || finishingRef.current) return;

    clearAuthorizationTimeout();
    finishingRef.current = true;
    setStatus("connecting");

    try {
      const response = await fetch("/api/meta/embedded-signup/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, ...assets, ...session }),
      });
      const body = (await response.json()) as { status?: string; error?: string };
      setStatus(response.ok ? "connected" : "error");
      setMessage(body.error || "WhatsApp conectado y validado.");
    } catch {
      setStatus("error");
      setMessage("Se perdiÃ³ la comunicaciÃ³n al completar la conexiÃ³n. Puedes reintentar.");
    } finally {
      finishingRef.current = false;
    }
  }, [clearAuthorizationTimeout]);

  useEffect(() => {
    function listener(event: MessageEvent) {
      const parsed = parseMetaEmbeddedEvent(event.origin, event.data);
      if (!parsed) return;
      if (parsed.kind === "cancel") {
        resetAttempt();
        setStatus("not_connected");
        setMessage("La conexiÃ³n fue cancelada. Puedes intentarlo nuevamente.");
        return;
      }
      if (parsed.kind === "error") {
        resetAttempt();
        setStatus("error");
        setMessage("Meta informÃ³ un error durante la conexiÃ³n. Revisa el diÃ¡logo e intÃ©ntalo nuevamente.");
        return;
      }
      assetsRef.current = parsed.assets;
      void finish();
    }

    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
      clearAuthorizationTimeout();
    };
  }, [clearAuthorizationTimeout, finish, resetAttempt]);

  function initialize() {
    if (!appId || !window.FB) return;
    window.FB.init({ appId, cookie: true, xfbml: false, version: graphVersion });
    setReady(true);
  }

  async function connect() {
    if (!window.FB || !configId) return;

    resetAttempt();
    const attempt = ++attemptRef.current;
    setStatus("connecting");
    setMessage("Esperando autorizaciÃ³n de Metaâ€¦");

    try {
      const sessionResponse = await fetch("/api/meta/embedded-signup/session", { cache: "no-store" });
      if (!sessionResponse.ok) throw new Error("SESSION_START_FAILED");
      sessionRef.current = (await sessionResponse.json()) as Session;

      timeoutRef.current = setTimeout(() => {
        if (attemptRef.current !== attempt || finishingRef.current) return;
        resetAttempt();
        setStatus("not_connected");
        setMessage("La ventana de Meta no respondiÃ³ o fue cerrada. Puedes intentarlo nuevamente.");
      }, META_AUTHORIZATION_TIMEOUT_MS);

      window.FB.login((response) => {
        if (attemptRef.current !== attempt) return;
        const code = response.authResponse?.code;
        if (!code) {
          resetAttempt();
          setStatus("not_connected");
          setMessage("La autorizaciÃ³n fue cancelada o no se completÃ³. Puedes intentarlo nuevamente.");
          return;
        }
        codeRef.current = code;
        void finish();
      }, {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        state: sessionRef.current.state,
      });
    } catch {
      resetAttempt();
      setStatus("error");
      setMessage("No fue posible abrir una sesiÃ³n segura con Meta. Puedes reintentar.");
    }
  }

  return <section className="integration-detail">
    <Script src="https://connect.facebook.net/es_LA/sdk.js" strategy="afterInteractive" onLoad={initialize}/>
    <h2>Conectar cuenta empresarial</h2>
    <p>Autoriza tus activos mediante WhatsApp Embedded Signup de Meta. Los tokens nunca llegan al navegador.</p>
    <button id="meta-embedded-connect" className="button button-primary" type="button" onClick={connect} disabled={!configured || !ready || status === "connecting"}>{status === "connecting" ? "Conectandoâ€¦" : "Conectar con Facebook"}</button>
    {!configured && <p className="form-status">La configuraciÃ³n empresarial de Meta no estÃ¡ activa.</p>}
    {message && <p className="form-status" aria-live="polite">{message}</p>}
    <p className="form-status">Estado: <strong>{status}</strong></p>
  </section>;
}
