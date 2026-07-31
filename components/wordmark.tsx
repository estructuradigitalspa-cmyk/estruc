import Link from "next/link"; import { brand } from "@/lib/site-config";
export function Wordmark(){return <Link className="wordmark" href="/" aria-label={`${brand.name}, inicio`}><span className="elytsa-mark" aria-hidden="true">E</span><span>{brand.name}</span></Link>}
