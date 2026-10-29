-- Foundation: extensions, shared enums, helpers, profiles and roles.

create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('editor', 'admin');

create type public.post_status as enum ('draft', 'scheduled', 'published', 'archived');

create type public.post_template as enum (
  'cinematic',
  'travel_journal',
  'day_in_life',
  'photo_essay',
  'reflection',
  'minimal',
  'timeline'
);

create type public.story_mood as enum (
  'joyful',
  'dreamy',
  'adventurous',
  'mindful',
  'nostalgic',
  'reflective',
  'cozy',
  'bittersweet'
);

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Lowercase, hyphen-separated, 1–96 chars. Used by posts, categories and tags.
create function public.is_valid_slug(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select value ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(value) <= 96;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (one per auth user; contains nothing private)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 120),
  bio text not null default '' check (char_length(bio) <= 4000),
  -- FK to media_assets is added in the media migration.
  avatar_media_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Roles. There is no self-service path: rows are written by an admin, or by
-- the service role from `pnpm admin:create`.
-- ---------------------------------------------------------------------------
create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  granted_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- True when the current user holds `min_role` or a higher one (admin ⊇ editor).
-- Security definer so policies on user_roles can call it without recursing.
create function public.has_role(min_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = (select auth.uid())
      and ur.role >= min_role
  );
$$;

-- Keep at least one admin, so the site can never be locked out from the app.
-- Security definer: it has to look at auth.users, which callers can't read.
create function public.prevent_last_admin_removal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'admin'
     and (tg_op = 'DELETE' or new.role <> 'admin')
     and not exists (
       select 1 from public.user_roles
       where role = 'admin' and user_id <> old.user_id
     )
     -- Allow the cascade when the auth user itself is being deleted.
     and exists (select 1 from auth.users where id = old.user_id)
  then
    raise exception 'Cannot remove the last admin' using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger user_roles_keep_one_admin
before update or delete on public.user_roles
for each row execute function public.prevent_last_admin_removal();

-- ---------------------------------------------------------------------------
-- Audit log. Written through log_audit() so actor_id always comes from the
-- session, never from the caller.
-- ---------------------------------------------------------------------------
create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null check (char_length(action) between 1 and 80),
  entity_type text not null check (char_length(entity_type) between 1 and 40),
  entity_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

create function public.log_audit(
  p_action text,
  p_entity_type text,
  p_entity_id text default null,
  p_metadata jsonb default '{}'
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.has_role('editor') then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values ((select auth.uid()), p_action, p_entity_type, p_entity_id, coalesce(p_metadata, '{}'));
end;
$$;

-- ---------------------------------------------------------------------------
-- Rate limiting for public forms and sign-in (service role only).
-- ---------------------------------------------------------------------------
create table public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (key, window_start)
);

-- Records one hit for `p_key` and returns true while the caller is within
-- `p_limit` hits for the current fixed window.
create function public.hit_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  bucket timestamptz := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );
  current_hits integer;
begin
  insert into public.rate_limits as rl (key, window_start, hits)
  values (p_key, bucket, 1)
  on conflict (key, window_start) do update set hits = rl.hits + 1
  returning hits into current_hits;

  -- Opportunistic cleanup of expired windows.
  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return current_hits <= p_limit;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.audit_logs enable row level security;
alter table public.rate_limits enable row level security;

-- Profiles hold only public author details.
create policy "Profiles are public"
on public.profiles for select
to anon, authenticated
using (true);

create policy "Users update their own profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "Admins update any profile"
on public.profiles for update
to authenticated
using ((select public.has_role('admin')))
with check ((select public.has_role('admin')));

create policy "Users see their own roles; admins see all"
on public.user_roles for select
to authenticated
using (user_id = (select auth.uid()) or (select public.has_role('admin')));

create policy "Admins grant roles"
on public.user_roles for insert
to authenticated
with check ((select public.has_role('admin')));

create policy "Admins change roles"
on public.user_roles for update
to authenticated
using ((select public.has_role('admin')))
with check ((select public.has_role('admin')));

create policy "Admins revoke roles"
on public.user_roles for delete
to authenticated
using ((select public.has_role('admin')));

create policy "Staff read the audit log"
on public.audit_logs for select
to authenticated
using ((select public.has_role('editor')));

-- rate_limits: no policies, so only the service role can touch it.

revoke execute on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;
revoke execute on function public.log_audit(text, text, text, jsonb) from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
