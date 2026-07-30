import {z} from "zod";
export const toolSchemas={
  calculate_quote:z.object({serviceRequestId:z.string().uuid(),quantity:z.number().int().positive(),commune:z.string().min(1)}).strict(),
  find_slots:z.object({serviceRequestId:z.string().uuid(),from:z.string().datetime(),durationMinutes:z.number().int().positive()}).strict(),
  request_handoff:z.object({serviceRequestId:z.string().uuid(),reason:z.string().min(2).max(500),summary:z.string().min(2).max(2000)}).strict()
} as const;
export type ToolName=keyof typeof toolSchemas;
export type ToolExecutor=(input:unknown,context:{organizationId:string;idempotencyKey:string})=>Promise<unknown>;
export class ToolGateway{
  constructor(private readonly allowed:readonly ToolName[],private readonly executors:Partial<Record<ToolName,ToolExecutor>>){}
  async execute(name:ToolName,input:unknown,context:{organizationId:string;idempotencyKey:string}){
    if(!this.allowed.includes(name))throw new Error("TOOL_NOT_ALLOWED");
    const parsed=toolSchemas[name].safeParse(input);
    if(!parsed.success)throw new Error("INVALID_TOOL_INPUT");
    const executor=this.executors[name];if(!executor)throw new Error("TOOL_UNAVAILABLE");
    return executor(parsed.data,context);
  }
}

