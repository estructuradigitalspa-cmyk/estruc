-- Fixture sintético local. Reemplaza :organization_id; no contiene datos reales.
with profile as (
 insert into public.organization_service_profiles(organization_id,trade_name,industry,communes,business_hours,minimum_notice_minutes,standard_duration_minutes,currency,timezone)
 values (:'organization_id','Limpio Hogar Demo','Limpieza','["Ñuñoa","Providencia","Las Condes"]','{"mon":["09:00","18:00"],"tue":["09:00","18:00"],"wed":["09:00","18:00"],"thu":["09:00","18:00"],"fri":["09:00","18:00"]}',1440,180,'CLP','America/Santiago')
 on conflict (organization_id) do update set trade_name=excluded.trade_name returning organization_id
), service as (
 insert into public.service_catalog(organization_id,name,category,estimated_duration_minutes,currency,requires_quote,allows_immediate_booking)
 select organization_id,'Limpieza de hogar','Limpieza',180,'CLP',true,false from profile
 on conflict (organization_id,name) do update set active=true returning id,organization_id
)
insert into public.service_variants(organization_id,service_id,name,price)
select organization_id,id,'Departamento',35000 from service union all select organization_id,id,'Casa',50000 from service
on conflict(service_id,name) do update set price=excluded.price;