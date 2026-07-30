-- Additive production hardening.
alter table public.integration_accounts
 add column if not exists created_by uuid references public.profiles(id) on delete set null,
 add column if not exists display_phone_number text,
 add column if not exists verified_name text,
 add column if not exists currency text,
 add column if not exists token_expires_at timestamptz,
 add column if not exists last_validated_at timestamptz;
drop index if exists public.integration_accounts_phone;
create unique index if not exists integration_accounts_org_waba_phone on public.integration_accounts(organization_id,waba_id,phone_number_id);
alter table public.webhook_events add column if not exists attempts integer not null default 0, add column if not exists next_retry_at timestamptz, add column if not exists failed_at timestamptz, add column if not exists last_error_code text;
create table if not exists public.oauth_nonces(nonce_hash text primary key,organization_id uuid not null references public.organizations(id) on delete cascade,user_id uuid not null references public.profiles(id) on delete cascade,session_id uuid not null unique,expires_at timestamptz not null,consumed_at timestamptz,created_at timestamptz not null default now());
alter table public.oauth_nonces enable row level security;
create or replace function public.consume_oauth_nonce(raw_nonce text,org uuid,actor uuid,sid uuid) returns boolean language plpgsql security definer set search_path=public,extensions as $$ declare n integer; begin update public.oauth_nonces set consumed_at=now() where nonce_hash=encode(digest(raw_nonce,'sha256'),'hex') and organization_id=org and user_id=actor and session_id=sid and consumed_at is null and expires_at>now(); get diagnostics n=row_count; return n=1; end $$;
revoke all on function public.consume_oauth_nonce(text,uuid,uuid,uuid) from public,anon,authenticated; grant execute on function public.consume_oauth_nonce(text,uuid,uuid,uuid) to service_role;
create table if not exists public.rate_limit_buckets(scope text,subject_hash text,window_start timestamptz,request_count integer not null default 0,expires_at timestamptz not null,primary key(scope,subject_hash,window_start)); alter table public.rate_limit_buckets enable row level security;
create or replace function public.consume_rate_limit(s text,h text,w integer,l integer) returns table(allowed boolean,current_count integer,retry_after integer) language plpgsql security definer set search_path=public as $$ declare b timestamptz;c integer; begin b:=to_timestamp(floor(extract(epoch from now())/w)*w); insert into public.rate_limit_buckets values(s,h,b,1,b+make_interval(secs=>w*2)) on conflict(scope,subject_hash,window_start) do update set request_count=public.rate_limit_buckets.request_count+1 returning request_count into c; return query select c<=l,c,greatest(1,ceil(extract(epoch from b+make_interval(secs=>w)-now()))::integer); end $$;
revoke all on function public.consume_rate_limit(text,text,integer,integer) from public,anon,authenticated; grant execute on function public.consume_rate_limit(text,text,integer,integer) to service_role;
alter table public.data_deletion_requests add column if not exists user_id uuid references auth.users(id) on delete set null,add column if not exists app_type text,add column if not exists error_code text,add column if not exists updated_at timestamptz not null default now();
create or replace function public.resolve_meta_user(x text) returns uuid language sql stable security definer set search_path=auth,public as $$ select user_id from auth.identities where provider='facebook' and (provider_id=x or identity_data->>'sub'=x) limit 1 $$; revoke all on function public.resolve_meta_user(text) from public,anon,authenticated; grant execute on function public.resolve_meta_user(text) to service_role;
drop policy if exists members_admin_write on public.organization_members;
drop policy if exists integrations_member on public.integrations;
create policy integrations_privileged_read on public.integrations for select using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
drop policy if exists webhook_member on public.webhook_events;
create policy webhook_privileged_read on public.webhook_events for select using(organization_id is not null and public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
drop policy if exists deletion_member on public.data_deletion_requests;
drop policy if exists audit_member on public.audit_logs;
create policy audit_privileged_read on public.audit_logs for select using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));drop policy if exists integration_accounts_member on public.integration_accounts;
create policy integration_accounts_privileged_read on public.integration_accounts for select using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create or replace function public.change_member_role(org uuid,target uuid,new_role public.organization_role) returns void language plpgsql security definer set search_path=public as $$ declare a public.organization_role;o public.organization_role;n integer; begin perform pg_advisory_xact_lock(hashtextextended(org::text,0));select role into a from organization_members where organization_id=org and user_id=auth.uid();select role into o from organization_members where organization_id=org and user_id=target;if a not in ('owner','admin') or o is null then raise exception 'not authorized';end if;if a='admin' and (o in ('owner','admin') or new_role in ('owner','admin')) then raise exception 'admin restricted';end if;if o='owner' and new_role<>'owner' then select count(*) into n from organization_members where organization_id=org and role='owner';if n<=1 then raise exception 'last owner';end if;end if;update organization_members set role=new_role where organization_id=org and user_id=target;insert into audit_logs(organization_id,actor_id,action,entity_type,entity_id,metadata) values(org,auth.uid(),'member.role_changed','member',target::text,jsonb_build_object('from',o,'to',new_role));end $$;
create or replace function public.remove_member(org uuid,target uuid) returns void language plpgsql security definer set search_path=public as $$ declare a public.organization_role;o public.organization_role;n integer; begin perform pg_advisory_xact_lock(hashtextextended(org::text,0));select role into a from organization_members where organization_id=org and user_id=auth.uid();select role into o from organization_members where organization_id=org and user_id=target;if a not in ('owner','admin') or o is null then raise exception 'not authorized';end if;if a='admin' and o not in ('agent','viewer') then raise exception 'admin restricted';end if;if o='owner' then select count(*) into n from organization_members where organization_id=org and role='owner';if n<=1 then raise exception 'last owner';end if;end if;delete from organization_members where organization_id=org and user_id=target;insert into audit_logs(organization_id,actor_id,action,entity_type,entity_id,metadata) values(org,auth.uid(),'member.removed','member',target::text,jsonb_build_object('role',o));end $$;
create or replace function public.transfer_ownership(org uuid,target uuid) returns void language plpgsql security definer set search_path=public as $$ begin perform pg_advisory_xact_lock(hashtextextended(org::text,0));if not exists(select 1 from organization_members where organization_id=org and user_id=auth.uid() and role='owner') or not exists(select 1 from organization_members where organization_id=org and user_id=target) then raise exception 'owner required';end if;update organization_members set role='owner' where organization_id=org and user_id=target;update organization_members set role='admin' where organization_id=org and user_id=auth.uid() and auth.uid()<>target;insert into audit_logs(organization_id,actor_id,action,entity_type,entity_id) values(org,auth.uid(),'ownership.transferred','member',target::text);end $$;
revoke all on function public.change_member_role(uuid,uuid,public.organization_role) from public;revoke all on function public.remove_member(uuid,uuid) from public;revoke all on function public.transfer_ownership(uuid,uuid) from public;grant execute on function public.change_member_role(uuid,uuid,public.organization_role) to authenticated;grant execute on function public.remove_member(uuid,uuid) to authenticated;grant execute on function public.transfer_ownership(uuid,uuid) to authenticated;
revoke select on public.integration_accounts from authenticated;
grant select(id,organization_id,integration_id,external_id,display_name,created_at,business_id,waba_id,phone_number_id,status,connected_at,metadata,created_by,display_phone_number,verified_name,currency,token_expires_at,last_validated_at) on public.integration_accounts to authenticated;
create or replace view public.integration_accounts_safe with(security_invoker=true) as select id,organization_id,integration_id,external_id,display_name,created_at,business_id,waba_id,phone_number_id,status,connected_at,metadata,created_by,display_phone_number,verified_name,currency,token_expires_at,last_validated_at from public.integration_accounts;grant select on public.integration_accounts_safe to authenticated;
-- Idempotent inbound messages and invitation workflow.
create unique index if not exists messages_org_external_id_unique on public.messages(organization_id,external_id);
create table if not exists public.organization_invitations(id uuid primary key default gen_random_uuid(),organization_id uuid not null references public.organizations(id) on delete cascade,email text not null,role public.organization_role not null check(role<>'owner'),invited_by uuid not null references public.profiles(id),expires_at timestamptz not null default now()+interval '7 days',accepted_at timestamptz,created_at timestamptz not null default now(),unique(organization_id,email));
alter table public.organization_invitations enable row level security;
create policy invitations_admin_read on public.organization_invitations for select using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create or replace function public.invite_member(org uuid,invite_email text,invite_role public.organization_role) returns uuid language plpgsql security definer set search_path=public as $$ declare a public.organization_role;out_id uuid;begin perform pg_advisory_xact_lock(hashtextextended(org::text,0));select role into a from organization_members where organization_id=org and user_id=auth.uid();if a not in ('owner','admin') then raise exception 'not authorized';end if;if length(trim(invite_email))>254 or trim(invite_email)!~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'invalid email';end if;if invite_role='owner' or (a='admin' and invite_role='admin') then raise exception 'role restricted';end if;insert into organization_invitations(organization_id,email,role,invited_by) values(org,lower(trim(invite_email)),invite_role,auth.uid()) on conflict(organization_id,email) do update set role=excluded.role,invited_by=excluded.invited_by,expires_at=now()+interval '7 days',accepted_at=null returning id into out_id;insert into audit_logs(organization_id,actor_id,action,entity_type,entity_id,metadata) values(org,auth.uid(),'member.invited','invitation',out_id::text,jsonb_build_object('role',invite_role));return out_id;end $$;
revoke all on function public.invite_member(uuid,text,public.organization_role) from public;grant execute on function public.invite_member(uuid,text,public.organization_role) to authenticated;
-- Atomic queue claim for scheduled webhook workers.
create or replace function public.claim_webhook_events(batch_size integer default 50)
returns table(id uuid,organization_id uuid,event_key text,payload jsonb)
language sql security definer set search_path=public as $$
  with candidates as (
    select w.id from public.webhook_events w
    where w.status='pending' and coalesce(w.next_retry_at,w.received_at)<=now()
    order by coalesce(w.next_retry_at,w.received_at),w.received_at
    for update skip locked limit greatest(1,least(batch_size,100))
  ), claimed as (
    update public.webhook_events w set status='processing'
    from candidates c where w.id=c.id
    returning w.id,w.organization_id,w.event_key,w.payload
  ) select * from claimed;
