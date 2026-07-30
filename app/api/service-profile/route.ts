import {NextResponse} from "next/server";
import {getApiContext} from "@/lib/supabase/api-context";
import {csrfError,validateMutationOrigin} from "@/lib/request-security";
import {serviceProfileSchema} from "@/lib/validation/service-operation";

export async function GET(){
  const context=await getApiContext();
  if(!context)return NextResponse.json({error:"No autorizado"},{status:401});
  const{data,error}=await context.supabase.from("organization_service_profiles").select("*").eq("organization_id",context.organizationId).maybeSingle();
  if(error)return NextResponse.json({error:"No se pudo cargar el perfil"},{status:500});
  return NextResponse.json({profile:data,canEdit:["owner","admin"].includes(context.role)},{headers:{"cache-control":"no-store"}});
}
export async function PUT(request:Request){
  if(!validateMutationOrigin(request))return csrfError();
  const context=await getApiContext();
  if(!context)return NextResponse.json({error:"No autorizado"},{status:401});
  if(!["owner","admin"].includes(context.role))return NextResponse.json({error:"Permisos insuficientes"},{status:403});
  const parsed=serviceProfileSchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Datos inválidos",details:parsed.error.flatten()},{status:400});
  const v=parsed.data;
  const row={organization_id:context.organizationId,trade_name:v.tradeName,description:v.description,industry:v.industry,currency:v.currency,timezone:v.timezone,communes:v.communes,service_zones:v.communes,business_hours:v.businessHours,standard_duration_minutes:v.standardDurationMinutes,buffer_minutes:v.bufferMinutes,minimum_notice_minutes:v.minimumNoticeMinutes,cancellation_policy:v.cancellationPolicy,rescheduling_policy:v.reschedulingPolicy,payment_methods:v.paymentMethods,quote_required_fields:v.quoteRequiredFields,booking_required_fields:v.bookingRequiredFields,human_handoff_rules:v.humanHandoffRules,welcome_message:v.welcomeMessage,out_of_hours_message:v.outOfHoursMessage,internal_instructions:v.internalInstructions,updated_at:new Date().toISOString()};
  const{data,error}=await context.supabase.from("organization_service_profiles").upsert(row).select("*").single();
  if(error)return NextResponse.json({error:"No se pudo guardar el perfil"},{status:500});
  await context.supabase.from("audit_logs").insert({organization_id:context.organizationId,actor_id:context.user.id,action:"service_profile.updated",entity_type:"organization_service_profile",entity_id:context.organizationId,metadata:{fields:Object.keys(v)}});
  return NextResponse.json({profile:data});
}
