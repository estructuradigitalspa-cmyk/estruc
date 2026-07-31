create or replace function public.reschedule_service_appointment(org uuid, appointment uuid, starts timestamptz, ends timestamptz, max_capacity integer default 1)
returns void language plpgsql security definer set search_path=public as $$
declare row public.appointments; used integer;
begin
 if not public.has_org_role(org,array['owner','admin','agent']::public.organization_role[]) then raise exception 'not authorized'; end if;
 select * into row from appointments where id=appointment and organization_id=org for update;
 if row is null or row.status='CANCELLED' then raise exception 'appointment unavailable'; end if;
 perform pg_advisory_xact_lock(hashtextextended(org::text||coalesce(row.assignee_id::text,'unassigned'),0));
 select coalesce(sum(capacity_units),0) into used from appointments a where a.organization_id=org and a.id<>appointment and a.assignee_id is not distinct from row.assignee_id and a.status<>'CANCELLED' and a.starts_at<ends and a.ends_at>starts;
 if used+row.capacity_units>max_capacity then raise exception 'capacity exceeded'; end if;
 update appointments set starts_at=starts,ends_at=ends,updated_at=now() where id=appointment;
 insert into service_request_events(organization_id,service_request_id,actor_id,event_type,metadata) values(org,row.service_request_id,auth.uid(),'appointment.rescheduled',jsonb_build_object('appointment_id',appointment));
end $$;
revoke all on function public.reschedule_service_appointment(uuid,uuid,timestamptz,timestamptz,integer) from public;
grant execute on function public.reschedule_service_appointment(uuid,uuid,timestamptz,timestamptz,integer) to authenticated;
