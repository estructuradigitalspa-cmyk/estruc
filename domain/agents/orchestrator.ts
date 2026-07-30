import {agentResponseSchema,type AgentResponse} from "./response-schema";
import type {LlmProvider} from "./provider";
import {ToolGateway,type ToolName} from "./tool-gateway";
export type OrchestrationResult={response:AgentResponse;tool?:{name:ToolName;output:unknown};telemetry:{model:string;inputTokens:number;outputTokens:number;latencyMs:number}};
export async function orchestrateAgent(input:{provider:LlmProvider;gateway:ToolGateway;layers:readonly string[];customerText:string;organizationId:string;runId:string;toolInput?:unknown}):Promise<OrchestrationResult>{
 const completion=await input.provider.complete({systemLayers:input.layers,customerText:input.customerText,timeoutMs:8000});
 const parsed=agentResponseSchema.safeParse(completion.response);if(!parsed.success)throw new Error("INVALID_LLM_OUTPUT");
 let tool:OrchestrationResult["tool"];
 const name=parsed.data.nextAction==="prepare_quote"?"calculate_quote":parsed.data.nextAction==="offer_schedule"?"find_slots":parsed.data.nextAction==="transfer_to_human"?"request_handoff":null;
 if(name){if(input.toolInput===undefined)throw new Error("TOOL_INPUT_REQUIRED");const output=await input.gateway.execute(name,input.toolInput,{organizationId:input.organizationId,idempotencyKey:`${input.runId}:${name}`});tool={name,output}}
 return{response:parsed.data,tool,telemetry:{model:completion.model,inputTokens:completion.inputTokens,outputTokens:completion.outputTokens,latencyMs:completion.latencyMs}};
}