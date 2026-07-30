import { requireAppContext } from "@/lib/supabase/app-context"; import { AppShell } from "@/components/app-shell/app-shell";
export const dynamic="force-dynamic"; export default async function Layout({children}:{children:React.ReactNode}){const ctx=await requireAppContext();return <AppShell organization={ctx.organization.name} userEmail={ctx.user.email||"Usuario"}>{children}</AppShell>}
