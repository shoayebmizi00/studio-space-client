"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Heart,
  LayoutGrid,
  AlignJustify,
  MapPin,
  Users,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stars } from "@/components/studios/studio-card";
import { cn } from "cn";
import type { Studio } from "@/lib/studio-type";
import { useSavedStudios } from "@/lib/saved-studios";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/* Saved studio grid card                                              */
/* ------------------------------------------------------------------ */

function SavedStudioCard({
  studio,
  onRemove,
}: {
  studio: Studio;
  onRemove: (id: string, name: string) => void;
}) {
  const id = studio._id || studio.id || "";
  return (
    <article className="group flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-xs transition-all hover:border-foreground/20 hover:shadow-md">
      <div className="relative aspect-10/9 overflow-hidden rounded-xl bg-muted">
        <Image
          src={studio.coverImage || studio.gallery?.[0] || "/placeholder.jpg"}
          alt={studio.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground shadow-xs backdrop-blur">
          {studio.category}
        </span>
        <Link
          href={`/studio-details?id=${id}`}
          aria-label={`View ${studio.name}`}
          className="absolute inset-0"
        />
        <Button
          type="button"
          aria-label="Remove from saved"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id, studio.name);
          }}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/95 text-foreground shadow-xs backdrop-blur transition-transform hover:scale-110 active:scale-95"
        >
          <Heart className="size-4 fill-red-500 text-red-500 transition-colors" />
        </Button>
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-[15px] font-semibold tracking-tight">
            <Link
              href={`/studio-details?id=${id}`}
              className="transition-colors hover:text-foreground/80"
            >
              {studio.name}
            </Link>
          </h3>
          <span className="flex shrink-0 items-center gap-1.5">
            <Stars rating={studio.rating || 0} />
            <span className="text-xs text-muted-foreground">({studio.reviews || 0})</span>
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{[studio.city, studio.country].filter(Boolean).join(", ")}</span>
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3">
          <div>
            <span className="text-base font-semibold tracking-tight">
              ${studio.hourlyRate || studio.price || 0}
            </span>
            <span className="text-xs text-muted-foreground"> /hr</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="size-3" />
              {studio.maxCapacity || studio.capacity || 0}
            </span>
            <Link
              href={`/studio-details?id=${id}`}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-foreground px-2.5 text-[11px] font-medium text-background transition-opacity hover:opacity-90"
            >
              Book
              <ArrowRight className="size-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Saved studio list card                                              */
/* ------------------------------------------------------------------ */

