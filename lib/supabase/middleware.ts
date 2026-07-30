import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, getSupabaseConfig } from "./config";
export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next({ request });
  const { url, anonKey } = getSupabaseConfig(); let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, { cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => { items.forEach(({name,value}) => request.cookies.set(name,value)); response = NextResponse.next({request}); items.forEach(({name,value,options}) => response.cookies.set(name,value,options)); } } });
  const { data: { user } } = await supabase.auth.getUser();
  const protectedPath = request.nextUrl.pathname === "/app" || request.nextUrl.pathname.startsWith("/app/") || request.nextUrl.pathname === "/onboarding";
  if (protectedPath && !user) { const target=request.nextUrl.clone(); target.pathname="/iniciar-sesion"; target.searchParams.set("returnTo",request.nextUrl.pathname); return NextResponse.redirect(target); }
  return response;
}
