import { z } from "zod";
export const contactSchema=z.object({name:z.string().trim().min(2).max(80),company:z.string().trim().min(2).max(120),email:z.string().trim().email().max(160),phone:z.string().trim().max(30).optional().default(""),solutionType:z.string().trim().min(2).max(100),description:z.string().trim().min(20).max(3000),consent:z.literal("accepted"),website:z.string().max(0).optional().default("")});
export const loginSchema=z.object({email:z.string().trim().email(),password:z.string().min(8)});
export const registerSchema=loginSchema.extend({name:z.string().trim().min(2).max(100)});
export const organizationSchema=z.object({name:z.string().trim().min(2).max(120),country:z.string().trim().min(2).max(80),website:z.union([z.literal(""),z.string().url().max(200)]),size:z.enum(["1","2-10","11-50","51-200","201+"]),objective:z.string().trim().min(5).max(500)});
