import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { anon, deleteUsers, service, slug, userWithRole, type Client } from "./helpers";

const DOC = { type: "doc", content: [] };
const past = new Date(Date.now() - 60_000).toISOString();
const future = new Date(Date.now() + 86_400_000).toISOString();

let admin: Awaited<ReturnType<typeof userWithRole>>;
let editor: Awaited<ReturnType<typeof userWithRole>>;
let nobody: Awaited<ReturnType<typeof userWithRole>>;
const posts: Record<"published" | "draft" | "future" | "due", { id: string; slug: string }> =
  {} as never;
const db = service();

async function createPost(
  fields: Partial<{ status: string; publish_at: string | null; title: string; body_text: string }>,
) {
  const row = {
    slug: slug("rls"),
    title: fields.title ?? "RLS test",
    content: DOC,
    is_demo: true,
    ...fields,
  };
  const { data, error } = await db
    .from("posts")
    .insert(row as never)
    .select("id, slug")
    .single();
  if (error) throw error;
  return data;
}

beforeAll(async () => {
  [admin, editor, nobody] = await Promise.all([
    userWithRole("admin"),
    userWithRole("editor"),
    userWithRole(null),
  ]);
  posts.published = await createPost({ status: "published", publish_at: past });
  posts.draft = await createPost({ status: "draft" });
  posts.future = await createPost({ status: "scheduled", publish_at: future });
  posts.due = await createPost({ status: "scheduled", publish_at: past });
});

afterAll(async () => {
  await db
    .from("posts")
    .delete()
    .in(
      "id",
      Object.values(posts).map((p) => p.id),
    );
  await db.from("posts").delete().like("slug", "rls-%");
  await db.from("media_assets").delete().like("storage_path", "tests/%");
  await deleteUsers([admin, editor, nobody].filter(Boolean).map((u) => u.id));
});

async function visibleIds(client: Client) {
  const { data } = await client
    .from("posts")
    .select("id")
    .in(
      "id",
      Object.values(posts).map((p) => p.id),
    );
  return new Set((data ?? []).map((row) => row.id));
}

describe("posts visibility", () => {
  it("visitors see published and due stories only", async () => {
    const ids = await visibleIds(anon());
    expect(ids.has(posts.published.id)).toBe(true);
    expect(ids.has(posts.due.id)).toBe(true);
    expect(ids.has(posts.draft.id)).toBe(false);
    expect(ids.has(posts.future.id)).toBe(false);
  });

  it("a signed-in account without a role is treated like a visitor", async () => {
    const ids = await visibleIds(nobody.client);
    expect(ids.has(posts.draft.id)).toBe(false);
  });

  it("editors see drafts and scheduled stories", async () => {
    const ids = await visibleIds(editor.client);
    expect(ids.size).toBe(4);
  });
});

describe("writes", () => {
  it("visitors and role-less accounts can't create stories", async () => {
    for (const client of [anon(), nobody.client]) {
      const { error } = await client.from("posts").insert({ slug: slug("rls"), title: "x" });
      expect(error).not.toBeNull();
    }
  });

  it("editors can create and edit stories", async () => {
    const { data, error } = await editor.client
      .from("posts")
      .insert({ slug: slug("rls"), title: "Editor story", author_id: editor.id })
      .select("id")
      .single();
    expect(error).toBeNull();
    const { error: updateError } = await editor.client
      .from("posts")
      .update({ subtitle: "Edited" })
      .eq("id", data!.id);
    expect(updateError).toBeNull();
  });

  it("visitors can't write comments, messages or subscriptions directly", async () => {
    const client = anon();
    const results = await Promise.all([
      client.from("comments").insert({ post_id: posts.published.id, author_name: "x", body: "hi" }),
      client.from("contact_messages").insert({ name: "x", email: "x@example.com", body: "hi" }),
      client.from("newsletter_subscribers").insert({ email: "x@example.com", token_hash: "x" }),
    ]);
    for (const { error } of results) expect(error).not.toBeNull();
  });

  it("only the service role can use the rate limiter", async () => {
    const { error } = await anon().rpc("hit_rate_limit", {
      p_key: "x",
      p_limit: 1,
      p_window_seconds: 60,
    });
    expect(error).not.toBeNull();
    const { data } = await db.rpc("hit_rate_limit", {
      p_key: `test:${slug("k")}`,
      p_limit: 1,
      p_window_seconds: 60,
    });
    expect(data).toBe(true);
  });
});

describe("roles", () => {
  it("nobody can promote themselves", async () => {
    for (const user of [nobody, editor]) {
      const { error } = await user.client
        .from("user_roles")
        .insert({ user_id: user.id, role: "admin" });
      expect(error).not.toBeNull();
    }
    const { data } = await db.from("user_roles").select("role").eq("user_id", editor.id);
    expect(data?.map((r) => r.role)).toEqual(["editor"]);
  });

  it("admins can grant roles", async () => {
    const { error } = await admin.client
      .from("user_roles")
      .insert({ user_id: nobody.id, role: "editor" });
    expect(error).toBeNull();
    await db.from("user_roles").delete().eq("user_id", nobody.id);
  });

  it("the last admin can't be removed", async () => {
    // Other admins may exist locally; only assert when this is the sole one.
    const { count } = await db
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    const { error } = await admin.client
      .from("user_roles")
      .delete()
      .eq("user_id", admin.id)
      .eq("role", "admin");
    if (count === 1) {
      expect(error?.message).toMatch(/last admin/);
    } else {
      expect(error).toBeNull();
      await db.from("user_roles").insert({ user_id: admin.id, role: "admin" });
    }
  });

  it("only admins change site settings", async () => {
    const { data: editorUpdate } = await editor.client
      .from("site_settings")
      .update({ value: { siteTitle: "Hacked" } })
      .eq("key", "identity")
      .select();
    expect(editorUpdate).toEqual([]);
  });
});

