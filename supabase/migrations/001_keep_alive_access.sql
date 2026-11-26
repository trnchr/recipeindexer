-- 001: Let the daily keep-alive ping read the keep_alive table.
--
-- The Worker's daily cron (worker/index.js) reads one row from keep_alive with
-- the publishable key so the free Supabase project counts as active and doesn't
-- pause. It was failing with "permission denied for table keep_alive" because
-- the anon (signed-out) role had no read access to the table.
--
-- keep_alive holds no user data (only an id), so a public read-only policy is
-- safe here. This is the one exception to the "users see only their own rows"
-- rule; every table with user data still gets auth.uid() policies.
--
-- Safe to run more than once.

-- Make sure the table exists (it should already).
create table if not exists public.keep_alive (
  id bigint generated always as identity primary key
);

-- Row Level Security stays on.
alter table public.keep_alive enable row level security;

-- Anyone may read it; nobody may change it through the API.
drop policy if exists "keep_alive is readable by anyone" on public.keep_alive;
create policy "keep_alive is readable by anyone"
  on public.keep_alive
  for select
  to anon, authenticated
  using (true);

grant select on public.keep_alive to anon, authenticated;
revoke insert, update, delete, truncate on public.keep_alive from anon, authenticated;
