import Image from "next/image"; import Link from "next/link";
export function Wordmark(){return <Link className="wordmark" href="/" aria-label="Estructura Digital, inicio"><Image className="brand-icon" src="/branding/app-icon.png" alt="" width={34} height={34} priority/><span>Estructura Digital</span></Link>}
