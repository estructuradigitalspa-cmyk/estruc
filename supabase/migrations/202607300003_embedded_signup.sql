alter table public.integration_accounts
  add column if not exists business_id text,
  add column if not exists waba_id text,
  add column if not exists phone_number_id text,
  add column if not exists status text not null default 'pending',
  add column if not exists connected_at timestamptz,
  add column if not exists metadata jsonb not null default '{}';

create index if not exists integration_accounts_business
  on public.integration_accounts(organization_id, business_id);

create index if not exists integration_accounts_waba
  on public.integration_accounts(organization_id, waba_id);

create unique index if not exists integration_accounts_phone
  on public.integration_accounts(organization_id, phone_number_id)
  where phone_number_id is not null;
