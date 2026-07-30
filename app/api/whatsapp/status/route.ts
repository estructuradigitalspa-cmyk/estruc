import { NextResponse } from "next/server";
import { getApiContext } from "@/lib/supabase/api-context";

export async function GET(request: Request) {
  const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta el identificador" }, { status: 400 });
  const { data } = await context.supabase
    .from("messages")
    .select("external_id,status,sent_at,delivered_at,read_at")
    .eq("organization_id", context.organizationId)
    .eq("external_id", id)
    .maybeSingle();
  return NextResponse.json({ message: data ?? null });
}
