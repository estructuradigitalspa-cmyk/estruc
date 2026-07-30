import {randomUUID} from "node:crypto";
type Fields={request_id?:string;organization_id?:string;user_id?:string;integration_id?:string;event_key?:string;stage:string;result:string;error_code?:string};
export function operationalLog(level:"info"|"warn"|"error",fields:Fields){console[level](JSON.stringify({event:"estructura.operation",request_id:fields.request_id||randomUUID(),...fields}))}