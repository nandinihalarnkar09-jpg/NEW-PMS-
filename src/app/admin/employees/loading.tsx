export default function AdminEmployeesLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <div className="h-8 w-40 animate-pulse rounded bg-zinc-200" />
      <p className="mt-2 text-sm text-zinc-500">Loading employees…</p>
      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="h-10 bg-zinc-50" />
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-8 animate-pulse rounded bg-zinc-100"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
