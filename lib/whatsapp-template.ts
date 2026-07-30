import { z } from "zod";

export const confirmationRequestTemplate = {
  name: "confirmacion_solicitud",
  languageCode: "es",
  category: "UTILITY",
  body: "Hola {{1}}, recibimos tu solicitud en {{2}}. Te contactaremos por este medio para continuar con la atención.",
  examples: ["Sebastián", "Estructura Digital"],
} as const;

export const whatsappTemplateSendSchema = z.object({
  type: z.literal("template"),
  to: z.string().regex(/^\d{8,15}$/, "Usa el número en formato internacional, solo dígitos."),
  templateName: z.literal(confirmationRequestTemplate.name),
  languageCode: z.literal(confirmationRequestTemplate.languageCode),
  parameters: z.tuple([
    z.string().trim().min(1).max(80),
    z.string().trim().min(1).max(120),
  ]),
});

export type WhatsAppTemplateSend = z.infer<typeof whatsappTemplateSendSchema>;

export function buildWhatsAppTemplatePayload(input: WhatsAppTemplateSend) {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: input.to,
    type: "template",
    template: {
      name: input.templateName,
      language: { code: input.languageCode },
      components: [
        {
          type: "body",
          parameters: input.parameters.map((text) => ({ type: "text", text })),
        },
      ],
    },
  };
}

export function renderWhatsAppTemplateBody(input: WhatsAppTemplateSend) {
  return `Hola ${input.parameters[0]}, recibimos tu solicitud en ${input.parameters[1]}. Te contactaremos por este medio para continuar con la atención.`;
}