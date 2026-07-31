begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','30000000-0000-0000-0000-000000000003',true);
select public.reserve_service_appointment(
 'c0000000-0000-0000-0000-000000000003',
 'c1000000-0000-0000-0000-000000000003',
 null,'2026-08-10T10:00:00Z','2026-08-10T11:00:00Z',1,1,null,null
);
commit;
