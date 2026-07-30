alter table public.service_catalog
  drop column if exists requires_human_review,
  drop column if exists service_communes,
  drop column if exists exclusions,
  drop column if exists required_fields,
  drop column if exists required_questions,
  drop column if exists pricing_mode;
alter table public.organization_service_profiles
  drop column if exists out_of_hours_message,
  drop column if exists welcome_message,
  drop column if exists booking_required_fields,
  drop column if exists quote_required_fields,
  drop column if exists rescheduling_policy,
  drop column if exists buffer_minutes;
