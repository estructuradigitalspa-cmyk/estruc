export type QuotationItem={description:string;quantity:number;unitPrice:number};
export function calculateQuotation(items:readonly QuotationItem[],taxRate=0){
  if(!items.length||!Number.isFinite(taxRate)||taxRate<0)throw new Error("INVALID_QUOTATION");
  const normalized=items.map(item=>{
    if(!item.description.trim()||!Number.isFinite(item.quantity)||item.quantity<=0||!Number.isFinite(item.unitPrice)||item.unitPrice<0)throw new Error("INVALID_QUOTATION_ITEM");
    return{...item,total:money(item.quantity*item.unitPrice)};
  });
  const subtotal=money(normalized.reduce((sum,item)=>sum+item.total,0));
  const tax=money(subtotal*taxRate);
  return{items:normalized,subtotal,tax,total:money(subtotal+tax)};
}
const money=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;

