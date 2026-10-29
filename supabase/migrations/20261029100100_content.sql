-- Stories, taxonomy, revisions, slug redirects and full-text search.

-- ---------------------------------------------------------------------------
-- Taxonomy
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (public.is_valid_slug(slug)),
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '' check (char_length(description) <= 600),
  cover_media_id uuid,
  position integer not null default 0,
  archived_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_position_idx on public.categories (position) where archived_at is null;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (public.is_valid_slug(slug)),
  name text not null check (char_length(name) between 1 and 60),
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Posts
-- ---------------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (public.is_valid_slug(slug)),
  title text not null check (char_length(title) between 1 and 200),
  subtitle text not null default '' check (char_length(subtitle) <= 300),
  excerpt text not null default '' check (char_length(excerpt) <= 600),
  -- Tiptap document. Rendered through an allowlist, never as raw HTML.
  content jsonb not null default '{"type":"doc","content":[]}'
    check (jsonb_typeof(content) = 'object' and content ->> 'type' = 'doc'),
  -- Plain text extracted from `content` by the app; feeds search.
  body_text text not null default '',
  template public.post_template not null default 'minimal',
  mood public.story_mood,
  location text not null default '' check (char_length(location) <= 160),
  cover_media_id uuid,
  status public.post_status not null default 'draft',
  publish_at timestamptz,
  featured boolean not null default false,
  comments_enabled boolean not null default true,
  show_toc boolean not null default false,
  seo jsonb not null default '{}' check (jsonb_typeof(seo) = 'object'),
  reading_minutes integer not null default 1 check (reading_minutes >= 1),
  author_id uuid references auth.users (id) on delete set null,
  is_demo boolean not null default false,
  search tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  constraint posts_publish_at_required
    check (status not in ('scheduled', 'published') or publish_at is not null)
);

create index posts_visibility_idx on public.posts (status, publish_at desc);
create index posts_featured_idx on public.posts (publish_at desc) where featured;
create index posts_search_idx on public.posts using gin (search);
create index posts_title_trgm_idx on public.posts using gin (title extensions.gin_trgm_ops);
create index posts_author_idx on public.posts (author_id);
create index posts_cover_idx on public.posts (cover_media_id);

-- A story is public once it is published or scheduled and its time has come.
-- The cron job later flips due `scheduled` rows to `published` for tidiness,
-- but visibility never waits on it.
create function public.is_post_visible(p_status public.post_status, p_publish_at timestamptz)
returns boolean
language sql
stable
set search_path = ''
as $$
  select p_status in ('published', 'scheduled') and p_publish_at <= now();
$$;

create table public.post_categories (
  post_id uuid not null references public.posts (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (post_id, category_id)
);
create index post_categories_category_idx on public.post_categories (category_id);

create table public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);
create index post_tags_tag_idx on public.post_tags (tag_id);

-- ---------------------------------------------------------------------------
-- Search: title (A), subtitle/excerpt/taxonomy/location (B), body (C).
-- Maintained by triggers because taxonomy lives in other tables.
-- ---------------------------------------------------------------------------
create function public.build_post_search(
  p_id uuid,
  p_title text,
  p_subtitle text,
  p_excerpt text,
  p_location text,
  p_body text
)
returns tsvector
language sql
stable
set search_path = ''
as $$
  select
    setweight(to_tsvector('english', coalesce(p_title, '')), 'A')
    || setweight(to_tsvector('english', concat_ws(' ', p_subtitle, p_excerpt)), 'B')
    || setweight(
      to_tsvector(
        'english',
        concat_ws(
          ' ',
          p_location,
          (select string_agg(c.name, ' ')
             from public.post_categories pc
             join public.categories c on c.id = pc.category_id
            where pc.post_id = p_id),
          (select string_agg(t.name, ' ')
             from public.post_tags pt
             join public.tags t on t.id = pt.tag_id
            where pt.post_id = p_id)
        )
      ),
      'B'
    )
    || setweight(to_tsvector('english', coalesce(p_body, '')), 'C');
$$;

create function public.posts_compute_search()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.search := public.build_post_search(
    new.id, new.title, new.subtitle, new.excerpt, new.location, new.body_text
  );
  return new;
end;
$$;

create trigger posts_compute_search
before insert or update of title, subtitle, excerpt, location, body_text on public.posts
for each row execute function public.posts_compute_search();

create function public.refresh_post_search(p_post_ids uuid[])
returns void
language sql
set search_path = ''
as $$
  update public.posts p
     set search = public.build_post_search(p.id, p.title, p.subtitle, p.excerpt, p.location, p.body_text)
   where p.id = any (p_post_ids);
