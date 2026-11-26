-- 002: The recipes table, where each user's saved recipes live.
--
-- One row = one saved recipe. Every recipe belongs to the signed-in user who
-- saved it (user_id), and Row Level Security makes sure each person can only
-- see, add, change, and delete their own recipes. Signed-out visitors can't
-- see any recipes at all.
--
-- Safe to run more than once.

-- The table ------------------------------------------------------------------

create table if not exists public.recipes (
  id          uuid primary key default gen_random_uuid(),

  -- Who saved it. Filled in automatically from the signed-in user.
  -- If a user deletes their account, their recipes are deleted too.
  user_id     uuid not null default auth.uid()
              references auth.users (id) on delete cascade,

  -- The recipe's name. Required and can't be blank.
  title       text not null check (length(trim(title)) > 0),

  -- Ingredient lines exactly as written, e.g. "2 lbs boneless chicken thighs".
  -- At least one is required.
  ingredients text[] not null check (cardinality(ingredients) > 0),

  -- Search words built from the ingredient lines by the app:
  -- lowercase, singular, no amounts, e.g. {chicken, thigh, miso}.
  keywords    text[] not null default '{}',

  -- Instructions, one entry per step.
  steps       text[] not null default '{}',

  -- Optional extras.
  servings    text,          -- e.g. "4 servings" or "12 cookies"
  total_time  text,          -- e.g. "45 minutes"
  notes       text,          -- the user's own notes

  -- Links. Must be web addresses (http or https) when present.
  source_url  text check (source_url is null or source_url ~* '^https?://'),
  image_url   text check (image_url  is null or image_url  ~* '^https?://'),

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Keep updated_at current ----------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists recipes_set_updated_at on public.recipes;
create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- Indexes (make lookups fast) ------------------------------------------------

-- Listing a user's recipes, newest first.
create index if not exists recipes_user_created_idx
  on public.recipes (user_id, created_at desc);

-- Ingredient search: "recipes whose keywords contain chicken AND cumin".
create index if not exists recipes_keywords_idx
  on public.recipes using gin (keywords);

-- Security: Row Level Security -----------------------------------------------

alter table public.recipes enable row level security;

drop policy if exists "Users can read their own recipes" on public.recipes;
create policy "Users can read their own recipes"
  on public.recipes
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add their own recipes" on public.recipes;
create policy "Users can add their own recipes"
  on public.recipes
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can change their own recipes" on public.recipes;
create policy "Users can change their own recipes"
  on public.recipes
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own recipes" on public.recipes;
create policy "Users can delete their own recipes"
  on public.recipes
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Signed-in users get access (still limited by the policies above).
-- Signed-out visitors get none.
grant select, insert, update, delete on public.recipes to authenticated;
revoke all on public.recipes from anon;
