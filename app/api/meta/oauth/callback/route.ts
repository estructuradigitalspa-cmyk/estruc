import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getApiContext } from "@/lib/supabase/api-context";
import { discoverWhatsAppAssets, exchangeMetaCode, subscribeWaba } from "@/lib/meta-assets";
import { verifyMetaOAuthState } from "@/lib/meta-oauth-state";
import { encryptMetaToken } from "@/lib/meta-token-crypto";

const destination = "https://estructuradigital.cl/app/integraciones/whatsapp";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) return NextResponse.redirect(`${destination}?meta=cancelled`);
  const code = url.searchParams.get("code");
  const stateValue = url.searchParams.get("state");
  const cookieStore = await cookies();
  const state = verifyMetaOAuthState(stateValue, cookieStore.get("meta_oauth_nonce")?.value);
  const context = await getApiContext();
  if (!code || !state || !context || state.userId !== context.user.id || state.organizationId !== context.organizationId) {
    return NextResponse.redirect(`${destination}?meta=invalid_state`);
  }
  try {
    const token = await exchangeMetaCode(code);
    const accessToken = token.access_token;
    if (!accessToken) throw new Error("Meta access token missing");
    const assets = await discoverWhatsAppAssets(accessToken);
    if (!assets.length || assets.every((asset) => asset.phones.length === 0)) {
      return NextResponse.redirect(`${destination}?meta=no_assets`);
    }
    const admin = createAdminClient();
    const { data: integration, error: integrationError } = await admin
      .from("integrations")
      .upsert(
        {
          organization_id: context.organizationId,
          provider: "whatsapp",
          status: "connected",
          config: { flow: "embedded_signup", graph_version: process.env.META_GRAPH_API_VERSION || "v26.0" },
        },
        { onConflict: "organization_id,provider" },
      )
      .select("id")
      .single();
    if (integrationError || !integration) throw integrationError ?? new Error("Integration insert failed");
    const encrypted = encryptMetaToken(accessToken);
    for (const asset of assets) {
      await subscribeWaba(asset.waba.id, accessToken);
      for (const phone of asset.phones) {
        const { error: accountError } = await admin.from("integration_accounts").upsert(
          {
            organization_id: context.organizationId,
            integration_id: integration.id,
            external_id: phone.id,
            display_name: phone.verified_name || phone.display_phone_number || "WhatsApp",
            encrypted_credentials: encrypted,
            business_id: asset.business.id,
            waba_id: asset.waba.id,
            phone_number_id: phone.id,
            status: "connected",
            connected_at: new Date().toISOString(),
            metadata: {
              business_name: asset.business.name,
              waba_name: asset.waba.name,
              display_phone_number: phone.display_phone_number,
              quality_rating: phone.quality_rating,
              token_expires_in: token.expires_in ?? null,
            },
          },
          { onConflict: "integration_id,external_id" },
        );
        if (accountError) throw accountError;
      }
    }
    await admin.from("audit_logs").insert({
      organization_id: context.organizationId,
      actor_id: context.user.id,
      action: "whatsapp.embedded_signup.connected",
      entity_type: "integration",
      entity_id: integration.id,
      metadata: { waba_count: assets.length, phone_count: assets.reduce((n, a) => n + a.phones.length, 0) },
    });
    const response = NextResponse.redirect(`${destination}?meta=connected`);
    response.cookies.delete("meta_oauth_nonce");
    return response;
  } catch (caught) {
    console.error("[meta:oauth]", { stage: "callback", name: caught instanceof Error ? caught.name : "unknown" });
    return NextResponse.redirect(`${destination}?meta=error`);
  }
}
