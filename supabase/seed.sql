-- Base content every install starts with. Real (not demo) rows: the author
-- edits or removes them from the dashboard. Demo stories and photos come from
-- `pnpm seed:demo` and are flagged is_demo.

insert into public.categories (slug, name, description, position) values
  ('travel', 'Travel', 'Places I''ve wandered through and the people I met on the way.', 0),
  ('day-in-my-life', 'Day in My Life', 'Ordinary days, written down before they blur together.', 1),
  ('photography', 'Photography', 'Light, frames and the stories behind them.', 2),
  ('food', 'Food', 'Kitchens, markets and meals worth remembering.', 3),
  ('experiences', 'Experiences', 'Firsts, lasts and everything in between.', 4),
  ('personal-thoughts', 'Personal Thoughts', 'Quiet notes on what I''m learning.', 5),
  ('memories', 'Memories', 'Small moments I want to keep.', 6),
  ('lifestyle', 'Lifestyle', 'Rituals, rooms and the rhythm of a slow life.', 7);

insert into public.site_settings (key, value, is_public) values
  ('identity', jsonb_build_object(
    'siteTitle', 'Chumbuo',
    'tagline', 'Little moments. Lasting stories.',
    'description', 'A personal collection of places I''ve been, moments I''ve lived, and thoughts worth keeping.',
    'logoMediaId', null,
    'faviconMediaId', null
  ), true),
  ('author', jsonb_build_object(
    'name', 'Your Name',
    'shortBio', 'Writer, wanderer and collector of small moments.',
    'bio', '',
    'portraitMediaId', null,
    'interests', jsonb_build_array(),
    'timeline', jsonb_build_array(),
    'favoriteExperiences', jsonb_build_array()
  ), true),
  ('social', jsonb_build_object('links', jsonb_build_array()), true),
  ('contact', jsonb_build_object('email', '', 'intro', 'Have a story, a question or a place I should see? Write to me.'), true),
  ('seo', jsonb_build_object(
    'defaultTitle', 'Chumbuo — Little moments. Lasting stories.',
    'titleTemplate', '%s — Chumbuo',
    'defaultDescription', 'A personal collection of places I''ve been, moments I''ve lived, and thoughts worth keeping.',
    'ogImageMediaId', null,
    'twitterHandle', ''
  ), true),
  ('analytics', jsonb_build_object('enabled', false, 'vercelAnalytics', false), false),
  ('comments', jsonb_build_object('enabled', true, 'requireApproval', true, 'allowReplies', true), true),
  ('newsletter', jsonb_build_object(
    'enabled', false,
    'heading', 'Letters from Chumbuo',
    'description', 'New stories, delivered quietly. No noise, unsubscribe any time.',
    'fromName', 'Chumbuo',
    'confirmSubject', 'Confirm your subscription',
    'newStorySubject', 'A new story: {{title}}'
  ), true),
  ('footer', jsonb_build_object(
    'note', 'Little moments. Lasting stories.',
    'copyright', 'All words and photographs are my own unless noted.'
  ), true);

insert into public.navigation_items (location, label, href, position) values
  ('header', 'Stories', '/stories', 0),
  ('header', 'Categories', '/stories#categories', 1),
  ('header', 'About', '/about', 2),
  ('header', 'Contact', '/contact', 3),
  ('footer', 'Stories', '/stories', 0),
  ('footer', 'About', '/about', 1),
  ('footer', 'Contact', '/contact', 2),
  ('footer', 'RSS', '/rss.xml', 3);

insert into public.homepage_sections (type, position, visible, config) values
  ('hero', 0, true, jsonb_build_object(
    'heading', 'Stories in Bloom.',
    'tagline', 'Little moments. Lasting stories.',
    'intro', 'A personal collection of places I''ve been, moments I''ve lived, and thoughts worth keeping.',
    'imageMediaId', null,
    'foregroundMediaId', null,
    'ctaLabel', 'Read the stories',
    'ctaHref', '/stories',
    'layout', 'portrait-right'
  )),
  ('intro', 1, true, jsonb_build_object(
    'heading', 'A space to be real.',
    'body', 'This is where I keep the moments that stayed with me — the journeys, the ordinary days and the thoughts in between.',
    'ctaLabel', 'More about me',
    'ctaHref', '/about'
  )),
  ('featured', 2, true, jsonb_build_object('heading', 'Featured story', 'postIds', jsonb_build_array(), 'layout', 'band')),
  ('latest', 3, true, jsonb_build_object('heading', 'Latest stories', 'count', 4)),
  ('categories', 4, true, jsonb_build_object('heading', 'Explore by mood', 'categoryIds', jsonb_build_array())),
  ('photo_strip', 5, true, jsonb_build_object('heading', 'Through my lens', 'mediaIds', jsonb_build_array())),
  ('quote', 6, true, jsonb_build_object(
    'text', 'Collect moments, not things.',
    'attribution', ''
  )),
  ('about', 7, true, jsonb_build_object('heading', 'Hello, I''m glad you''re here.', 'ctaLabel', 'Read my story', 'ctaHref', '/about')),
  ('newsletter', 8, true, jsonb_build_object());

-- The draft starts as a copy of the live layout.
insert into public.homepage_drafts (sections)
select jsonb_agg(
  jsonb_build_object('type', type, 'position', position, 'visible', visible, 'config', config)
  order by position
)
from public.homepage_sections;
