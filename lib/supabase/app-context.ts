import { redirect } from "next/navigation"; import { createClient } from "./server"; import { isSupabaseConfigured } from "./config";
export async function requireAppContext(){
  if(!isSupabaseConfigured()) redirect("/iniciar-sesion?config=missing");
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/iniciar-sesion?returnTo=/app");
  const {data:membership}=await supabase.from("organization_members").select("organization_id,role,organizations(id,name)").eq("user_id",user.id).limit(1).maybeSingle();
  if(!membership) redirect("/onboarding");
  const orgValue=membership.organizations as unknown as {id:string;name:string}|{id:string;name:string}[]|null;
  const organization=Array.isArray(orgValue)?orgValue[0]:orgValue;
  return {supabase,user,membership,organization:{id:membership.organization_id,name:organization?.name||"Mi organización"}};
}
