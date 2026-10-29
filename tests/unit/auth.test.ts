import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/auth/redirects";
import { highestRole, satisfiesRole } from "@/lib/auth/roles";
import { newPasswordSchema, signInSchema, totpCodeSchema } from "@/lib/validation/auth";

describe("safeNextPath", () => {
  it("keeps same-origin paths with query and hash", () => {
    expect(safeNextPath("/admin/stories?status=draft#top")).toBe("/admin/stories?status=draft#top");
  });

  it.each([
    "https://evil.example/admin",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "admin",
    "",
    undefined,
    ["/admin"],
  ])("falls back for %j", (value) => {
    expect(safeNextPath(value)).toBe("/admin");
  });
});

describe("roles", () => {
  it("treats admin as a superset of editor", () => {
    expect(satisfiesRole(["admin"], "editor")).toBe(true);
    expect(satisfiesRole(["editor"], "admin")).toBe(false);
    expect(satisfiesRole([], "editor")).toBe(false);
  });

  it("reports the highest role held", () => {
    expect(highestRole(["editor", "admin"])).toBe("admin");
    expect(highestRole(["editor"])).toBe("editor");
    expect(highestRole([])).toBeNull();
  });
});

describe("auth validation", () => {
  it("normalises the sign-in email", () => {
    const parsed = signInSchema.parse({ email: "  Me@Example.COM ", password: "x" });
    expect(parsed.email).toBe("me@example.com");
  });

  it("enforces the password policy and matching confirmation", () => {
    expect(newPasswordSchema.safeParse({ password: "short1A", confirm: "short1A" }).success).toBe(
      false,
    );
    expect(
      newPasswordSchema.safeParse({ password: "alllowercase1", confirm: "alllowercase1" }).success,
    ).toBe(false);
    const mismatch = newPasswordSchema.safeParse({
      password: "GoodPassw0rd",
      confirm: "GoodPassw0rd!",
    });
    expect(mismatch.success).toBe(false);
    expect(mismatch.error?.issues[0]?.path).toEqual(["confirm"]);
    expect(
      newPasswordSchema.safeParse({ password: "GoodPassw0rd", confirm: "GoodPassw0rd" }).success,
    ).toBe(true);
  });

  it("accepts only 6-digit TOTP codes", () => {
    const factorId = "6f1c2c1e-6c55-4c55-9a43-6a1f0d3f1b2a";
    expect(totpCodeSchema.safeParse({ factorId, code: " 123456 " }).success).toBe(true);
    expect(totpCodeSchema.safeParse({ factorId, code: "12345a" }).success).toBe(false);
  });
});
