alter table public.contacts
  add constraint contacts_organization_phone_unique unique (organization_id, phone);

alter table public.conversations
  add constraint conversations_channel_external_unique
  unique (organization_id, channel, external_id);

alter table public.messages
  add column if not exists status text not null default 'received',
  add column if not exists waba_id text,
  add column if not exists phone_number_id text,
  add column if not exists contact_external_id text,
  add column if not exists sent_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists read_at timestamptz;

create unique index if not exists messages_external_id_unique
  on public.messages(external_id)
  where external_id is not null;

create index if not exists webhook_events_phone_number
  on public.webhook_events ((payload->>'phone_number_id'), received_at desc);

create index if not exists messages_status_external
  on public.messages(organization_id, external_id, status);
