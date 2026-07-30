drop function if exists public.accept_invitation(uuid);
drop function if exists public.claim_webhook_events(integer);
create policy deletion_member on public.data_deletion_requests for select using(organization_id is not null and public.is_org_member(organization_id));
drop policy if exists audit_privileged_read on public.audit_logs;
create policy audit_member on public.audit_logs for select using(public.is_org_member(organization_id));
drop policy if exists webhook_privileged_read on public.webhook_events;
create policy webhook_member on public.webhook_events for select using(organization_id is not null and public.is_org_member(organization_id));
drop policy if exists integrations_privileged_read on public.integrations;
create policy integrations_member on public.integrations for select using(public.is_org_member(organization_id));-- Manual rollback for 202607300004_production_hardening.sql.
-- Apply only after verifying no application deployment depends on these objects.
drop view if exists public.integration_accounts_safe;
drop function if exists public.invite_member(uuid,text,public.organization_role);
drop table if exists public.organization_invitations;
drop index if exists public.messages_org_external_id_unique;
drop function if exists public.transfer_ownership(uuid,uuid);
drop function if exists public.remove_member(uuid,uuid);
drop function if exists public.change_member_role(uuid,uuid,public.organization_role);
drop function if exists public.resolve_meta_user(text);
drop function if exists public.consume_rate_limit(text,text,integer,integer);
drop table if exists public.rate_limit_buckets;
drop function if exists public.consume_oauth_nonce(text,uuid,uuid,uuid);
drop table if exists public.oauth_nonces;
drop index if exists public.integration_accounts_org_waba_phone;
-- Columns are intentionally retained because dropping them would destroy data.
drop policy if exists integration_accounts_privileged_read on public.integration_accounts;
create policy integration_accounts_member on public.integration_accounts for select using(public.is_org_member(organization_id));
-- Restore the previous member write policy only after a security review; it was over-permissive.