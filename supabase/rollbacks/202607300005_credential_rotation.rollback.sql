-- Manual rollback. Do not run while any credential rotation backup must be retained.
begin;
drop function if exists public.replace_integration_credential(uuid,text,text);
drop function if exists public.backup_integration_credentials(uuid,uuid[]);
drop table if exists public.credential_rotation_backups;
commit;