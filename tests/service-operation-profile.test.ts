import {describe,expect,it} from "vitest";
import {emptyBusinessHours,serviceProfileSchema} from "@/lib/validation/service-operation";
const valid={tradeName:"Limpio Hogar",description:"Limpieza profesional",industry:"Limpieza",currency:"CLP",timezone:"America/Santiago",communes:["Ñuñoa"],businessHours:emptyBusinessHours,standardDurationMinutes:180,bufferMinutes:30,minimumNoticeMinutes:1440,cancellationPolicy:"24 horas",reschedulingPolicy:"Una vez",paymentMethods:["Transferencia"],quoteRequiredFields:["commune","quantity"],bookingRequiredFields:["address"],humanHandoffRules:["reclamo"],welcomeMessage:"Hola",outOfHoursMessage:"Estamos fuera de horario",internalInstructions:"No prometer disponibilidad"};
describe("service operation profile",()=>{
 it("accepts a typed weekly schedule",()=>expect(serviceProfileSchema.safeParse(valid).success).toBe(true));
 it("rejects closing before opening",()=>expect(serviceProfileSchema.safeParse({...valid,businessHours:{...emptyBusinessHours,monday:{enabled:true,opensAt:"18:00",closesAt:"09:00"}}}).success).toBe(false));
 it("rejects malformed operational values",()=>{expect(serviceProfileSchema.safeParse({...valid,currency:"peso"}).success).toBe(false);expect(serviceProfileSchema.safeParse({...valid,bufferMinutes:-1}).success).toBe(false)});
});
