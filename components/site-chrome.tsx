"use client"; import { usePathname } from "next/navigation"; import { Header } from "./header"; import { Footer } from "./footer";
const standalone=["/app","/onboarding","/iniciar-sesion","/registro","/recuperar-contrasena"];
export function SiteChrome({children}:{children:React.ReactNode}){const path=usePathname();const isStandalone=standalone.some(p=>path===p||path.startsWith(`${p}/`));if(isStandalone)return <>{children}</>;return <><a className="skip-link" href="#contenido">Saltar al contenido</a><Header/><main id="contenido">{children}</main><Footer/></>}
