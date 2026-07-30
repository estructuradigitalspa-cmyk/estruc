-- Additive catalog for tenant-scoped WhatsApp message templates.
create table if not exists public.whatsapp_message_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  integration_account_id uuid references public.integration_accounts(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 512 and name ~ '^[a-z0-9_]+$'),
  language_code text not null check (language_code ~ '^[a-z]{2,3}(_[A-Z]{2})?$'),
  category text not null check (category in ('UTILITY','AUTHENTICATION','MARKETING')),
  status text not null default 'draft' check (status in ('draft','pending','approved','rejected','paused','disabled')),
  namespace text,
  components jsonb not null default '[]'::jsonb,
  meta_template_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name, language_code)
);

create index if not exists whatsapp_templates_org_status
  on public.whatsapp_message_templates(organization_id, status);

alter table public.whatsapp_message_templates enable row level security;

create policy whatsapp_templates_privileged_read
  on public.whatsapp_message_templates for select
  using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));

create policy whatsapp_templates_privileged_write
  on public.whatsapp_message_templates for all
  using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]))
  with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));

revoke all on public.whatsapp_message_templates from public, anon;
grant select,insert,update,delete on public.whatsapp_message_templates to authenticated;