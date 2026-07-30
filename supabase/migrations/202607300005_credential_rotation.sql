create table if not exists public.credential_rotation_backups (
  id uuid primary key default gen_random_uuid(),
  rotation_id uuid not null,
  integration_account_id uuid not null references public.integration_accounts(id) on delete restrict,
  encrypted_credentials text not null,
  created_at timestamptz not null default now(),
  unique (rotation_id, integration_account_id)
);

alter table public.credential_rotation_backups enable row level security;
revoke all on public.credential_rotation_backups from public, anon, authenticated;
grant select, insert on public.credential_rotation_backups to service_role;

create or replace function public.backup_integration_credentials(rotation uuid, account_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare copied integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;
  insert into public.credential_rotation_backups(rotation_id,integration_account_id,encrypted_credentials)
  select rotation,id,encrypted_credentials
  from public.integration_accounts
  where id = any(account_ids) and encrypted_credentials is not null
  on conflict (rotation_id,integration_account_id) do nothing;
  get diagnostics copied = row_count;
  return copied;
end;
$$;

create or replace function public.replace_integration_credential(account_id uuid, expected_ciphertext text, replacement_ciphertext text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare changed integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;
  update public.integration_accounts
  set encrypted_credentials = replacement_ciphertext
  where id = account_id and encrypted_credentials = expected_ciphertext;
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

revoke all on function public.backup_integration_credentials(uuid,uuid[]) from public, anon, authenticated;
revoke all on function public.replace_integration_credential(uuid,text,text) from public, anon, authenticated;
grant execute on function public.backup_integration_credentials(uuid,uuid[]) to service_role;
grant execute on function public.replace_integration_credential(uuid,text,text) to service_role;
