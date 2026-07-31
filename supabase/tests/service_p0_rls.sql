begin;
insert into auth.users(id,email) values
 ('10000000-0000-0000-0000-000000000001','a@example.test'),
 ('20000000-0000-0000-0000-000000000002','b@example.test');
insert into public.organizations(id,name,country) values
 ('a0000000-0000-0000-0000-000000000001','Tenant A','CL'),
 ('b0000000-0000-0000-0000-000000000002','Tenant B','CL');
insert into public.organization_members(organization_id,user_id,role) values
 ('a0000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','owner'),
 ('b0000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000002','owner');
insert into public.service_catalog(id,organization_id,name,base_price) values
 ('a1000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','Servicio A',100),
 ('b1000000-0000-0000-0000-000000000002','b0000000-0000-0000-0000-000000000002','Servicio B',200);
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
do $$ begin
 if (select count(*) from public.service_catalog)<>1 then raise exception 'tenant isolation failed'; end if;
 if exists(select 1 from public.service_catalog where organization_id='b0000000-0000-0000-0000-000000000002') then raise exception 'tenant B leaked'; end if;
 begin
  insert into public.service_catalog(organization_id,name) values('b0000000-0000-0000-0000-000000000002','Injected');
  raise exception 'organization manipulation accepted';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
update public.organization_members set role='viewer' where organization_id='a0000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
do $$ begin
 begin
  update public.service_catalog set name='Viewer write' where organization_id='a0000000-0000-0000-0000-000000000001';
  if found then raise exception 'viewer write accepted'; end if;
 exception when insufficient_privilege then null; end;
end $$;
rollback;
