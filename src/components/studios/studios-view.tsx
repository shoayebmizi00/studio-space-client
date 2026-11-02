"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, LayoutGrid, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiltersPanel, defaultFilters } from "./filters-panel";
import { StudioCard } from "./studio-card";
import { StudioListCard } from "./studio-list-card";
import { SortSelect, type SortOption } from "./sort-select";
import type { FilterState } from "./filters-panel";
import type { StudioListing } from "@/lib/api";
import { useSavedStudios } from "@/lib/saved-studios";
import { toast } from "sonner";

type CatalogStudio = StudioListing & {
  id: string;
  location: string;
  price: number;
  capacity: number;
};

export function StudiosView({ initialCategory }: { initialCategory?: string }) {
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    category: initialCategory || defaultFilters.category,
  }));
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("Recommended");
  const { has, toggle } = useSavedStudios();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [studios, setStudios] = useState<StudioListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudios() {
      try {
        // Use the Next.js API route as a proxy so the browser never needs to
        // reach the Express server directly (avoids cross-origin issues when
        // the client fetches from a "use client" component).
        const res = await fetch("/api/studios", { cache: "no-store" });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || `Server responded with ${res.status}`);
        }
        const data: StudioListing[] = await res.json();
        setStudios(data);
      } catch (err) {
        console.error("Failed to load studios:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not load studios from the backend server. Make sure studio-space-server is running on port 5000."
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadStudios();
  }, []);

  const filtered = useMemo(
    () => sortStudios(filterStudios(studios.map(mapStudioListing), filters, query), sort),
    [studios, filters, query, sort]
  );
  const categoryOptions = useMemo(
    () => [
      "All categories",
      ...Array.from(new Set(studios.map((studio) => studio.category.trim()).filter(Boolean)))
        .sort((left, right) => left.localeCompare(right)),
    ],
    [studios]
  );
  const maxPriceLimit = Math.max(
    600,
    ...studios.map((studio) => studio.hourlyRate || studio.price || 0)
  );

  const toggleFavorite = (id: string) => {
    const isNowSaved = toggle(id);
    const studio = studios.find((s) => (s._id || s.id) === id);
    const name = studio?.name || "Studio";
    if (isNowSaved) {
      toast.success("Studio saved", {
        description: `${name} has been added to your saved studios.`,
      });
    } else {
      toast.info("Removed from saved", {
        description: `${name} has been removed from your saved studios.`,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
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
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city, country or studio name"
              className="h-11 w-full rounded-xl border border-border/70 bg-card pl-10 pr-4 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <SortSelect value={sort} onChange={setSort} />
            <Button
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
            </Button>
            <Button
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
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <FiltersPanel
              filters={filters}
              onChange={setFilters}
              maxPriceLimit={maxPriceLimit}
              categoryOptions={categoryOptions}
            />
          </div>

          <div>
            <p className="mb-5 text-[13px] text-muted-foreground">
              {filtered.length} studios
            </p>

            {isLoading ? (
              <div className="min-h-100 flex items-center justify-center text-muted-foreground text-sm">
                Loading studios from backend server...
              </div>
            ) : error ? (
              <div className="grid min-h-56 place-content-center gap-2 rounded-2xl border border-dashed border-red-300 bg-red-50/50 p-6 text-center text-red-900">
                <p className="text-sm font-medium">{error}</p>
                <p className="text-xs text-red-700/80">
                  Run <code className="rounded bg-red-100 px-1 py-0.5">node index.js</code> or <code className="rounded bg-red-100 px-1 py-0.5">npm start</code> inside <code className="rounded bg-red-100 px-1 py-0.5">studio-space-server</code>.
                </p>
              </div>
            ) : filtered.length === 0 ? (
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
                    isFavorite={has(studio.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((studio) => (
                  <StudioListCard
                    key={studio.id}
                    studio={studio}
                    isFavorite={has(studio.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function mapStudioListing(studio: StudioListing): CatalogStudio {
  // Map backend StudioListing to the shape expected by the UI components
  return {
    ...studio,
    id: studio._id || studio.id || "",
    price: studio.hourlyRate || studio.price || 0,
    capacity: studio.maxCapacity || studio.capacity || 0,
    location: `${studio.city}, ${studio.country}`,
    rating: studio.rating || 0,
    reviews: studio.reviews || 0,
  };
}

function filterStudios(all: CatalogStudio[], f: FilterState, search: string): CatalogStudio[] {
  const query = search.trim().toLowerCase();
  const location = f.location.trim().toLowerCase();
  const category = f.category.toLowerCase();

  return all.filter((studio) => {
    const mapped = mapStudioListing(studio);
    const searchable = `${mapped.name} ${mapped.location} ${mapped.category}`.toLowerCase();
    const matchesQuery = query.length === 0 || searchable.includes(query);

    const matchesLocation =
      location.length === 0 || mapped.location.toLowerCase().includes(location);

    const matchesCategory =
      f.category === "All categories" ||
      mapped.category.toLowerCase() === category;

    return (
      matchesQuery &&
      matchesLocation &&
      matchesCategory &&
      (f.maxPrice === null || mapped.price <= f.maxPrice) &&
      (mapped.rating || 0) >= f.rating &&
      (f.capacity === 0 || mapped.capacity >= f.capacity) &&
      f.amenities.every((amenity) => mapped.amenities.includes(amenity))
    );
  });
}

function sortStudios(list: CatalogStudio[], sort: SortOption): CatalogStudio[] {
  const sorted = [...list];
  switch (sort) {
    case "Newest":
      return sorted.sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return bDate - aDate;
      });
    case "Price: low to high":
      return sorted.sort((a, b) => a.price - b.price);
    case "Price: high to low":
      return sorted.sort((a, b) => b.price - a.price);
    case "Top rated":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
    default:
      return sorted;
  }
}
