import type { Metadata } from "next";
import { Suspense } from "react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Overview" };

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<div aria-busy="true" className="h-96" />}>
      <Overview />
    </Suspense>
  );
}

const ACTION_LABELS: Record<string, string> = {
  "auth.sign_in": "Signed in",
  "auth.password_changed": "Changed password",
  "auth.mfa_enrolled": "Turned on two-step verification",
  "auth.mfa_removed": "Turned off two-step verification",
  "profile.updated": "Updated profile",
  "role.granted": "Granted a role",
};

async function Overview() {
  const user = await requireRole("editor");
  const supabase = await createClient();

  const count = (query: PromiseLike<{ count: number | null }>) => query.then((r) => r.count ?? 0);
  const posts = () => supabase.from("posts").select("id", { count: "exact", head: true });

  const [published, scheduled, drafts, categories, media, activity] = await Promise.all([
    count(posts().eq("status", "published")),
    count(posts().eq("status", "scheduled")),
    count(posts().eq("status", "draft")),
    count(
      supabase
        .from("categories")
        .select("id", { count: "exact", head: true })
        .is("archived_at", null),
    ),
    count(supabase.from("media_assets").select("id", { count: "exact", head: true })),
    supabase
      .from("audit_logs")
      .select("id, action, created_at, actor_id")
      .order("created_at", { ascending: false })
      .limit(8)
      .then((r) => r.data ?? []),
  ]);

  const stats = [
    { label: "Published stories", value: published },
    { label: "Scheduled", value: scheduled },
    { label: "Drafts", value: drafts },
    { label: "Categories", value: categories },
    { label: "Media", value: media },
  ];

  return (
    <div className="grid gap-14">
      <header>
        <h1 className="text-h2">Hello, {user.displayName}.</h1>
        <p className="mt-3 text-ink-muted">Here&apos;s where Chumbuo stands today.</p>
      </header>

      <dl className="rule grid grid-cols-2 border-t sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rule border-b py-6 pr-6">
            <dt className="text-meta text-ink-muted">{stat.label}</dt>
            <dd className="mt-2 font-display text-h2 tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="activity-heading" className="max-w-2xl">
        <h2 id="activity-heading" className="text-h3">
          Recent activity
        </h2>
        {activity.length === 0 ? (
          <p className="mt-4 text-ink-muted">Nothing yet. Actions you take here will be listed.</p>
        ) : (
          <ol className="rule mt-6 divide-y divide-(--color-rule) border-y">
            {activity.map((entry) => (
              <li key={entry.id} className="flex flex-wrap justify-between gap-x-6 py-3">
                <span>
                  {ACTION_LABELS[entry.action] ?? entry.action}
                  {entry.actor_id === user.id && <span className="text-ink-muted"> · you</span>}
                </span>
                <time dateTime={entry.created_at} className="text-sm text-ink-muted tabular-nums">
                  {new Date(entry.created_at).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
