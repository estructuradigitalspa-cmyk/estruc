"use client";
import {useState} from "react";
import type {ServiceProfileInput} from "@/lib/validation/service-operation";
const dayLabels={monday:"Lunes",tuesday:"Martes",wednesday:"Miércoles",thursday:"Jueves",friday:"Viernes",saturday:"Sábado",sunday:"Domingo"} as const;
const list=(value:string)=>value.split(",").map(item=>item.trim()).filter(Boolean);
export function ServiceOperationProfileForm({initial,canEdit}:{initial:ServiceProfileInput;canEdit:boolean}){
 const[value,setValue]=useState(initial);const[message,setMessage]=useState("");const[saving,setSaving]=useState(false);
 const update=<K extends keyof ServiceProfileInput>(key:K,next:ServiceProfileInput[K])=>setValue(current=>({...current,[key]:next}));
 async function submit(event:React.FormEvent){event.preventDefault();setSaving(true);setMessage("");const response=await fetch("/api/service-profile",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(value)});const body=await response.json().catch(()=>({}));setMessage(response.ok?"Configuración guardada y auditada.":body.error||"No se pudo guardar.");setSaving(false)}
 return <form className="operation-form" onSubmit={submit}><fieldset disabled={!canEdit||saving}><div className="form-grid">
  <label className="field"><span>Nombre comercial</span><input value={value.tradeName} onChange={e=>update("tradeName",e.target.value)} required/></label>
  <label className="field"><span>Rubro</span><input value={value.industry} onChange={e=>update("industry",e.target.value)} required/></label>
  <label className="field field-full"><span>Descripción</span><textarea value={value.description} onChange={e=>update("description",e.target.value)}/></label>
  <label className="field"><span>Moneda</span><select value={value.currency} onChange={e=>update("currency",e.target.value)}><option>CLP</option><option>USD</option><option>EUR</option></select></label>
  <label className="field"><span>Zona horaria</span><select value={value.timezone} onChange={e=>update("timezone",e.target.value)}><option>America/Santiago</option><option>America/Bogota</option><option>America/Lima</option><option>America/Mexico_City</option></select></label>
  <label className="field field-full"><span>Comunas o zonas (separadas por coma)</span><input value={value.communes.join(", ")} onChange={e=>update("communes",list(e.target.value))}/></label>
 </div><h2>Horario semanal</h2><div className="schedule-grid">{Object.entries(dayLabels).map(([day,label])=>{const key=day as keyof typeof value.businessHours;const current=value.businessHours[key];return <div className="schedule-row" key={day}><label><input type="checkbox" checked={current.enabled} onChange={e=>update("businessHours",{...value.businessHours,[key]:{...current,enabled:e.target.checked}})}/>{label}</label><input aria-label={`Apertura ${label}`} type="time" value={current.opensAt} onChange={e=>update("businessHours",{...value.businessHours,[key]:{...current,opensAt:e.target.value}})}/><input aria-label={`Cierre ${label}`} type="time" value={current.closesAt} onChange={e=>update("businessHours",{...value.businessHours,[key]:{...current,closesAt:e.target.value}})}/></div>})}</div>
 <div className="form-grid">
  <label className="field"><span>Duración predeterminada (min)</span><input type="number" min="15" value={value.standardDurationMinutes} onChange={e=>update("standardDurationMinutes",Number(e.target.value))}/></label>
  <label className="field"><span>Tiempo entre servicios (min)</span><input type="number" min="0" value={value.bufferMinutes} onChange={e=>update("bufferMinutes",Number(e.target.value))}/></label>
  <label className="field"><span>Anticipación mínima (min)</span><input type="number" min="0" value={value.minimumNoticeMinutes} onChange={e=>update("minimumNoticeMinutes",Number(e.target.value))}/></label>
  <label className="field"><span>Medios de pago</span><input value={value.paymentMethods.join(", ")} onChange={e=>update("paymentMethods",list(e.target.value))}/></label>
  <label className="field field-full"><span>Política de cancelación</span><textarea value={value.cancellationPolicy} onChange={e=>update("cancellationPolicy",e.target.value)}/></label>
  <label className="field field-full"><span>Política de reprogramación</span><textarea value={value.reschedulingPolicy} onChange={e=>update("reschedulingPolicy",e.target.value)}/></label>
  <label className="field"><span>Datos obligatorios para cotizar</span><input value={value.quoteRequiredFields.join(", ")} onChange={e=>update("quoteRequiredFields",list(e.target.value))}/></label>
  <label className="field"><span>Datos obligatorios para reservar</span><input value={value.bookingRequiredFields.join(", ")} onChange={e=>update("bookingRequiredFields",list(e.target.value))}/></label>
  <label className="field field-full"><span>Motivos de ayuda humana</span><input value={value.humanHandoffRules.join(", ")} onChange={e=>update("humanHandoffRules",list(e.target.value))}/></label>
  <label className="field field-full"><span>Mensaje de bienvenida</span><textarea value={value.welcomeMessage} onChange={e=>update("welcomeMessage",e.target.value)}/></label>
  <label className="field field-full"><span>Mensaje fuera de horario</span><textarea value={value.outOfHoursMessage} onChange={e=>update("outOfHoursMessage",e.target.value)}/></label>
  <label className="field field-full"><span>Instrucciones operativas internas</span><textarea value={value.internalInstructions} onChange={e=>update("internalInstructions",e.target.value)}/></label>
 </div></fieldset>{message&&<p className={`form-status ${message.startsWith("Configuración")?"success":"error"}`}>{message}</p>}{canEdit?<button className="button button-primary" disabled={saving}>{saving?"Guardando…":"Guardar operación"}</button>:<p className="app-alert">Tu rol permite consultar esta configuración, pero no modificarla.</p>}</form>
}
