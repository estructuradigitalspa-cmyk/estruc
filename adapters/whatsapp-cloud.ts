import type {ConversationChannelAdapter,InboundEvent,OutboundResult,TransferResult} from "@/domain/conversations/channel-adapter";
export type WhatsAppTransport={send(input:{recipient:string;body:string;idempotencyKey:string}):Promise<OutboundResult>};
export class WhatsAppCloudAdapter implements ConversationChannelAdapter{
 constructor(private readonly options:{organizationExternalMessagesEnabled:boolean;transport?:WhatsAppTransport}){}
 async receive(payload:unknown):Promise<InboundEvent[]>{if(!payload||typeof payload!=="object")return[];return[]}
 async send(event:{recipient:string;body:string;idempotencyKey:string}):Promise<OutboundResult>{const environmentEnabled=process.env.ALLOW_REAL_WHATSAPP==="true"&&process.env.ALLOW_EXTERNAL_MESSAGES==="true";if(!environmentEnabled||!this.options.organizationExternalMessagesEnabled)return{externalId:`dry-run:${event.idempotencyKey}`,status:"accepted"};if(!this.options.transport)throw new Error("WHATSAPP_TRANSPORT_NOT_CONFIGURED");return this.options.transport.send(event)}
 async transfer(event:{conversationId:string;reason:string}):Promise<TransferResult>{return{status:"transferred",reason:event.reason}}
}
