# Chumbuo

A personal journal: a cinematic public site, a CMS and a media library, built with Next.js 16 and Supabase.

## Local setup

Requires Node 24+, pnpm 10 and Docker Desktop (running).

```sh
pnpm install
pnpm db:start                 # local Supabase: Postgres, Auth, Storage, Mailpit
cp .env.example .env.local    # then paste the keys printed by `pnpm supabase status`
pnpm admin:create you@example.com --name "Your Name"
pnpm dev
```

`admin:create` sends an invitation. Locally it lands in Mailpit at http://127.0.0.1:54324; the link verifies the address and lets you choose a password. Sign in at http://localhost:3000/login.

There is no public sign-up. The CLI (which uses the service key) is the only way to grant the first admin; after that, admins grant roles from the dashboard.

## Scripts

| Script                                                          | What it does                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------- |
| `pnpm dev`                                                      | Next dev server                                               |
| `pnpm check`                                                    | Lint, typecheck, unit tests and production build              |
| `pnpm test`                                                     | Unit and component tests (no database needed)                 |
| `pnpm test:db`                                                  | RLS and schema tests against the local database               |
| `pnpm test:e2e`                                                 | Playwright (desktop and mobile); needs the local database     |
| `pnpm db:reset`                                                 | Re-run all migrations and `supabase/seed.sql`                 |
| `pnpm db:types`                                                 | Regenerate `lib/supabase/database.types.ts` after a migration |
| `pnpm admin:create <email> [--role admin\|editor] [--name "…"]` | Invite a user and grant a role                                |

## How auth works

- Email and password through Supabase Auth, with the session kept in cookies via `@supabase/ssr` (verified server-side on every admin request).
- `proxy.ts` refreshes the session on `/admin`, `/login` and the auth routes only; public pages never touch it.
- Every admin page and server action calls `requireRole()` (`lib/auth/session.ts`), which verifies the user with the auth server. It also enforces the second factor when one is enrolled.
- Row Level Security is the final line: visitors read only published content. Editors manage content; only admins change roles and site settings.
- Visitor writes (comments, contact, newsletter) have no public insert policy. They go through rate-limited server actions instead.
- The optional TOTP two-step verification is set up from **Account** in the dashboard.

## Production notes (Supabase project)

- Push the schema: `pnpm supabase link --project-ref <ref>` then `pnpm supabase db push`.
- In **Auth → URL configuration**, set the Site URL to the production origin and add `https://<domain>/**` to the redirect URLs.
- Copy the templates in `supabase/templates` into **Auth → Email templates**. Every link goes to `/auth/confirm?token_hash=…`.
- In **Auth → Providers → Email**, turn off sign-ups and keep "Confirm email" on. Configure custom SMTP so invitations and resets are delivered.
- Turn on TOTP under **Auth → Multi-factor**.
- Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` and `HASH_SALT` in Vercel. The secret key must never get a `NEXT_PUBLIC_` prefix.
