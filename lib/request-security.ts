import { NextResponse } from "next/server";
const allowed=new Set(["https://estructuradigital.cl","https://www.estructuradigital.cl",...(process.env.NODE_ENV==="development"?["http://localhost:3000"]:[])]);
export function validateMutationOrigin(request:Request){const origin=request.headers.get("origin");const host=request.headers.get("host");if(!origin||!host)return false;try{return allowed.has(origin)&&new URL(origin).host===host}catch{return false}}
export function csrfError(){return NextResponse.json({error:"Origen no permitido"},{status:403})}