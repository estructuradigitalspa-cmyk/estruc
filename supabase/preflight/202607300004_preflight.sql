-- Read-only preflight before 202607300004_production_hardening.sql.
select organization_id,waba_id,phone_number_id,count(*) as duplicates from public.integration_accounts where waba_id is not null and phone_number_id is not null group by 1,2,3 having count(*)>1;
select organization_id,external_id,count(*) as duplicates from public.messages where external_id is not null group by 1,2 having count(*)>1;
select organization_id,count(*) filter(where role='owner') as owners,count(*) as members from public.organization_members group by organization_id having count(*) filter(where role='owner')=0;
select count(*) as pending_webhooks from public.webhook_events where status not in ('processed');