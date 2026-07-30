import {z} from "zod";
export const agentResponseSchema=z.object({
  intent:z.enum(["greeting","identify_service","request_quote","provide_information","book","human_handoff","complaint","unknown"]),
  serviceId:z.string().uuid().nullable(),
  customerMessage:z.string().min(1).max(2000),
  collectedFields:z.record(z.string(),z.union([z.string(),z.number(),z.boolean(),z.null()])),
  missingFields:z.array(z.string().max(80)).max(20),
  nextAction:z.enum(["ask_for_information","prepare_quote","offer_schedule","transfer_to_human","reply_only"]),
  requiresHuman:z.boolean(),
  confidence:z.number().min(0).max(1)
}).strict();
export type AgentResponse=z.infer<typeof agentResponseSchema>;
