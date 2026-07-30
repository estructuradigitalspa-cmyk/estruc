"use client";

import { useState } from "react";
import { Facebook } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function FacebookLoginButton() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function signIn() {
    setPending(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/app` },
      });
      if (oauthError) throw oauthError;
    } catch {
      setPending(false);
      setError("No fue posible iniciar el acceso con Facebook.");
    }
  }
  return <>
    <button className="button facebook-login" type="button" onClick={signIn} disabled={pending}>
      <Facebook aria-hidden="true" />{pending ? "Conectando…" : "Continuar con Facebook"}
    </button>
    {error && <p className="form-status error">{error}</p>}
  </>;
}
