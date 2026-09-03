import { currentUser } from "@clerk/nextjs/server";

import { getCurrentEmployee } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export default async function DashboardPage() {
  const user = await currentUser();
  const supabaseReady = isSupabaseConfigured();
  const employee = supabaseReady ? await getCurrentEmployee() : null;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-zinc-600">
        Signed in as {user?.primaryEmailAddress?.emailAddress ?? "your Clerk account"}.
      </p>

      {!supabaseReady ? (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Supabase is not configured yet. Add{" "}
          <code className="rounded bg-white px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and{" "}
          <code className="rounded bg-white px-1">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          to <code className="rounded bg-white px-1">.env.local</code>, then run{" "}
          <code className="rounded bg-white px-1">supabase/schema.sql</code> in
          the SQL editor.
        </div>
      ) : null}

      {supabaseReady && !employee ? (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700">
          Your Clerk user is signed in, but there is no{" "}
          <code className="rounded bg-zinc-100 px-1">employees</code> row with
          this <code className="rounded bg-zinc-100 px-1">clerk_user_id</code>.
          HR needs to insert that row before goals and reviews can load. This
          page does not guess an employee record from the URL.
        </div>
      ) : null}

      {employee ? (
        <dl className="mt-8 grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">Name</dt>
            <dd className="mt-1 font-medium">{employee.full_name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">Role</dt>
            <dd className="mt-1 font-medium">{employee.role}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Department
            </dt>
            <dd className="mt-1 font-medium">
              {employee.department ?? "Not set"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Job title
            </dt>
            <dd className="mt-1 font-medium">
              {employee.job_title ?? "Not set"}
            </dd>
          </div>
        </dl>
      ) : null}
    </main>
  );
}
