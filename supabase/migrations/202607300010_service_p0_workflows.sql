-- Cierre P0: decisiones públicas, agenda transaccional, control humano e historial.
alter table public.quotations
  add column public_token_hash text unique,
  add column public_token_expires_at timestamptz,
  add column public_decision text check (public_decision in ('accepted','rejected')),
  add column public_decided_at timestamptz,
  add column ready_to_send boolean not null default false,
  add column cancelled_at timestamptz;

create table public.quotation_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  quotation_id uuid not null,
  event_type text not null check (event_type in ('created','versioned','approved','ready_to_send','send_simulated','accepted','rejected','expired','cancelled')),
  actor_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  foreign key (organization_id,quotation_id) references public.quotations(organization_id,id) on delete cascade
);
create index quotation_events_history on public.quotation_events(organization_id,quotation_id,created_at);

create table public.schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  assignee_id uuid references public.profiles(id) on delete set null,
  starts_at timestamptz not null, ends_at timestamptz not null,
  reason text not null, created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), check(ends_at>starts_at)
);
create index schedule_blocks_window on public.schedule_blocks(organization_id,starts_at,ends_at);

alter table public.service_requests
  add column tags jsonb not null default '[]' check(jsonb_typeof(tags)='array'),
  add column next_action text,
  add column follow_up_at timestamptz,
  add column lost_reason text,
  add column review_reason text,
  add column internal_notes_in_ai boolean not null default false;
create table public.service_request_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null, metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index service_request_events_history on public.service_request_events(organization_id,service_request_id,created_at);

alter table public.conversations
  add column ai_control_state text not null default 'ai_active' check(ai_control_state in ('ai_active','handoff_requested','human_active','ai_paused')),
  add column assigned_to uuid references public.profiles(id) on delete set null,
  add column priority text not null default 'normal' check(priority in ('low','normal','high','urgent'));

create or replace function public.reserve_service_appointment(
  org uuid, request_id uuid, assignee uuid, starts timestamptz, ends timestamptz,
  units integer default 1, max_capacity integer default 1, appointment_address text default null,
  appointment_commune text default null
) returns uuid language plpgsql security definer set search_path=public as $$
declare used integer; out_id uuid;
begin
  if not public.has_org_role(org,array['owner','admin','agent']::public.organization_role[]) then raise exception 'not authorized'; end if;
  if ends<=starts or units<1 or max_capacity<1 then raise exception 'invalid appointment'; end if;
  perform pg_advisory_xact_lock(hashtextextended(org::text||coalesce(assignee::text,'unassigned'),0));
  if exists(select 1 from schedule_blocks b where b.organization_id=org and (b.assignee_id is null or b.assignee_id=assignee) and b.starts_at<ends and b.ends_at>starts) then raise exception 'schedule blocked'; end if;
  select coalesce(sum(capacity_units),0) into used from appointments a
   where a.organization_id=org and a.assignee_id is not distinct from assignee
   and a.status<>'CANCELLED' and a.starts_at<ends and a.ends_at>starts;
  if used+units>max_capacity then raise exception 'capacity exceeded'; end if;
  insert into appointments(organization_id,service_request_id,assignee_id,status,starts_at,ends_at,capacity_units,address,commune)
  values(org,request_id,assignee,'CONFIRMED',starts,ends,units,appointment_address,appointment_commune) returning id into out_id;
  insert into service_request_events(organization_id,service_request_id,actor_id,event_type,metadata)
  values(org,request_id,auth.uid(),'appointment.booked',jsonb_build_object('appointment_id',out_id));
  return out_id;
end $$;
revoke all on function public.reserve_service_appointment(uuid,uuid,uuid,timestamptz,timestamptz,integer,integer,text,text) from public;
grant execute on function public.reserve_service_appointment(uuid,uuid,uuid,timestamptz,timestamptz,integer,integer,text,text) to authenticated;

alter table public.quotation_events enable row level security;
alter table public.schedule_blocks enable row level security;
alter table public.service_request_events enable row level security;
create policy quotation_events_member_read on public.quotation_events for select using(public.is_org_member(organization_id));
create policy quotation_events_agent_write on public.quotation_events for insert with check(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy schedule_blocks_member_read on public.schedule_blocks for select using(public.is_org_member(organization_id));
create policy schedule_blocks_agent_write on public.schedule_blocks for all using(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy request_events_member_read on public.service_request_events for select using(public.is_org_member(organization_id));
create policy request_events_agent_write on public.service_request_events for insert with check(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
grant select,insert on public.quotation_events,public.service_request_events to authenticated;
grant select,insert,update,delete on public.schedule_blocks to authenticated;
