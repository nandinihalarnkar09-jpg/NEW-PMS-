import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-medium text-zinc-500">College project</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Performance Management System
        </h1>
        <p className="text-lg leading-7 text-zinc-600">
          Plan work with goals. Record outcomes with reviews and goal ratings.
          Those two layers stay separate. Access is decided on the server by
          who you are and who reports to you — not by hiding buttons.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Employee</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Draft and submit your own goals. Complete self-appraisal when a
            cycle is open.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">Manager</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Approve or send back reports&apos; goals. Review their appraisals.
            A manager is an employee with people in{" "}
            <code className="rounded bg-zinc-100 px-1 text-xs">manager_id</code>
            .
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium">HR admin</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Run cycles and see the whole company. Admin actions are checked
            again on the server, not only in the UI.
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/dashboard" className="font-medium text-zinc-900 underline">
          Open the dashboard
        </Link>
        . Signed-out visitors are sent to sign in.
      </p>
    </main>
  );
}
