export type InboundEvent={channel:string;externalId:string;contactExternalId:string;body:string|null;receivedAt:string};
export type OutboundResult={externalId:string;status:"accepted"|"sent"|"failed"};
export type TransferResult={status:"transferred"|"queued";reason:string};
export interface ConversationChannelAdapter {
  receive(payload:unknown):Promise<InboundEvent[]>;
  send(event:{recipient:string;body:string;idempotencyKey:string}):Promise<OutboundResult>;
  transfer(event:{conversationId:string;reason:string}):Promise<TransferResult>;
}
