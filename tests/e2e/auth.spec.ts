import { createHmac, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

const PASSWORD = "Test-Passw0rd-123";
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
const created: string[] = [];

async function createUser(role: "editor" | null, displayName = "Test Author") {
  const email = `e2e-${randomUUID().slice(0, 8)}@chumbuo.test`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });
  if (error) throw error;
  created.push(data.user.id);
  if (role) await admin.from("user_roles").insert({ user_id: data.user.id, role });
  return email;
}

// Next keeps recently visited routes mounted but hidden, so match visible fields only.
const field = (page: Page, label: string) =>
  page.getByLabel(label, { exact: true }).filter({ visible: true });

async function signIn(page: Page, email: string, password = PASSWORD) {
  await field(page, "Email").fill(email);
  await field(page, "Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

/** RFC 6238 code for a base32 secret, as an authenticator app would show. */
function totp(secret: string, at = Date.now()) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const char of secret.replace(/=+$/, ""))
    bits += alphabet.indexOf(char).toString(2).padStart(5, "0");
  const key = Buffer.from(bits.match(/.{8}/g)!.map((byte) => parseInt(byte, 2)));
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(at / 30_000)));
  const hmac = createHmac("sha1", key).update(counter).digest();
  const offset = hmac[hmac.length - 1]! & 0xf;
  return String((hmac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, "0");
}

/** Polls Mailpit (local Supabase's mail catcher) for the newest email to `to`. */
async function latestEmailLink(to: string): Promise<string> {
  const mailpit = "http://127.0.0.1:54324/api/v1";
  for (let attempt = 0; attempt < 20; attempt++) {
    const search = await fetch(`${mailpit}/search?query=${encodeURIComponent(`to:"${to}"`)}`).then(
      (r) => r.json(),
    );
    const id = search.messages?.[0]?.ID;
    if (id) {
      const message = await fetch(`${mailpit}/message/${id}`).then((r) => r.json());
      const href = /href="([^"]*\/auth\/confirm[^"]*)"/.exec(message.HTML)?.[1];
      if (href) return href.replaceAll("&amp;", "&");
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`No email for ${to}`);
}

test.beforeEach(async () => {
  // Our own sign-in limiter would otherwise trip across repeated local runs.
  await admin.from("rate_limits").delete().neq("key", "");
});

test.afterAll(async () => {
  for (const id of created) await admin.auth.admin.deleteUser(id);
});

test("the dashboard sends signed-out visitors to sign in", async ({ page }) => {
  await page.goto("/admin/account");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Faccount/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("a wrong password shows a clear error", async ({ page }) => {
  const email = await createUser("editor");
  await page.goto("/login");
  await signIn(page, email, "Wrong-Passw0rd");
  await expect(page.getByRole("main").getByRole("alert")).toHaveText(
    "That email and password don't match.",
  );
  await expect(page.getByLabel("Email")).toHaveValue(email);
});

test("an editor signs in, sees the overview and signs out", async ({ page }) => {
  const email = await createUser("editor", "Meera");
  await page.goto("/login?next=/admin/account");
  await signIn(page, email);
  await expect(page).toHaveURL(/\/admin\/account$/);
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();

  await page.getByRole("link", { name: "Overview" }).click();
  await expect(page.getByRole("heading", { name: "Hello, Meera." })).toBeVisible();
  await expect(page.getByText("Published stories")).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login\?error=signed-out$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?next=/);
});

test("an account without a role is turned away", async ({ page }) => {
  const email = await createUser(null);
  await page.goto("/login");
  await signIn(page, email);
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "doesn't have access to the dashboard",
  );
});

test("password reset works end to end", async ({ page, baseURL }) => {
  const email = await createUser("editor");
  await page.goto("/login");
  await page.getByRole("link", { name: "Forgot your password?" }).click();
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await field(page, "Email").fill(email);
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByRole("main").getByRole("status")).toContainText(
    "a reset link is on its way",
  );

  // Emails link to the configured site URL; point it at the test server.
  const link = new URL(await latestEmailLink(email));
  await page.goto(`${baseURL}${link.pathname}${link.search}`);
  await expect(page).toHaveURL(/\/reset-password$/);

  const fresh = "Fresh-Passw0rd-456";
  await field(page, "New password").fill(fresh);
  await field(page, "Repeat new password").fill(fresh);
  await page.getByRole("button", { name: "Save password" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login\?error=signed-out$/);
  await signIn(page, email, fresh);
  await expect(page).toHaveURL(/\/admin$/);
});

test("used or invalid email links explain what happened", async ({ page }) => {
  await page.goto("/auth/confirm?token_hash=not-a-real-token&type=recovery&next=/reset-password");
  await expect(page).toHaveURL(/\/login\?error=link-expired/);
  await expect(page.getByRole("main").getByRole("status")).toContainText(
    "expired or was already used",
  );
});

test("sign-out refuses cross-site requests", async ({ request }) => {
  const response = await request.post("/auth/sign-out", {
    headers: { origin: "https://evil.example" },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(403);
});

test("two-step verification is enforced once turned on", async ({ page }) => {
  const email = await createUser("editor");
  await page.goto("/login?next=/admin/account");
  await signIn(page, email);
  await page.getByRole("button", { name: "Set up an authenticator app" }).click();
  const secret = (await page.locator("code").textContent())!.trim();
  await field(page, "Code from the app").fill(totp(secret));
  await page.getByRole("button", { name: "Turn on" }).click();
  await expect(page.getByText("On. Your account asks for a code at sign-in.")).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await signIn(page, email);
  await expect(page).toHaveURL(/\/login\/mfa/);

  // Password alone isn't enough: the dashboard still bounces to the code step.
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\/mfa\?next=%2Fadmin/);

  await field(page, "Authentication code").fill("000000");
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(page.getByText("That code didn't work.")).toBeVisible();

  await field(page, "Authentication code").fill(totp(secret));
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(page).toHaveURL(/\/admin$/);
});
