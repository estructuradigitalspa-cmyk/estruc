import Link from "next/link";
import { AuthCard } from "@/components/app-shell/auth-card";
import { FacebookLoginButton } from "@/components/app-shell/facebook-login-button";
import { signIn } from "../actions";

export default async function Page({searchParams}:{searchParams:Promise<{error?:string;message?:string;config?:string;next?:string}>}) {
  const p=await searchParams;
  return <AuthCard title="Accede a tu espacio" description="Ingresa con tu cuenta empresarial para administrar la plataforma." footer={<><Link href="/recuperar-contrasena">Recuperar contraseña</Link><span>¿Sin cuenta? <Link href="/registro">Regístrate</Link></span></>}>
    {p.config==="missing"&&<p className="app-alert">El acceso estará disponible cuando se configure Supabase.</p>}
    {p.error&&<p className="form-status error">{p.error}</p>}
    {p.message&&<p className="form-status success">{p.message}</p>}
    <FacebookLoginButton next={p.next}/>
    <div className="auth-divider"><span>o usa tu correo</span></div>
    <form action={signIn} className="auth-form"><input type="hidden" name="next" value={p.next||"/app"}/><label>Correo<input name="email" type="email" required autoComplete="email"/></label><label>Contraseña<input name="password" type="password" required minLength={8} autoComplete="current-password"/></label><button className="button button-primary">Iniciar sesión</button></form>
  </AuthCard>;
}
