-- Media library, responsive variants, reference tracking and storage buckets.

create type public.media_variant_kind as enum ('thumb', 'sm', 'md', 'lg', 'og');
create type public.media_variant_format as enum ('avif', 'webp', 'jpeg');
create type public.post_media_role as enum ('cover', 'inline', 'gallery', 'og');

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  -- Path inside the private `media-originals` bucket.
  storage_path text not null unique,
  -- Set on edited copies; the original is never overwritten.
  original_id uuid references public.media_assets (id) on delete set null,
  filename text not null check (char_length(filename) between 1 and 255),
  mime text not null check (mime in ('image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif')),
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 20 * 1024 * 1024),
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  alt text not null default '' check (char_length(alt) <= 300),
  caption text not null default '' check (char_length(caption) <= 600),
  credit text not null default '' check (char_length(credit) <= 200),
  focal_x real not null default 0.5 check (focal_x between 0 and 1),
  focal_y real not null default 0.5 check (focal_y between 0 and 1),
  collection text check (char_length(collection) <= 80),
  -- Small CSS colour used as the placeholder while an image loads.
  dominant_color text check (dominant_color ~ '^#[0-9a-fA-F]{6}$'),
  -- Crop/rotate/adjustment settings that produced an edited copy.
  edit_params jsonb,
  is_demo boolean not null default false,
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index media_assets_created_idx on public.media_assets (created_at desc);
create index media_assets_collection_idx on public.media_assets (collection);
create index media_assets_original_idx on public.media_assets (original_id);
create index media_assets_search_trgm_idx
  on public.media_assets using gin ((filename || ' ' || alt || ' ' || caption) extensions.gin_trgm_ops);

create trigger media_assets_set_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

create table public.media_variants (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.media_assets (id) on delete cascade,
  kind public.media_variant_kind not null,
  format public.media_variant_format not null,
  -- Path inside the public `media-public` bucket.
  path text not null unique,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  size_bytes integer not null check (size_bytes > 0),
  unique (asset_id, kind, format)
);

-- Which posts use which assets (maintained by the app on save). Drives the
-- delete guard and the "used in" list in the media library.
create table public.post_media (
  post_id uuid not null references public.posts (id) on delete cascade,
  asset_id uuid not null references public.media_assets (id) on delete restrict,
  role public.post_media_role not null,
  primary key (post_id, asset_id, role)
);
create index post_media_asset_idx on public.post_media (asset_id);

alter table public.profiles
  add constraint profiles_avatar_media_fk
  foreign key (avatar_media_id) references public.media_assets (id) on delete set null;
alter table public.categories
  add constraint categories_cover_media_fk
  foreign key (cover_media_id) references public.media_assets (id) on delete set null;
alter table public.posts
  add constraint posts_cover_media_fk
  foreign key (cover_media_id) references public.media_assets (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Delete guard: assets used by visible stories can't be removed until the
-- story stops using them.
-- ---------------------------------------------------------------------------
create function public.media_published_references(p_asset_id uuid)
returns table (post_id uuid, title text, slug text)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct p.id, p.title, p.slug
    from public.posts p
   where public.is_post_visible(p.status, p.publish_at)
     and (
       p.cover_media_id = p_asset_id
       or exists (select 1 from public.post_media pm where pm.post_id = p.id and pm.asset_id = p_asset_id)
     );
$$;

create function public.guard_media_delete()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (select 1 from public.media_published_references(old.id)) then
    raise exception 'Asset % is used by published stories', old.id
      using errcode = 'P0002', hint = 'Replace it in those stories before deleting.';
  end if;
  -- Draft references are released so the delete can go through.
  delete from public.post_media where asset_id = old.id;
  return old;
end;
$$;

create trigger media_assets_guard_delete
before delete on public.media_assets
for each row execute function public.guard_media_delete();

-- ---------------------------------------------------------------------------
-- Public visibility: an asset is readable by visitors only once something
-- public uses it, so photos attached to drafts stay private.
-- ---------------------------------------------------------------------------
create function public.is_media_public(p_asset_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    exists (select 1 from public.media_published_references(p_asset_id))
    or exists (select 1 from public.categories c where c.cover_media_id = p_asset_id and c.archived_at is null)
    or exists (select 1 from public.profiles pr where pr.avatar_media_id = p_asset_id)
    or exists (
      select 1 from public.site_settings s
       where s.is_public and s.value::text like '%' || p_asset_id::text || '%'
    )
    or exists (
      select 1 from public.homepage_sections h
       where h.visible and h.config::text like '%' || p_asset_id::text || '%'
    );
$$;

alter table public.media_assets enable row level security;
alter table public.media_variants enable row level security;
alter table public.post_media enable row level security;

create policy "Assets in public use are readable; staff see all"
on public.media_assets for select
to anon, authenticated
using ((select public.has_role('editor')) or public.is_media_public(id));

create policy "Staff manage assets"
on public.media_assets for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Variants follow their asset"
on public.media_variants for select
to anon, authenticated
using (exists (select 1 from public.media_assets a where a.id = asset_id));

create policy "Staff manage variants"
on public.media_variants for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Staff manage post media"
on public.post_media for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

revoke execute on function public.media_published_references(uuid) from public, anon;

-- ---------------------------------------------------------------------------
-- Storage. Originals are private; generated variants are publicly served.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media-originals', 'media-originals', false, 20971520,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']),
  ('media-public', 'media-public', true, 20971520,
   array['image/jpeg', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "Staff read originals"
on storage.objects for select
to authenticated
using (bucket_id = 'media-originals' and (select public.has_role('editor')));

create policy "Staff upload originals"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media-originals' and (select public.has_role('editor')));

create policy "Staff replace originals"
on storage.objects for update
to authenticated
using (bucket_id = 'media-originals' and (select public.has_role('editor')))
with check (bucket_id = 'media-originals' and (select public.has_role('editor')));

create policy "Staff delete originals"
on storage.objects for delete
to authenticated
using (bucket_id = 'media-originals' and (select public.has_role('editor')));

-- Public bucket files are served by URL without RLS; listing and writes stay staff-only.
create policy "Staff list variants"
on storage.objects for select
to authenticated
using (bucket_id = 'media-public' and (select public.has_role('editor')));

create policy "Staff write variants"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media-public' and (select public.has_role('editor')));

create policy "Staff replace variants"
on storage.objects for update
to authenticated
using (bucket_id = 'media-public' and (select public.has_role('editor')))
with check (bucket_id = 'media-public' and (select public.has_role('editor')));

create policy "Staff delete variants"
on storage.objects for delete
to authenticated
using (bucket_id = 'media-public' and (select public.has_role('editor')));
