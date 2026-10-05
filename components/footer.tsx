import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Wordmark } from "./wordmark";
import { TrackedContactLink } from "./tracked-contact-link";

export function Footer(){return <footer className="site-footer"><div className="container"><div className="footer-grid"><div><Wordmark/><p className="footer-copy">Páginas web, software y automatización para empresas que quieren captar clientes y ordenar su operación.</p><TrackedContactLink href={`mailto:${siteConfig.email}`} event="email_click">{siteConfig.email}</TrackedContactLink></div><div className="footer-links"><strong>Empresa</strong>{siteConfig.navigation.map(i=><Link href={i.href} key={i.href}>{i.label}</Link>)}<Link href="/contacto">Contacto</Link></div><div className="footer-links"><strong>Información</strong><Link href="/privacidad">Privacidad</Link><Link href="/terminos">Términos</Link><Link href="/eliminacion-de-datos">Eliminación de datos</Link><Link href="/seguridad">Seguridad</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.legalName}</span><span>{siteConfig.country} · {siteConfig.phone}</span></div></div></footer>}
