export type HandoffState="OPEN"|"CLAIMED"|"RESOLVED";
export function transitionHandoff(current:HandoffState,next:HandoffState){
  return(current==="OPEN"&&next==="CLAIMED")||(current==="CLAIMED"&&next==="RESOLVED");
}
export function agentMayRun(openHandoffs:number){return openHandoffs===0}

