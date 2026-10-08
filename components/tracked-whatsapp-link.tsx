"use client";

import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";
import { trackConversion } from "@/lib/analytics";

export function TrackedWhatsAppLink({
  className,
  serviceName,
  children,
}: {
  className?: string;
  serviceName: string;
  children: ReactNode;
}) {
  const message = `Hola Sebastián, vi la web de Estructura Digital y quiero cotizar: ${serviceName}.`;

  return <a
    className={className}
    href={`https://wa.me/${siteConfig.phoneHref.replace("+", "")}?text=${encodeURIComponent(message)}`}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackConversion("whatsapp_click", { service_name: serviceName })}
  >{children}</a>;
}
