import { describe, expect, it } from "vitest";
import {
  buildWhatsAppTemplatePayload,
  confirmationRequestTemplate,
  renderWhatsAppTemplateBody,
  whatsappTemplateSendSchema,
} from "@/lib/whatsapp-template";

const valid = {
  type: "template" as const,
  to: "56912345678",
  templateName: "confirmacion_solicitud" as const,
  languageCode: "es" as const,
  parameters: ["Sebastián", "Estructura Digital"] as [string, string],
};

describe("plantilla Utility de WhatsApp", () => {
  it("mantiene categoría, idioma, nombre y texto no promocional", () => {
    expect(confirmationRequestTemplate).toMatchObject({
      name: "confirmacion_solicitud",
      languageCode: "es",
      category: "UTILITY",
    });
    expect(confirmationRequestTemplate.body).not.toMatch(/oferta|descuento|promoci[oó]n/i);
  });

  it("construye el payload Graph API esperado", () => {
    const parsed = whatsappTemplateSendSchema.parse(valid);
    expect(buildWhatsAppTemplatePayload(parsed)).toEqual({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "56912345678",
      type: "template",
      template: {
        name: "confirmacion_solicitud",
        language: { code: "es" },
        components: [{
          type: "body",
          parameters: [
            { type: "text", text: "Sebastián" },
            { type: "text", text: "Estructura Digital" },
          ],
        }],
      },
    });
  });

  it("rechaza nombres, idiomas, destinatarios y variables no previstos", () => {
    expect(whatsappTemplateSendSchema.safeParse({ ...valid, templateName: "marketing" }).success).toBe(false);
    expect(whatsappTemplateSendSchema.safeParse({ ...valid, languageCode: "en_US" }).success).toBe(false);
    expect(whatsappTemplateSendSchema.safeParse({ ...valid, to: "+569123" }).success).toBe(false);
    expect(whatsappTemplateSendSchema.safeParse({ ...valid, parameters: ["solo uno"] }).success).toBe(false);
  });

  it("renderiza el cuerpo que se conserva en el historial del tenant", () => {
    expect(renderWhatsAppTemplateBody(valid)).toBe(
      "Hola Sebastián, recibimos tu solicitud en Estructura Digital. Te contactaremos por este medio para continuar con la atención.",
    );
  });
});