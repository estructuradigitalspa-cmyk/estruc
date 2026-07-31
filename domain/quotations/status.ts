export type QuotationAction="approve"|"ready_to_send"|"simulate_send"|"reject"|"cancel"|"expire";
export function canApplyQuotationAction(status:string,action:QuotationAction){
 if(action==="approve")return status==="DRAFT"||status==="REVIEW_REQUIRED";
 if(action==="ready_to_send")return status==="APPROVED";
 if(action==="simulate_send")return status==="APPROVED";
 if(action==="reject")return status==="APPROVED"; if(action==="cancel")return["DRAFT","REVIEW_REQUIRED","APPROVED"].includes(status);
 return["DRAFT","REVIEW_REQUIRED","APPROVED"].includes(status);
}
