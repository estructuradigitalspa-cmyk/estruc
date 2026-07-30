import { describe, expect, it } from "vitest";
import { getWhatsAppServerConfig, parseWhatsAppWebhook, whatsappSendSchema } from "@/lib/whatsapp";

describe("WhatsApp webhook", () => {
  it("procesa únicamente changes con field messages", () => {
    const events = parseWhatsAppWebhook({
      object: "whatsapp_business_account",
      entry: [
        {
          id: "waba_test",
          changes: [
            { field: "account_update", value: { messages: [{ id: "ignored" }] } },
            {
              field: "messages",
              value: {
                metadata: { phone_number_id: "phone_test" },
                contacts: [{ wa_id: "56911111111" }],
                messages: [
                  {
                    id: "wamid.inbound",
                    from: "56911111111",
                    timestamp: "1760000000",
                    type: "text",
                    text: { body: "hola" },
                  },
                ],
                statuses: [
                  {
                    id: "wamid.outbound",
                    recipient_id: "56911111111",
                    status: "delivered",
                    timestamp: "1760000001",
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({
      kind: "message",
      externalId: "wamid.inbound",
      wabaId: "waba_test",
      phoneNumberId: "phone_test",
      contactId: "56911111111",
      body: "hola",
    });
    expect(events[1]).toMatchObject({
      kind: "status",
      externalId: "wamid.outbound",
      status: "delivered",
    });
  });

  it("genera claves idempotentes distintas por estado", () => {
    const payload = (status: string) => ({
      object: "whatsapp_business_account",
      entry: [
        {
          id: "waba_test",
          changes: [
            {
              field: "messages",
              value: {
                metadata: { phone_number_id: "phone_test" },
                statuses: [{ id: "wamid.1", status, timestamp: "1760000001" }],
              },
            },
          ],
        },
      ],
    });
    expect(parseWhatsAppWebhook(payload("sent"))[0]?.eventKey).not.toBe(
      parseWhatsAppWebhook(payload("delivered"))[0]?.eventKey,
    );
  });
});

describe("WhatsApp send validation", () => {
  it("acepta números internacionales solo con dígitos", () => {
    expect(whatsappSendSchema.safeParse({ to: "56912345678", message: "Prueba" }).success).toBe(true);
  });
  it("rechaza signos y mensajes vacíos", () => {
    expect(whatsappSendSchema.safeParse({ to: "+56 9", message: "" }).success).toBe(false);
  });
});

describe("WhatsApp parser edge cases",()=>{
 it("ignora objetos ajenos, entradas incompletas e IDs ausentes",()=>{expect(parseWhatsAppWebhook(null)).toEqual([]);expect(parseWhatsAppWebhook({object:"other"})).toEqual([]);expect(parseWhatsAppWebhook({object:"whatsapp_business_account",entry:[{changes:[{field:"messages",value:{messages:[{}],statuses:[{}]}}]}]})).toEqual([])});
 it("usa contacto alternativo, texto no textual y estados por defecto",()=>{const events=parseWhatsAppWebhook({object:"whatsapp_business_account",entry:[{changes:[{field:"messages",value:{metadata:{phone_number_id:"phone"},contacts:[{wa_id:"contact"}],messages:[{id:"m",timestamp:"invalid",type:"image"}],statuses:[{id:"s"}]}}]}]});expect(events[0]).toMatchObject({contactId:"contact",body:null});expect(events[1]).toMatchObject({status:"unknown",contactId:null})});
 it("lee configuración de prueba y falla si está incompleta",()=>{process.env.META_PHONE_NUMBER_ID="phone";process.env.META_ACCESS_TOKEN="token";delete process.env.META_GRAPH_API_VERSION;expect(getWhatsAppServerConfig()).toMatchObject({phoneNumberId:"phone",version:"v26.0"});delete process.env.META_ACCESS_TOKEN;expect(()=>getWhatsAppServerConfig()).toThrow()})});