describe("site configuration", () => {
  it("visitors read public settings but not private ones", async () => {
    const { data } = await anon().from("site_settings").select("key");
    const keys = (data ?? []).map((r) => r.key);
    expect(keys).toContain("identity");
    expect(keys).not.toContain("analytics");
  });

  it("the homepage draft is staff-only", async () => {
    const { data: visitor } = await anon().from("homepage_drafts").select("sections");
    expect(visitor).toEqual([]);
    const { data: staff } = await editor.client.from("homepage_drafts").select("sections");
    expect(staff).toHaveLength(1);
  });

  it("seeded categories are readable", async () => {
    const { data } = await anon().from("categories").select("slug").eq("slug", "travel");
    expect(data).toHaveLength(1);
  });
});

describe("comments", () => {
  it("visitors see approved comments but never the hashed identifiers", async () => {
    const { error: insertError } = await db.from("comments").insert([
      {
        post_id: posts.published.id,
        author_name: "A",
        body: "approved",
        status: "approved",
        ip_hash: "secret",
      },
      {
        post_id: posts.published.id,
        author_name: "B",
        body: "pending",
        status: "pending",
        ip_hash: null,
      },
    ]);
    expect(insertError).toBeNull();
    const { data } = await anon().from("comments").select("body").eq("post_id", posts.published.id);
    expect(data?.map((c) => c.body)).toEqual(["approved"]);

    const { error } = await anon()
      .from("comments")
      .select("ip_hash")
      .eq("post_id", posts.published.id);
    expect(error).not.toBeNull();
  });
});

describe("slugs and search", () => {
  it("renaming a slug leaves a redirect behind", async () => {
    const oldSlug = posts.published.slug;
    const newSlug = slug("rls");
    await db.from("posts").update({ slug: newSlug }).eq("id", posts.published.id);
    const { data } = await anon()
      .from("redirects")
      .select("post_id")
      .eq("from_slug", oldSlug)
      .single();
    expect(data?.post_id).toBe(posts.published.id);
    posts.published.slug = newSlug;
  });

  it("finds stories by category name and body text", async () => {
    const { data: travel } = await db.from("categories").select("id").eq("slug", "travel").single();
    const post = await createPost({
      status: "published",
      publish_at: past,
      title: "Morning light",
      body_text: "We walked through the souk at dawn.",
    });
    await db.from("post_categories").insert({ post_id: post.id, category_id: travel!.id });

    const search = (q: string) =>
      anon()
        .from("posts")
        .select("id")
        .textSearch("search", q, { type: "websearch", config: "english" })
        .eq("id", post.id);

    expect((await search("travel")).data).toHaveLength(1);
    expect((await search("souk")).data).toHaveLength(1);
    expect((await search("zeppelin")).data).toHaveLength(0);
  });
});

describe("media", () => {
  async function asset() {
    const { data, error } = await db
      .from("media_assets")
      .insert({
        storage_path: `tests/${slug("img")}.jpg`,
        filename: "x.jpg",
        mime: "image/jpeg",
        size_bytes: 10,
        width: 10,
        height: 10,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  }

  it("draft photos stay private until a published story uses them", async () => {
    const id = await asset();
    expect((await anon().from("media_assets").select("id").eq("id", id)).data).toEqual([]);
    await db.from("posts").update({ cover_media_id: id }).eq("id", posts.published.id);
    expect((await anon().from("media_assets").select("id").eq("id", id)).data).toHaveLength(1);
  });

  it("assets used by published stories can't be deleted", async () => {
    const used = await asset();
    await db
      .from("post_media")
      .insert({ post_id: posts.published.id, asset_id: used, role: "gallery" });
    const { error } = await editor.client.from("media_assets").delete().eq("id", used);
    expect(error?.message).toMatch(/used by published stories/);

    const draftOnly = await asset();
    await db
      .from("post_media")
      .insert({ post_id: posts.draft.id, asset_id: draftOnly, role: "inline" });
    const { error: draftError } = await editor.client
      .from("media_assets")
      .delete()
      .eq("id", draftOnly);
    expect(draftError).toBeNull();

    await db.from("post_media").delete().eq("asset_id", used);
  });

  it("only staff can upload or read originals", async () => {
    const path = `tests/${slug("file")}.png`;
    const png = new Blob([Uint8Array.from([137, 80, 78, 71])], { type: "image/png" });

    const { error: anonUpload } = await anon().storage.from("media-originals").upload(path, png);
    expect(anonUpload).not.toBeNull();

    const { error: editorUpload } = await editor.client.storage
      .from("media-originals")
      .upload(path, png);
    expect(editorUpload).toBeNull();

    const { error: anonRead } = await anon().storage.from("media-originals").download(path);
    expect(anonRead).not.toBeNull();

    await db.storage.from("media-originals").remove([path]);
  });
});

describe("revisions", () => {
  it("keeps the newest 50 per story", async () => {
    const rows = Array.from({ length: 53 }, (_, i) => ({
      post_id: posts.draft.id,
      title: `r${i}`,
      content: DOC,
    }));
    await db.from("post_revisions").insert(rows);
    const { count } = await db
      .from("post_revisions")
      .select("*", { count: "exact", head: true })
      .eq("post_id", posts.draft.id);
    expect(count).toBe(50);
  });
});
