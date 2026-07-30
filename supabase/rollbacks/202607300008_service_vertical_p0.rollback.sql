drop table if exists public.human_handoffs,public.appointments,public.quotation_items,public.quotations,public.agent_tool_calls,public.agent_runs cascade;
alter table public.service_agents drop constraint if exists service_agents_active_version_fk;
drop table if exists public.service_agent_versions,public.service_agents cascade;
drop type if exists public.appointment_status;
drop type if exists public.quotation_status;
drop type if exists public.agent_run_status;
