"use client";

import { useMemo, useState } from "react";
import { Search, LayoutGrid, AlignJustify } from "lucide-react";
import { studios, type Studio } from "@/lib/studios-data";
import { FiltersPanel, defaultFilters } from "./filters-panel";
import { StudioCard } from "./studio-card";
import { StudioListCard } from "./studio-list-card";
import { SortSelect, type SortOption } from "./sort-select";
import type { FilterState } from "./filters-panel";

export function StudiosView() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("Recommended");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(
    () => sortStudios(filterStudios(studios, filters, query), sort),
    [filters, query, sort]
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f3]">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
        {/* Page intro */}
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          The marketplace
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-[42px]">
          Explore creative studios
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every space is published by a verified host with real availability,
          transparent hourly pricing and honest reviews from completed bookings.
        </p>

        {/* Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city, country or studio name"
              className="h-11 w-full rounded-xl border border-border/70 bg-card pl-10 pr-4 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <SortSelect value={sort} onChange={setSort} />
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={
                view === "grid"
                  ? "grid h-11 w-11 place-items-center rounded-xl bg-foreground text-primary"
                  : "grid h-11 w-11 place-items-center rounded-xl border border-border/70 bg-card text-foreground/70 hover:border-foreground/25 hover:text-foreground"
              }
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView("list")}
              className={
                view === "list"
                  ? "grid h-11 w-11 place-items-center rounded-xl bg-foreground text-primary"
                  : "grid h-11 w-11 place-items-center rounded-xl border border-border/70 bg-card text-foreground/70 hover:border-foreground/25 hover:text-foreground"
              }
            >
              <AlignJustify className="size-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <FiltersPanel filters={filters} onChange={setFilters} />
          </div>

          <div>
            <p className="mb-5 text-[13px] text-muted-foreground">
              {filtered.length} studios
            </p>

            {filtered.length === 0 ? (
              <div className="grid min-h-56 place-content-center gap-1 rounded-2xl border border-dashed border-border text-center">
                <p className="text-sm font-medium">No studios match your filters</p>
                <p className="text-xs text-muted-foreground">
                  Try clearing the category or raising the max price.
                </p>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((studio) => (
                  <StudioCard
                    key={studio.id}
                    studio={studio}
                    isFavorite={favorites.has(studio.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((studio) => (
                  <StudioListCard key={studio.id} studio={studio} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function filterStudios(all: Studio[], f: FilterState, search: string): Studio[] {
  const query = search.trim().toLowerCase();
  const location = f.location.trim().toLowerCase();
  const category = f.category.toLowerCase();

  return all.filter((studio) => {
    const searchable = `${studio.name} ${studio.location} ${studio.category}`.toLowerCase();
    const matchesQuery = query.length === 0 || searchable.includes(query);

    const matchesLocation =
      location.length === 0 || studio.location.toLowerCase().includes(location);

    const matchesCategory =
      f.category === "All categories" ||
      studio.category.toLowerCase() === category;

    return (
      matchesQuery &&
      matchesLocation &&
      matchesCategory &&
      studio.price <= f.maxPrice &&
      studio.rating >= f.rating &&
      (f.capacity === 0 || studio.capacity >= f.capacity) &&
      f.amenities.every((amenity) => studio.amenities.includes(amenity))
    );
  });
}

function sortStudios(list: Studio[], sort: SortOption): Studio[] {
  const sorted = [...list];
  switch (sort) {
    case "Newest":
      return sorted.sort((a, b) => b.addedAt - a.addedAt);
    case "Price: low to high":
      return sorted.sort((a, b) => a.price - b.price);
    case "Price: high to low":
      return sorted.sort((a, b) => b.price - a.price);
    case "Top rated":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    default:
      return sorted;
  }
}
