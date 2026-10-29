import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("keeps custom type-scale sizes alongside colours", () => {
    expect(cn("text-meta", "text-oatmeal")).toBe("text-meta text-oatmeal");
  });

  it("still resolves conflicting sizes", () => {
    expect(cn("text-h1", "text-h2")).toBe("text-h2");
  });
});
