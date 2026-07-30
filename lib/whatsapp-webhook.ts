import { createAdminClient } from "@/lib/supabase/admin";
import { verifyMetaSignature } from "@/lib/meta-security";
import { parseWhatsAppWebhook, type WhatsAppWebhookItem } from "@/lib/whatsapp";

async function resolveOrganizationId(phoneNumberId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("integration_accounts")
    .select("organization_id")
    .eq("external_id", phoneNumberId)
    .maybeSingle();
  return data?.organization_id as string | undefined;
}

async function persistEvent(item: WhatsAppWebhookItem) {
  const supabase = createAdminClient();
  const organizationId = await resolveOrganizationId(item.phoneNumberId);
  const safeEvent = {
    kind: item.kind,
    external_id: item.externalId,
    waba_id: item.wabaId,
    phone_number_id: item.phoneNumberId,
    contact_id: item.contactId,
    timestamp: item.timestamp,
    status: item.status,
  };
  const { data: inserted, error: eventError } = await supabase
    .from("webhook_events")
    .upsert(
      {
        organization_id: organizationId ?? null,
        provider: "meta",
        event_key: item.eventKey,
        event_type: item.kind,
        payload: safeEvent,
        status: "received",
      },
      { onConflict: "event_key", ignoreDuplicates: true },
    )
    .select("id")
    .maybeSingle();
  if (eventError || !inserted) return;

  if (item.kind === "status") {
    await supabase
      .from("messages")
      .update({
        status: item.status,
        delivered_at: item.status === "delivered" ? item.timestamp : undefined,
        read_at: item.status === "read" ? item.timestamp : undefined,
      })
      .eq("external_id", item.externalId);
  } else if (organizationId && item.contactId) {
    const { data: contact } = await supabase
      .from("contacts")
      .upsert(
        {
          organization_id: organizationId,
          name: item.contactId,
          phone: item.contactId,
          metadata: { whatsapp_id: item.contactId },
        },
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
            external_id: item.contactId,
            status: "open",
            updated_at: item.timestamp,
          },
          { onConflict: "organization_id,channel,external_id" },
        )
        .select("id")
        .single();
      if (conversation) {
        await supabase.from("messages").upsert(
          {
            organization_id: organizationId,
            conversation_id: conversation.id,
            external_id: item.externalId,
            direction: "inbound",
            body: item.body,
            status: "received",
            waba_id: item.wabaId,
            phone_number_id: item.phoneNumberId,
            contact_external_id: item.contactId,
            created_at: item.timestamp,
          },
          { onConflict: "external_id", ignoreDuplicates: true },
        );
      }
    }
  }
  await supabase
    .from("webhook_events")
    .update({ status: "processed", processed_at: new Date().toISOString() })
    .eq("event_key", item.eventKey);
}

export async function handleWhatsAppWebhookPost(request: Request) {
  const raw = await request.text();
  const secret = process.env.META_APP_SECRET;
  if (!secret || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ status: "received", processing: "disabled" }, { status: 200 });
  }
  if (!verifyMetaSignature(raw, request.headers.get("x-hub-signature-256"), secret)) {
    return Response.json({ error: "Firma inválida" }, { status: 401 });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }
  const events = parseWhatsAppWebhook(payload);
  await Promise.all(events.map(persistEvent));
  console.info("[meta:webhook]", { accepted: events.length });
  return Response.json({ status: "received" }, { status: 200 });
}
