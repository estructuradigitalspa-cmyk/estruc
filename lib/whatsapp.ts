import { z } from "zod";

const whatsappRecipientSchema = z.string().regex(/^\d{8,15}$/, "Usa el número en formato internacional, solo dígitos.");

export const whatsappSendSchema = z.union([
  z.object({
    type: z.literal("text").optional().default("text"),
    to: whatsappRecipientSchema,
    message: z.string().trim().min(1).max(4096),
  }),
  z.object({
    type: z.literal("template"),
    to: whatsappRecipientSchema,
    templateName: z.literal("confirmacion_solicitud"),
    languageCode: z.literal("es"),
    parameters: z.tuple([z.string().trim().min(1).max(80), z.string().trim().min(1).max(120)]),
  }),
]);

export type WhatsAppWebhookItem = {
  kind: "message" | "status";
  eventKey: string;
  externalId: string;
  wabaId: string;
  phoneNumberId: string;
  contactId: string | null;
  timestamp: string;
  body: string | null;
  status: string | null;
};

type MetaWebhook = {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: {
        metadata?: { phone_number_id?: string };
        contacts?: Array<{ wa_id?: string }>;
        messages?: Array<{ id?: string; from?: string; timestamp?: string; type?: string; text?: { body?: string } }>;
        statuses?: Array<{ id?: string; status?: string; timestamp?: string; recipient_id?: string }>;
      };
    }>;
  }>;
};

const isoTimestamp = (value?: string) => {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? new Date(seconds * 1000).toISOString() : new Date().toISOString();
};

export function parseWhatsAppWebhook(payload: unknown): WhatsAppWebhookItem[] {
  const root = payload as MetaWebhook;
  if (root?.object !== "whatsapp_business_account") return [];
  const items: WhatsAppWebhookItem[] = [];
  for (const entry of root.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const value = change.value ?? {};
      const wabaId = entry.id ?? "";
      const phoneNumberId = value.metadata?.phone_number_id ?? "";
      for (const message of value.messages ?? []) {
        if (!message.id || !phoneNumberId) continue;
        items.push({
          kind: "message",
          eventKey: `message:${message.id}`,
          externalId: message.id,
          wabaId,
          phoneNumberId,
          contactId: message.from ?? value.contacts?.[0]?.wa_id ?? null,
          timestamp: isoTimestamp(message.timestamp),
          body: message.type === "text" ? message.text?.body ?? null : null,
          status: "received",
        });
      }
      for (const status of value.statuses ?? []) {
        if (!status.id || !phoneNumberId) continue;
        items.push({
          kind: "status",
          eventKey: `status:${status.id}:${status.status ?? "unknown"}:${status.timestamp ?? ""}`,
          externalId: status.id,
          wabaId,
          phoneNumberId,
          contactId: status.recipient_id ?? null,
          timestamp: isoTimestamp(status.timestamp),
          body: null,
          status: status.status ?? "unknown",
        });
      }
    }
  }
  return items;
}

export function getWhatsAppServerConfig() {
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const version = process.env.META_GRAPH_API_VERSION || "v26.0";
  if (!phoneNumberId || !accessToken) throw new Error("WhatsApp de prueba no está configurado.");
  return { phoneNumberId, accessToken, version };
}
