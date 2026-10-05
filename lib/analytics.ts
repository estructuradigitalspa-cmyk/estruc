export type ConversionName="contact_form_success"|"email_click"|"phone_click"|"whatsapp_click";

const WHATSAPP_ADS_CONVERSION = "AW-18496187427/UNa6CP2Gq5IdEKPY1fNE";

export function trackConversion(name:ConversionName,detail:Record<string,string>={}){
  if(typeof window==="undefined")return;

  const payload={event:"business_conversion",conversion_name:name,page_path:window.location.pathname,...detail};
  const analyticsWindow=window as Window&{
    dataLayer?:Record<string,string>[];
    gtag?:(command:string,eventName:string,parameters:Record<string,string>)=>void;
  };

  window.dispatchEvent(new CustomEvent("estructura-digital:conversion",{detail:payload}));
  analyticsWindow.dataLayer?.push(payload);

  if(name==="whatsapp_click"){
    analyticsWindow.gtag?.("event","conversion",{send_to:WHATSAPP_ADS_CONVERSION});
  }
}
