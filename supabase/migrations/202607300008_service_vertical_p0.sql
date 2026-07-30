-- P0 operativo del vertical de servicios. Aditiva, tenant-scoped y reversible.
create type public.agent_run_status as enum ('RUNNING','SUCCEEDED','FAILED','HANDED_OFF');
create type public.quotation_status as enum ('DRAFT','REVIEW_REQUIRED','APPROVED','REJECTED','EXPIRED');
create type public.appointment_status as enum ('TENTATIVE','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED');

create table public.service_agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  description text,
  active boolean not null default false,
  active_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table public.service_agent_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid not null references public.service_agents(id) on delete cascade,
  version integer not null check (version > 0),
  tone text not null default 'claro, amable y profesional',
  instructions text not null,
  limits jsonb not null default '{}',
  service_ids jsonb not null default '[]',
  allowed_tools jsonb not null default '[]',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (agent_id, version),
  unique (organization_id, id)
);
alter table public.service_agents add constraint service_agents_active_version_fk
  foreign key (organization_id, active_version_id)
  references public.service_agent_versions(organization_id, id) deferrable initially deferred;

create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid references public.service_agents(id) on delete set null,
  agent_version_id uuid references public.service_agent_versions(id) on delete set null,
  service_request_id uuid references public.service_requests(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  status public.agent_run_status not null default 'RUNNING',
  provider text not null,
  model text not null,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  latency_ms integer check (latency_ms >= 0),
  estimated_cost numeric(14,6) not null default 0 check (estimated_cost >= 0),
  result jsonb,
  error_code text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.agent_tool_calls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_run_id uuid not null references public.agent_runs(id) on delete cascade,
  tool_name text not null,
  idempotency_key text not null,
  input jsonb not null default '{}',
  output jsonb,
  status text not null check (status in ('STARTED','SUCCEEDED','REJECTED','FAILED')),
  error_code text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (organization_id, idempotency_key)
);

create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  folio bigint not null,
  version integer not null default 1 check (version > 0),
  status public.quotation_status not null default 'DRAFT',
  currency text not null default 'CLP' check (currency ~ '^[A-Z]{3}$'),
  subtotal numeric(14,2) not null check (subtotal >= 0),
  tax numeric(14,2) not null default 0 check (tax >= 0),
  total numeric(14,2) not null check (total >= 0 and total = subtotal + tax),
  valid_until date not null,
  review_reason text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, folio, version),
  unique (organization_id, id)
);

create table public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  quotation_id uuid not null,
  description text not null,
  quantity numeric(12,2) not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  total numeric(14,2) generated always as (round(quantity * unit_price, 2)) stored,
  sort_order integer not null default 0,
  foreign key (organization_id, quotation_id) references public.quotations(organization_id, id) on delete cascade
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  assignee_id uuid references public.profiles(id) on delete set null,
  status public.appointment_status not null default 'TENTATIVE',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity_units integer not null default 1 check (capacity_units > 0),
  address text,
  commune text,
  notes text,
  cancelled_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.human_handoffs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  agent_run_id uuid references public.agent_runs(id) on delete set null,
  requested_by text not null check (requested_by in ('customer','agent','operator','system')),
  reason text not null,
  priority text not null default 'normal' check (priority in ('normal','high','urgent')),
  summary text not null,
  pending_questions jsonb not null default '[]',
  status text not null default 'OPEN' check (status in ('OPEN','CLAIMED','RESOLVED')),
  claimed_by uuid references public.profiles(id) on delete set null,
  claimed_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index agent_versions_org_agent on public.service_agent_versions(organization_id,agent_id,version desc);
create index agent_runs_request on public.agent_runs(organization_id,service_request_id,created_at desc);
create index quotations_request on public.quotations(organization_id,service_request_id,created_at desc);
create index appointments_window on public.appointments(organization_id,starts_at,ends_at) where status <> 'CANCELLED';
create index handoffs_open on public.human_handoffs(organization_id,status,created_at) where status <> 'RESOLVED';

alter table public.service_agents enable row level security;
alter table public.service_agent_versions enable row level security;
alter table public.agent_runs enable row level security;
alter table public.agent_tool_calls enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_items enable row level security;
alter table public.appointments enable row level security;
alter table public.human_handoffs enable row level security;

create policy service_agents_member_read on public.service_agents for select using (public.is_org_member(organization_id));
create policy service_agents_admin_write on public.service_agents for all using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy service_agent_versions_member_read on public.service_agent_versions for select using (public.is_org_member(organization_id));
create policy service_agent_versions_admin_write on public.service_agent_versions for all using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy agent_runs_member_read on public.agent_runs for select using (public.is_org_member(organization_id));
create policy agent_runs_agent_write on public.agent_runs for all using (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy tool_calls_member_read on public.agent_tool_calls for select using (public.is_org_member(organization_id));
create policy tool_calls_agent_write on public.agent_tool_calls for all using (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy quotations_member_read on public.quotations for select using (public.is_org_member(organization_id));
create policy quotations_agent_write on public.quotations for all using (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy quotation_items_member_read on public.quotation_items for select using (public.is_org_member(organization_id));
create policy quotation_items_agent_write on public.quotation_items for all using (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy appointments_member_read on public.appointments for select using (public.is_org_member(organization_id));
create policy appointments_agent_write on public.appointments for all using (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy handoffs_member_read on public.human_handoffs for select using (public.is_org_member(organization_id));
create policy handoffs_agent_write on public.human_handoffs for all using (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));

grant select,insert,update,delete on public.service_agents,public.service_agent_versions,public.agent_runs,public.agent_tool_calls,public.quotations,public.quotation_items,public.appointments,public.human_handoffs to authenticated;

