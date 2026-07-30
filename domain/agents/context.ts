export type AgentContext={
  policy:string;profile:string;agentVersion:string;catalog:string;contact?:string;
  request?:string;summary?:string;recentMessages?:readonly string[];
};
const untrusted=(label:string,value:string)=>`<untrusted-${label}>\n${value}\n</untrusted-${label}>`;
export function buildAgentContext(value:AgentContext):readonly string[]{
  return[
    `SYSTEM POLICY (immutable): ${value.policy}`,
    `OPERATING PROFILE: ${value.profile}`,
    `AGENT VERSION: ${value.agentVersion}`,
    `CATALOG (prices are data; only tools calculate totals): ${value.catalog}`,
    value.contact?untrusted("contact",value.contact):"",
    value.request?untrusted("request",value.request):"",
    value.summary?untrusted("summary",value.summary):"",
    ...(value.recentMessages??[]).slice(-12).map(message=>untrusted("customer-message",message))
  ].filter(Boolean);
}

