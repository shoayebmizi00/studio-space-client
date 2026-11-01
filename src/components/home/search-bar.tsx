import { LayoutGrid, CalendarDays, Users, ChevronDown, Search, MapPin } from "lucide-react";

const divider = "hidden h-6 w-px shrink-0 bg-border sm:block";

export function SearchBar() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-1.5 shadow-lg shadow-black/10">
      <form className="flex flex-wrap items-stretch gap-y-1.5 lg:flex-nowrap" action="#explore">
        {/* Location */}
        <div className="relative flex flex-[1.4] items-center">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="City or neighborhood"
            className="w-full rounded-xl bg-transparent py-3 pl-9 pr-3 text-[13px] text-foreground outline-none placeholder:text-foreground/80 focus:bg-muted/50"
          />
          <span className="absolute right-3 top-1/2 size-2 -translate-y-1/2 rounded-full bg-emerald-500" />
        </div>

        <span className={divider} />

        {/* Category */}
        <button
          type="button"
          className="flex flex-1 items-center gap-2.5 rounded-xl px-4 py-3 text-left text-[13px] text-foreground/80 transition-colors hover:bg-muted/50"
        >
          <LayoutGrid className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">All categories</span>
          <ChevronDown className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
        </button>

        <span className={divider} />

        {/* Date */}
        <button
          type="button"
          className="flex flex-1 items-center gap-2.5 rounded-xl px-4 py-3 text-left text-[13px] text-foreground/80 transition-colors hover:bg-muted/50"
        >
          <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-muted-foreground">MMM/DD/YYYY</span>
          <ChevronDown className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
        </button>

        <span className={divider} />

        {/* Guests */}
        <button
          type="button"
          className="flex flex-1 items-center gap-2.5 rounded-xl px-4 py-3 text-left text-[13px] text-foreground/80 transition-colors hover:bg-muted/50"
        >
          <Users className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">4 guests</span>
          <ChevronDown className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
        </button>

        {/* Search */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98] lg:ml-1"
        >
          <Search className="size-3.5" />
          Search
        </button>
      </form>
    </div>
  );
}
