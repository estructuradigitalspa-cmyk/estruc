export const cleaningCompanyFixture={
  profile:{tradeName:"Limpio Hogar Demo",industry:"Limpieza",currency:"CLP",timezone:"America/Santiago",communes:["Ñuñoa","Providencia","Las Condes"],minimumNoticeMinutes:1440,businessHours:{mon:["09:00","18:00"],tue:["09:00","18:00"],wed:["09:00","18:00"],thu:["09:00","18:00"],fri:["09:00","18:00"]}},
  service:{name:"Limpieza de hogar",basePrice:null,durationMinutes:180,requiresPhotos:false},
  variants:[{name:"Departamento",price:35000},{name:"Casa",price:50000}],
  extras:[{name:"Limpieza de horno",amount:12000},{name:"Interior de refrigerador",amount:10000}],
  rules:[{type:"PER_QUANTITY" as const,value:15000},{type:"ZONE" as const,commune:"Las Condes",value:5000}],
  agent:{name:"Recepcionista y vendedor",version:1,allowedTools:["calculate_quote","find_slots","request_handoff"]},
  scenarios:[
    "Quiero limpieza para un departamento de 2 dormitorios en Ñuñoa",
    "Necesito hablar con una persona por un reclamo",
    "¿Tienen hora mañana en Providencia?"
  ]
} as const;