function SavedStudioListCard({
  studio,
  onRemove,
}: {
  studio: Studio;
  onRemove: (id: string, name: string) => void;
}) {
  const id = studio._id || studio.id || "";
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all hover:border-foreground/20 hover:shadow-md sm:flex-row">
      <div className="relative aspect-16/9 shrink-0 sm:aspect-square sm:w-60 lg:w-64">
        <Image
          src={studio.coverImage || studio.gallery?.[0] || "/placeholder.jpg"}
          alt={studio.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 256px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <Link
          href={`/studio-details?id=${id}`}
          aria-label={`View ${studio.name}`}
          className="absolute inset-0"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground shadow-xs backdrop-blur">
          {studio.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                <Link
                  href={`/studio-details?id=${id}`}
                  className="transition-colors hover:text-foreground/80"
                >
                  {studio.name}
                </Link>
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />
                {[studio.streetAddress, studio.city, studio.country].filter(Boolean).join(", ")}
              </p>
            </div>

            <Button
              type="button"
              aria-label="Remove from saved"
              onClick={() => onRemove(id, studio.name)}
              className="grid size-8 shrink-0 place-items-center rounded-full border border-border/70 bg-card text-muted-foreground transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <Heart className="size-4 fill-red-500 text-red-500" />
            </Button>
          </div>

          <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
            {studio.shortDescription || studio.fullDescription}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {studio.amenities?.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] text-foreground/80"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Stars rating={studio.rating || 0} />
              <span className="font-semibold text-foreground">{(studio.rating || 0).toFixed(1)}</span>
              <span>({studio.reviews || 0})</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              Up to {studio.maxCapacity || studio.capacity || 0} guests
            </span>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-base font-semibold tracking-tight">
              ${studio.hourlyRate || studio.price || 0}
              <span className="text-xs font-normal text-muted-foreground"> /hour</span>
            </p>
            <Link
              href={`/studio-details?id=${id}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90"
            >
              Book space
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main view                                                           */
/* ------------------------------------------------------------------ */

export function SavedStudiosView() {
  const { savedIds, count, isLoaded, toggle, clearAll } = useSavedStudios();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Load all studios straight from the Express server.
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:5000/studios", { cache: "no-store" });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || `Server returned ${res.status}`);
        }
        const data: Studio[] = await res.json();
        setStudios(data);
      } catch (err) {
        console.error("Error loading studios for saved view:", err);
        setError(err instanceof Error ? err.message : "Failed to load studios");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter down to only saved studios
  const savedStudios = useMemo(() => {
    const idSet = new Set(savedIds);
    return studios.filter((studio) => {
      const id = studio._id || studio.id || "";
      return idSet.has(id);
    });
  }, [studios, savedIds]);

  // Available categories within saved studios
  const availableCategories = useMemo(() => {
    const cats = new Set(savedStudios.map((s) => s.category?.trim()).filter(Boolean));
    return ["All", ...Array.from(cats).sort()];
  }, [savedStudios]);

  // Filtered by search and category
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return savedStudios.filter((studio) => {
      const matchesCategory =
        selectedCategory === "All" || studio.category === selectedCategory;
      const matchesSearch =
        !q ||
        studio.name.toLowerCase().includes(q) ||
        studio.city?.toLowerCase().includes(q) ||
        studio.country?.toLowerCase().includes(q) ||
        studio.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [savedStudios, selectedCategory, search]);

  const handleRemove = (id: string, name: string) => {
    toggle(id);
    toast.success("Removed from saved", {
      description: `${name} has been removed from your saved list.`,
    });
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all your saved studios?")) {
      clearAll();
      toast.success("Saved studios cleared");
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span>›</span>
          <Link href="/studios" className="transition-colors hover:text-foreground">
            Studios
          </Link>
          <span>›</span>
          <span className="font-medium text-foreground">Saved studios</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                <Heart className="size-3.5 fill-current" />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Your Collection
              </p>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Saved studios
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Spaces you&apos;ve shortlisted for future shoots, rehearsals, and sessions.
            </p>
          </div>

          {savedStudios.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl border border-border/70 bg-card p-1">
                <Button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => setView("grid")}
                  className={cn(
                    "grid size-8 place-items-center rounded-lg transition-colors",
                    view === "grid"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  type="button"
                  aria-label="List view"
                  onClick={() => setView("list")}
                  className={cn(
                    "grid size-8 place-items-center rounded-lg transition-colors",
                    view === "list"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <AlignJustify className="size-4" />
                </Button>
              </div>

              <Button
                type="button"
                onClick={handleClearAll}
                className="h-9 rounded-xl border border-border/70 bg-card px-3 text-xs text-muted-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
              >
                Clear all ({count})
              </Button>
            </div>
          )}
        </div>

        {/* Search & Category Filter Toolbar */}
        {savedStudios.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your saved spaces…"
                className="h-10 w-full rounded-xl border-border/70 bg-card pl-9 pr-3 text-[13px]"
              />
            </div>

            {availableCategories.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      selectedCategory === cat
                        ? "bg-foreground text-background"
                        : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="mt-6">
          {!isLoaded || loading ? (
            <div className="grid min-h-60 place-content-center text-sm text-muted-foreground">
              Loading your saved studios…
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          ) : savedStudios.length === 0 ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card px-6 py-14 text-center">
              <div className="grid size-14 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
                <Bookmark className="size-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">No saved studios yet</h2>
              <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                Browse through our collection and tap the heart icon on any studio card to save it here for quick access later.
              </p>
              <Link
                href="/studios"
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground shadow-xs transition-transform hover:brightness-95 active:scale-[0.98]"
              >
                <Sparkles className="size-4" />
                Explore studios
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid min-h-48 place-content-center gap-2 rounded-2xl border border-dashed border-border/70 bg-card p-8 text-center">
              <p className="text-sm font-medium">No saved studios match your filter</p>
              <p className="text-xs text-muted-foreground">Try clearing the search or category filter.</p>
              <Button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mx-auto mt-2 h-8 rounded-full border border-border/70 bg-card px-3 text-xs"
              >
                Reset filters
              </Button>
            </div>
          ) : view === "grid" ? (
            <div>
              <p className="mb-4 text-xs font-medium text-muted-foreground">
                Showing {filtered.length} of {savedStudios.length} saved studio{savedStudios.length === 1 ? "" : "s"}
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((studio) => (
                  <SavedStudioCard
                    key={studio._id || studio.id}
                    studio={studio}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-xs font-medium text-muted-foreground">
                Showing {filtered.length} of {savedStudios.length} saved studio{savedStudios.length === 1 ? "" : "s"}
              </p>
              <div className="flex flex-col gap-4">
                {filtered.map((studio) => (
                  <SavedStudioListCard
                    key={studio._id || studio.id}
                    studio={studio}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
