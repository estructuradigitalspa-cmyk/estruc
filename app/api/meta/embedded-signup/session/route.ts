import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiContext } from "@/lib/supabase/api-context";
import { createAdminClient } from "@/lib/supabase/admin";
import { encryptMetaToken } from "@/lib/meta-token-crypto";

const schema = z.object({ code: z.string().min(10).max(4096) });

export async function POST(request: Request) {
  const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  if (!["owner", "admin"].includes(context.role)) {
    return NextResponse.json({ error: "Solo administradores pueden conectar Meta." }, { status: 403 });
  }
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const graphVersion = process.env.META_GRAPH_API_VERSION || "v26.0";
  if (!appId || !appSecret || !process.env.META_CONFIG_ID || !process.env.META_TOKEN_ENCRYPTION_KEY) {
    return NextResponse.json({ error: "La integración empresarial de Meta no está configurada." }, { status: 503 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Código de autorización inválido." }, { status: 400 });

  const tokenUrl = new URL(`https://graph.facebook.com/${graphVersion}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("code", parsed.data.code);
  const tokenResponse = await fetch(tokenUrl, { method: "GET", cache: "no-store" });
  const tokenBody = await tokenResponse.json() as { access_token?: string; error?: { message?: string } };
  if (!tokenResponse.ok || !tokenBody.access_token) {
    console.error("[meta:embedded-signup] code exchange failed", { status: tokenResponse.status });
    return NextResponse.json({ error: "Meta rechazó la autorización." }, { status: 502 });
  }

  const admin = createAdminClient();
  const { data: integration, error: integrationError } = await admin.from("integrations").upsert({
    organization_id: context.organizationId,
    provider: "meta",
    status: "authorized",
    config: { flow: "facebook_login_for_business", graph_version: graphVersion },
  }, { onConflict: "organization_id,provider" }).select("id").single();
  if (integrationError || !integration) {
    return NextResponse.json({ error: "No fue posible guardar la integración." }, { status: 500 });
  }
  const { error: accountError } = await admin.from("integration_accounts").upsert({
    organization_id: context.organizationId,
    integration_id: integration.id,
    external_id: `pending:${context.user.id}`,
    display_name: "Meta Business",
    encrypted_credentials: encryptMetaToken(tokenBody.access_token),
  }, { onConflict: "integration_id,external_id" });
  if (accountError) return NextResponse.json({ error: "No fue posible proteger las credenciales." }, { status: 500 });
  await admin.from("audit_logs").insert({
    organization_id: context.organizationId,
    actor_id: context.user.id,
    action: "meta.authorization.completed",
    entity_type: "integration",
    entity_id: integration.id,
    metadata: { flow: "facebook_login_for_business" },
  });
  return NextResponse.json({ message: "Autorización de Meta completada de forma segura." });
}
