begin;
create or replace function pg_temp.assert_true(condition boolean,message text) returns void language plpgsql as $$begin if not condition then raise exception 'ASSERTION FAILED: %',message;end if;end$$;
insert into auth.users(id,email,raw_user_meta_data) values
 ('10000000-0000-4000-8000-000000000001','owner-a@test.invalid','{}'),
 ('10000000-0000-4000-8000-000000000002','admin-a@test.invalid','{}'),
 ('10000000-0000-4000-8000-000000000003','agent-a@test.invalid','{}'),
 ('10000000-0000-4000-8000-000000000004','viewer-a@test.invalid','{}'),
 ('20000000-0000-4000-8000-000000000001','owner-b@test.invalid','{}'),
 ('20000000-0000-4000-8000-000000000002','admin-b@test.invalid','{}');
insert into public.organizations(id,name,country) values('aaaaaaaa-0000-4000-8000-000000000001','Organization A','CL'),('bbbbbbbb-0000-4000-8000-000000000001','Organization B','CL');
insert into public.organization_members(organization_id,user_id,role) values
 ('aaaaaaaa-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','owner'),
 ('aaaaaaaa-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','admin'),
 ('aaaaaaaa-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000003','agent'),
 ('aaaaaaaa-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000004','viewer'),
 ('bbbbbbbb-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','owner'),
 ('bbbbbbbb-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','admin');
insert into public.contacts(id,organization_id,name) values('aaaaaaaa-1000-4000-8000-000000000001','aaaaaaaa-0000-4000-8000-000000000001','Contact A'),('bbbbbbbb-1000-4000-8000-000000000001','bbbbbbbb-0000-4000-8000-000000000001','Contact B');
insert into public.conversations(id,organization_id,contact_id,channel,external_id) values('aaaaaaaa-1100-4000-8000-000000000001','aaaaaaaa-0000-4000-8000-000000000001','aaaaaaaa-1000-4000-8000-000000000001','whatsapp','conv-a'),('bbbbbbbb-1100-4000-8000-000000000001','bbbbbbbb-0000-4000-8000-000000000001','bbbbbbbb-1000-4000-8000-000000000001','whatsapp','conv-b');
insert into public.messages(id,organization_id,conversation_id,external_id,direction,body) values('aaaaaaaa-1200-4000-8000-000000000001','aaaaaaaa-0000-4000-8000-000000000001','aaaaaaaa-1100-4000-8000-000000000001','msg-a','inbound','A'),('bbbbbbbb-1200-4000-8000-000000000001','bbbbbbbb-0000-4000-8000-000000000001','bbbbbbbb-1100-4000-8000-000000000001','msg-b','inbound','B');insert into public.integrations(id,organization_id,provider,status) values('aaaaaaaa-2000-4000-8000-000000000001','aaaaaaaa-0000-4000-8000-000000000001','whatsapp','connected'),('bbbbbbbb-2000-4000-8000-000000000001','bbbbbbbb-0000-4000-8000-000000000001','whatsapp','connected');
insert into public.integration_accounts(organization_id,integration_id,external_id,waba_id,phone_number_id,encrypted_credentials) values('aaaaaaaa-0000-4000-8000-000000000001','aaaaaaaa-2000-4000-8000-000000000001','phone-a','30001','40001','cipher-a'),('bbbbbbbb-0000-4000-8000-000000000001','bbbbbbbb-2000-4000-8000-000000000001','phone-b','30002','40002','cipher-b');
set local role authenticated;
set local request.jwt.claims='{"sub":"10000000-0000-4000-8000-000000000001","email":"owner-a@test.invalid","role":"authenticated"}';
select pg_temp.assert_true((select count(*)=1 from public.integration_accounts_safe),'Owner A only reads its integration account');
select pg_temp.assert_true(not exists(select 1 from public.integration_accounts_safe where organization_id='bbbbbbbb-0000-4000-8000-000000000001'),'Owner A cannot read B integration');
do $$begin begin perform encrypted_credentials from public.integration_accounts;raise exception 'ASSERTION FAILED: ciphertext was readable';exception when insufficient_privilege then null;end;end$$;
reset role;set local role authenticated;
set local request.jwt.claims='{"sub":"10000000-0000-4000-8000-000000000003","email":"agent-a@test.invalid","role":"authenticated"}';
select pg_temp.assert_true((select count(*)=1 from public.contacts),'Agent A only reads A contacts');
select pg_temp.assert_true(not exists(select 1 from public.contacts where organization_id='bbbbbbbb-0000-4000-8000-000000000001'),'Agent A cannot read B contacts');
select pg_temp.assert_true((select count(*)=1 from public.messages),'Agent A only reads A messages');
select pg_temp.assert_true(not exists(select 1 from public.messages where organization_id='bbbbbbbb-0000-4000-8000-000000000001'),'Agent A cannot read B messages');
select pg_temp.assert_true(not exists(select 1 from public.integrations),'Agent cannot read integrations');
do $$begin begin perform encrypted_credentials from public.integration_accounts;raise exception 'ASSERTION FAILED: ciphertext was readable';exception when insufficient_privilege then null;end;end$$;
reset role;set local role authenticated;
set local request.jwt.claims='{"sub":"10000000-0000-4000-8000-000000000004","email":"viewer-a@test.invalid","role":"authenticated"}';
do $$begin begin update public.contacts set name='mutated' where id='aaaaaaaa-1000-4000-8000-000000000001';if found then raise exception 'ASSERTION FAILED: Viewer modified contact';end if;exception when insufficient_privilege then null;end;end$$;
reset role;set local role authenticated;
set local request.jwt.claims='{"sub":"10000000-0000-4000-8000-000000000002","email":"admin-a@test.invalid","role":"authenticated"}';
do $$begin begin perform public.remove_member('aaaaaaaa-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001');raise exception 'ASSERTION FAILED: Admin removed Owner';exception when others then if sqlerrm='ASSERTION FAILED: Admin removed Owner' then raise;end if;end;end$$;
reset role;set local role authenticated;
set local request.jwt.claims='{"sub":"10000000-0000-4000-8000-000000000001","email":"owner-a@test.invalid","role":"authenticated"}';
select public.transfer_ownership('aaaaaaaa-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002');
select pg_temp.assert_true((select role='owner' from public.organization_members where organization_id='aaaaaaaa-0000-4000-8000-000000000001' and user_id='10000000-0000-4000-8000-000000000002'),'Owner transfer promotes target');
select pg_temp.assert_true((select role='admin' from public.organization_members where organization_id='aaaaaaaa-0000-4000-8000-000000000001' and user_id='10000000-0000-4000-8000-000000000001'),'Owner transfer demotes actor');
rollback;