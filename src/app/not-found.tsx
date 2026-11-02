import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
        404 · Page not found
      </p>
      <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        This space isn’t on the map.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page may have moved, or the link may be incorrect. Head back to the marketplace to find your next space.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/studios" className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground">
          <Search className="size-3.5" />
          Explore studios
        </Link>
        <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-5 text-[13px] font-medium">
          <ArrowLeft className="size-3.5" />
          Home
        </Link>
      </div>
    </main>
  );
}