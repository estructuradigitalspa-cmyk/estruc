-- Ejecutar sólo tras respaldar datos del vertical.
drop table if exists public.service_request_notes;
drop table if exists public.service_requests;
drop table if exists public.service_pricing_rules;
drop table if exists public.service_extras;
drop table if exists public.service_variants;
drop table if exists public.service_catalog;
drop table if exists public.organization_service_profiles;
drop type if exists public.pricing_rule_type;
drop type if exists public.service_request_status;
