import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-16">
      <div className="max-w-xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Performance Management System
        </h1>
        <p className="text-lg leading-7 text-zinc-600">
          Set goals, complete reviews, and record ratings for a services team.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex h-10 items-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Sign In
        </Link>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="font-medium text-zinc-900">Goals</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Employees plan the year. Managers approve the plan or send it back.
          </p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="font-medium text-zinc-900">Reviews</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Self-appraisal first, then the manager review, then a completed
            cycle.
          </p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="font-medium text-zinc-900">Roles</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            The same screens serve employees, managers, and HR — each sees
            only what they should.
          </p>
        </article>
      </div>
    </main>
  );
}
