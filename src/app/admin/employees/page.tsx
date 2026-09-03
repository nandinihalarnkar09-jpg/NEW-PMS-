import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { isHrAdmin } from "@/lib/auth/access";
import { getCurrentEmployee } from "@/lib/auth/session";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

import type { EmployeeListItem, EmployeeRow } from "./types";

function withManagerNames(employees: EmployeeRow[]): EmployeeListItem[] {
  const namesById = new Map(employees.map((row) => [row.id, row.full_name]));

  return employees.map((row) => ({
    ...row,
    manager_name: row.manager_id
      ? (namesById.get(row.manager_id) ?? null)
      : null,
  }));
}

export default async function AdminEmployeesPage() {
  await auth.protect();

  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Supabase is not configured. Add{" "}
          <code className="rounded bg-white px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and{" "}
          <code className="rounded bg-white px-1">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          to <code className="rounded bg-white px-1">.env.local</code>.
        </p>
      </main>
    );
  }

  const actor = await getCurrentEmployee();
  if (!actor || !isHrAdmin(actor)) {
    notFound();
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, clerk_user_id, full_name, email, designation, department, date_of_joining, manager_id, role, is_active, created_at",
    )
    .order("full_name", { ascending: true });

  if (error) throw error;

  const employees = withManagerNames((data ?? []) as EmployeeRow[]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Everyone in the company directory. Manager names come from{" "}
        <code className="rounded bg-zinc-100 px-1 text-xs">manager_id</code>,
        not a separate table.
      </p>

      {employees.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="font-medium text-zinc-900">No employees yet</p>
          <p className="mt-2 text-sm text-zinc-600">
            When HR adds people to the employees table, they will show up here.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Designation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Manager
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-zinc-50">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-900">
                    {employee.full_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                    {employee.designation ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                    {employee.department ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                    {employee.manager_name ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                    {employee.role}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                    {employee.is_active ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
