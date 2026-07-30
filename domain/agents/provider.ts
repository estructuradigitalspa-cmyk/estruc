import {agentResponseSchema,type AgentResponse} from "./response-schema";

export type LlmRequest={systemLayers:readonly string[];customerText:string;timeoutMs?:number};
export type LlmResult={response:AgentResponse;model:string;inputTokens:number;outputTokens:number;latencyMs:number};
export interface LlmProvider{complete(request:LlmRequest):Promise<LlmResult>}

export class InvalidLlmOutputError extends Error{constructor(){super("INVALID_LLM_OUTPUT")}}

export class SimulatedLlmProvider implements LlmProvider{
  async complete(request:LlmRequest):Promise<LlmResult>{
    const started=Date.now();
    const text=request.customerText.toLocaleLowerCase("es");
    const wantsHuman=/humano|persona|ejecutivo|reclamo/.test(text);
    const hasCommune=/comuna|Ã±uÃ±oa|providencia|las condes|santiago/.test(text);
    const hasQuantity=/\b\d+\b/.test(text);
    const candidate={
      intent:wantsHuman?"human_handoff":"request_quote",serviceId:null,
      customerMessage:wantsHuman?"Te transferirÃ© con una persona del equipo.":"Para cotizar necesito la comuna y la cantidad o superficie.",
      collectedFields:{},missingFields:[...(hasCommune?[]:["commune"]),...(hasQuantity?[]:["quantity"])],
      nextAction:wantsHuman?"transfer_to_human":hasCommune&&hasQuantity?"prepare_quote":"ask_for_information",
      requiresHuman:wantsHuman,confidence:wantsHuman?.99:.85
    };
    const parsed=agentResponseSchema.safeParse(candidate);
    if(!parsed.success)throw new InvalidLlmOutputError();
    return{response:parsed.data,model:"simulated-service-agent-v1",inputTokens:estimateTokens([...request.systemLayers,request.customerText].join("\n")),outputTokens:estimateTokens(JSON.stringify(candidate)),latencyMs:Date.now()-started};
  }
}
function estimateTokens(value:string){return Math.ceil(value.length/4)}

