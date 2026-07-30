export type PricingRule =
  | {type:"FIXED";value:number}
  | {type:"PER_QUANTITY";value:number}
  | {type:"FIXED_SURCHARGE";value:number}
  | {type:"PERCENT_SURCHARGE";value:number}
  | {type:"ZONE";value:number;commune:string}
  | {type:"MANUAL"};

export type PriceInput={basePrice:number|null;quantity:number;commune?:string;rules:PricingRule[]};
export type PriceResult={status:"priced";subtotal:number;total:number}|{status:"manual_review";reason:string};

export function calculateServicePrice(input:PriceInput):PriceResult {
  if (!Number.isInteger(input.quantity)||input.quantity<1) return {status:"manual_review",reason:"INVALID_QUANTITY"};
  if (input.rules.some(rule=>rule.type==="MANUAL")) return {status:"manual_review",reason:"MANUAL_RULE"};
  const fixed=input.rules.find((rule):rule is Extract<PricingRule,{type:"FIXED"}>=>rule.type==="FIXED");
  const perUnit=input.rules.find((rule):rule is Extract<PricingRule,{type:"PER_QUANTITY"}>=>rule.type==="PER_QUANTITY");
  const initial=fixed?.value??(perUnit?perUnit.value*input.quantity:input.basePrice);
  if (initial===null||!Number.isFinite(initial)||initial<0) return {status:"manual_review",reason:"PRICE_NOT_CONFIGURED"};
  let subtotal=initial;
  for(const rule of input.rules){
    if(rule.type==="FIXED_SURCHARGE") subtotal+=rule.value;
    if(rule.type==="ZONE"&&input.commune?.toLocaleLowerCase("es")===rule.commune.toLocaleLowerCase("es")) subtotal+=rule.value;
  }
  const percentage=input.rules.filter((rule):rule is Extract<PricingRule,{type:"PERCENT_SURCHARGE"}>=>rule.type==="PERCENT_SURCHARGE").reduce((sum,rule)=>sum+rule.value,0);
  const total=subtotal*(1+percentage/100);
  if(!Number.isFinite(total)||total<0)return {status:"manual_review",reason:"INVALID_RULE_RESULT"};
  return {status:"priced",subtotal:roundCurrency(subtotal),total:roundCurrency(total)};
}
function roundCurrency(value:number){return Math.round((value+Number.EPSILON)*100)/100}
