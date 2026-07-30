import { NextResponse } from "next/server";
import { getApiContext } from "@/lib/supabase/api-context";
import { createMetaOAuthState } from "@/lib/meta-oauth-state";

export async function GET() {
  const context = await getApiContext();
  if (!context) return NextResponse.redirect("https://estructuradigital.cl/iniciar-sesion");
  if (!["owner", "admin"].includes(context.role)) {
    return NextResponse.redirect("https://estructuradigital.cl/app/integraciones/whatsapp?meta=forbidden");
  }
  const appId = process.env.META_APP_ID;
  const configId = process.env.META_CONFIG_ID;
  if (!appId || !configId) {
    return NextResponse.redirect("https://estructuradigital.cl/app/integraciones/whatsapp?meta=missing");
  }
  const { state, payload } = createMetaOAuthState(context.organizationId, context.user.id);
  const redirectUri = "https://estructuradigital.cl/api/meta/oauth/callback";
  const oauth = new URL(`https://www.facebook.com/${process.env.META_GRAPH_API_VERSION || "v26.0"}/dialog/oauth`);
  oauth.searchParams.set("client_id", appId);
  oauth.searchParams.set("redirect_uri", redirectUri);
  oauth.searchParams.set("state", state);
  oauth.searchParams.set("config_id", configId);
  oauth.searchParams.set("response_type", "code");
  oauth.searchParams.set("override_default_response_type", "true");
  const response = NextResponse.redirect(oauth);
  response.cookies.set("meta_oauth_nonce", payload.nonce, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/meta/oauth/callback",
    maxAge: 10 * 60,
  });
  return response;
}
