drop function if exists public.reserve_service_appointment(uuid,uuid,uuid,timestamptz,timestamptz,integer,integer,text,text);
drop table if exists public.service_request_events,public.schedule_blocks,public.quotation_events;
alter table public.conversations drop column if exists priority,drop column if exists assigned_to,drop column if exists ai_control_state;
alter table public.service_requests drop column if exists internal_notes_in_ai,drop column if exists review_reason,drop column if exists lost_reason,drop column if exists follow_up_at,drop column if exists next_action,drop column if exists tags;
alter table public.quotations drop column if exists cancelled_at,drop column if exists ready_to_send,drop column if exists public_decided_at,drop column if exists public_decision,drop column if exists public_token_expires_at,drop column if exists public_token_hash;
