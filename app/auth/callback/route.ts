import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/app";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const canonicalOrigin = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(new URL("/iniciar-sesion?error=No fue posible confirmar la sesión.", canonicalOrigin));
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/iniciar-sesion?error=No fue posible confirmar la cuenta.", canonicalOrigin));
  }
  return NextResponse.redirect(new URL(next, canonicalOrigin));
}
