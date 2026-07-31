insert into auth.users(id,email) values('30000000-0000-0000-0000-000000000003','scheduler@example.test') on conflict do nothing;
insert into public.organizations(id,name,country) values('c0000000-0000-0000-0000-000000000003','Concurrency','CL') on conflict do nothing;
insert into public.organization_members(organization_id,user_id,role) values('c0000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','owner') on conflict do nothing;
insert into public.service_requests(id,organization_id,description) values('c1000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000003','Concurrent booking') on conflict do nothing;
