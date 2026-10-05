"use client";
import type { ReactNode } from "react";
import { trackConversion, type ConversionName } from "@/lib/analytics";
export function TrackedContactLink({href,event,children,className}:{href:string;event:ConversionName;children:ReactNode;className?:string}){return <a href={href} className={className} onClick={()=>trackConversion(event)}>{children}</a>}
