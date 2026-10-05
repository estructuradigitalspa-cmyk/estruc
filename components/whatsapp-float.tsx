"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { trackConversion } from "@/lib/analytics";

export function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatea con Sebastián por WhatsApp"
      onClick={() => trackConversion("whatsapp_click")}
    >
      <MessageCircle aria-hidden="true" size={20} strokeWidth={2.3} />
      <span>Chatea con Sebastián</span>
    </a>
  );
}