$$;
revoke all on function public.claim_webhook_events(integer) from public,anon,authenticated;
grant execute on function public.claim_webhook_events(integer) to service_role;
-- Invitation acceptance is bound to the authenticated email and expiry.
create or replace function public.accept_invitation(invitation uuid) returns uuid language plpgsql security definer set search_path=public as $$
declare row public.organization_invitations%rowtype;actor_email text;
begin
  if auth.uid() is null then raise exception 'authentication required';end if;
  actor_email:=lower(coalesce(auth.jwt()->>'email',''));
  select * into row from public.organization_invitations where id=invitation for update;
  if row.id is null or row.accepted_at is not null or row.expires_at<=now() or lower(row.email)<>actor_email then raise exception 'invalid invitation';end if;
  insert into public.organization_members(organization_id,user_id,role) values(row.organization_id,auth.uid(),row.role) on conflict(organization_id,user_id) do nothing;
  update public.organization_invitations set accepted_at=now() where id=row.id;
  insert into public.audit_logs(organization_id,actor_id,action,entity_type,entity_id,metadata) values(row.organization_id,auth.uid(),'member.invitation_accepted','invitation',row.id::text,jsonb_build_object('role',row.role));
  return row.organization_id;
end $$;
revoke all on function public.accept_invitation(uuid) from public,anon;
grant execute on function public.accept_invitation(uuid) to authenticated;