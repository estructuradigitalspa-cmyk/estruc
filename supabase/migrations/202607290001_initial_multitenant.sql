-- Estructura Digital SaaS — esquema inicial multi-tenant
create extension if not exists pgcrypto;
create type public.organization_role as enum ('owner','admin','agent','viewer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.organizations (
  id uuid primary key default gen_random_uuid(), name text not null, country text not null,
  website text, size text, objective text, created_at timestamptz not null default now()
);
create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.organization_role not null default 'viewer', created_at timestamptz not null default now(),
  primary key (organization_id,user_id)
);
create table public.contacts (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, email text, phone text, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.conversations (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null, channel text not null, external_id text,
  status text not null default 'open', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.messages (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade, external_id text,
  direction text not null check(direction in ('inbound','outbound')), body text, created_at timestamptz not null default now()
);
create table public.pipelines (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, created_at timestamptz not null default now()
);
create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  pipeline_id uuid not null references public.pipelines(id) on delete cascade, name text not null, position integer not null default 0
);
create table public.deals (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  pipeline_id uuid references public.pipelines(id) on delete set null, stage_id uuid references public.pipeline_stages(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null, title text not null, value numeric, status text not null default 'open', created_at timestamptz not null default now()
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null, title text not null, status text not null default 'pending',
  due_at timestamptz, created_at timestamptz not null default now()
);
create table public.integrations (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null, status text not null default 'not_configured', config jsonb not null default '{}', created_at timestamptz not null default now(),
  unique(organization_id,provider)
);
create table public.integration_accounts (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  integration_id uuid not null references public.integrations(id) on delete cascade, external_id text not null,
  display_name text, encrypted_credentials text, created_at timestamptz not null default now(), unique(integration_id,external_id)
);
create table public.webhook_events (
  id uuid primary key default gen_random_uuid(), organization_id uuid references public.organizations(id) on delete cascade,
  provider text not null, event_key text not null unique, event_type text not null, payload jsonb not null,
  status text not null default 'received', received_at timestamptz not null default now(), processed_at timestamptz
);
create table public.audit_logs (
  id bigint generated always as identity primary key, organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null, action text not null, entity_type text, entity_id text,
  metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.data_deletion_requests (
  id uuid primary key default gen_random_uuid(), organization_id uuid references public.organizations(id) on delete set null,
  provider text not null, external_user_id text, confirmation_code uuid not null unique, status text not null default 'received',
  requested_at timestamptz not null default now(), completed_at timestamptz
);

create index on public.organization_members(user_id);
create index on public.contacts(organization_id);
create index on public.conversations(organization_id);
create index on public.messages(organization_id,conversation_id);
create index on public.deals(organization_id);
create index on public.tasks(organization_id,status);
create index on public.audit_logs(organization_id,created_at desc);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,full_name) values(new.id,new.raw_user_meta_data->>'full_name') on conflict(id) do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_org_member(org_id uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.organization_members m where m.organization_id=org_id and m.user_id=auth.uid());
$$;
create or replace function public.has_org_role(org_id uuid, allowed public.organization_role[]) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.organization_members m where m.organization_id=org_id and m.user_id=auth.uid() and m.role=any(allowed));
$$;
create or replace function public.create_organization_with_owner(organization_name text,organization_country text,organization_website text,organization_size text,organization_objective text) returns uuid language plpgsql security definer set search_path=public as $$
declare new_id uuid; begin if auth.uid() is null then raise exception 'authentication required'; end if; insert into public.organizations(name,country,website,size,objective) values(organization_name,organization_country,organization_website,organization_size,organization_objective) returning id into new_id; insert into public.organization_members(organization_id,user_id,role) values(new_id,auth.uid(),'owner'); return new_id; end; $$;
revoke all on function public.create_organization_with_owner(text,text,text,text,text) from public;
grant execute on function public.create_organization_with_owner(text,text,text,text,text) to authenticated;

alter table public.profiles enable row level security; alter table public.organizations enable row level security;
alter table public.organization_members enable row level security; alter table public.contacts enable row level security;
alter table public.conversations enable row level security; alter table public.messages enable row level security;
alter table public.pipelines enable row level security; alter table public.pipeline_stages enable row level security;
alter table public.deals enable row level security; alter table public.tasks enable row level security;
alter table public.integrations enable row level security; alter table public.integration_accounts enable row level security;
alter table public.webhook_events enable row level security; alter table public.audit_logs enable row level security;
alter table public.data_deletion_requests enable row level security;

create policy profiles_self on public.profiles for select using(id=auth.uid());
create policy organizations_member on public.organizations for select using(public.is_org_member(id));
create policy members_member on public.organization_members for select using(public.is_org_member(organization_id));
create policy members_admin_write on public.organization_members for all using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));

create policy contacts_member on public.contacts for select using(public.is_org_member(organization_id));
create policy contacts_agent_write on public.contacts for all using(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy conversations_member on public.conversations for select using(public.is_org_member(organization_id));
create policy conversations_agent_write on public.conversations for all using(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy messages_member on public.messages for select using(public.is_org_member(organization_id));
create policy messages_agent_write on public.messages for all using(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy pipelines_member on public.pipelines for select using(public.is_org_member(organization_id)); create policy pipelines_admin_write on public.pipelines for all using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy stages_member on public.pipeline_stages for select using(public.is_org_member(organization_id)); create policy stages_admin_write on public.pipeline_stages for all using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy deals_member on public.deals for select using(public.is_org_member(organization_id)); create policy deals_agent_write on public.deals for all using(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy tasks_member on public.tasks for select using(public.is_org_member(organization_id)); create policy tasks_agent_write on public.tasks for all using(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy integrations_member on public.integrations for select using(public.is_org_member(organization_id)); create policy integrations_admin_write on public.integrations for all using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy integration_accounts_member on public.integration_accounts for select using(public.is_org_member(organization_id)); create policy integration_accounts_admin_write on public.integration_accounts for all using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy webhook_member on public.webhook_events for select using(organization_id is not null and public.is_org_member(organization_id));
create policy audit_member on public.audit_logs for select using(public.is_org_member(organization_id));
create policy deletion_member on public.data_deletion_requests for select using(organization_id is not null and public.is_org_member(organization_id));
