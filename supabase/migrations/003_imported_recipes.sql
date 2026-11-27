-- 003: Remember which recipes were imported, and lock their source link.
--
-- An imported recipe's source link credits the site it came from, so it
-- can't be changed. The rest of the recipe (title, ingredients, steps,
-- notes) can still be edited, and the recipe can still be deleted.
--
-- The lock lives in the database, not only in the edit form, so even a
-- request that skips the form can't change the link.
--
-- Row Level Security on recipes is unchanged: each user still only sees
-- and changes their own rows (see 002_recipes.sql).
--
-- Safe to run more than once.

-- The new column ----------------------------------------------------------

-- True for recipes added with "Import" from a link. Typed-in recipes
-- (including "Enter it by hand") stay false.
alter table public.recipes
  add column if not exists imported boolean not null default false;

-- Recipes imported before this column existed: only imports save a photo
-- link, so a recipe with one was imported. (Runs before the lock below is
-- created; on a second run there's nothing left to change.)
update public.recipes
  set imported = true
  where image_url is not null and imported = false;

-- The lock ----------------------------------------------------------------

-- Refuses any change to an imported recipe's source link, and any change to
-- the imported flag itself (in either direction).
create or replace function public.protect_imported_source()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.imported is distinct from old.imported then
    raise exception 'Whether a recipe was imported can''t be changed.';
  end if;
  if old.imported and new.source_url is distinct from old.source_url then
    raise exception 'The source link of an imported recipe can''t be changed.';
  end if;
  return new;
end;
$$;

drop trigger if exists recipes_protect_imported_source on public.recipes;
create trigger recipes_protect_imported_source
  before update on public.recipes
  for each row execute function public.protect_imported_source();
