import {z} from "zod";

const time=z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const dayScheduleSchema=z.object({
  enabled:z.boolean(),
  opensAt:time,
  closesAt:time,
}).refine(value=>!value.enabled||value.opensAt<value.closesAt,{message:"La apertura debe ser anterior al cierre"});
export const businessHoursSchema=z.object({
  monday:dayScheduleSchema,tuesday:dayScheduleSchema,wednesday:dayScheduleSchema,
  thursday:dayScheduleSchema,friday:dayScheduleSchema,saturday:dayScheduleSchema,sunday:dayScheduleSchema,
}).strict();
export const serviceProfileSchema=z.object({
  tradeName:z.string().trim().min(2).max(120),
  description:z.string().trim().max(2000),
  industry:z.string().trim().min(2).max(100),
  currency:z.string().regex(/^[A-Z]{3}$/),
  timezone:z.string().trim().min(3).max(100),
  communes:z.array(z.string().trim().min(1).max(120)).max(100),
  businessHours:businessHoursSchema,
  standardDurationMinutes:z.number().int().min(15).max(1440),
  bufferMinutes:z.number().int().min(0).max(1440),
  minimumNoticeMinutes:z.number().int().min(0).max(525600),
  cancellationPolicy:z.string().trim().max(4000),
  reschedulingPolicy:z.string().trim().max(4000),
  paymentMethods:z.array(z.string().trim().min(1).max(80)).max(20),
  quoteRequiredFields:z.array(z.string().trim().min(1).max(80)).max(50),
  bookingRequiredFields:z.array(z.string().trim().min(1).max(80)).max(50),
  humanHandoffRules:z.array(z.string().trim().min(1).max(500)).max(50),
  welcomeMessage:z.string().trim().max(1000),
  outOfHoursMessage:z.string().trim().max(1000),
  internalInstructions:z.string().trim().max(4000),
}).strict();
export type ServiceProfileInput=z.infer<typeof serviceProfileSchema>;

export const emptyBusinessHours={
  monday:{enabled:true,opensAt:"09:00",closesAt:"18:00"},tuesday:{enabled:true,opensAt:"09:00",closesAt:"18:00"},
  wednesday:{enabled:true,opensAt:"09:00",closesAt:"18:00"},thursday:{enabled:true,opensAt:"09:00",closesAt:"18:00"},
  friday:{enabled:true,opensAt:"09:00",closesAt:"18:00"},saturday:{enabled:false,opensAt:"09:00",closesAt:"14:00"},
  sunday:{enabled:false,opensAt:"09:00",closesAt:"14:00"},
};
