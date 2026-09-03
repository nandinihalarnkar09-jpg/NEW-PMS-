import type { AppRole, Employee } from "@/types/database";

export function isHrAdmin(actor: Pick<Employee, "role">): boolean {
  return actor.role === "hr_admin";
}

/**
 * Who may read or mutate another employee's PMS data.
 * Role labels change the UI; this check is what the server must use.
 * A manager is whoever the target lists in manager_id — not a separate table.
 */
export function canAccessEmployee(
  actor: Pick<Employee, "id" | "role">,
  target: Pick<Employee, "id" | "manager_id">,
): boolean {
  if (isHrAdmin(actor)) return true;
  if (actor.id === target.id) return true;
  if (target.manager_id === actor.id) return true;
  return false;
}

export function hasRole(
  actor: Pick<Employee, "role">,
  roles: AppRole[],
): boolean {
  return roles.includes(actor.role);
}
