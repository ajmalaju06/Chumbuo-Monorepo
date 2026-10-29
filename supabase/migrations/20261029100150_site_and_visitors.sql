-- Site configuration (settings, navigation, homepage) and visitor input
-- (comments, newsletter, contact).

create type public.homepage_section_type as enum (
  'hero',
  'intro',
  'featured',
  'latest',
  'categories',
  'photo_strip',
  'quote',
  'about',
  'newsletter'
);
create type public.nav_location as enum ('header', 'footer');
create type public.comment_status as enum ('pending', 'approved', 'rejected', 'spam');
create type public.subscriber_status as enum ('pending', 'confirmed', 'unsubscribed');
create type public.message_status as enum ('new', 'read', 'archived');

-- ---------------------------------------------------------------------------
-- Settings: one jsonb document per key. Private keys (analytics) are never
-- served to visitors.
-- ---------------------------------------------------------------------------
create table public.site_settings (
  key text primary key
    check (key in ('identity', 'author', 'social', 'contact', 'seo', 'analytics', 'comments', 'newsletter', 'footer')),
  value jsonb not null default '{}' check (jsonb_typeof(value) = 'object'),
  is_public boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  location public.nav_location not null,
  label text not null check (char_length(label) between 1 and 40),
  -- Internal paths or http(s) URLs only.
  href text not null check (href ~ '^(/[^\s]*|https?://[^\s]+)$'),
  position integer not null default 0,
  visible boolean not null default true,
  open_in_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index navigation_items_order_idx on public.navigation_items (location, position);

create trigger navigation_items_set_updated_at
before update on public.navigation_items
for each row execute function public.set_updated_at();

-- The live homepage. Edits are staged in homepage_drafts and copied here on publish.
create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  type public.homepage_section_type not null,
  position integer not null default 0,
  visible boolean not null default true,
  config jsonb not null default '{}' check (jsonb_typeof(config) = 'object'),
  updated_at timestamptz not null default now()
);
create index homepage_sections_order_idx on public.homepage_sections (position);

create trigger homepage_sections_set_updated_at
before update on public.homepage_sections
for each row execute function public.set_updated_at();

-- Single staged layout (ordered sections with config) for preview-before-publish.
create table public.homepage_drafts (
  id boolean primary key default true check (id),
  sections jsonb not null check (jsonb_typeof(sections) = 'array'),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create trigger homepage_drafts_set_updated_at
before update on public.homepage_drafts
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Comments. Visitors submit through a rate-limited server action that uses
-- the service role; there is no direct public insert path.
-- ---------------------------------------------------------------------------
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 80),
  -- Hashed so the database never holds visitor emails or IPs in the clear.
  author_email_hash text,
  ip_hash text,
  body text not null check (char_length(body) between 1 and 5000),
  status public.comment_status not null default 'pending',
  report_count integer not null default 0 check (report_count >= 0),
  created_at timestamptz not null default now(),
  moderated_at timestamptz,
  moderated_by uuid references auth.users (id) on delete set null
);
create index comments_post_idx on public.comments (post_id, created_at);
create index comments_status_idx on public.comments (status, created_at desc);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  status public.subscriber_status not null default 'pending',
  -- sha256 of the confirm/unsubscribe token; the raw token only lives in the email.
  token_hash text not null,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index newsletter_subscribers_status_idx on public.newsletter_subscribers (status);

create trigger newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) <= 254),
  subject text not null default '' check (char_length(subject) <= 200),
  body text not null check (char_length(body) between 1 and 5000),
  status public.message_status not null default 'new',
  ip_hash text,
  created_at timestamptz not null default now()
);
create index contact_messages_created_idx on public.contact_messages (status, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.site_settings enable row level security;
alter table public.navigation_items enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.homepage_drafts enable row level security;
alter table public.comments enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;

create policy "Public settings are public; staff see all"
on public.site_settings for select
to anon, authenticated
using (is_public or (select public.has_role('editor')));

create policy "Admins manage settings"
on public.site_settings for all
to authenticated
using ((select public.has_role('admin')))
with check ((select public.has_role('admin')));

create policy "Visible navigation is public; staff see all"
on public.navigation_items for select
to anon, authenticated
using (visible or (select public.has_role('editor')));

create policy "Staff manage navigation"
on public.navigation_items for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Visible sections are public; staff see all"
on public.homepage_sections for select
to anon, authenticated
using (visible or (select public.has_role('editor')));

create policy "Staff publish the homepage"
on public.homepage_sections for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Staff manage the homepage draft"
on public.homepage_drafts for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Approved comments on visible posts are public; staff see all"
on public.comments for select
to anon, authenticated
using (
  (status = 'approved' and exists (select 1 from public.posts p where p.id = post_id))
  or (select public.has_role('editor'))
);

create policy "Staff moderate comments"
on public.comments for update
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Staff delete comments"
on public.comments for delete
to authenticated
using ((select public.has_role('editor')));

-- Hashes are for spam handling only: not readable through the API at all.
revoke select on public.comments from anon, authenticated;
grant select (id, post_id, parent_id, author_name, body, status, report_count, created_at, moderated_at)
  on public.comments to anon, authenticated;

create policy "Staff manage subscribers"
on public.newsletter_subscribers for all
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Staff read messages"
on public.contact_messages for select
to authenticated
using ((select public.has_role('editor')));

create policy "Staff update messages"
on public.contact_messages for update
to authenticated
using ((select public.has_role('editor')))
with check ((select public.has_role('editor')));

create policy "Staff delete messages"
on public.contact_messages for delete
to authenticated
using ((select public.has_role('editor')));

-- Column privileges only bite once the table-wide grant is gone.
revoke select on public.newsletter_subscribers from anon, authenticated;
grant select (id, email, status, confirmed_at, unsubscribed_at, created_at, updated_at)
  on public.newsletter_subscribers to authenticated;
