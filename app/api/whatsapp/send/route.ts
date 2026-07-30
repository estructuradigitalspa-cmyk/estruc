import { NextResponse } from "next/server";
import { getApiContext } from "@/lib/supabase/api-context";
import { whatsappSendSchema } from "@/lib/whatsapp";
import { getOrganizationWhatsAppConfig } from "@/lib/whatsapp-organization-config";

export async function POST(request: Request) {
  const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!["owner", "admin"].includes(context.role)) {
    return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
  }
  const parsed = whatsappSendSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  let config;
  try {
    config = await getOrganizationWhatsAppConfig(context.organizationId);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Configuración inválida" }, { status: 503 });
  }

  const response = await fetch(
    `https://graph.facebook.com/${config.version}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: parsed.data.to,
        type: "text",
        text: { preview_url: false, body: parsed.data.message },
      }),
      cache: "no-store",
    },
  );
  const graphResult = (await response.json().catch(() => ({}))) as {
    messages?: Array<{ id?: string }>;
    error?: { message?: string; code?: number };
  };
  if (!response.ok || !graphResult.messages?.[0]?.id) {
    console.warn("[whatsapp:send]", { ok: false, status: response.status, code: graphResult.error?.code });
    return NextResponse.json(
      { error: graphResult.error?.message || "Meta rechazó el mensaje", code: graphResult.error?.code },
      { status: response.status || 502 },
    );
  }

  const externalId = graphResult.messages[0].id;
  const { supabase, organizationId } = context;
  const { data: integration } = await supabase
    .from("integrations")
    .upsert(
      { organization_id: organizationId, provider: "whatsapp", status: "test", config: { mode: "test" } },
      { onConflict: "organization_id,provider" },
    )
    .select("id")
    .single();
  if (integration) {
    await supabase.from("integration_accounts").upsert(
      {
        organization_id: organizationId,
        integration_id: integration.id,
        external_id: config.phoneNumberId,
        display_name: "WhatsApp test number",
      },
      { onConflict: "integration_id,external_id" },
    );
  }
  const { data: contact } = await supabase
    .from("contacts")
    .upsert(
      { organization_id: organizationId, name: parsed.data.to, phone: parsed.data.to, metadata: { whatsapp_id: parsed.data.to } },
      { onConflict: "organization_id,phone" },
    )
    .select("id")
    .single();
  if (contact) {
    const { data: conversation } = await supabase
      .from("conversations")
      .upsert(
        {
          organization_id: organizationId,
          contact_id: contact.id,
          channel: "whatsapp",
          external_id: parsed.data.to,
          status: "open",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "organization_id,channel,external_id" },
      )
      .select("id")
      .single();
    if (conversation) {
      await supabase.from("messages").insert(
        {
          organization_id: organizationId,
          conversation_id: conversation.id,
          external_id: externalId,
          direction: "outbound",
          body: parsed.data.message,
          status: "sent",
          waba_id: config.wabaId,
          phone_number_id: config.phoneNumberId,
          contact_external_id: parsed.data.to,
          sent_at: new Date().toISOString(),
        },
      );
    }
  }
  console.info("[whatsapp:send]", { ok: true, messageId: externalId.slice(0, 12) });
  return NextResponse.json({ ok: true, messageId: externalId, status: "sent" });
}
