-- Manual rollback for the additive template catalog. Preserves all WhatsApp integrations and messages.
begin;
drop table if exists public.whatsapp_message_templates;
commit;