$$;

create function public.taxonomy_link_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.refresh_post_search(array[coalesce(new.post_id, old.post_id)]);
  return null;
end;
$$;

create trigger post_categories_refresh_search
after insert or delete on public.post_categories
for each row execute function public.taxonomy_link_changed();

create trigger post_tags_refresh_search
after insert or delete on public.post_tags
for each row execute function public.taxonomy_link_changed();

create function public.taxonomy_renamed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'categories' then
    perform public.refresh_post_search(
      array(select post_id from public.post_categories where category_id = new.id)
    );
  else
    perform public.refresh_post_search(
      array(select post_id from public.post_tags where tag_id = new.id)
    );
  end if;
  return null;
end;
$$;

create trigger categories_refresh_search
after update of name on public.categories
for each row execute function public.taxonomy_renamed();

create trigger tags_refresh_search
after update of name on public.tags
for each row execute function public.taxonomy_renamed();

-- Only real edits move "last modified" — not search refreshes.
create trigger posts_set_updated_at
before update of slug, title, subtitle, excerpt, content, template, mood, location,
  cover_media_id, status, publish_at, featured, comments_enabled, show_toc, seo
on public.posts
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Slug redirects: renaming a slug keeps the old URL working (308).
-- ---------------------------------------------------------------------------
create table public.redirects (
  from_slug text primary key check (public.is_valid_slug(from_slug)),
  post_id uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index redirects_post_idx on public.redirects (post_id);

create function public.posts_track_slug()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- A slug that is live again no longer redirects anywhere.
  delete from public.redirects where from_slug = new.slug;

  if tg_op = 'UPDATE' and old.slug <> new.slug then
    insert into public.redirects (from_slug, post_id)
    values (old.slug, new.id)
    on conflict (from_slug) do update set post_id = excluded.post_id, created_at = now();
  end if;
  return new;
end;
$$;

create trigger posts_track_slug
after insert or update of slug on public.posts
for each row execute function public.posts_track_slug();

-- ---------------------------------------------------------------------------
-- Revisions (autosave snapshots, newest 50 kept per post)
-- ---------------------------------------------------------------------------
create table public.post_revisions (
  id bigint generated always as identity primary key,
  post_id uuid not null references public.posts (id) on delete cascade,
  title text not null,
  content jsonb not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index post_revisions_post_idx on public.post_revisions (post_id, created_at desc);

create function public.cap_post_revisions()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.post_revisions
   where post_id = new.post_id
     and id not in (
       select id from public.post_revisions
        where post_id = new.post_id
        order by created_at desc, id desc
        limit 50
     );
  return null;
end;
$$;

create trigger post_revisions_cap
after insert on public.post_revisions
for each row execute function public.cap_post_revisions();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_categories enable row level security;
alter table public.post_tags enable row level security;
alter table public.redirects enable row level security;
alter table public.post_revisions enable row level security;

create policy "Active categories are public"
on public.categories for select
to anon, authenticated
using (archived_at is null or (select public.has_role('editor')));

create policy "Staff manage categories"
on public.categories for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Tags are public"
on public.tags for select
to anon, authenticated
using (true);

create policy "Staff manage tags"
on public.tags for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Visible posts are public; staff see all"
on public.posts for select
to anon, authenticated
using (public.is_post_visible(status, publish_at) or (select public.has_role('editor')));

create policy "Staff create posts"
on public.posts for insert
to authenticated
with check ((select public.has_role('editor')));

create policy "Staff edit posts"
on public.posts for update
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Staff delete posts"
on public.posts for delete
to authenticated
using ((select public.has_role('editor')));

-- Join rows inherit visibility from the post (the subquery runs under posts RLS).
create policy "Category links follow post visibility"
on public.post_categories for select
to anon, authenticated
using (exists (select 1 from public.posts p where p.id = post_id));

create policy "Staff manage category links"
on public.post_categories for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Tag links follow post visibility"
on public.post_tags for select
to anon, authenticated
using (exists (select 1 from public.posts p where p.id = post_id));

create policy "Staff manage tag links"
on public.post_tags for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Redirects follow post visibility"
on public.redirects for select
to anon, authenticated
using (exists (select 1 from public.posts p where p.id = post_id));

create policy "Staff manage revisions"
on public.post_revisions for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

revoke execute on function public.refresh_post_search(uuid[]) from public, anon, authenticated;
