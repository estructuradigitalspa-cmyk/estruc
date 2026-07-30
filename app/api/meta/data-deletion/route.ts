import { randomUUID } from "node:crypto";
import { metaBusinessAppSecret, metaLoginAppSecret } from "@/lib/meta-env";
import {NextResponse} from "next/server";
import {parseSignedRequest} from "@/lib/meta-security";
import {createAdminClient} from "@/lib/supabase/admin";
import {clientIp,consumeRateLimit} from "@/lib/rate-limit";
import {operationalLog} from "@/lib/structured-log";
type Payload={user_id?:string|number};
function candidates(){return[{type:"login",secret:metaLoginAppSecret()},{type:"business",secret:metaBusinessAppSecret()}].filter((v):v is {type:string;secret:string}=>Boolean(v.secret))}
async function signedValue(request:Request){const type=request.headers.get("content-type")||"";if(type.includes("application/json")){const j=await request.json().catch(()=>({})) as {signed_request?:unknown};return typeof j.signed_request==="string"?j.signed_request:""}const f=await request.formData().catch(()=>null);return String(f?.get("signed_request")||"")}
export async function POST(request:Request){
 const rate=await consumeRateLimit({scope:"meta_data_deletion",subject:clientIp(request),limit:Number(process.env.RATE_LIMIT_DATA_DELETION||5),windowSeconds:3600});
 if(!rate.allowed)return NextResponse.json({error:"Rate limit"},{status:429});
 const signed=await signedValue(request);const matches=candidates().map(c=>({type:c.type,payload:parseSignedRequest(signed,c.secret) as Payload|null})).filter(v=>v.payload?.user_id);
 if(matches.length!==1)return NextResponse.json({error:"Invalid signed_request"},{status:401});
 const match=matches[0],externalId=String(match.payload!.user_id),code=randomUUID(),admin=createAdminClient();
 const{data:userId}=await admin.rpc("resolve_meta_user",{x:externalId});
 const{data:reqRow,error:createError}=await admin.from("data_deletion_requests").insert({provider:"meta",external_user_id:externalId,confirmation_code:code,status:"processing",app_type:match.type,user_id:userId||null}).select("id").single();
 if(createError||!reqRow)return NextResponse.json({error:"Unable to create request"},{status:500});
 let failure:string|undefined=userId?undefined:"IDENTITY_NOT_FOUND";
 try{
  if(userId&&!failure){
   const{data:memberships}=await admin.from("organization_members").select("organization_id,role").eq("user_id",userId);
   const inspected=[] as Array<{organization_id:string;role:string;members:number}>;
   for(const membership of memberships??[]){
    let members=0;
    if(membership.role==="owner"){
     const[{count:owners},{count:memberCount}]=await Promise.all([admin.from("organization_members").select("user_id",{count:"exact",head:true}).eq("organization_id",membership.organization_id).eq("role","owner"),admin.from("organization_members").select("user_id",{count:"exact",head:true}).eq("organization_id",membership.organization_id)]);
     members=memberCount||0;
     if((owners||0)<=1&&members>1){failure="OWNERSHIP_TRANSFER_REQUIRED";break}
    }
    inspected.push({organization_id:membership.organization_id,role:membership.role,members});
   }
   if(!failure)for(const membership of inspected){
    if(membership.role==="owner"&&membership.members<=1)await admin.from("organizations").delete().eq("id",membership.organization_id);
    else await admin.from("organization_members").delete().eq("organization_id",membership.organization_id).eq("user_id",userId);
   }
   if(!failure){
    if(match.type==="business")await admin.from("integration_accounts").delete().eq("created_by",userId);
    await admin.from("audit_logs").delete().eq("actor_id",userId);
    const{error}=await admin.auth.admin.deleteUser(userId);if(error)throw error;
   }
  }
  if(failure)await admin.from("data_deletion_requests").update({status:"failed",error_code:failure,updated_at:new Date().toISOString()}).eq("id",reqRow.id);
  else await admin.from("data_deletion_requests").update({status:"completed",completed_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",reqRow.id);
 }catch(error){failure="DELETION_FAILED";await admin.from("data_deletion_requests").update({status:"failed",error_code:failure,updated_at:new Date().toISOString()}).eq("id",reqRow.id);operationalLog("error",{stage:"data_deletion",result:"failed",error_code:error instanceof Error?error.name:"UNKNOWN"})}
 const base=process.env.NEXT_PUBLIC_SITE_URL||"https://estructuradigital.cl";return NextResponse.json({url:`${base}/data-deletion/status/${code}`,confirmation_code:code,status:failure?"failed":"completed"});
}
export function GET(){return NextResponse.json({status:"ready",instructions:`${process.env.NEXT_PUBLIC_SITE_URL||"https://estructuradigital.cl"}/data-deletion`})}