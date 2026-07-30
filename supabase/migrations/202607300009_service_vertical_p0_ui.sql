-- Campos operativos tipados requeridos por la experiencia P0.
alter table public.organization_service_profiles
  add column buffer_minutes integer not null default 0 check (buffer_minutes >= 0 and buffer_minutes <= 1440),
  add column rescheduling_policy text,
  add column quote_required_fields jsonb not null default '[]' check (jsonb_typeof(quote_required_fields) = 'array'),
  add column booking_required_fields jsonb not null default '[]' check (jsonb_typeof(booking_required_fields) = 'array'),
  add column welcome_message text,
  add column out_of_hours_message text;

alter table public.service_catalog
  add column pricing_mode text not null default 'fixed'
    check (pricing_mode in ('fixed','per_unit','base_plus_extras','zone_adjusted','range','manual')),
  add column required_questions jsonb not null default '[]' check (jsonb_typeof(required_questions) = 'array'),
  add column required_fields jsonb not null default '[]' check (jsonb_typeof(required_fields) = 'array'),
  add column exclusions jsonb not null default '[]' check (jsonb_typeof(exclusions) = 'array'),
  add column service_communes jsonb not null default '[]' check (jsonb_typeof(service_communes) = 'array'),
  add column requires_human_review boolean not null default false;
