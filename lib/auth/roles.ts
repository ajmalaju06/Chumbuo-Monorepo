export const ROLES = ["editor", "admin"] as const;
export type Role = (typeof ROLES)[number];

/** Admin includes everything an editor can do. */
export function satisfiesRole(held: readonly Role[], min: Role): boolean {
  const rank = ROLES.indexOf(min);
  return held.some((role) => ROLES.indexOf(role) >= rank);
}

export function highestRole(held: readonly Role[]): Role | null {
  return held.includes("admin") ? "admin" : held.includes("editor") ? "editor" : null;
}
