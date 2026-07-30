-- Vertical de empresas de servicios. Migración aditiva y reversible.
create type public.service_request_status as enum (
  'NEW','QUALIFYING','AWAITING_INFORMATION','READY_TO_QUOTE','QUOTED',
  'FOLLOW_UP','BOOKED','IN_PROGRESS','COMPLETED','CANCELLED','LOST','REQUIRES_HUMAN'
);
create type public.pricing_rule_type as enum (
  'FIXED','PER_QUANTITY','FIXED_SURCHARGE','PERCENT_SURCHARGE','ZONE','MANUAL'
);

create table public.organization_service_profiles (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  trade_name text not null,
  description text,
  industry text,
  service_zones jsonb not null default '[]',
  communes jsonb not null default '[]',
  business_hours jsonb not null default '{}',
  minimum_notice_minutes integer not null default 0 check (minimum_notice_minutes >= 0),
  standard_duration_minutes integer not null default 60 check (standard_duration_minutes > 0),
  payment_methods jsonb not null default '[]',
  cancellation_policy text,
  warranty_policy text,
  currency text not null default 'CLP' check (currency ~ '^[A-Z]{3}$'),
  timezone text not null default 'America/Santiago',
  internal_instructions text,
  human_handoff_rules jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  description text,
  category text,
  active boolean not null default true,
  estimated_duration_minutes integer check (estimated_duration_minutes > 0),
  base_price numeric(14,2) check (base_price >= 0),
  currency text not null default 'CLP' check (currency ~ '^[A-Z]{3}$'),
  requires_quote boolean not null default false,
  requires_photos boolean not null default false,
  requires_visit boolean not null default false,
  allows_immediate_booking boolean not null default false,
  ai_instructions text,
  terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table public.service_variants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_id uuid not null references public.service_catalog(id) on delete cascade,
  name text not null,
  price numeric(14,2) check (price >= 0),
  active boolean not null default true,
  metadata jsonb not null default '{}',
  unique (service_id, name),
  unique (organization_id, id)
);

create table public.service_extras (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_id uuid not null references public.service_catalog(id) on delete cascade,
  name text not null,
  amount numeric(14,2) not null default 0,
  is_percentage boolean not null default false,
  requires_human_review boolean not null default false,
  active boolean not null default true,
  unique (service_id, name),
  unique (organization_id, id)
);

create table public.service_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_id uuid not null references public.service_catalog(id) on delete cascade,
  rule_type public.pricing_rule_type not null,
  priority integer not null default 0,
  conditions jsonb not null default '{}',
  value numeric(14,2),
  active boolean not null default true,
  requires_human_review boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  service_id uuid references public.service_catalog(id) on delete set null,
  status public.service_request_status not null default 'NEW',
  address text,
  commune text,
  preferred_date date,
  preferred_time_range text,
  description text,
  attachments jsonb not null default '[]',
  qualification_data jsonb not null default '{}',
  assigned_to uuid references public.profiles(id) on delete set null,
  source text not null default 'manual',
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  human_handoff_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_request_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_request_id uuid not null references public.service_requests(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index service_catalog_org_active on public.service_catalog(organization_id, active);
create index pricing_rules_service on public.service_pricing_rules(organization_id, service_id, priority);
create index service_requests_pipeline on public.service_requests(organization_id, status, updated_at desc);
create index service_requests_contact on public.service_requests(organization_id, contact_id);
create index service_request_notes_request on public.service_request_notes(organization_id, service_request_id, created_at);

alter table public.organization_service_profiles enable row level security;
alter table public.service_catalog enable row level security;
alter table public.service_variants enable row level security;
alter table public.service_extras enable row level security;
alter table public.service_pricing_rules enable row level security;
alter table public.service_requests enable row level security;
alter table public.service_request_notes enable row level security;

create policy service_profiles_member_read on public.organization_service_profiles for select using (public.is_org_member(organization_id));
create policy service_profiles_admin_write on public.organization_service_profiles for all using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy service_catalog_member_read on public.service_catalog for select using (public.is_org_member(organization_id));
create policy service_catalog_admin_write on public.service_catalog for all using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy service_variants_member_read on public.service_variants for select using (public.is_org_member(organization_id));
create policy service_variants_admin_write on public.service_variants for all using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy service_extras_member_read on public.service_extras for select using (public.is_org_member(organization_id));
create policy service_extras_admin_write on public.service_extras for all using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy pricing_rules_member_read on public.service_pricing_rules for select using (public.is_org_member(organization_id));
create policy pricing_rules_admin_write on public.service_pricing_rules for all using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy service_requests_member_read on public.service_requests for select using (public.is_org_member(organization_id));
create policy service_requests_agent_write on public.service_requests for all using (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy service_request_notes_member_read on public.service_request_notes for select using (public.is_org_member(organization_id));
create policy service_request_notes_agent_write on public.service_request_notes for all using (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));

grant select on public.organization_service_profiles,public.service_catalog,public.service_variants,public.service_extras,public.service_pricing_rules,public.service_requests,public.service_request_notes to authenticated;
grant insert,update,delete on public.organization_service_profiles,public.service_catalog,public.service_variants,public.service_extras,public.service_pricing_rules,public.service_requests,public.service_request_notes to authenticated;
