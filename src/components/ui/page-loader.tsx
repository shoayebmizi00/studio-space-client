/**
 * Branded skeleton loader used by route `loading.tsx` files and while
 * data is being fetched. Plain pulse blocks — no extra dependencies.
 */
export function PageLoader() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
      <div className="animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-muted" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-muted" />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="h-44 rounded-xl bg-muted" />
              <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              <div className="mt-4 h-3 w-1/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/** Narrow skeleton for a single detail/form page. */
export function FormLoader() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
      <div className="animate-pulse rounded-3xl border border-border/60 bg-card p-8">
        <div className="h-7 w-1/2 rounded bg-muted" />
        <div className="mt-3 h-4 w-2/3 rounded bg-muted" />
        <div className="mt-8 h-11 rounded-xl bg-muted" />
        <div className="mt-4 h-11 rounded-xl bg-muted" />
        <div className="mt-4 h-11 rounded-xl bg-muted" />
        <div className="mt-4 h-32 rounded-xl bg-muted" />
      </div>
    </main>
  );
}
