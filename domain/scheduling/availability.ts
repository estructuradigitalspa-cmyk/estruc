export type TimeRange={startsAt:Date;endsAt:Date;capacityUnits?:number};
export function hasCapacity(candidate:TimeRange,existing:readonly TimeRange[],capacity:number){
  if(candidate.endsAt<=candidate.startsAt||capacity<1)return false;
  const used=existing.filter(item=>item.startsAt<candidate.endsAt&&item.endsAt>candidate.startsAt)
    .reduce((sum,item)=>sum+(item.capacityUnits??1),0);
  return used+(candidate.capacityUnits??1)<=capacity;
}
export function generateSlots(input:{from:Date;to:Date;durationMinutes:number;stepMinutes:number;existing:readonly TimeRange[];capacity:number}){
  if(input.durationMinutes<=0||input.stepMinutes<=0)return[];
  const slots:TimeRange[]=[];
  for(let starts=input.from.getTime();starts+input.durationMinutes*60000<=input.to.getTime();starts+=input.stepMinutes*60000){
    const slot={startsAt:new Date(starts),endsAt:new Date(starts+input.durationMinutes*60000)};
    if(hasCapacity(slot,input.existing,input.capacity))slots.push(slot);
  }
  return slots;
}

