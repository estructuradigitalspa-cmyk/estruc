-- P1 Piloto Comercial: onboarding, presupuestos, métricas y checklist.
create table public.organization_pilot_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  environment text not null default 'staging' check(environment in ('local','staging','production')),
  onboarding_step integer not null default 1 check(onboarding_step between 1 and 7),
  onboarding_completed_at timestamptz,
  llm_provider text not null default 'simulated' check(llm_provider in ('simulated','openai_compatible')),
  llm_model text not null default 'simulated-service-agent-v1',
  llm_enabled boolean not null default false,
  monthly_token_budget bigint not null default 100000 check(monthly_token_budget>=0),
  monthly_cost_budget numeric(14,4) not null default 10 check(monthly_cost_budget>=0),
  per_run_token_limit integer not null default 4000 check(per_run_token_limit between 128 and 100000),
  external_messages_enabled boolean not null default false,
  pilot_data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.pilot_checklist_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  item_key text not null,
  completed boolean not null default false,
  completed_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  evidence jsonb not null default '{}',
  unique(organization_id,item_key)
);
create table public.webhook_diagnostics (
  id bigint generated always as identity primary key,
  organization_id uuid references public.organizations(id) on delete cascade,
  provider text not null,
  event_key text,
  diagnostic_type text not null,
  severity text not null check(severity in ('info','warning','error')),
  summary text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index pilot_runs_metrics on public.agent_runs(organization_id,created_at,status);
create index webhook_diagnostics_recent on public.webhook_diagnostics(organization_id,created_at desc);
alter table public.organization_pilot_settings enable row level security;
alter table public.pilot_checklist_items enable row level security;
alter table public.webhook_diagnostics enable row level security;
create policy pilot_settings_member_read on public.organization_pilot_settings for select using(public.is_org_member(organization_id));
create policy pilot_settings_admin_write on public.organization_pilot_settings for all using(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy pilot_checklist_member_read on public.pilot_checklist_items for select using(public.is_org_member(organization_id));
create policy pilot_checklist_agent_write on public.pilot_checklist_items for all using(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
create policy webhook_diagnostics_privileged_read on public.webhook_diagnostics for select using(public.has_org_role(organization_id,array['owner','admin','agent']::public.organization_role[]));
grant select,insert,update,delete on public.organization_pilot_settings,public.pilot_checklist_items to authenticated;
grant select on public.webhook_diagnostics to authenticated;
